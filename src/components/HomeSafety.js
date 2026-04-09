import React, { useState } from 'react';

const ROOMS = [
  { id:'bathroom', icon:'🚿', label:'Bathroom', questions:['Are there grab bars near the toilet and shower?','Is there a non-slip mat in the tub/shower?','Is the water temperature set below 49°C to prevent burns?','Is there adequate lighting at night?','Can the door be opened from outside in an emergency?'] },
  { id:'bedroom',  icon:'🛏️', label:'Bedroom',  questions:['Is the path from bed to bathroom clear at night?','Is the bed at a safe height (feet flat on floor when sitting)?','Is there a phone or call device within reach of the bed?','Are lamp switches easy to reach from bed?','Are extension cords out of walkways?'] },
  { id:'kitchen',  icon:'🍳', label:'Kitchen',  questions:['Are frequently used items at waist height (no high reaching or bending)?','Is the stove free of clutter that could catch fire?','Are sharp knives stored safely?','Is there a working smoke detector nearby?','Are cleaning products stored separately from food?'] },
  { id:'living',   icon:'🛋️', label:'Living Room', questions:['Are area rugs secured or removed?','Are walkways clear of furniture and cords?','Is seating firm enough to get up from easily?','Is lighting adequate throughout the room?','Are stairs or steps clearly visible and well-lit?'] },
  { id:'entrance', icon:'🚪', label:'Entrance & Stairs', questions:['Are all stairs in good repair with no loose boards?','Is there a sturdy handrail on both sides of stairs?','Are outdoor steps clear of ice, snow, leaves?','Is there good lighting at all entrances?','Are there any raised thresholds that could cause tripping?'] },
  { id:'general',  icon:'🏠', label:'General Home', questions:['Are there working smoke detectors on every level?','Is there a working carbon monoxide detector?','Are emergency numbers posted visibly?','Is the home adequately heated in winter (min 20°C)?','Are medications stored safely and organized?'] },
];

