import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLogin from '../components/AdminLogin';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function AuctionPage() {
  const [teams, setTeams] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playersLeft, setPlayersLeft] = useState(0);
  const [bid, setBid] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [phase, setPhase] = useState('normal');
  const [allPlayers, setAllPlayers] = useState([]);
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('admin_token'));

  async function loadMeta() {
    try {
      const [teamsRes, playersRes] = await Promise.all([
        axios.get(`${API}/teams`),
        axios.get(`${API}/players`)
      ]);
      const serverTeams = (teamsRes.data || []).map(t => ({ ...t }));
      setTeams(serverTeams);
      const available = (playersRes.data || []).filter(p => p.status === 'available');
      setPlayersLeft(available.length);
      setAllPlayers(playersRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { 
    loadMeta();
  }, []);

  function onAdminLogin(success) {
    setIsAdmin(!!success);
    loadMeta();
  }

  async function startAuction(startPhase = 'normal') {
    setLoading(true);
    try {
      const startRes = await axios.post(`${API}/auction/start?phase=${startPhase}`);
      const resPhase = startRes.data.phase || startPhase;
      setPhase(resPhase);

      if (resPhase === 'unsold' && startRes.data.unsoldReactivated) {
        alert('Unsold auction started — unsold players reactivated and are now available for bidding.');
      } else if (resPhase === 'unsold' && !startRes.data.unsoldReactivated) {
        alert('Unsold auction started but there were no unsold players.');
      }

      if (startRes.data.queueLength === 0 && resPhase === 'normal') {
        await startAuction('unsold');
        return;
      }

      const next = await axios.get(`${API}/auction/next`);
      if (next.data.done) {
        if (next.data.phase === 'normal') {
          await startAuction('unsold');
        } else {
          setCurrent(null);
        }
      } else {
        setPhase(next.data.phase || resPhase);
        setCurrent(next.data.player || null);
        setPlayersLeft(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to start auction: ' + (err?.response?.data?.error || err.message));
    } finally { setLoading(false); }
  }

  async function nextPlayer() {
    setLoading(true);
    try {
      const next = await axios.get(`${API}/auction/next`);
      if (next.data.done) {
        if (next.data.phase === 'normal') {
          await startAuction('unsold');
          return;
        }
        setCurrent(null);
        alert('Queue exhausted');
      } else {
        setPhase(next.data.phase);
        setCurrent(next.data.player || null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to get next player');
    } finally { setLoading(false); }
  }

  async function assignPlayer() {
    if (!current) return alert('No player loaded');
    if (!selectedTeam) return alert('Select a team');
    const price = Number(bid);
    if (!price || price <= 0) return alert('Enter a valid bid points');
    
    const teamObj = teams.find(t => t._id === selectedTeam);
    const teamName = teamObj ? teamObj.name : selectedTeam;
    const confirmMsg = `Assign player "${current.name}" to team "${teamName}" for ${price} points? This action is final.`;
    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await axios.post(`${API}/auction/assign`, {
        playerId: current._id,
        teamId: selectedTeam,
        action: 'assign',
        price
      });

      await loadMeta();
      const next = await axios.get(`${API}/auction/next`);
      if (next.data.done) {
        if (next.data.phase === 'normal') {
          await startAuction('unsold');
        } else {
          setCurrent(null);
        }
      } else {
        setPhase(next.data.phase);
        setCurrent(next.data.player || null);
      }

      setBid(''); setSelectedTeam('');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message;
      alert('Assign failed: ' + msg);
    } finally { setLoading(false); }
  }

  async function markUnsold() {
    if (!current) return alert('No player loaded');

    const confirmMsg = `Mark player "${current.name}" as UNSOLD? This will move them to the unsold pool.`;
    if (!confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await axios.post(`${API}/auction/assign`, { playerId: current._id, action: 'unsold' });
      await loadMeta();
      const next = await axios.get(`${API}/auction/next`);
      if (next.data.done) {
        if (next.data.phase === 'normal') {
          await startAuction('unsold');
        } else {
          setCurrent(null);
        }
      } else {
        setPhase(next.data.phase);
        setCurrent(next.data.player || null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to mark unsold');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Auction</h1>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                phase === 'normal' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                Phase: {phase.toUpperCase()}
              </span>
            </div>
          </div>
          <AdminLogin onLogin={onAdminLogin} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Auction Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-6">
              {/* Auction Controls */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-gray-600 text-sm">Players Remaining</p>
                  <p className="text-4xl font-bold text-gray-900">{playersLeft}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => startAuction('normal')}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-lg btn disabled:opacity-50"
                  >
                    {loading ? 'Starting...' : 'Start Auction'}
                  </button>
                  
                  {/* <button
                    onClick={nextPlayer}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg btn disabled:opacity-50"
                  >
                    Next Player
                  </button> */}
                </div>
              </div>

              {/* Current Player Display */}
              {!current ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-gray-400">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Player Loaded</h3>
                  <p className="text-gray-500">Click "Start Auction" to begin</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Player Info */}
                  <div className="text-center">
                    <div className="mb-8">
                      <div className="text-gray-600 text-lg mb-2">Serial Number</div>
                      <div className="text-8xl font-bold text-blue-600 mb-4">
                        {current.serialNumber}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{current.name}</h2>
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        current.status === 'available' ? 'status-available' : 
                        current.status === 'assigned' ? 'status-assigned' : 'status-unsold'
                      }`}>
                        {current.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Bidding Controls */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Select Team</label>
                      <select 
                        value={selectedTeam} 
                        onChange={(e)=>setSelectedTeam(e.target.value)} 
                        className="w-full p-4 rounded-xl enhanced-input text-lg"
                      >
                        <option value="">-- Choose Team --</option>
                        {teams.map(t => (
                          <option key={t._id} value={t._id}>
                            {t.name} — {t.points} Points
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">Bid Amount</label>
                      <input 
                        value={bid} 
                        onChange={(e)=>setBid(e.target.value)} 
                        type="number" 
                        className="w-full p-4 rounded-xl enhanced-input text-lg"
                        placeholder="Enter bid points"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={assignPlayer} 
                        disabled={loading || !selectedTeam} 
                        className="px-4 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-lg btn disabled:opacity-50"
                      >
                        Assign to Team
                      </button>
                      <button 
                        onClick={markUnsold} 
                        disabled={loading} 
                        className="px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg btn disabled:opacity-50"
                      >
                        Mark Unsold
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Teams Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Teams</h3>
                <button onClick={loadMeta} className="text-gray-500 hover:text-gray-700 btn">
                  🔄
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-auto">
                {teams.map(team => (
                  <div key={team._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                    <div className="team-badge w-12 h-12">
                      {(team.name||'').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{team.name}</div>
                      <div className="text-gray-600 text-sm">
                        Points: <span className="font-bold text-blue-600">{team.points}</span> • 
                        Players: <span className="font-bold text-green-600">{team.players?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                <button 
                  onClick={() => setShowAllPlayers(s => !s)} 
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm btn hover:bg-gray-200"
                >
                  {showAllPlayers ? 'Hide' : 'All Players'}
                </button>
              </div>
              
              {showAllPlayers && (
                <div className="mt-4 max-h-48 overflow-auto">
                  <div className="space-y-2">
                    {allPlayers.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">No players uploaded</div>
                    ) : (
                      allPlayers.map(p => (
                        <div key={p._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{p.serialNumber}</span>
                          </div>
                          <div className="text-gray-700 text-sm truncate">{p.name}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}