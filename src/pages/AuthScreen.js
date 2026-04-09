import React, { useState } from 'react';

const setStorage = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export default function AuthScreen({ onAuth, onBack }) {
  const [mode, setMode]   = useState('signup');
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (!email.includes('@'))       { setError('Please enter a valid email address.'); return; }
    if (pw.length < 6)              { setError('Password must be at least 6 characters.'); return; }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return; }

    setLoading(true);
    // Simulate brief network delay for realism
    await new Promise(r => setTimeout(r, 600));

    const user = {
      email,
      name: name.trim() || email.split('@')[0],
      plan: 'free',
      joined: new Date().toISOString(),
    };
    setStorage('cg_user', user);
    setStorage('cg_usage', { questions: 0, letters: 0 });
    setLoading(false);
    onAuth(user);
  };

  const inp = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(124,184,138,0.25)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#dde8de',
    fontSize: 15,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#0d1f14,#0a1a10,#0d1f14)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Back */}
        <button onClick={onBack} style={{ background:'none', border:'none', color:'#5a7a60', cursor:'pointer', fontSize:14, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>
          ← Back to home
        </button>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:38, marginBottom:12 }}>🌿</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#fff', fontWeight:400, marginBottom:4 }}>
            CareGuide <span style={{color:'#7cb88a'}}>AI</span>
          </h1>
          <p style={{ fontSize:12, color:'#5a7a60', letterSpacing:'0.08em', textTransform:'uppercase' }}>Ontario Caregiver Assistant</p>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.14)', borderRadius:20, padding:32 }}>

          {/* Tab toggle */}
          <div style={{ display:'flex', background:'rgba(255,255,255,0.05)', borderRadius:10, padding:3, marginBottom:24 }}>
            {['signup','login'].map(m => (
              <button key={m} onClick={()=>{ setMode(m); setError(''); }} style={{
                flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer',
                background: mode===m ? 'rgba(61,107,79,0.55)' : 'transparent',
                color: mode===m ? '#fff' : '#5a7a60',
                fontSize:14, transition:'all 0.2s',
                fontFamily:"'DM Sans',sans-serif",
              }}>
                {m === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {mode === 'signup' && (
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" style={inp}/>
            )}
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={inp}/>
            <input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password (min. 6 characters)" type="password" style={inp}
              onKeyDown={e=>{ if(e.key==='Enter') submit(); }}/>

            {error && <p style={{ fontSize:13, color:'#e07070', lineHeight:1.4 }}>{error}</p>}

            <button onClick={submit} disabled={loading} style={{
              background: loading ? 'rgba(61,122,82,0.5)' : '#3d7a52',
              border:'none', borderRadius:10, padding:'13px',
              color:'#fff', fontSize:15, cursor: loading ? 'default' : 'pointer',
              marginTop:4, fontWeight:500, fontFamily:"'DM Sans',sans-serif",
              transition:'background 0.2s',
            }}>
              {loading ? '...' : mode === 'signup' ? 'Start Free Trial →' : 'Sign In →'}
            </button>
          </div>

          <p style={{ fontSize:12, color:'#4a6a4f', textAlign:'center', marginTop:16, lineHeight:1.6 }}>
            {mode === 'signup'
              ? '✓ 14 days free · No credit card required · Cancel anytime'
              : 'Forgot password? Email hello@careguideai.ca'}
          </p>
        </div>

        <p style={{ textAlign:'center', fontSize:11, color:'#3a5a3f', marginTop:20, lineHeight:1.6, fontStyle:'italic' }}>
          CareGuide AI is informational only. Always confirm with qualified professionals.
        </p>
      </div>
    </div>
  );
}
