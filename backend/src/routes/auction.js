// backend/src/routes/auction.js
const express = require('express');
const router = express.Router();
const auctionCtrl = require('../controllers/auctionController');
const adminAuth = require('../middleware/adminAuth');

if (!auctionCtrl || typeof auctionCtrl !== 'object') {
  throw new Error('auctionController not found or invalid - check backend/src/controllers/auctionController.js');
}

// Anyone can GET next (for public UI) — but starting /assign are admin-only
router.get('/next', auctionCtrl.getNext);

// Admin: start auction
router.post('/start', adminAuth, auctionCtrl.startAuction);

// Admin: assign or mark unsold
router.post('/assign', adminAuth, auctionCtrl.assignPlayer);

// Admin: advance pointer (helper)
router.post('/advance', adminAuth, auctionCtrl.advancePointer);

module.exports = router;