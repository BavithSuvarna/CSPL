// backend/src/controllers/teamController.js
const Team = require('../models/Team');

exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Team name required' });

    const teamData = {
      name,
      points: req.body.points ? Number(req.body.points) : 10000,
      players: []
    };

    const team = new Team(teamData);
    await team.save();
    return res.status(201).json(team);
  } catch (err) {
    console.error('createTeam error:', err);
    // Return error detail to assist debugging (safe in dev). Remove detail in production.
    return res.status(500).json({ error: 'Failed to create team', detail: err.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teamsDocs = await Team.find()
      .populate({
        path: 'players',
        select: 'name serialNumber price photoUrl status'
      })
      .sort({ name: 1 });
    return res.json(teamsDocs);
  } catch (err) {
    console.error('getTeams error:', err);
    return res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// ✅ NEW FUNCTION
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamDoc = await Team.findById(id).populate({
      path: 'players',
      select: 'name serialNumber price photoUrl status'
    });
    if (!teamDoc) return res.status(404).json({ error: 'Team not found' });
    return res.json(teamDoc);
  } catch (err) {
    console.error('getTeamById error:', err);
    return res.status(500).json({ error: 'Failed to fetch team details' });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    await Team.deleteOne({ _id: id });
    return res.json({ message: 'Team deleted' });
  } catch (err) {
    console.error('deleteTeam error:', err);
    return res.status(500).json({ error: 'Failed to delete team' });
  }
};