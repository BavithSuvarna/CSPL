// backend/src/controllers/playersController.js
const Player = require('../models/Player');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Create a new player.
 * Accepts multipart file (req.file) or photoUrl in body.
 */
exports.createPlayer = async (req, res) => {
  try {
    const { name, serialNumber, photoUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'Player name required' });
    if (!serialNumber) return res.status(400).json({ error: 'serialNumber required' });

    const serial = Number(serialNumber);
    if (Number.isNaN(serial)) return res.status(400).json({ error: 'serialNumber must be numeric' });

    let finalPhoto = photoUrl || null;
    let originalPath = null;
    if (req.file) {
      // Save original path
      originalPath = `/uploads/${req.file.filename}`;

      // Create a thumbnail version (300x300 cover) and save under uploads/thumbs
      const uploadsDir = path.join(__dirname, '../../uploads');
      const thumbsDir = path.join(uploadsDir, 'thumbs');
      if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

      const thumbFilename = `thumb-${req.file.filename}`;
      const thumbPath = path.join(thumbsDir, thumbFilename);
      try {
        // Use .rotate() to respect EXIF Orientation so images are not rotated incorrectly
        await sharp(path.join(uploadsDir, req.file.filename))
          .rotate()
          .resize(300, 300, { fit: 'cover' })
          .toFile(thumbPath);
        finalPhoto = `/uploads/thumbs/${thumbFilename}`;
      } catch (sharpErr) {
        console.warn('Failed to create thumbnail, using original image', sharpErr.message);
        finalPhoto = `/uploads/${req.file.filename}`;
      }
    }

    // ensure unique serialNumber
    const exists = await Player.findOne({ serialNumber: serial });
    if (exists) return res.status(400).json({ error: 'serialNumber already exists' });

    const player = new Player({
      name,
      serialNumber: serial,
      photoUrl: finalPhoto,
      photoOriginal: originalPath,
      status: 'available',
      price: 0
    });

    await player.save();
    return res.status(201).json(player);
  } catch (err) {
    console.error('createPlayer error:', err);
    return res.status(500).json({ error: 'Failed to create player', detail: err.message });
  }
};

/**
 * Get players.
 * Optional query: ?status=available|assigned|unsold
 */
exports.getPlayers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const players = await Player.find(filter).populate('assignedTeam', 'name').sort({ serialNumber: 1 });
    return res.json(players);
  } catch (err) {
    console.error('getPlayers error:', err);
    return res.status(500).json({ error: 'Failed to fetch players' });
  }
};

/**
 * Delete a single player by id.
 * Removes the DB entry and attempts to unlink uploaded file if it exists.
 */
exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    // delete thumbnail and original if present
    if (player.photoUrl && player.photoUrl.startsWith('/uploads/')) {
      const filepath = path.join(__dirname, '../../uploads', path.basename(player.photoUrl));
      fs.unlink(filepath, (err) => {
        if (err) console.warn('Failed to unlink player photo', filepath, err.message);
      });
    }
    if (player.photoOriginal && player.photoOriginal.startsWith('/uploads/')) {
      const origPath = path.join(__dirname, '../../uploads', path.basename(player.photoOriginal));
      fs.unlink(origPath, (err) => {
        if (err) console.warn('Failed to unlink original player photo', origPath, err.message);
      });
    }

    await Player.deleteOne({ _id: id });
    return res.json({ message: 'Player deleted' });
  } catch (err) {
    console.error('deletePlayer error:', err);
    return res.status(500).json({ error: 'Failed to delete player' });
  }
};

/**
 * Clear all players (admin).
 * WARNING: deletes all player documents from DB. Does NOT delete uploaded files.
 */
exports.clearPlayers = async (req, res) => {
  try {
    await Player.deleteMany({});
    return res.json({ message: 'All players deleted' });
  } catch (err) {
    console.error('clearPlayers error:', err);
    return res.status(500).json({ error: 'Failed to clear players' });
  }
};