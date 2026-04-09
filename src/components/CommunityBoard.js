import React, { useState } from 'react';

const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const setStorage = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); }      catch {} };

const CATEGORIES = ['General','Dementia & Alzheimer\'s','Mental Health','LTC & Placement','Home Care & PSW','Legal & Financial','Palliative Care','Housing','Caregiver Burnout','Disability Care'];

// Seed posts to make the board feel alive
const SEED_POSTS = [
  { id:1, author:'Sandra M.', city:'St. Thomas', cat:'Home Care & PSW', time:'2 days ago', title:'PSW hours cut — appeal worked!', body:'Just wanted to share that after using the appeal letter tool here, I sent a letter to Home and Community Care and my mom\'s PSW hours were reinstated from 4 back to 10 per week. Don\'t give up — appeal everything!', replies:3, likes:12 },
  { id:2, author:'James K.', city:'Aylmer', cat:'Dementia & Alzheimer\'s', time:'4 days ago', title:'Tips for managing nighttime wandering?', body:'My father has been wandering at night and it\'s exhausting. We\'ve tried door alarms but he gets upset. Has anyone found something that works better? He\'s in mid-stage Alzheimer\'s.', replies:7, likes:6 },
  { id:3, author:'Diane R.', city:'Elgin County', cat:'Legal & Financial', time:'1 week ago', title:'Ontario Caregiver Tax Credit — I got $1,600 back!', body:'I had no idea this credit existed until I used the Benefits Helper on this app. Claimed it retroactively for 3 years. If you haven\'t looked into this yet, do it today.', replies:5, likes:18 },
  { id:4, author:'Maria T.', city:'London', cat:'Caregiver Burnout', time:'1 week ago', title:'Is it normal to feel angry sometimes?', body:'I love my mother but sometimes I feel so angry about how much my life has changed. I feel guilty about it. Does anyone else feel this way? How do you cope?', replies:11, likes:24 },
  { id:5, author:'Robert H.', city:'Sudbury', cat:'LTC & Placement', time:'2 weeks ago', title:'LTC waitlist — 3 years and counting', body:'We\'ve been on the waitlist for 3 years in Sudbury. My father\'s needs have increased significantly. Anyone know how to escalate or get moved up the list? His doctor says he needs higher level care.', replies:4, likes:8 },
  { id:6, author:'Anne B.', city:'Ottawa', cat:'Palliative Care', time:'2 weeks ago', title:'How do you know when it\'s time for hospice?', body:'My mother has late-stage cancer. Her oncologist mentioned palliative care options but I\'m not sure how to know when to make that transition. It feels like giving up even though I know it\'s not.', replies:9, likes:15 },
  { id:7, author:'Kevin L.', city:'Thunder Bay', cat:'General', time:'3 weeks ago', title:'Resources in Northwestern Ontario are so limited', body:'It feels like all the support and services are in the south. We have very limited home care hours available here and the waitlist for everything is twice as long. Anyone else dealing with this in rural/northern Ontario?', replies:6, likes:19 },
];

