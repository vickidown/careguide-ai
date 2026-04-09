import React, { useState, useRef, useEffect } from 'react';

function TypingDots() {
  return (
    <div style={{ display:'flex', gap:5, padding:'10px 0' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:7, height:7, borderRadius:'50%', background:'#7cb88a',
          animation:'bounce 1.2s ease-in-out infinite',
          animationDelay:`${i*0.2}s`
        }}/>
      ))}
    </div>
  );
}

export default function ChatPanel({ config, canUse, onUsed }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const send = async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading) return;
    if (!canUse()) return;
    setInput(''); setError('');
    const msgs = [...messages, { role:'user', content:txt }];
    setMessages(msgs);
    setLoading(true);
    onUsed();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: config.system, messages: msgs }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error ' + res.status);
      }
      const data  = await res.json();
      const reply = data.content?.map(b => b.text || '').join('') || 'No response received.';
      setMessages([...msgs, { role:'assistant', content:reply }]);
    } catch (err) {
      setError(err.message || 'Connection error. Please try again.');
      setMessages(msgs.slice(0, -1));
    }
    setLoading(false);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:400 }}>
      {messages.length === 0 && (
        <div style={{ paddingBottom:16 }}>
          <p style={{ fontSize:12, color:'#5a7a60', fontStyle:'italic', marginBottom:10 }}>Try asking…</p>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {config.starters.map((s,i) => (
              <button key={i} onClick={() => send(s)} style={{
                background:'rgba(124,184,138,0.07)', border:'1px solid rgba(124,184,138,0.18)',
                borderRadius:10, padding:'9px 13px', color:'#c8dcc9', fontSize:13,
                textAlign:'left', cursor:'pointer', fontFamily:'Georgia,serif', lineHeight:1.45,
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex:1, overflowY:'auto' }}>
        {messages.map((m,i) => (
          <div key={i} style={{ marginBottom:14, display:'flex', flexDirection: m.role==='user' ? 'row-reverse' : 'row', gap:8, alignItems:'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, fontSize:13, background: m.role==='user' ? '#2d5a3d' : '#1a3328', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {m.role==='user' ? '👤' : '🌿'}
            </div>
            <div style={{
              background: m.role==='user' ? 'rgba(45,90,61,0.35)' : 'rgba(255,255,255,0.04)',
              border:`1px solid ${m.role==='user' ? 'rgba(61,107,79,0.5)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: m.role==='user' ? '14px 3px 14px 14px' : '3px 14px 14px 14px',
              padding:'10px 14px', maxWidth:'83%', color:'#dde8de',
              fontSize:14, lineHeight:1.65, fontFamily:'Georgia,serif', whiteSpace:'pre-wrap',
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#1a3328', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🌿</div>
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'3px 14px 14px 14px', padding:'4px 14px' }}><TypingDots/></div>
          </div>
        )}
        {error && (
          <div style={{ background:'rgba(224,112,112,0.1)', border:'1px solid rgba(224,112,112,0.3)', borderRadius:10, padding:'10px 14px', color:'#e07070', fontSize:13, marginTop:8 }}>
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{ display:'flex', gap:8, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:10 }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder={config.placeholder} rows={2}
          style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(124,184,138,0.22)', borderRadius:10, padding:'9px 13px', color:'#dde8de', fontSize:14, fontFamily:'Georgia,serif', resize:'none', outline:'none' }}/>
        <button onClick={()=>send()} disabled={loading||!input.trim()} style={{
          background: loading||!input.trim() ? 'rgba(61,107,79,0.22)' : '#3d6b4f',
          border:'none', borderRadius:10, width:42, cursor: loading||!input.trim() ? 'default' : 'pointer', color:'#fff', fontSize:18,
        }}>↑</button>
      </div>
    </div>
  );
}
