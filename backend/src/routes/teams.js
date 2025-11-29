// backend/src/routes/teams.js
const express = require('express');
const router = express.Router();
const teamCtrl = require('../controllers/teamController');
const adminAuth = require('../middleware/adminAuth');

// Public GET teams
router.get('/', teamCtrl.getTeams);

// ✅ NEW route to get single team by ID
router.get('/:id', teamCtrl.getTeamById);

// Admin create team
router.post('/', adminAuth, teamCtrl.createTeam);

// Admin delete team
router.delete('/:id', adminAuth, teamCtrl.deleteTeam);

module.exports = router;