import React, { useState, useEffect } from 'react';

const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const setStorage = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); }      catch {} };

// Request browser notification permission
async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

// Show a browser notification
function showNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  });
}

// Check tasks and fire browser notifications for anything due today/tomorrow
function checkAndNotify(tasks) {
  const today     = new Date().toISOString().split('T')[0];
  const tomorrow  = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dueSoon   = tasks.filter(t => !t.done && t.date && (t.date === today || t.date === tomorrow));
  dueSoon.forEach(t => {
    const when = t.date === today ? 'TODAY' : 'TOMORROW';
    showNotification(`🌿 CareGuide Reminder — ${when}`, t.text);
  });
  return dueSoon;
}

export default function TaskTracker({ userEmail, userName }) {
  const [tasks,       setTasks]       = useState(() => getStorage('cg_tasks', []));
  const [text,        setText]        = useState('');
  const [date,        setDate]        = useState('');
  const [notifStatus, setNotifStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [email,       setEmail]       = useState(() => getStorage('cg_reminder_email', userEmail || ''));
  const [emailSaved,  setEmailSaved]  = useState(false);
  const [sending,     setSending]     = useState(false);
  const [sendMsg,     setSendMsg]     = useState('');

  // Check for due tasks on mount and every 30 minutes
  useEffect(() => {
    if (notifStatus === 'granted') checkAndNotify(tasks);
    const interval = setInterval(() => {
      if (Notification.permission === 'granted') checkAndNotify(getStorage('cg_tasks', []));
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const save = (t) => { setTasks(t); setStorage('cg_tasks', t); };

  const add = () => {
    if (!text.trim()) return;
    save([...tasks, { id: Date.now(), text: text.trim(), date, done: false }]);
    setText(''); setDate('');
  };

  const toggle = id => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = id => save(tasks.filter(t => t.id !== id));

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifStatus(granted ? 'granted' : 'denied');
    if (granted) {
      const due = checkAndNotify(tasks);
      if (due.length === 0) showNotification('🌿 CareGuide AI', 'Notifications enabled! You\'ll be reminded about upcoming appointments.');
    }
  };

  const saveEmail = () => {
    setStorage('cg_reminder_email', email);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const sendTestReminder = async () => {
    if (!email.includes('@')) { setSendMsg('Please enter a valid email first.'); return; }
    setSending(true); setSendMsg('');
    try {
      const res = await fetch('/api/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: userName || 'there', tasks }),
      });
      const data = await res.json();
      if (data.sent) setSendMsg(`✅ Reminder sent! Check ${email}`);
      else setSendMsg('No tasks due today or tomorrow — nothing to remind about yet.');
    } catch { setSendMsg('Could not send — check your Resend API key in Vercel.'); }
    setSending(false);
  };

  const upcoming = tasks.filter(t => !t.done).sort((a, b) => a.date > b.date ? 1 : -1);
  const done     = tasks.filter(t =>  t.done);
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const inp = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(124,184,138,0.22)',
    borderRadius: 10,
    padding: '9px 13px',
    color: '#dde8de',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'DM Sans',sans-serif",
  };

  const tagColor = (date) => {
    if (date === today)    return { bg: 'rgba(224,112,112,0.15)', color: '#e07070', label: 'TODAY' };
    if (date === tomorrow) return { bg: 'rgba(201,168,76,0.15)',  color: '#c9a84c', label: 'TOMORROW' };
    return { bg: 'rgba(124,184,138,0.1)', color: '#7cb88a', label: date };
  };

  return (
    <div style={{ color: '#dde8de' }}>

      {/* ── NOTIFICATION BANNER ────────────────────────────── */}
      {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
        <div style={{ background: 'rgba(61,107,79,0.2)', border: '1px solid rgba(124,184,138,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 14, color: '#c8dcc9', marginBottom: 2 }}>🔔 Enable browser notifications</div>
            <div style={{ fontSize: 12, color: '#5a7a60' }}>Get pop-up alerts when appointments are due (desktop & Android)</div>
          </div>
          {notifStatus === 'denied' ? (
            <span style={{ fontSize: 12, color: '#e07070' }}>Blocked — allow in browser settings</span>
          ) : (
            <button onClick={enableNotifications} style={{ background: '#3d6b4f', border: 'none', borderRadius: 8, padding: '7px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif" }}>
              Enable
            </button>
          )}
        </div>
      )}

      {notifStatus === 'granted' && (
        <div style={{ background: 'rgba(124,184,138,0.08)', border: '1px solid rgba(124,184,138,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#7cb88a' }}>
          ✅ Browser notifications are on — you'll get pop-up alerts for today & tomorrow's tasks
        </div>
      )}

      {/* ── EMAIL REMINDERS ────────────────────────────────── */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,184,138,0.12)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: '#c8dcc9', marginBottom: 4, fontWeight: 500 }}>📧 Email reminders</div>
        <div style={{ fontSize: 12, color: '#5a7a60', marginBottom: 12 }}>Works on all devices including iPhone. We'll email you the day of upcoming tasks.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            style={{ ...inp, flex: 2, minWidth: 180, fontSize: 13 }}
          />
          <button onClick={saveEmail} style={{ background: emailSaved ? '#7cb88a' : '#3d6b4f', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background 0.2s' }}>
            {emailSaved ? '✓ Saved' : 'Save'}
          </button>
          <button onClick={sendTestReminder} disabled={sending} style={{ background: 'transparent', border: '1px solid rgba(124,184,138,0.3)', borderRadius: 8, padding: '8px 14px', color: '#7cb88a', fontSize: 13, cursor: sending ? 'default' : 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            {sending ? 'Sending…' : 'Test Email'}
          </button>
        </div>
        {sendMsg && <p style={{ fontSize: 12, color: sendMsg.startsWith('✅') ? '#7cb88a' : '#c9a84c', marginTop: 8 }}>{sendMsg}</p>}
      </div>

      {/* ── ADD TASK ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={text} onChange={e => setText(e.target.value)}
          placeholder="Add appointment or task…"
          onKeyDown={e => { if (e.key === 'Enter') add(); }}
          style={{ ...inp, flex: 2, minWidth: 160 }} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: 130, fontSize: 13 }} />
        <button onClick={add} style={{ background: '#3d6b4f', border: 'none', borderRadius: 10, padding: '9px 18px', color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
          + Add
        </button>
      </div>

      {/* ── EMPTY STATE ────────────────────────────────────── */}
      {tasks.length === 0 && (
        <p style={{ color: '#4a6a4f', fontStyle: 'italic', fontSize: 14, textAlign: 'center', padding: '28px 0' }}>
          No tasks yet. Add appointments, medication reminders, or care tasks above.
        </p>
      )}

      {/* ── UPCOMING TASKS ─────────────────────────────────── */}
      {upcoming.map(t => {
        const tag = t.date ? tagColor(t.date) : null;
        return (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,184,138,0.1)', borderRadius: 10, marginBottom: 7 }}>
            <input type="checkbox" checked={false} onChange={() => toggle(t.id)} style={{ accentColor: '#7cb88a', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 14 }}>{t.text}</span>
            {tag && (
              <span style={{ fontSize: 10, background: tag.bg, color: tag.color, padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap', fontWeight: 600, letterSpacing: '0.04em' }}>
                {tag.label}
              </span>
            )}
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: '#4a6a4f', cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>
        );
      })}

      {/* ── COMPLETED ──────────────────────────────────────── */}
      {done.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <p style={{ fontSize: 11, color: '#4a6a4f', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Completed</p>
          {done.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', opacity: 0.4, marginBottom: 5 }}>
              <input type="checkbox" checked onChange={() => toggle(t.id)} style={{ accentColor: '#7cb88a', cursor: 'pointer' }} />
              <span style={{ flex: 1, fontSize: 13, textDecoration: 'line-through' }}>{t.text}</span>
              <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', color: '#4a6a4f', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
