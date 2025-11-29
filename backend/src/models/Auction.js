const mongoose = require('mongoose');
const AuctionSchema = new mongoose.Schema({
  phase: { type: String, enum: ['normal','unsold','finished'], default: 'normal' },
  queue: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  pointer: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Auction', AuctionSchema);