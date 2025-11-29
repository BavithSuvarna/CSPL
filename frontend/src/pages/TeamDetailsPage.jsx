import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function TeamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    axios.get(`${API}/teams/${id}`)
      .then(res => {
        const t = res.data;
        setTeam({ ...t });
        // Calculate total spent
        const spent = (t.players || []).reduce((sum, player) => sum + (player.price || 0), 0);
        setTotalSpent(spent);
      })
      .catch(err => console.error('Failed to load team:', err));
  }, [id]);

  if (!team) return (
    <div className="min-h-screen flex items-center justify-center bg-pattern">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading team details...</p>
      </div>
    </div>
  );

  const players = team.players || [];

  return (
    <div className="min-h-screen bg-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-white text-gray-700 font-semibold btn hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 border border-gray-300"
          >
            <span>←</span>
            Back to Results
          </button>
        </div>

        {/* Team Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="team-badge w-20 h-20 text-3xl">
                {(team.name||'').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{team.name}</h1>
                <p className="text-gray-600 text-lg">Complete Player Squad</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{team.points}</div>
                  <div className="text-gray-600 text-sm">Points Left</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{totalSpent}</div>
                  <div className="text-gray-600 text-sm">Points Spent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Players Grid - Compact Version */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">👥</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Squad Players</h2>
              <p className="text-gray-600">{players.length} players in the team</p>
            </div>
            <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold ml-auto">
              {players.length} Players
            </div>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-gray-400">😔</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Players Yet</h3>
              <p className="text-gray-500">This team hasn't acquired any players in the auction.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-auto">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="col-span-1 text-center text-gray-600 text-sm font-semibold">#</div>
                <div className="col-span-5 text-gray-600 text-sm font-semibold">Player Name</div>
                <div className="col-span-3 text-gray-600 text-sm font-semibold">Serial Number</div>
                <div className="col-span-3 text-right text-gray-600 text-sm font-semibold">Price</div>
              </div>
              
              {/* Players List */}
              {players.map((player, index) => (
                <div 
                  key={player._id || index}
                  className="grid grid-cols-12 gap-4 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="col-span-5 flex items-center">
                    <div className="text-gray-900 font-medium truncate">{player.name}</div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <div className="text-gray-600 text-sm">{player.serialNumber}</div>
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    <div className="text-yellow-600 font-bold text-lg">{player.price || 0}</div>
                    <div className="text-gray-500 text-xs ml-2">pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Squad Summary */}
          {players.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Squad Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{players.length}</div>
                  <div className="text-gray-600 text-sm">Total Players</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600">{totalSpent}</div>
                  <div className="text-gray-600 text-sm">Total Spent</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{team.points}</div>
                  <div className="text-gray-600 text-sm">Budget Left</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {players.length > 0 ? Math.round(totalSpent / players.length) : 0}
                  </div>
                  <div className="text-gray-600 text-sm">Avg. Price</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}