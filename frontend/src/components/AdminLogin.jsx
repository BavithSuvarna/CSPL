// frontend/src/components/AdminLogin.jsx
import React, { useState, useEffect } from 'react';

/**
 * AdminLogin (token-only)
 * - Stores token in localStorage as "admin_token"
 * - Calls onLogin(true/false) when login state changes
 *
 * Usage: <AdminLogin onLogin={(loggedIn)=>{...}} />
 */
export default function AdminLogin({ onLogin }) {
  const [tokenInput, setTokenInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin_token'));

  useEffect(() => {
    // notify parent about initial state
    onLogin && onLogin(isLoggedIn);
    // keep state in sync if token changed elsewhere
    const handler = () => {
      const cur = !!localStorage.getItem('admin_token');
      setIsLoggedIn(cur);
      onLogin && onLogin(cur);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  function login(e) {
    e?.preventDefault();
    if (!tokenInput) return alert('Enter admin token');
    localStorage.setItem('admin_token', tokenInput);
    setTokenInput('');
    setIsLoggedIn(true);
    onLogin && onLogin(true);
  }

  function logout() {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    onLogin && onLogin(false);
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600">Admin</span>
        <button onClick={logout} className="px-2 py-1 text-sm border rounded">Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={login} className="flex items-center gap-2">
      <input
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
        placeholder="Admin token"
        className="p-1 border rounded text-sm"
        type="password"
      />
      <button type="submit" className="px-2 py-1 text-sm bg-blue-600 text-white rounded">Login</button>
    </form>
  );
}