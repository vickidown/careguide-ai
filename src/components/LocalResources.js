import React, { useState } from 'react';

const RESOURCES = [
  { name:'St. Thomas-Elgin General Hospital',    phone:'519-631-2020', type:'Hospital',         address:'189 Elm St, St. Thomas' },
  { name:'VON Canada – Elgin County',            phone:'519-633-2273', type:'Home Care',         address:'St. Thomas, ON' },
  { name:'Alzheimer Society of Elgin-St. Thomas',phone:'519-631-1220', type:'Dementia Support',  address:'11 Mondamin St' },
  { name:'Ontario Caregiver Organization',       phone:'1-833-416-2273',type:'Caregiver Support',address:'Province-wide helpline' },
  { name:'CMHA Thames Valley Elgin',             phone:'519-433-2023', type:'Mental Health',     address:'648 Huron St' },
  { name:'Elgin County Home Care',               phone:'519-633-7402', type:'PSW Services',      address:'450 Sunset Dr, St. Thomas' },
  { name:'St. Thomas Senior Centre',             phone:'519-631-1880', type:'Seniors Programs',  address:'225 Balaclava St' },
  { name:'Legal Aid Ontario',                    phone:'1-800-668-8258',type:'Legal Help',        address:'Province-wide' },
  { name:'Distress Centre Elgin',                phone:'519-633-1492', type:'Crisis Support',    address:'St. Thomas, ON' },
  { name:'Elgin County Library',                 phone:'519-631-6050', type:'Community Resource',address:'450 Sunset Dr, St. Thomas' },
];

export function LocalResources() {
  const [search, setSearch] = useState('');
  const filtered = RESOURCES.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="Search by name or type…"
        style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.22)', borderRadius:10, padding:'9px 14px', color:'#dde8de', fontSize:14, outline:'none', marginBottom:14, fontFamily:"'DM Sans',sans-serif" }}/>
      {filtered.map((r,i) => (
        <div key={i} style={{ padding:'13px 15px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.09)', borderRadius:12, marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
            <div>
              <div style={{ fontSize:14, color:'#dde8de', marginBottom:3, fontWeight:500 }}>{r.name}</div>
              <div style={{ fontSize:12, color:'#5a7a60' }}>{r.address}</div>
            </div>
            <span style={{ fontSize:10, background:'rgba(124,184,138,0.11)', color:'#7cb88a', padding:'3px 10px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, letterSpacing:'0.04em' }}>{r.type}</span>
          </div>
          <a href={`tel:${r.phone}`} style={{ display:'inline-block', marginTop:8, fontSize:13, color:'#7cb88a', textDecoration:'none' }}>📞 {r.phone}</a>
        </div>
      ))}
    </div>
  );
}

export function UpgradeModal({ reason, onClose, onUpgrade }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
      <div style={{ background:'#0d1f14', border:'1px solid rgba(124,184,138,0.3)', borderRadius:20, padding:36, maxWidth:400, width:'100%', textAlign:'center', fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{fontSize:36, marginBottom:14}}>⭐</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:22, marginBottom:10 }}>Upgrade to Family</h2>
        <p style={{ color:'#6a8a6f', fontSize:14, lineHeight:1.65, marginBottom:22 }}>
          You've used your free {reason} allowance for this month.<br/>Upgrade for unlimited access to everything.
        </p>
        <div style={{ background:'rgba(61,107,79,0.15)', border:'1px solid rgba(124,184,138,0.25)', borderRadius:14, padding:18, marginBottom:22, textAlign:'left' }}>
          {['Unlimited AI conversations','Unlimited letter drafts','Medication tracker (unlimited)','Benefits navigator','Care task tracker','Priority support'].map((f,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'5px 0', borderBottom: i<5 ? '1px solid rgba(124,184,138,0.08)' : 'none' }}>
              <span style={{color:'#7cb88a'}}>✓</span>
              <span style={{color:'#c8dcc9', fontSize:13}}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:5, marginBottom:20 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:40, color:'#fff', fontWeight:700 }}>$19</span>
          <span style={{ color:'#5a7a60', fontSize:14 }}>/month · cancel anytime</span>
        </div>
        <button onClick={onUpgrade} style={{ width:'100%', background:'#7cb88a', border:'none', borderRadius:10, padding:13, color:'#0d1f14', fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>
          Upgrade Now →
        </button>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'#5a7a60', cursor:'pointer', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default LocalResources;
