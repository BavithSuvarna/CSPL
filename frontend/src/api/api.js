// frontend/src/api/api.js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function handleRes(res) {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchTeams() {
  return fetch(`${BASE}/teams`).then(handleRes);
}
export async function fetchPlayers(query = '') {
  return fetch(`${BASE}/players${query ? `?${query}` : ''}`).then(handleRes);
}
export async function startAuction(phase='normal') {
  return fetch(`${BASE}/auction/start?phase=${phase}`, { method:'POST' }).then(handleRes);
}
export async function getNext() {
  return fetch(`${BASE}/auction/next`).then(handleRes);
}
export async function assignPlayerAPI({ playerId, teamId }) {
  return fetch(`${BASE}/auction/assign`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ playerId, teamId, action: 'assign' })
  }).then(handleRes);
}
export async function markUnsoldAPI({ playerId }) {
  return fetch(`${BASE}/auction/assign`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ playerId, action: 'unsold' })
  }).then(handleRes);
}
export async function fetchAssignedPlayers() {
  return fetch(`${BASE}/players?status=assigned`).then(handleRes);
}
export async function fetchUnsoldPlayers() {
  return fetch(`${BASE}/players?status=unsold`).then(handleRes);
}
export async function advancePointer() {
  return fetch(`${BASE}/auction/advance`, { method: 'POST' }).then(handleRes);
}
