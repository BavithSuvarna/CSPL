// backend/src/controllers/auctionController.js
const Auction = require('../models/Auction');
const Player = require('../models/Player');
const Team = require('../models/Team');

/** Fisher-Yates shuffle */
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * startAuction - build queue for phase
 * returns 200 always, queueLength may be 0
 * POST /api/auction/start?phase=normal|unsold
 */
exports.startAuction = async (req, res) => {
  try {
    const phase = req.query.phase === 'unsold' ? 'unsold' : 'normal';

    if (phase === 'unsold') {
      // get unsold players
      const unsoldDocs = await Player.find({ status: 'unsold' }).select('_id').lean();
      const ids = unsoldDocs.map(d => d._id.toString());

      // if no unsold players, create empty auction doc but return 200
      const queue = shuffle(ids);
      let auction = await Auction.findOne();
      if (!auction) auction = new Auction();
      auction.phase = 'unsold';
      auction.queue = queue;
      auction.pointer = 0;
      auction.updatedAt = new Date();
      await auction.save();

      // we will reactivate unsold to available on the server only if the admin wants to
      // — but for our UI we will reactivate now so they are assignable
      if (ids.length > 0) {
        await Player.updateMany({ _id: { $in: ids } }, { $set: { status: 'available' } });
      }

      return res.json({
        message: 'Unsold auction started (reactivated unsold players).',
        phase: 'unsold',
        queueLength: queue.length,
        unsoldReactivated: ids.length > 0
      });
    }

    // normal phase: available players
    const players = await Player.find({ status: 'available' }).select('_id').lean();
    const ids = players.map(p => p._id.toString());
    const queue = shuffle(ids);

    let auction = await Auction.findOne();
    if (!auction) auction = new Auction();
    auction.phase = 'normal';
    auction.queue = queue;
    auction.pointer = 0;
    auction.updatedAt = new Date();
    await auction.save();

    return res.json({ message: 'Auction started', phase: 'normal', queueLength: queue.length });
  } catch (err) {
    console.error('startAuction error:', err);
    return res.status(500).json({ error: 'Failed to start auction' });
  }
};

/**
 * getNext - return next player at pointer or done:true
 * GET /api/auction/next
 */
exports.getNext = async (req, res) => {
  try {
    const auction = await Auction.findOne();
    if (!auction) return res.status(200).json({ done: true, message: 'Auction not started', phase: null, pointer: 0, queueLength: 0 });

    const queue = auction.queue || [];
    const pointer = auction.pointer || 0;
    const phase = auction.phase || 'normal';
    const queueLength = queue.length;

    if (pointer >= queueLength) {
      // exhausted
      return res.json({ done: true, phase, pointer, queueLength });
    }

    const playerId = queue[pointer];
    const player = await Player.findById(playerId).populate('assignedTeam', 'name');
    if (!player) {
      // advance pointer to skip missing player
      await Auction.findOneAndUpdate({}, { $inc: { pointer: 1 }, $set: { updatedAt: new Date() } });
      return res.status(404).json({ error: 'Player not found; pointer advanced' });
    }

    return res.json({ done: false, phase, pointer, queueLength, player });
  } catch (err) {
    console.error('getNext error:', err);
    return res.status(500).json({ error: 'Failed to get next player' });
  }
};

/**
 * assignPlayer - non-transactional but attempts safe operations on standalone MongoDB
 * POST /api/auction/assign
 * body: { playerId, teamId, action: 'assign'|'unsold', price? }
 *
 * Strategy:
 * 1) For 'assign': try to decrement team points and push player atomically via findOneAndUpdate with points:$gte
 * 2) Then update player status -> if player update fails, revert team (points += price, pull player)
 * 3) Always advance auction pointer after success
 */
exports.assignPlayer = async (req, res) => {
  try {
    const { playerId, teamId, action, price } = req.body;
    if (!playerId) return res.status(400).json({ error: 'playerId required' });

    if (action === 'assign') {
      if (!teamId) return res.status(400).json({ error: 'teamId required for assign' });
      const bidPrice = Number(price);
      if (Number.isNaN(bidPrice) || bidPrice < 0) return res.status(400).json({ error: 'Valid numeric price required' });

      // Step 1: decrement team points and push player (only if team has enough points)
      const teamUpdated = await Team.findOneAndUpdate(
        { _id: teamId, points: { $gte: bidPrice } },
        { $inc: { points: -bidPrice }, $push: { players: playerId } },
        { new: true }
      );
      if (!teamUpdated) {
        return res.status(400).json({ error: 'Team not found or not enough points' });
      }

      // Step 2: update player to assigned only if it was available or unsold
      const playerUpdated = await Player.findOneAndUpdate(
        { _id: playerId, status: { $in: ['available', 'unsold'] } },
        { $set: { status: 'assigned', assignedTeam: teamId, price: bidPrice } },
        { new: true }
      ).populate('assignedTeam', 'name');

      if (!playerUpdated) {
        // rollback team update: refund points and remove player id from players array
        await Team.findByIdAndUpdate(teamId, { $inc: { points: bidPrice }, $pull: { players: playerId } });
        return res.status(400).json({ error: 'Player not available (already assigned) — team refunded' });
      }

      // advance pointer (best-effort)
      await Auction.findOneAndUpdate({}, { $inc: { pointer: 1 }, $set: { updatedAt: new Date() } });

      return res.json({ message: 'Player assigned', player: playerUpdated, team: teamUpdated });
    }

    if (action === 'unsold') {
      // mark player unsold (only if not assigned)
      const player = await Player.findById(playerId);
      if (!player) return res.status(404).json({ error: 'Player not found' });
      if (player.status === 'assigned') return res.status(400).json({ error: 'Player already assigned' });

      const updated = await Player.findByIdAndUpdate(playerId, { $set: { status: 'unsold', assignedTeam: null, price: 0 } }, { new: true });
      // advance pointer
      await Auction.findOneAndUpdate({}, { $inc: { pointer: 1 }, $set: { updatedAt: new Date() } });
      return res.json({ message: 'Player marked unsold', player: updated });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error('assignPlayer error:', err);
    return res.status(500).json({ error: 'Failed to assign player', detail: err.message });
  }
};

/**
 * advancePointer - increment pointer manually
 * POST /api/auction/advance
 */
exports.advancePointer = async (req, res) => {
  try {
    await Auction.findOneAndUpdate({}, { $inc: { pointer: 1 }, $set: { updatedAt: new Date() } });
    return res.json({ message: 'pointer advanced' });
  } catch (err) {
    console.error('advancePointer error:', err);
    return res.status(500).json({ error: 'Failed to advance pointer' });
  }
};