import React, { useState } from 'react';

const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const setStorage = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); }      catch {} };

const CATEGORIES = ['Medical Visit','Medication Change','Symptom','Mood','Nutrition','Fall/Incident','Behaviour','Sleep','Weight','Other'];
const MOODS = ['😊 Good','😐 Neutral','😔 Poor','😟 Anxious','😴 Exhausted','😤 Agitated'];

export default function CareJournal() {
  const [entries,  setEntries]  = useState(() => getStorage('cg_journal', []));
  const [tab,      setTab]      = useState('log'); // log | add | print
  const [form,     setForm]     = useState({ date: new Date().toISOString().split('T')[0], category:'Medical Visit', note:'', mood:'', vitals:'' });
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');
  const [profile,  setProfile]  = useState(() => getStorage('cg_profile', { name:'', dob:'', diagnoses:'', allergies:'', medications:'', doctor:'', pharmacy:'' }));
  const [editProf, setEditProf] = useState(false);

  const save = (e) => { const u = [...entries, { ...form, id:Date.now() }].sort((a,b)=>b.date>a.date?1:-1); setEntries(u); setStorage('cg_journal',u); setForm({ date:new Date().toISOString().split('T')[0], category:'Medical Visit', note:'', mood:'', vitals:'' }); setTab('log'); };
  const remove = (id) => { const u = entries.filter(e=>e.id!==id); setEntries(u); setStorage('cg_journal',u); };
  const saveProfile = () => { setStorage('cg_profile', profile); setEditProf(false); };

  const filtered = entries.filter(e => {
    const matchCat  = filter==='All' || e.category===filter;
    const matchSearch = e.note?.toLowerCase().includes(search.toLowerCase()) || e.category?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catColor = { 'Medical Visit':'#7cb88a','Medication Change':'#c9a84c','Symptom':'#e07070','Fall/Incident':'#e07070','Mood':'#8a7cb8','Nutrition':'#7cb8b8','Behaviour':'#c9a84c','Sleep':'#7898c8','Other':'#6a8a6f','Weight':'#7cb88a' };

  const inp = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.22)', borderRadius:10, padding:'9px 13px', color:'#dde8de', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif", width:'100%' };

  const printView = () => {
    const content = `
CARE JOURNAL — ${profile.name || 'Care Recipient'}
Generated: ${new Date().toLocaleDateString('en-CA')}

CARE RECIPIENT PROFILE
Name: ${profile.name}
Date of Birth: ${profile.dob}
Diagnoses: ${profile.diagnoses}
Allergies: ${profile.allergies}
Medications: ${profile.medications}
Primary Doctor: ${profile.doctor}
Pharmacy: ${profile.pharmacy}

HEALTH LOG (${entries.length} entries)
${entries.map(e => `${e.date} | ${e.category}${e.mood?' | '+e.mood:''}${e.vitals?' | Vitals: '+e.vitals:''}
${e.note}`).join('\n\n')}
    `;
    const blob = new Blob([content], { type:'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `care-journal-${profile.name || 'report'}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={{ color:'#dde8de' }}>
      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {[['log','📋 Journal'],['add','+ Add Entry'],['print','📤 Export']].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={{
            background: tab===id ? 'rgba(61,107,79,0.45)' : 'rgba(255,255,255,0.04)',
            border:`1px solid ${tab===id ? 'rgba(124,184,138,0.55)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius:8, padding:'7px 14px', cursor:'pointer', fontSize:13,
            color: tab===id ? '#c8dcc9' : '#5a7a60', fontFamily:"'DM Sans',sans-serif",
          }}>{label}</button>
        ))}
      </div>

      {/* ADD ENTRY */}
      {tab === 'add' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Date</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/>
            </div>
            <div>
              <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...inp, cursor:'pointer'}}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Mood (optional)</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {MOODS.map(m => (
                <button key={m} onClick={()=>setForm({...form, mood: form.mood===m ? '' : m})} style={{
                  background: form.mood===m ? 'rgba(61,107,79,0.45)' : 'rgba(255,255,255,0.04)',
                  border:`1px solid ${form.mood===m ? 'rgba(124,184,138,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:20, padding:'5px 12px', cursor:'pointer', fontSize:13,
                  color: form.mood===m ? '#c8dcc9' : '#5a7a60', fontFamily:"'DM Sans',sans-serif",
                }}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Vitals (optional — e.g. BP 130/80, weight 68kg)</label>
            <input value={form.vitals} onChange={e=>setForm({...form,vitals:e.target.value})} placeholder="Blood pressure, weight, temperature…" style={inp}/>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Notes *</label>
            <textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What happened? What did the doctor say? Any changes?" rows={4} style={{...inp, resize:'none'}}/>
          </div>
          <button onClick={save} disabled={!form.note.trim()} style={{ background: form.note.trim() ? '#3d7a52' : 'rgba(61,122,82,0.2)', border:'none', borderRadius:10, padding:'11px', color:'#fff', cursor: form.note.trim() ? 'pointer' : 'default', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
            Save Entry
          </button>
        </div>
      )}

      {/* JOURNAL LOG */}
      {tab === 'log' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search entries…" style={{...inp, flex:2, minWidth:140}}/>
            <select value={filter} onChange={e=>setFilter(e.target.value)} style={{...inp, flex:1, minWidth:120, cursor:'pointer'}}>
              <option>All</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 0', color:'#4a6a4f' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
              <p style={{ fontStyle:'italic', fontSize:14 }}>{entries.length===0 ? 'No entries yet. Add your first entry to start tracking.' : 'No entries match your search.'}</p>
              {entries.length===0 && <button onClick={()=>setTab('add')} style={{ marginTop:12, background:'#3d6b4f', border:'none', borderRadius:8, padding:'8px 18px', color:'#fff', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Add First Entry</button>}
            </div>
          ) : filtered.map(e => (
            <div key={e.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.09)', borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:6 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:'#5a7a60' }}>{e.date}</span>
                  <span style={{ fontSize:11, background:`${catColor[e.category] || '#6a8a6f'}22`, color: catColor[e.category] || '#6a8a6f', padding:'2px 9px', borderRadius:20, letterSpacing:'0.04em' }}>{e.category}</span>
                  {e.mood && <span style={{ fontSize:12, color:'#8a8aaa' }}>{e.mood}</span>}
                </div>
                <button onClick={()=>remove(e.id)} style={{ background:'none', border:'none', color:'#3a5a3f', cursor:'pointer', fontSize:16, flexShrink:0 }}>×</button>
              </div>
              {e.vitals && <p style={{ fontSize:12, color:'#c9a84c', marginBottom:5 }}>📊 {e.vitals}</p>}
              <p style={{ fontSize:13, color:'#c8dcc9', lineHeight:1.6 }}>{e.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* EXPORT */}
      {tab === 'print' && (
        <div>
          <p style={{ fontSize:14, color:'#8a9e8f', marginBottom:20, lineHeight:1.6 }}>
            Fill in your loved one's profile once, then export your complete care journal to share with doctors, specialists, or PSWs — saving you from repeating the same information over and over.
          </p>

          {/* Profile form */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:12, padding:18, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <span style={{ fontSize:14, color:'#c8dcc9', fontWeight:500 }}>Care Recipient Profile</span>
              <button onClick={()=>setEditProf(!editProf)} style={{ background:'none', border:'1px solid rgba(124,184,138,0.3)', borderRadius:8, padding:'4px 12px', color:'#7cb88a', cursor:'pointer', fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
                {editProf ? 'Save' : 'Edit'}
              </button>
            </div>
            {editProf ? (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[['name','Full Name'],['dob','Date of Birth'],['diagnoses','Diagnoses'],['allergies','Allergies'],['medications','Current Medications'],['doctor','Primary Doctor'],['pharmacy','Pharmacy']].map(([key,label]) => (
                  <div key={key} style={{ gridColumn: ['diagnoses','medications'].includes(key) ? '1/-1' : 'auto' }}>
                    <label style={{ fontSize:11, color:'#5a7a60', display:'block', marginBottom:3 }}>{label}</label>
                    <input value={profile[key]} onChange={e=>setProfile({...profile,[key]:e.target.value})} style={{...inp, fontSize:13}} placeholder={label}/>
                  </div>
                ))}
                <button onClick={saveProfile} style={{ gridColumn:'1/-1', background:'#3d7a52', border:'none', borderRadius:10, padding:10, color:'#fff', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Save Profile</button>
              </div>
            ) : (
              <div style={{ fontSize:13, color:'#8a9e8f', lineHeight:1.8 }}>
                {profile.name ? (
                  Object.entries(profile).filter(([,v])=>v).map(([k,v]) => (
                    <div key={k}><strong style={{ color:'#c8dcc9', textTransform:'capitalize' }}>{k.replace(/([A-Z])/g,' $1')}:</strong> {v}</div>
                  ))
                ) : <span style={{ fontStyle:'italic' }}>No profile saved yet. Click Edit to add details.</span>}
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={printView} style={{ background:'#3d7a52', border:'none', borderRadius:10, padding:'11px 20px', color:'#fff', cursor:'pointer', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
              📥 Download Full Journal ({entries.length} entries)
            </button>
          </div>
          <p style={{ fontSize:11, color:'#3a5a3f', marginTop:10, fontStyle:'italic' }}>Downloaded as a .txt file you can print or email to your healthcare team.</p>
        </div>
      )}
    </div>
  );
}
