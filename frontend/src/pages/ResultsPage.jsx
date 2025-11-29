import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function ResultsPage() {
  const [teams, setTeams] = useState([]);
  const [unsold, setUnsold] = useState([]);
  const navigate = useNavigate();

  async function fetchAll() {
    try {
      const [tRes, pRes] = await Promise.all([
        axios.get(`${API}/teams`),
        axios.get(`${API}/players`)
      ]);
      const teamsData = (tRes.data || []).map(t => ({ ...t }));
      setTeams(teamsData);
      setUnsold((pRes.data || []).filter(p => p.status === 'unsold'));
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  // Group teams into rows of 2
  const teamRows = [];
  for (let i = 0; i < teams.length; i += 2) {
    teamRows.push(teams.slice(i, i + 2));
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Auction Results</h1>
          <p className="text-gray-600 text-xl">CSPL 2k25 - Final Team Squads & Unsold Players</p>
        </div>

        {/* Teams Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Team Squads</h2>
            <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
              {teams.length} Teams
            </div>
          </div>

          {/* Teams Grid - 2 per row */}
          <div className="space-y-6">
            {teamRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid md:grid-cols-2 gap-6">
                {row.map(team => (
                  <div 
                    key={team._id}
                    onClick={() => navigate(`/team/${team._id}`)}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 card-hover cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="team-badge w-16 h-16 text-xl group-hover:scale-105 transition-transform duration-300">
                          {(team.name||'').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {team.name}
                          </h3>
                          <p className="text-gray-600">Click to view full squad</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{team.points}</div>
                        <div className="text-gray-600 text-sm">Points Left</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">
                        <span className="text-green-600 font-bold text-lg">{team.players?.length || 0}</span> Players
                      </div>
                      <div className="flex gap-2">
                        {team.players?.slice(0, 3).map((player, idx) => (
                          <div key={idx} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {player.name?.charAt(0) || 'P'}
                          </div>
                        ))}
                        {team.players?.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs">
                            +{team.players.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add empty div if odd number of teams to maintain grid */}
                {row.length === 1 && <div className="hidden md:block"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Unsold Players Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Unsold Players</h2>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold">
                  {unsold.length} Players
                </div>
              </div>
            </div>
          </div>

          {unsold.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">All Players Sold!</h3>
              <p className="text-gray-600 text-lg mb-6">
                Congratulations! Every player found a team in the auction.
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {unsold.length} Players Went Unsold
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Click below to view all unsold players and their details
              </p>
              <button 
                onClick={() => navigate('/unsold')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold text-lg shadow-lg btn hover:scale-105 transition-transform duration-300"
              >
                View All {unsold.length} Unsold Players
              </button>
            </div>
          )}

          {/* Stats Card */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Auction Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{teams.length}</div>
                <div className="text-gray-600 text-sm">Total Teams</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {teams.reduce((acc, team) => acc + (team.players?.length || 0), 0)}
                </div>
                <div className="text-gray-600 text-sm">Players Sold</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{unsold.length}</div>
                <div className="text-gray-600 text-sm">Unsold Players</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">
                  {teams.reduce((acc, team) => acc + team.points, 0)}
                </div>
                <div className="text-gray-600 text-sm">Total Points Left</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}