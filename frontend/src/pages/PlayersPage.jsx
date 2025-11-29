// frontend/src/pages/PlayersPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchPlayers } from '../api/api';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [serial, setSerial] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadPlayers(); }, []);

  async function loadPlayers() {
    try {
      const data = await fetchPlayers();
      setPlayers(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load players');
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name || !serial) return alert('Name and serial number required');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('name', name);
      form.append('serialNumber', serial);
      if (photoFile) form.append('photo', photoFile);
      else if (photoUrl) form.append('photoUrl', photoUrl);

      const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      const res = await fetch(`${BASE}/players`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setName(''); setSerial(''); setPhotoFile(null); setPhotoUrl('');
      loadPlayers();
    } catch (err) {
      console.error(err);
      alert('Failed to create player: ' + err.message);
    } finally { setLoading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this player?')) return;
    try {
      const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      const res = await fetch(`${BASE}/players/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      loadPlayers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete player');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Players</h1>

      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Player Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded border" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Serial Number</label>
          <input value={serial} onChange={e => setSerial(e.target.value)} className="w-full p-2 rounded border" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo (file)</label>
          <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo URL (optional)</label>
          <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full p-2 rounded border" />
        </div>

        <div className="col-span-2">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">
            {loading ? 'Adding...' : 'Add Player'}
          </button>
        </div>
      </form>

      <div className="grid gap-3">
        {players.length === 0 && <div className="text-sm text-gray-500">No players yet</div>}
        {players.map(p => (
          <div key={p._id} className="flex items-center gap-4 p-3 bg-white/80 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img src={p.photoUrl || '/placeholder-player.png'} alt={p.name} className="player-photo--sm" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-gray-500">Serial: {p.serialNumber} • Status: {p.status}</div>
            </div>
            <button onClick={() => handleDelete(p._id)} className="px-3 py-1 rounded-md bg-red-500 text-white text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}