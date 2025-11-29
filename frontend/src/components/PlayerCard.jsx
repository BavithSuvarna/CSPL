// frontend/src/components/PlayerCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function PlayerCard({ player }) {
  if (!player) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No player loaded</div>;
  }

  const src = player.photoResolved || player.photoUrl || player.photo || '/placeholder-player.png';

  return (
    <motion.div
      key={player._id}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white/80 backdrop-blur"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-36 h-36 rounded-full overflow-hidden shadow">
          <img src={src} alt={player.name} className="w-full h-full object-cover player-photo" />
        </div>
        <h2 className="text-2xl font-extrabold">{player.name}</h2>
        <p className="text-sm text-gray-600">Serial: <span className="font-medium">{player.serialNumber}</span></p>
        <p className="text-xs text-gray-500">Status: {player.status}</p>
      </div>
    </motion.div>
  );
}