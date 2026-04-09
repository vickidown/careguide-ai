import React, { useState } from 'react';
import ChatPanel   from '../components/ChatPanel';
import TaskTracker from '../components/TaskTracker';
import LocalResources from '../components/LocalResources';
import { UpgradeModal } from '../components/LocalResources';

const PLANS = {
  free:   { name:'Free',         questions:10,       letters:1 },
  family: { name:'Family',       questions:Infinity, letters:Infinity },
  org:    { name:'Organization', questions:Infinity, letters:Infinity },
};

const TOOLS = [
  { id:'chat',   icon:'💬', label:'AI Assistant',     desc:'Ask anything about caregiving in Ontario' },
  { id:'letter', icon:'📄', label:'Insurance Letter', desc:'Draft dispute & appeal letters instantly'  },
  { id:'meds',   icon:'💊', label:'Medication Guide', desc:'Check interactions & understand meds'      },
  { id:'forms',  icon:'📋', label:'Benefits Helper',  desc:'Navigate OHIP, PSW, ODSP & more'           },
  { id:'tasks',  icon:'🗓️', label:'Care Tracker',     desc:'Track appointments & care tasks'            },
  { id:'local',  icon:'📍', label:'Local Resources',  desc:'St. Thomas & Elgin County services'         },
];

const PROMPTS = {
  chat: {
    system: `You are CareGuide AI, a compassionate assistant for Ontario family caregivers, especially in St. Thomas and Elgin County. Help navigate OHIP, Home and Community Care, PSW services, long-term care waitlists, caregiver tax credits, and more. Be warm, plain-spoken, and practical. Keep responses under 250 words unless a detailed answer is truly needed.`,
    placeholder: 'Ask about home care, benefits, rights…',
    starters: [
      'My mom was just discharged from hospital. What home care can she get in Ontario?',
      'What is the Ontario Caregiver Tax Credit and how do I claim it?',
      'I need a break from caregiving — what respite options exist in Elgin County?',
    ],
  },
  letter: {
    system: `You are CareGuide AI. Draft a complete, professional, ready-to-send letter for an Ontario caregiver. Include [YOUR NAME], [DATE], [ADDRESS] placeholders. Be assertive but respectful. Include a subject line and reference relevant Ontario policy when applicable.`,
    placeholder: "Describe your situation — e.g. 'My dad's PSW hours were cut from 10 to 4 per week…'",
    starters: [
      'My father\'s home care hours were cut and I want to appeal.',
      'Insurance denied a hospital bed claim for my mother.',
      'I\'ve been on the LTC waitlist 2 years with no update.',
    ],
  },
  meds: {
    system: `You are CareGuide AI medication assistant. For a given list of medications: explain what each is for in plain language, list key side effects, flag potential interactions, and give practical caregiver tips. Always end with: "Please confirm with your pharmacist or doctor before making changes."`,
    placeholder: "List medications — e.g. 'Metformin 500mg, Lisinopril 10mg, Amlodipine 5mg'",
    starters: [
      'Metformin 500mg, Lisinopril 10mg, Atorvastatin 20mg — any interactions?',
      'My mom takes Warfarin. What foods and meds should she avoid?',
      'What side effects should I watch for with Donepezil for dementia?',
    ],
  },
  forms: {
    system: `You are CareGuide AI benefits navigator for Ontario caregivers. For any program or form asked about: explain eligibility in plain language, give step-by-step application instructions, list documents needed, provide realistic timelines, and share tips to improve approval odds. Focus on Ontario programs: Home and Community Care, Ontario Caregiver Tax Credit, PSW, ODSP, RDSP, Caregiver Respite, and LTC applications.`,
    placeholder: "Ask about a program — e.g. 'How do I apply for PSW services?'",
    starters: [
      'How do I apply for PSW services in Ontario?',
      'What is the RDSP and does my father with a disability qualify?',
      'How do I get my parent on the long-term care waitlist in Elgin County?',
    ],
  },
};

const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const setStorage = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); }      catch {} };

