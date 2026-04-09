import React, { useState, useEffect } from 'react';
import Landing        from './pages/Landing';
import AuthScreen     from './pages/AuthScreen';
import Dashboard      from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

const getStorage = (key, def) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
};

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [user,   setUser]   = useState(null);

  useEffect(() => {
    // Admin route: careguideai.ca/admin
    if (window.location.pathname === '/admin') { setScreen('admin'); return; }
    const saved = getStorage('cg_user', null);
    if (saved) { setUser(saved); setScreen('app'); }
  }, []);

  const handleAuth   = (u) => { setUser(u); setScreen('app'); };
  const handleLogout = () => {
    localStorage.removeItem('cg_user');
    localStorage.removeItem('cg_usage');
    setUser(null);
    setScreen('landing');
  };

  if (screen === 'admin')   return <AdminDashboard />;
  if (screen === 'landing') return <Landing onGetStarted={() => setScreen('auth')} />;
  if (screen === 'auth')    return <AuthScreen onAuth={handleAuth} onBack={() => setScreen('landing')} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
