// frontend/src/components/AuctionPanel.jsx
import React from 'react';

/**
 * AuctionPanel is a reusable control component for auction actions.
 * Props:
 * - onStart(phase)  => start auction with phase 'normal' or 'unsold'
 * - onNext()        => load next player
 * - loading (bool)
 * - phase (string)
 */
export default function AuctionPanel({ onStart, onNext, loading, phase }) {
  return (
    <div className="p-4 bg-white/80 rounded-2xl shadow mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onStart('normal')}
          disabled={loading}
          className="px-4 py-2 rounded-lg shadow font-semibold bg-gradient-to-r from-indigo-400 to-pink-400 text-white btn"
        >
          Start Normal Auction
        </button>

        <button
          onClick={() => onStart('unsold')}
          disabled={loading}
          className="px-4 py-2 rounded-lg shadow font-semibold bg-gradient-to-r from-yellow-400 to-red-400 text-white btn"
        >
          Start Unsold Auction
        </button>

        <button
          onClick={onNext}
          disabled={loading}
          className="ml-auto px-3 py-2 rounded-lg border font-medium btn"
        >
          Next
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        Phase:&nbsp;<span className="font-medium">{phase}</span>
      </div>
    </div>
  );
}