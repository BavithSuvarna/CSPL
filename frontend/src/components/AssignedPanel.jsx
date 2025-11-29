// frontend/src/components/AssignedPanel.jsx
import React, { useEffect, useState } from 'react';
import { fetchAssignedPlayers } from '../api/api';

export default function AssignedPanel({ refreshSignal }) {
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    load();
  }, [refreshSignal]);

  async function load() {
    try {
      const data = await fetchAssignedPlayers();
      const map = {};
      data.forEach(p => {
        const tId = p.assignedTeam?._id || 'unassigned';
        if (!map[tId]) map[tId] = { team: p.assignedTeam, players: [] };
        map[tId].players.push(p);
      });
      setAssigned(Object.values(map));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-4 bg-white/70 rounded-2xl shadow-md w-full">
      <h3 className="text-lg font-bold mb-3">Assigned Players</h3>
      <div className="flex flex-col gap-3 max-h-[60vh] overflow-auto">
        {assigned.length === 0 && <div className="text-sm text-gray-500">No assigned players yet</div>}
        {assigned.map(group => (
          <div key={group.team?._id || 'un'} className="border p-2 rounded">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">{(group.team?.name||'U').charAt(0).toUpperCase()}</div>
              <div>
                <div className="font-semibold">{group.team?.name || 'Unassigned'}</div>
                <div className="text-xs text-gray-500">{group.players.length} players</div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {group.players.map(p => (
                <div key={p._id} className="p-2 bg-white/90 rounded shadow-sm">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">S: {p.serialNumber}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}