export default function Dashboard({ user, onLogout }) {
  const [activeTab,    setActiveTab]    = useState('chat');
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [showUpgrade,  setShowUpgrade]  = useState(false);
  const [upgradeReason,setUpgradeReason]= useState('');
  const [usage,        setUsage]        = useState(() => getStorage('cg_usage', { questions:0, letters:0 }));
  const [currentUser,  setCurrentUser]  = useState(user);

  const plan = PLANS[currentUser?.plan || 'free'];
  const activeTool = TOOLS.find(t => t.id === activeTab);

  const canUse = (type = 'questions') => {
    if (plan.name !== 'Free') return true;
    const limit = plan[type];
    const used  = usage[type] || 0;
    if (used >= limit) { setUpgradeReason(type); setShowUpgrade(true); return false; }
    return true;
  };

  const recordUsage = (type = 'questions') => {
    const u = { ...usage, [type]: (usage[type] || 0) + 1 };
    setUsage(u); setStorage('cg_usage', u);
  };

  const handleUpgrade = () => {
    // In production: redirect to Stripe payment link
    // window.location.href = 'https://buy.stripe.com/YOUR_LINK';
    const u = { ...currentUser, plan: 'family' };
    setCurrentUser(u); setStorage('cg_user', u);
    setShowUpgrade(false);
    alert('✅ Upgraded to Family plan!\n\nIn production this connects to your Stripe payment link.');
  };

  const usageBarStyle = (used, limit) => {
    if (limit === Infinity) return null;
    const pct = Math.min(100, (used / limit) * 100);
    return { width: `${pct}%`, background: pct > 80 ? '#e07070' : '#7cb88a' };
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#0d1f14,#0a1a10,#0d1f14)', fontFamily:"'DM Sans',sans-serif", color:'#dde8de', display:'flex', flexDirection:'column' }}>

      {/* HEADER */}
      <div style={{ padding:'13px 18px', borderBottom:'1px solid rgba(124,184,138,0.12)', background:'rgba(13,31,20,0.92)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{fontSize:20}}>🌿</span>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#c8dcc9' }}>CareGuide <span style={{color:'#7cb88a'}}>AI</span></div>
            <div style={{ fontSize:10, color:'#4a6a4f', letterSpacing:'0.08em', textTransform:'uppercase' }}>Ontario Caregiver Assistant</div>
          </div>
        </div>
        <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.2)', borderRadius:8, padding:'6px 14px', color:'#c8dcc9', fontSize:13, cursor:'pointer' }}>
          👤 {currentUser.name.split(' ')[0]}
        </button>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden', position:'relative' }}>

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:260, zIndex:50, background:'#0d1f14', borderLeft:'1px solid rgba(124,184,138,0.14)', padding:24, overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <span style={{ fontSize:14, color:'#c8dcc9', fontWeight:500 }}>My Account</span>
              <button onClick={()=>setSidebarOpen(false)} style={{ background:'none', border:'none', color:'#5a7a60', fontSize:20, cursor:'pointer' }}>×</button>
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:13, color:'#7cb88a', marginBottom:4 }}>{currentUser.email}</div>
              <span style={{ fontSize:11, background:'rgba(124,184,138,0.12)', border:'1px solid rgba(124,184,138,0.25)', borderRadius:20, padding:'3px 12px', color:'#7cb88a', letterSpacing:'0.06em' }}>
                {plan.name} Plan
              </span>
            </div>

            {/* Usage */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:12, padding:16, marginBottom:18 }}>
              <div style={{ fontSize:11, color:'#5a7a60', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:12 }}>Usage This Month</div>
              {[
                { label:'AI Questions', key:'questions', limit: plan.questions },
                { label:'Letter Drafts', key:'letters',   limit: plan.letters   },
              ].map(item => (
                <div key={item.key} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#6a8a6f', marginBottom:4 }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.limit===Infinity ? '#7cb88a' : undefined }}>
                      {item.limit === Infinity ? 'Unlimited' : `${usage[item.key]||0} / ${item.limit}`}
                    </span>
                  </div>
                  {item.limit !== Infinity && (
                    <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:2 }}>
                      <div style={{ height:'100%', borderRadius:2, transition:'width 0.3s', ...usageBarStyle(usage[item.key]||0, item.limit) }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {currentUser.plan === 'free' && (
              <button onClick={()=>{ setShowUpgrade(true); setSidebarOpen(false); }} style={{ width:'100%', background:'#3d7a52', border:'none', borderRadius:10, padding:12, color:'#fff', fontSize:14, cursor:'pointer', marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>
                ⭐ Upgrade to Family — $19/mo
              </button>
            )}
            <button onClick={onLogout} style={{ width:'100%', background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:10, color:'#5a7a60', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              Sign Out
            </button>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 28px', maxWidth:720, margin:'0 auto', width:'100%' }}>

          {/* TOOL TABS */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:12 }}>
            {TOOLS.map(t => (
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
                background: activeTab===t.id ? 'rgba(61,107,79,0.45)' : 'rgba(255,255,255,0.03)',
                border:`1px solid ${activeTab===t.id ? 'rgba(124,184,138,0.55)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:10, padding:'9px 5px', cursor:'pointer', textAlign:'center', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif",
              }}>
                <div style={{fontSize:17, marginBottom:3}}>{t.icon}</div>
                <div style={{ fontSize:10, color: activeTab===t.id ? '#c8dcc9' : '#4a6a4f', lineHeight:1.2 }}>{t.label}</div>
              </button>
            ))}
          </div>

          {/* TOOL HEADER */}
          <div style={{ padding:'11px 15px', background:'rgba(124,184,138,0.06)', border:'1px solid rgba(124,184,138,0.11)', borderRadius:12, marginBottom:12, display:'flex', alignItems:'center', gap:11 }}>
            <span style={{fontSize:21}}>{activeTool.icon}</span>
            <div>
              <div style={{fontSize:14, color:'#c8dcc9'}}>{activeTool.label}</div>
              <div style={{fontSize:11, color:'#5a7a60', fontStyle:'italic'}}>{activeTool.desc}</div>
            </div>
          </div>

          {/* TOOL BODY */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(124,184,138,0.09)', borderRadius:16, padding:15, minHeight:440, animation:'fadeIn 0.25s ease' }}>
            {activeTab === 'tasks' ? (
              <TaskTracker/>
            ) : activeTab === 'local' ? (
              <LocalResources/>
            ) : (
              <ChatPanel
                key={activeTab}
                config={PROMPTS[activeTab]}
                canUse={() => canUse(activeTab === 'letter' ? 'letters' : 'questions')}
                onUsed={() => recordUsage(activeTab === 'letter' ? 'letters' : 'questions')}
              />
            )}
          </div>

          <p style={{ textAlign:'center', fontSize:11, color:'#2e4e34', marginTop:12, fontStyle:'italic' }}>
            CareGuide AI is informational only. Always confirm with qualified professionals.
          </p>
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={()=>setShowUpgrade(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}
