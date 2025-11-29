// frontend/src/pages/TeamsPage.jsx
import React, { useEffect, useState } from 'react';
import TeamCard from '../components/TeamCard';
import { fetchTeams } from '../api/api';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTeams(); }, []);

  async function loadTeams() {
    try {
      const data = await fetchTeams();
      setTeams(data);
    } catch (e) {
      console.error(e);
      alert('Failed to load teams');
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name) return alert('Team name required');
    setLoading(true);
    try {
      const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      const res = await fetch(`${BASE}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setName('');
      loadTeams();
    } catch (err) {
      console.error(err);
      alert('Failed to create team: ' + err.message);
    } finally { setLoading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this team?')) return;
    try {
      const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      const res = await fetch(`${BASE}/teams/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      loadTeams();
    } catch (err) {
      console.error(err);
      alert('Failed to delete team');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Team Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded border" />
        </div>

        <div className="col-span-2">
          <p className="text-sm text-gray-500">Logos are no longer supported — just provide a team name.</p>
        </div>

        <div className="col-span-2">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white">
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>

      <div className="grid gap-3">
        {teams.length === 0 && <div className="text-sm text-gray-500">No teams yet</div>}
        {teams.map(t => (
          <TeamCard key={t._id} team={t} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}