export default function HomeSafety() {
  const [step, setStep]         = useState('intro'); // intro | assess | results
  const [roomIdx, setRoomIdx]   = useState(0);
  const [answers, setAnswers]   = useState({});
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading]   = useState(false);

  const currentRoom = ROOMS[roomIdx];

  const answer = (roomId, qIdx, val) => {
    setAnswers(prev => ({
      ...prev,
      [roomId]: { ...(prev[roomId] || {}), [qIdx]: val }
    }));
  };

  const roomComplete = (room) => {
    const ans = answers[room.id] || {};
    return room.questions.every((_, i) => ans[i] !== undefined);
  };

  const allComplete = ROOMS.every(roomComplete);

  const countIssues = () => {
    let issues = [];
    ROOMS.forEach(room => {
      room.questions.forEach((q, i) => {
        if ((answers[room.id] || {})[i] === false) {
          issues.push({ room: room.label, question: q });
        }
      });
    });
    return issues;
  };

  const getAdvice = async () => {
    setLoading(true);
    const issues = countIssues();
    const summary = issues.length === 0
      ? 'The home appears to be quite safe based on the assessment.'
      : `Issues found:\n${issues.map(i => `- ${i.room}: ${i.question}`).join('\n')}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are CareGuide AI, a home safety specialist for Ontario caregivers. Based on a home safety assessment, provide specific, practical recommendations. For each issue identified, suggest: 1) a low-cost DIY fix, 2) a product solution (with approximate cost), and 3) whether it qualifies for the Home Accessibility Tax Credit (federal, 15% on up to $20,000) or Ontario Seniors Care at Home Tax Credit. Be warm, specific, and encouraging. Format clearly with sections per room.`,
          messages: [{ role: 'user', content: `Here are the home safety assessment results for my loved one's home:\n\n${summary}\n\nPlease provide specific recommendations for each issue, including costs and tax credit eligibility.` }]
        })
      });
      const data = await res.json();
      setAiAdvice(data.content?.map(b => b.text || '').join('') || 'Unable to generate advice. Please try again.');
    } catch { setAiAdvice('Connection error. Please try again.'); }
    setLoading(false);
    setStep('results');
  };

  const issues = countIssues();

  if (step === 'intro') return (
    <div style={{ color:'#dde8de' }}>
      <div style={{ textAlign:'center', padding:'20px 0 28px' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🏠</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#fff', marginBottom:10 }}>Home Safety Assessment</h2>
        <p style={{ color:'#6a8a6f', fontSize:14, lineHeight:1.7, maxWidth:420, margin:'0 auto 24px' }}>
          Falls are the #1 cause of injury hospitalization for Ontario seniors. This room-by-room assessment takes 5 minutes and identifies risks — then our AI gives you specific, affordable fixes.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:28 }}>
          {[['⏱️','5 minutes'],['🏠','6 rooms'],['💰','Tax credit info included']].map(([icon,label],i) => (
            <div key={i} style={{ background:'rgba(124,184,138,0.08)', border:'1px solid rgba(124,184,138,0.2)', borderRadius:10, padding:'8px 16px', fontSize:13, color:'#7cb88a' }}>
              {icon} {label}
            </div>
          ))}
        </div>
        <button onClick={()=>setStep('assess')} style={{ background:'#3d7a52', border:'none', borderRadius:10, padding:'12px 28px', color:'#fff', fontSize:15, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
          Start Assessment →
        </button>
      </div>
    </div>
  );

  if (step === 'assess') return (
    <div style={{ color:'#dde8de' }}>
      {/* Progress */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {ROOMS.map((r, i) => (
          <div key={r.id} onClick={()=>setRoomIdx(i)} style={{ flex:1, height:4, borderRadius:2, cursor:'pointer', background: i === roomIdx ? '#7cb88a' : roomComplete(r) ? '#3d7a52' : 'rgba(255,255,255,0.1)', transition:'background 0.2s' }}/>
        ))}
      </div>

      {/* Room tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:18 }}>
        {ROOMS.map((r, i) => (
          <button key={r.id} onClick={()=>setRoomIdx(i)} style={{
            background: i===roomIdx ? 'rgba(61,107,79,0.45)' : 'rgba(255,255,255,0.04)',
            border:`1px solid ${i===roomIdx ? 'rgba(124,184,138,0.55)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12,
            color: i===roomIdx ? '#c8dcc9' : roomComplete(r) ? '#7cb88a' : '#5a7a60',
            fontFamily:"'DM Sans',sans-serif",
          }}>
            {r.icon} {r.label} {roomComplete(r) ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:14, padding:20, marginBottom:16 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#c8dcc9', marginBottom:16 }}>
          {currentRoom.icon} {currentRoom.label}
        </h3>
        {currentRoom.questions.map((q, i) => {
          const val = (answers[currentRoom.id] || {})[i];
          return (
            <div key={i} style={{ padding:'12px 0', borderBottom: i < currentRoom.questions.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <p style={{ fontSize:14, color:'#c8dcc9', marginBottom:10, lineHeight:1.5 }}>{q}</p>
              <div style={{ display:'flex', gap:10 }}>
                {[['Yes ✓', true, '#3d7a52', '#7cb88a'], ['No ✗', false, '#7a3d3d', '#e07070'], ['N/A', null, '#3d3d5a', '#8a8aaa']].map(([label, v, bg, color]) => (
                  <button key={label} onClick={()=>answer(currentRoom.id, i, v)} style={{
                    background: val===v ? bg : 'rgba(255,255,255,0.05)',
                    border:`1px solid ${val===v ? color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius:8, padding:'6px 16px', cursor:'pointer',
                    color: val===v ? '#fff' : '#5a7a60', fontSize:13,
                    fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
                  }}>{label}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav */}
      <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
        <button onClick={()=>setRoomIdx(Math.max(0, roomIdx-1))} disabled={roomIdx===0} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 20px', color: roomIdx===0 ? '#3a5a3f' : '#c8dcc9', cursor: roomIdx===0 ? 'default' : 'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>← Previous</button>
        {roomIdx < ROOMS.length-1
          ? <button onClick={()=>setRoomIdx(roomIdx+1)} style={{ background:'#3d6b4f', border:'none', borderRadius:10, padding:'10px 20px', color:'#fff', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>Next Room →</button>
          : <button onClick={getAdvice} disabled={!allComplete || loading} style={{ background: allComplete ? '#7cb88a' : 'rgba(124,184,138,0.2)', border:'none', borderRadius:10, padding:'10px 20px', color: allComplete ? '#0d1f14' : '#4a6a4f', cursor: allComplete ? 'pointer' : 'default', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600 }}>
              {loading ? 'Analysing…' : allComplete ? 'Get My Safety Report →' : 'Complete all rooms first'}
            </button>
        }
      </div>
    </div>
  );

  // Results
  return (
    <div style={{ color:'#dde8de' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff' }}>Your Safety Report</div>
        <div style={{ background: issues.length===0 ? 'rgba(124,184,138,0.15)' : 'rgba(224,112,112,0.15)', border:`1px solid ${issues.length===0 ? '#7cb88a' : '#e07070'}`, borderRadius:20, padding:'3px 12px', fontSize:12, color: issues.length===0 ? '#7cb88a' : '#e07070' }}>
          {issues.length === 0 ? '✓ No major issues found' : `${issues.length} issue${issues.length>1?'s':''} identified`}
        </div>
      </div>

      {issues.length > 0 && (
        <div style={{ background:'rgba(224,112,112,0.08)', border:'1px solid rgba(224,112,112,0.2)', borderRadius:12, padding:16, marginBottom:16 }}>
          <p style={{ fontSize:12, color:'#e07070', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:10 }}>Issues Found</p>
          {issues.map((issue, i) => (
            <div key={i} style={{ display:'flex', gap:8, padding:'5px 0', borderBottom: i<issues.length-1 ? '1px solid rgba(224,112,112,0.1)' : 'none' }}>
              <span style={{ color:'#e07070', flexShrink:0 }}>⚠️</span>
              <span style={{ fontSize:13 }}><strong style={{ color:'#c9a84c' }}>{issue.room}:</strong> {issue.question}</span>
            </div>
          ))}
        </div>
      )}

      {aiAdvice && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.12)', borderRadius:12, padding:18, marginBottom:16, fontSize:14, lineHeight:1.7, whiteSpace:'pre-wrap', fontFamily:'Georgia,serif', color:'#dde8de' }}>
          {aiAdvice}
        </div>
      )}

      <button onClick={()=>{setStep('intro');setAnswers({});setRoomIdx(0);setAiAdvice('');}} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'9px 18px', color:'#c8dcc9', cursor:'pointer', fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
        Start New Assessment
      </button>
    </div>
  );
}
