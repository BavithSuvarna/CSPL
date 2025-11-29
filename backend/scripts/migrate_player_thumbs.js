#!/usr/bin/env node
// backend/scripts/migrate_player_thumbs.js
// Scan Player documents and, if a thumbnail exists for the stored photo, set photoUrl to thumbnail path.

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Player = require('../src/models/Player');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/cspl-auction';
const uploadsDir = path.join(__dirname, '..', 'uploads');
const thumbsDir = path.join(uploadsDir, 'thumbs');

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo');

  const players = await Player.find({});
  let updated = 0;
  for (const p of players) {
    if (!p.photoUrl) continue;
    // if already points to thumbs, skip
    if (p.photoUrl.includes('/uploads/thumbs/')) continue;
    const filename = path.basename(p.photoUrl);
    const thumbPath = path.join(thumbsDir, `thumb-${filename}`);
    if (fs.existsSync(thumbPath)) {
      p.photoOriginal = `/uploads/${filename}`;
      p.photoUrl = `/uploads/thumbs/thumb-${filename}`;
      await p.save();
      updated++;
      console.log('Updated player', p._id, '->', p.photoUrl);
    }
  }

  console.log('Done. Updated', updated, 'players.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
