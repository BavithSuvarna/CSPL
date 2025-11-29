// backend/src/models/Player.js
const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: { type: String },
  // store original uploaded file path (optional) and thumbnail path in `photoUrl`
  photoOriginal: { type: String },
  serialNumber: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['available','assigned','unsold'], default: 'available' },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', PlayerSchema);