// backend/scripts/migrate_team_purse.js
// Simple migration to update existing Team documents' points to the new purse.
// By default this will update any team that has points !== 100000 to 100000.
// Run with: node scripts/migrate_team_purse.js

require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../src/models/Team');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/cspl-auction';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for team purse migration');

  // Recommended migration: recompute each team's remaining points as
  // newPurse - sum(player.price for players assigned to team)
  // This preserves already-spent amounts while updating the purse to 100000.
  const NEW_PURSE = 100000;
  const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

  const teams = await Team.find().lean();
  let matched = 0, modified = 0;
  for (const t of teams) {
    // compute spent for this team by summing prices of players referencing this team
    const Player = require('../src/models/Player');
    const players = await Player.find({ assignedTeam: t._id }).select('price').lean();
    const spent = players.reduce((s, p) => s + (Number(p.price) || 0), 0);
    const newRemaining = Math.max(0, NEW_PURSE - spent);

    if (t.points !== newRemaining) {
      matched += 1;
      if (!dryRun) {
        await Team.updateOne({ _id: t._id }, { $set: { points: newRemaining } });
        modified += 1;
      }
      console.log(`Team ${t.name} (${t._id}): spent=${spent} -> points ${t.points} => ${newRemaining}`);
    }
  }

  console.log(`Matched ${matched}, modified ${modified} teams. (dryRun=${dryRun})`);

  await mongoose.disconnect();
  console.log('Migration complete. Disconnected.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
