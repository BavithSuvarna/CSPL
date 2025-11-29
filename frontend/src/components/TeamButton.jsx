// frontend/src/components/TeamButton.jsx
import React from 'react';

export default function TeamButton({ team, onClick }) {
  return (
    <button
      onClick={() => onClick(team._id)}
      className="flex items-center gap-3 p-3 rounded-xl shadow hover:scale-[1.02] transition-transform border border-white/20 bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-300 text-white"
    >
      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center font-semibold">{(team.name||'').charAt(0).toUpperCase()}</div>
      <span className="font-semibold">{team.name}</span>
    </button>
  );
}