export default function CommunityBoard({ userName, userCity }) {
  const [posts,    setPosts]    = useState(() => {
    const saved = getStorage('cg_posts', null);
    return saved || SEED_POSTS;
  });
  const [tab,      setTab]      = useState('browse');
  const [catFilter,setCatFilter]= useState('All');
  const [newPost,  setNewPost]  = useState({ title:'', body:'', cat:'General' });
  const [likedIds, setLikedIds] = useState(() => getStorage('cg_liked', []));

  const submit = () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    const post = { id:Date.now(), author: userName||'Anonymous', city: userCity||'Ontario', cat:newPost.cat, time:'Just now', title:newPost.title, body:newPost.body, replies:0, likes:0 };
    const u = [post, ...posts];
    setPosts(u); setStorage('cg_posts', u);
    setNewPost({ title:'', body:'', cat:'General' });
    setTab('browse');
  };

  const like = (id) => {
    if (likedIds.includes(id)) return;
    const liked = [...likedIds, id];
    setLikedIds(liked); setStorage('cg_liked', liked);
    const u = posts.map(p => p.id===id ? {...p, likes:p.likes+1} : p);
    setPosts(u); setStorage('cg_posts', u);
  };

  const filtered = posts.filter(p => catFilter==='All' || p.cat===catFilter);

  const inp = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.22)', borderRadius:10, padding:'9px 13px', color:'#dde8de', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif", width:'100%' };

  return (
    <div style={{ color:'#dde8de' }}>
      {/* Header notice */}
      <div style={{ background:'rgba(124,184,138,0.06)', border:'1px solid rgba(124,184,138,0.15)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#6a8a6f', lineHeight:1.6 }}>
        👥 <strong style={{ color:'#7cb88a' }}>Caregiver Community</strong> — A safe space to share experiences and support each other. Be kind. For medical emergencies call 911 or 811.
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[['browse','💬 Browse Posts'],['post','+ Share Your Story']].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={{
            background: tab===id ? 'rgba(61,107,79,0.45)' : 'rgba(255,255,255,0.04)',
            border:`1px solid ${tab===id ? 'rgba(124,184,138,0.55)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius:8, padding:'7px 14px', cursor:'pointer', fontSize:13,
            color: tab===id ? '#c8dcc9' : '#5a7a60', fontFamily:"'DM Sans',sans-serif",
          }}>{label}</button>
        ))}
      </div>

      {/* NEW POST */}
      {tab === 'post' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Category</label>
            <select value={newPost.cat} onChange={e=>setNewPost({...newPost,cat:e.target.value})} style={{...inp, cursor:'pointer'}}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Title</label>
            <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} placeholder="What's your question or story?" style={inp}/>
          </div>
          <div>
            <label style={{ fontSize:12, color:'#5a7a60', display:'block', marginBottom:4 }}>Your message</label>
            <textarea value={newPost.body} onChange={e=>setNewPost({...newPost,body:e.target.value})} placeholder="Share your experience, ask for advice, or offer support…" rows={5} style={{...inp, resize:'none'}}/>
          </div>
          <p style={{ fontSize:11, color:'#4a6a4f', fontStyle:'italic' }}>You'll be shown as "{userName||'Anonymous'}" from {userCity||'Ontario'}. Never share personal health information like full names or OHIP numbers.</p>
          <button onClick={submit} disabled={!newPost.title.trim()||!newPost.body.trim()} style={{ background: newPost.title.trim()&&newPost.body.trim() ? '#3d7a52' : 'rgba(61,122,82,0.2)', border:'none', borderRadius:10, padding:'11px', color:'#fff', cursor: newPost.title.trim() ? 'pointer' : 'default', fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
            Post to Community
          </button>
        </div>
      )}

      {/* BROWSE */}
      {tab === 'browse' && (
        <div>
          {/* Category filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
            {['All', ...CATEGORIES].map(c => (
              <button key={c} onClick={()=>setCatFilter(c)} style={{
                background: catFilter===c ? 'rgba(61,107,79,0.4)' : 'rgba(255,255,255,0.04)',
                border:`1px solid ${catFilter===c ? 'rgba(124,184,138,0.5)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:20, padding:'4px 11px', cursor:'pointer', fontSize:11,
                color: catFilter===c ? '#c8dcc9' : '#4a6a4f', fontFamily:"'DM Sans',sans-serif",
              }}>{c}</button>
            ))}
          </div>

          {/* Posts */}
          {filtered.map(post => (
            <div key={post.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.08)', borderRadius:12, padding:'14px 16px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                <div>
                  <span style={{ fontSize:11, background:'rgba(124,184,138,0.1)', color:'#7cb88a', padding:'2px 9px', borderRadius:20, letterSpacing:'0.03em' }}>{post.cat}</span>
                </div>
                <span style={{ fontSize:11, color:'#3a5a3f', whiteSpace:'nowrap' }}>{post.time}</span>
              </div>
              <h3 style={{ fontSize:15, color:'#c8dcc9', marginBottom:6, fontWeight:500 }}>{post.title}</h3>
              <p style={{ fontSize:13, color:'#8a9e8f', lineHeight:1.65, marginBottom:10 }}>{post.body}</p>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:12, color:'#4a6a4f' }}>👤 {post.author} · {post.city}</span>
                <button onClick={()=>like(post.id)} style={{
                  background:'none', border:'none', cursor: likedIds.includes(post.id) ? 'default' : 'pointer',
                  color: likedIds.includes(post.id) ? '#7cb88a' : '#4a6a4f', fontSize:13, padding:0, fontFamily:"'DM Sans',sans-serif",
                }}>
                  {likedIds.includes(post.id) ? '❤️' : '🤍'} {post.likes}
                </button>
                <span style={{ fontSize:12, color:'#4a6a4f' }}>💬 {post.replies} replies</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
