import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function UnsoldPage() {
  const [unsold, setUnsold] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/players`)
      .then(res => {
        const data = (res.data || []).filter(p => p.status === 'unsold');
        setUnsold(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch unsold players:', err);
        setLoading(false);
      });
  }, []);

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

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          {/* Page Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Unsold Players</h1>
              <p className="text-gray-600 text-lg">Players who went unsold in the CSPL 2k25 Auction</p>
            </div>
            <div className="px-6 py-3 bg-red-500 text-white rounded-full text-lg font-semibold ml-auto">
              {unsold.length} Players
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading unsold players...</p>
            </div>
          ) : unsold.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-3xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">All Players Sold!</h3>
              <p className="text-gray-600 text-lg mb-6">
                Congratulations! Every player found a team in the auction.
              </p>
              <button 
                onClick={() => navigate('/results')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg shadow-lg btn hover:scale-105 transition-transform duration-300"
              >
                View Team Squads
              </button>
            </div>
          ) : (
            <>
              {/* Unsold Players Table - Compact Version */}
              <div className="mb-8">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 mb-3">
                  <div className="col-span-1 text-center text-gray-600 text-sm font-semibold">#</div>
                  <div className="col-span-5 text-gray-600 text-sm font-semibold">Player Name</div>
                  <div className="col-span-4 text-gray-600 text-sm font-semibold">Serial Number</div>
                  <div className="col-span-2 text-center text-gray-600 text-sm font-semibold">Status</div>
                </div>
                
                {/* Players List */}
                <div className="space-y-2 max-h-96 overflow-auto">
                  {unsold.map((player, index) => (
                    <div 
                      key={player._id || index}
                      className="grid grid-cols-12 gap-4 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="col-span-1 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div className="col-span-5 flex items-center">
                        <div className="text-gray-900 font-medium truncate">{player.name}</div>
                      </div>
                      <div className="col-span-4 flex items-center">
                        <div className="text-gray-600 text-sm">{player.serialNumber}</div>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                          UNSOLD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Unsold Players Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{unsold.length}</div>
                    <div className="text-gray-600 text-sm">Total Unsold</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {unsold.length}
                    </div>
                    <div className="text-gray-600 text-sm">Available for Bidding</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      100%
                    </div>
                    <div className="text-gray-600 text-sm">Eligible for Next Round</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={() => navigate('/results')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg btn hover:scale-105 transition-transform duration-300"
            >
              Back to Results
            </button>
            <button 
              onClick={() => navigate('/auction')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg btn hover:scale-105 transition-transform duration-300"
            >
              Go to Auction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}