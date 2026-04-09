import React, { useState } from 'react';

const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const setStorage = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); }      catch {} };

export default function TaskTracker() {
  const [tasks, setTasks] = useState(() => getStorage('cg_tasks', []));
  const [text,  setText]  = useState('');
  const [date,  setDate]  = useState('');

  const save = (t) => { setTasks(t); setStorage('cg_tasks', t); };
  const add  = () => {
    if (!text.trim()) return;
    save([...tasks, { id:Date.now(), text:text.trim(), date, done:false }]);
    setText(''); setDate('');
  };
  const toggle = id => save(tasks.map(t => t.id===id ? {...t,done:!t.done} : t));
  const remove = id => save(tasks.filter(t => t.id!==id));

  const upcoming = tasks.filter(t=>!t.done).sort((a,b)=>a.date>b.date?1:-1);
  const done     = tasks.filter(t=> t.done);

  const inp = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.22)', borderRadius:10, padding:'9px 13px', color:'#dde8de', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif" };

  return (
    <div style={{ color:'#dde8de' }}>
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add task or appointment…" style={{...inp, flex:2, minWidth:160}}
          onKeyDown={e=>{ if(e.key==='Enter') add(); }}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inp, flex:1, minWidth:130, fontSize:13}}/>
        <button onClick={add} style={{ background:'#3d6b4f', border:'none', borderRadius:10, padding:'9px 18px', color:'#fff', cursor:'pointer', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>+ Add</button>
      </div>

      {tasks.length === 0 && (
        <p style={{ color:'#4a6a4f', fontStyle:'italic', fontSize:14, textAlign:'center', padding:'32px 0' }}>
          No tasks yet. Add appointments, medication reminders, or care tasks above.
        </p>
      )}

      {upcoming.map(t => (
        <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:10, marginBottom:7 }}>
          <input type="checkbox" checked={false} onChange={()=>toggle(t.id)} style={{ accentColor:'#7cb88a', width:16, height:16, cursor:'pointer' }}/>
          <span style={{ flex:1, fontSize:14 }}>{t.text}</span>
          {t.date && <span style={{ fontSize:12, color:'#7cb88a', background:'rgba(124,184,138,0.1)', padding:'2px 9px', borderRadius:6 }}>{t.date}</span>}
          <button onClick={()=>remove(t.id)} style={{ background:'none', border:'none', color:'#4a6a4f', cursor:'pointer', fontSize:18, lineHeight:1 }}>×</button>
        </div>
      ))}

      {done.length > 0 && (
        <div style={{ marginTop:18 }}>
          <p style={{ fontSize:11, color:'#4a6a4f', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Completed</p>
          {done.map(t => (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', opacity:0.4, marginBottom:5 }}>
              <input type="checkbox" checked onChange={()=>toggle(t.id)} style={{ accentColor:'#7cb88a', cursor:'pointer' }}/>
              <span style={{ flex:1, fontSize:13, textDecoration:'line-through' }}>{t.text}</span>
              <button onClick={()=>remove(t.id)} style={{ background:'none', border:'none', color:'#4a6a4f', cursor:'pointer', fontSize:16 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
