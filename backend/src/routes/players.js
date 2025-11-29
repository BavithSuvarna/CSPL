// backend/src/routes/players.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const playersCtrl = require('../controllers/playersController');
const adminAuth = require('../middleware/adminAuth');

const uploadsDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Public: get players (anyone can read)
router.get('/', playersCtrl.getPlayers);

// Admin: create player (upload) — protect
router.post('/', adminAuth, upload.single('photo'), playersCtrl.createPlayer);

// Admin: delete single player
router.delete('/:id', adminAuth, playersCtrl.deletePlayer);

// Admin: clear all players
router.delete('/clear/all', adminAuth, playersCtrl.clearPlayers);

module.exports = router;