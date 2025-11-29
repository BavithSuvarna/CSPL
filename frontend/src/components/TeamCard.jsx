// frontend/src/components/TeamCard.jsx
import React from 'react';

export default function TeamCard({ team, onDelete, onSelect }) {
  const initial = (team?.name || '').charAt(0).toUpperCase() || '?';
  return (
    <div className="flex items-center gap-4 p-3 bg-white/80 rounded-xl shadow-sm">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
        {initial}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{team.name}</div>
      </div>
      {onSelect && (
        <button
          onClick={() => onSelect(team._id)}
          className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm mr-2"
        >
          Select
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(team._id)}
          className="px-3 py-1 rounded-md bg-red-500 text-white text-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
}