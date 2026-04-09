import React, { useState, useEffect } from 'react';

// Simple password protection for the admin view
// Change this password before deploying!
const ADMIN_PASSWORD = 'careguide2026';

const MOCK_SIGNUPS = [
  { name:'Sandra M.',   email:'sandra.m@gmail.com',   plan:'family',  joined:'2026-04-01', location:'St. Thomas' },
  { name:'James K.',    email:'james.k@hotmail.com',   plan:'family',  joined:'2026-04-03', location:'Aylmer'     },
  { name:'Diane R.',    email:'diane.r@outlook.com',   plan:'free',    joined:'2026-04-04', location:'Elgin County'},
  { name:'Robert T.',   email:'robert.t@gmail.com',    plan:'free',    joined:'2026-04-05', location:'St. Thomas' },
  { name:'Mary L.',     email:'mary.l@gmail.com',      plan:'family',  joined:'2026-04-06', location:'Port Stanley'},
  { name:'VON Elgin',   email:'admin@vonelgin.ca',     plan:'org',     joined:'2026-04-07', location:'St. Thomas' },
];

const METRIC = (label, value, sub, color='#7cb88a') => ({ label, value, sub, color });

export default function AdminDashboard() {
  const [pw,       setPw]       = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [pwError,  setPwError]  = useState('');
  const [signups]               = useState(MOCK_SIGNUPS);

  const tryLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); }
    else { setPwError('Incorrect password'); }
  };

  const freeUsers   = signups.filter(s=>s.plan==='free').length;
  const familyUsers = signups.filter(s=>s.plan==='family').length;
  const orgUsers    = signups.filter(s=>s.plan==='org').length;
  const mrr         = (familyUsers * 19) + (orgUsers * 79);

  const metrics = [
    METRIC('Total Signups',   signups.length, 'all plans',              '#7cb88a'),
    METRIC('Paying Users',    familyUsers + orgUsers, 'Family + Org',   '#c9a84c'),
    METRIC('Monthly Revenue', `$${mrr}`,  'MRR (recurring)',            '#7cb88a'),
    METRIC('Free Users',      freeUsers,  'conversion opportunities',   '#5a7a60'),
  ];

  const planColor = { free:'#4a6a4f', family:'#7cb88a', org:'#c9a84c' };

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:'#0a1a10', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ maxWidth:360, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🔒</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:22, fontWeight:400 }}>Admin Dashboard</h2>
          <p style={{ color:'#4a6a4f', fontSize:13, marginTop:4 }}>CareGuide AI · Internal</p>
        </div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') tryLogin(); }}
          placeholder="Admin password"
          style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.25)', borderRadius:10, padding:'12px 14px', color:'#dde8de', fontSize:15, outline:'none', marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}/>
        {pwError && <p style={{ color:'#e07070', fontSize:13, marginBottom:8 }}>{pwError}</p>}
        <button onClick={tryLogin} style={{ width:'100%', background:'#3d7a52', border:'none', borderRadius:10, padding:13, color:'#fff', fontSize:15, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
          Enter Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#0a1a10', fontFamily:"'DM Sans',sans-serif", color:'#dde8de' }}>
      {/* Header */}
      <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(124,184,138,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{fontSize:20}}>🌿</span>
          <div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#c8dcc9' }}>CareGuide </span>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'#7cb88a' }}>Admin</span>
          </div>
        </div>
        <div style={{ fontSize:12, color:'#4a6a4f', letterSpacing:'0.06em' }}>
          Last updated: {new Date().toLocaleDateString('en-CA')}
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 20px' }}>

        {/* Metrics */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
          {metrics.map((m,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:14, padding:'20px 18px' }}>
              <div style={{ fontSize:11, color:'#4a6a4f', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>{m.label}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, color:m.color, fontWeight:700, lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:11, color:'#4a6a4f', marginTop:4 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Revenue breakdown */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:14, padding:'20px 18px', marginBottom:20 }}>
          <div style={{ fontSize:12, color:'#5a7a60', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:16 }}>Revenue Breakdown</div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {[
              { plan:'Free', count:freeUsers, rev:0, color:'#4a6a4f' },
              { plan:'Family ($19)', count:familyUsers, rev:familyUsers*19, color:'#7cb88a' },
              { plan:'Organization ($79)', count:orgUsers, rev:orgUsers*79, color:'#c9a84c' },
            ].map((row,i)=>(
              <div key={i} style={{ flex:1, minWidth:140, background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'14px 16px', border:`1px solid ${row.color}30` }}>
                <div style={{ fontSize:12, color:row.color, marginBottom:6, fontWeight:500 }}>{row.plan}</div>
                <div style={{ fontSize:22, fontWeight:700, color:'#fff' }}>{row.count} <span style={{ fontSize:13, color:'#5a7a60', fontWeight:400 }}>users</span></div>
                <div style={{ fontSize:14, color:row.color, marginTop:4 }}>${row.rev}/mo</div>
              </div>
            ))}
            <div style={{ flex:1, minWidth:140, background:'rgba(61,122,82,0.12)', borderRadius:10, padding:'14px 16px', border:'1px solid rgba(124,184,138,0.3)' }}>
              <div style={{ fontSize:12, color:'#7cb88a', marginBottom:6, fontWeight:500 }}>Total MRR</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#7cb88a' }}>${mrr}</div>
              <div style={{ fontSize:12, color:'#5a7a60', marginTop:4 }}>~${Math.round(mrr*0.8)} profit</div>
            </div>
          </div>
        </div>

        {/* User list */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:14, padding:'20px 18px' }}>
          <div style={{ fontSize:12, color:'#5a7a60', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:16 }}>Recent Signups</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(124,184,138,0.12)' }}>
                  {['Name','Email','Plan','Location','Joined'].map(h=>(
                    <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, color:'#4a6a4f', letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signups.map((u,i)=>(
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'10px 12px', color:'#c8dcc9', fontWeight:500 }}>{u.name}</td>
                    <td style={{ padding:'10px 12px', color:'#7cb88a' }}>{u.email}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:11, background:`${planColor[u.plan]}20`, color:planColor[u.plan], padding:'3px 10px', borderRadius:20, letterSpacing:'0.05em', textTransform:'uppercase' }}>
                        {u.plan}
                      </span>
                    </td>
                    <td style={{ padding:'10px 12px', color:'#5a7a60' }}>{u.location}</td>
                    <td style={{ padding:'10px 12px', color:'#5a7a60' }}>{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize:11, color:'#3a5a3f', marginTop:14, fontStyle:'italic' }}>
            ⚡ Connect a real database (Supabase free tier) to see live user data. See README for instructions.
          </p>
        </div>

      </div>
    </div>
  );
}
