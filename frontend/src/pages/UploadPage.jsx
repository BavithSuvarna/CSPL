import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLogin from '../components/AdminLogin';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function UploadPage() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('admin_token'));
  const [pName, setPName] = useState('');
  const [pSerial, setPSerial] = useState('');
  const [pFile, setPFile] = useState(null);
  const [pUploading, setPUploading] = useState(false);
  const [tName, setTName] = useState('');
  const [tUploading, setTUploading] = useState(false);

  useEffect(() => {
    const handler = () => setIsAdmin(!!localStorage.getItem('admin_token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toast = (msg, type = 'info') => {
    alert(`${type.toUpperCase()}: ${msg}`);
  };

  function adminHeaders() {
    const token = localStorage.getItem('admin_token');
    return token ? { 'x-admin-token': token } : {};
  }

  async function uploadPlayer(e) {
    e?.preventDefault();
    if (!isAdmin) return toast('Only admin can upload players. Please login with admin token.', 'error');
    if (!pName || !pSerial) return toast('Please enter player name and serial.', 'warning');
    try {
      setPUploading(true);
      const fd = new FormData();
      fd.append('name', pName);
      fd.append('serialNumber', pSerial);
      if (pFile) fd.append('photo', pFile);

      await axios.post(`${API}/players`, fd, {
        headers: { ...adminHeaders() }
      });

      toast('Player uploaded successfully', 'success');
      setPName(''); setPSerial(''); setPFile(null);
    } catch (err) {
      console.error(err);
      toast('Failed to upload player: ' + (err?.response?.data?.error || err?.message), 'error');
    } finally {
      setPUploading(false);
    }
  }

  async function uploadTeam(e) {
    e?.preventDefault();
    if (!isAdmin) return toast('Only admin can upload teams. Please login with admin token.', 'error');
    if (!tName) return toast('Please enter team name.', 'warning');
    try {
      setTUploading(true);
      await axios.post(`${API}/teams`, { name: tName }, { headers: { ...adminHeaders() } });

      toast('Team uploaded successfully', 'success');
      setTName('');
    } catch (err) {
      console.error(err);
      toast('Failed to upload team: ' + (err?.response?.data?.error || err?.message), 'error');
    } finally {
      setTUploading(false);
    }
  }

  function onAdminLogin(loggedIn) {
    setIsAdmin(!!loggedIn);
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600 text-lg">Manage players and teams for CSPL 2k25 Auction</p>
          </div>
          <AdminLogin onLogin={onAdminLogin} />
        </div>

        {!isAdmin ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200 card-hover">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-3xl">🔒</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 text-lg mb-6">Please login with your admin token to access upload features</p>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Player Upload Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 card-hover">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <div className="text-white text-2xl">👤</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-white text-sm">➕</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Player</h2>
                  <p className="text-gray-600">Register new players for the auction</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={uploadPlayer}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Player Name</label>
                  <input 
                    value={pName} 
                    onChange={(e)=>setPName(e.target.value)} 
                    className="w-full p-4 rounded-xl enhanced-input text-lg"
                    placeholder="Enter player full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Serial Number</label>
                  <input 
                    value={pSerial} 
                    onChange={(e)=>setPSerial(e.target.value)} 
                    className="w-full p-4 rounded-xl enhanced-input text-lg"
                    placeholder="Unique identification number"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={pUploading} 
                    className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg shadow-lg btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </span>
                    ) : (
                      'Add Player to Auction'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={()=>{ setPName(''); setPSerial(''); setPFile(null); }} 
                    className="px-6 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold btn hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Team Upload Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 card-hover">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <div className="text-white text-2xl font-bold">T</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-white text-sm">🏢</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Team</h2>
                  <p className="text-gray-600">Register new teams for bidding</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={uploadTeam}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Team Name</label>
                  <input 
                    value={tName} 
                    onChange={(e)=>setTName(e.target.value)} 
                    className="w-full p-4 rounded-xl enhanced-input text-lg"
                    placeholder="Enter team name"
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm text-center">
                    Team branding and logos can be configured in the team management panel
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={tUploading} 
                    className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg shadow-lg btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      'Create Team'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={()=>{ setTName(''); }} 
                    className="px-6 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold btn hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        {/* {isAdmin && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 card-hover">
              <div className="text-3xl text-blue-600 mb-2">🚀</div>
              <h3 className="text-gray-900 font-semibold mb-1">Quick Setup</h3>
              <p className="text-gray-600 text-sm">Add players and teams in seconds</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 card-hover">
              <div className="text-3xl text-green-600 mb-2">🔒</div>
              <h3 className="text-gray-900 font-semibold mb-1">Secure Access</h3>
              <p className="text-gray-600 text-sm">Admin protected operations</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 card-hover">
              <div className="text-3xl text-purple-600 mb-2">⚡</div>
              <h3 className="text-gray-900 font-semibold mb-1">Live Updates</h3>
              <p className="text-gray-600 text-sm">Real-time auction management</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}