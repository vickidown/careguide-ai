import React, { useState } from 'react';
import ChatPanel      from '../components/ChatPanel';
import TaskTracker    from '../components/TaskTracker';
import HomeSafety     from '../components/HomeSafety';
import CareJournal    from '../components/CareJournal';
import CommunityBoard from '../components/CommunityBoard';
import { LocalResources, UpgradeModal } from '../components/LocalResources';

const PLANS = {
  free:   { name:'Free',         questions:10, letters:1 },
  family: { name:'Family',       questions:Infinity, letters:Infinity },
  org:    { name:'Organization', questions:Infinity, letters:Infinity },
};

// ── ALL 22 TOOLS ─────────────────────────────────────────────────────────────
const TOOLS = [
  // Row 1 — Core
  { id:'chat',      icon:'💬', label:'AI Assistant',      desc:'Ask anything about caregiving in Ontario' },
  { id:'letter',    icon:'📄', label:'Insurance Letter',  desc:'Draft dispute & appeal letters instantly' },
  { id:'meds',      icon:'💊', label:'Medication Guide',  desc:'Check interactions & understand meds' },
  { id:'forms',     icon:'📋', label:'Benefits Helper',   desc:'Navigate OHIP, PSW, ODSP & more' },
  // Row 2 — Financial & Work
  { id:'tax',       icon:'💰', label:'Tax Credits',       desc:'Find every caregiver tax credit you qualify for' },
  { id:'ei',        icon:'💼', label:'EI & Job Rights',   desc:'EI benefits, leave rights & job protection' },
  // Row 3 — Care Planning
  { id:'ltc',       icon:'🏥', label:'LTC & Placement',   desc:'Long-term care applications & waitlists' },
  { id:'discharge', icon:'🏨', label:'Hospital Discharge',desc:'Bring your loved one home safely' },
  { id:'hospice',   icon:'🕊️', label:'Palliative Care',   desc:'End-of-life planning & hospice guidance' },
  { id:'emergency', icon:'🚨', label:'Emergency Plan',    desc:'What happens if you can\'t be there?' },
  // Row 4 — Specialized Care
  { id:'dementia',  icon:'🧩', label:'Dementia Guide',    desc:'Stage-by-stage dementia caregiving' },
  { id:'disability',icon:'♿', label:'Disability Care',   desc:'ODSP, developmental services & supports' },
  { id:'sandwich',  icon:'🥪', label:'Work & Caregiving', desc:'Balancing career, family & caregiving' },
  { id:'nutrition', icon:'🥗', label:'Nutrition Guide',   desc:'Meal planning for medical conditions' },
  // Row 5 — Wellbeing & Legal
  { id:'mental',    icon:'🧠', label:'Mental Health',     desc:'Support for caregiver burnout & stress' },
  { id:'legal',     icon:'⚖️', label:'Legal & POA',       desc:'Power of attorney, wills & legal rights' },
  { id:'housing',   icon:'🏠', label:'Housing Options',   desc:'Retirement homes, supportive housing & more' },
  // Row 6 — Tools & Community
  { id:'safety',    icon:'🔒', label:'Home Safety',       desc:'Room-by-room fall & safety assessment' },
  { id:'journal',   icon:'📓', label:'Care Journal',      desc:'Health log & shareable care record' },
  { id:'tasks',     icon:'🗓️', label:'Care Tracker',      desc:'Appointments & task reminders' },
  { id:'community', icon:'👥', label:'Community',         desc:'Connect with other Ontario caregivers' },
  { id:'local',     icon:'📍', label:'Local Resources',   desc:'Find care services anywhere in Ontario' },
];

// ── AI SYSTEM PROMPTS ────────────────────────────────────────────────────────
const PROMPTS = {
  chat: {
    system:`You are CareGuide AI, a compassionate assistant for Ontario family caregivers across all of Ontario. Help navigate OHIP, Home and Community Care, PSW services, long-term care waitlists, caregiver tax credits, and more. Be warm, plain-spoken, and practical. Keep responses under 250 words unless a detailed answer is truly needed.`,
    placeholder:'Ask about home care, benefits, rights…',
    starters:['My mom was just discharged from hospital. What home care can she get in Ontario?','What is the Ontario Caregiver Tax Credit and how do I claim it?','I need a break from caregiving — what respite options exist in Ontario?'],
  },
  letter: {
    system:`You are CareGuide AI. Draft a complete, professional, ready-to-send letter for an Ontario caregiver. Include [YOUR NAME], [DATE], [ADDRESS] placeholders. Be assertive but respectful. Include a subject line and reference relevant Ontario policy when applicable.`,
    placeholder:"Describe your situation — e.g. 'My dad's PSW hours were cut from 10 to 4 per week…'",
    starters:["My father's home care hours were cut and I want to appeal.",'Insurance denied a hospital bed claim for my mother.',"I've been on the LTC waitlist 2 years with no update."],
  },
  meds: {
    system:`You are CareGuide AI medication assistant. For a given list of medications: explain what each is for in plain language, list key side effects, flag potential interactions, and give practical caregiver tips. Always end with: "Please confirm with your pharmacist or doctor before making changes."`,
    placeholder:"List medications — e.g. 'Metformin 500mg, Lisinopril 10mg, Amlodipine 5mg'",
    starters:['Metformin 500mg, Lisinopril 10mg, Atorvastatin 20mg — any interactions?','My mom takes Warfarin. What foods and meds should she avoid?','What side effects should I watch for with Donepezil for dementia?'],
  },
  forms: {
    system:`You are CareGuide AI benefits navigator for Ontario caregivers. For any program or form asked about: explain eligibility in plain language, give step-by-step application instructions, list documents needed, provide realistic timelines, and share tips to improve approval odds. Focus on: Home and Community Care, Ontario Caregiver Tax Credit, PSW, ODSP, RDSP, Caregiver Respite, and LTC applications.`,
    placeholder:"Ask about a program — e.g. 'How do I apply for PSW services?'",
    starters:['How do I apply for PSW services in Ontario?','What is the RDSP and does my father with a disability qualify?','How do I get my parent on the long-term care waitlist in Ontario?'],
  },
  tax: {
    system:`You are CareGuide AI tax credit specialist for Ontario caregivers. Help caregivers understand and claim every tax credit available: Canada Caregiver Credit (Line 30450, up to $8,601), Ontario Caregiver Tax Credit, Disability Tax Credit (Form T2201), Medical Expense Tax Credit (2026 threshold: $2,890), Home Accessibility Tax Credit (15% on up to $20,000), Ontario Seniors Care at Home Tax Credit (25% up to $6,000 for seniors 70+), RDSP, EI Caregiving Benefits, Ontario Trillium Benefit, and retroactive T1 Adjustment claims up to 10 years back. Always explain in plain language with exact form numbers and dollar amounts. Remind users to consult a tax professional for their specific situation.`,
    placeholder:"Ask about tax credits — e.g. 'What credits can I claim for caring for my mother?'",
    starters:['What tax credits can I claim for caring for my elderly mother?','How do I apply for the Disability Tax Credit (T2201) for my husband?','Can I claim medical expenses I paid for my father on my tax return?'],
  },
  ei: {
    system:`You are CareGuide AI employment and income specialist for Ontario caregivers. Help with: EI Compassionate Care Benefits (up to 26 weeks at 55% of earnings, max $729/week in 2026), Family Caregiver Benefit for Adults (up to 15 weeks), Family Caregiver Benefit for Children (up to 35 weeks), Ontario Family Medical Leave (unpaid, job-protected), Family Caregiver Leave (up to 8 weeks/year), Critical Illness Leave (17 weeks for adults), how to keep your job protected while caregiving, what documents are needed (medical certificate from doctor), how to apply through Service Canada, and employer obligations under Ontario's Employment Standards Act. Be specific about week limits, dollar amounts, and eligibility rules.`,
    placeholder:"Ask about work & income — e.g. 'Can I get EI while caring for my dying parent?'",
    starters:['Can I get EI benefits while taking time off to care for my critically ill mother?','What job protection do I have as a caregiver in Ontario?','My employer is pressuring me to quit because of my caregiving duties. What are my rights?'],
  },
  ltc: {
    system:`You are CareGuide AI long-term care specialist for Ontario. Help families navigate the entire LTC process: how to get assessed through Home and Community Care (call 310-2222), how the waitlist works, current wait times (typically 2-5+ years in many areas, shorter for crisis placements), how to apply to multiple homes simultaneously, what the co-payment costs are (basic: ~$62.82/day, semi-private: ~$93.65/day, private: ~$110.60/day in 2026), how to appeal a placement decision, what rights residents have under Ontario's Long-Term Care Homes Act, and how to find homes in specific Ontario communities. Be honest about wait times and costs.`,
    placeholder:"Ask about long-term care — e.g. 'How do I start the LTC application?'",
    starters:['How do I start the long-term care application process in Ontario?','How long is the LTC waitlist and how can I speed it up?','What does long-term care cost in Ontario and what does OHIP cover?'],
  },
  discharge: {
    system:`You are CareGuide AI hospital discharge specialist for Ontario caregivers. Help families navigate bringing someone home from hospital safely. Cover: what to ask before leaving hospital, understanding discharge paperwork and medical instructions, medication reconciliation checklist, what home care to request immediately (call 310-2222 before discharge), setting up the home safely, the critical first 72 hours at home, warning signs that require calling 911 or returning to hospital, when to call the doctor vs. 811, follow-up appointment scheduling, and how to prevent hospital readmission. Be practical and specific — many caregivers feel overwhelmed and underprepared at discharge.`,
    placeholder:"Describe the situation — e.g. 'My mom is being discharged tomorrow after hip surgery…'",
    starters:['My mother is being discharged tomorrow after a hip replacement. What do I need to do?','What questions should I ask the hospital before my father comes home?','What warning signs should I watch for in the first week after discharge?'],
  },
  hospice: {
    system:`You are CareGuide AI palliative and end-of-life care specialist for Ontario. Help families navigate: what palliative care is and when to consider it, how to access palliative home care through Home and Community Care (310-2222), hospice facilities in Ontario and how to access them, MAID (Medical Assistance in Dying) — what it is, eligibility, and how to request an assessment, advance care planning and creating a care directive, substitute decision making, what to expect physically in the final stages of various illnesses, grief and bereavement support resources, and how to have end-of-life conversations with loved ones. Be compassionate, honest, and direct. These conversations are difficult but necessary.`,
    placeholder:"Ask about palliative care — e.g. 'When should we consider hospice care?'",
    starters:['When should we consider moving to palliative or hospice care?','How do I access palliative home care in Ontario?','What is an advance care plan and how do we make one?'],
  },
  emergency: {
    system:`You are CareGuide AI emergency planning specialist for Ontario caregivers. Help caregivers build comprehensive emergency and contingency plans covering: what happens if the primary caregiver gets sick, injured, or is unavailable, who should be the backup caregiver and how to prepare them, creating a care binder with all critical information (medications, allergies, diagnoses, contacts, routines), registering with local emergency services, Ontario's Personal Support Network registry, what to do during a power outage or natural disaster when caring for someone with medical needs, emergency medication supplies, and how to communicate the care plan to first responders. Provide practical checklists and templates.`,
    placeholder:"Ask about emergency planning — e.g. 'What happens if I get sick and can't care for my mom?'",
    starters:["What should be in my emergency backup plan if I can't care for my parent?","How do I create a care binder so others can step in if I'm unavailable?",'How do I prepare for a power outage when my husband depends on medical equipment?'],
  },
  dementia: {
    system:`You are CareGuide AI dementia care specialist for Ontario. Provide stage-by-stage guidance for caregivers of people with dementia or Alzheimer's: early stage (memory lapses, driving concerns, financial safety, legal planning), middle stage (wandering prevention, responsive behaviours, personal care, communication strategies, day programs), late stage (feeding difficulties, pain management, palliative care, when to consider memory care), and throughout all stages (caregiver stress, respite options, Ontario dementia care resources including Alzheimer Society chapter support). Be specific, practical, and compassionate. Acknowledge how profoundly difficult this journey is.`,
    placeholder:"Ask about dementia care — e.g. 'My mother keeps wandering at night. What can I do?'",
    starters:['My father was just diagnosed with early-stage Alzheimer\'s. Where do we start?','My mother keeps wandering at night. What strategies actually work?','My husband is in late-stage dementia and refuses to eat. What can we do?'],
  },
  disability: {
    system:`You are CareGuide AI disability and special needs care specialist for Ontario. Help families caring for adults with developmental disabilities, autism spectrum disorder, acquired brain injuries, physical disabilities, or complex mental health conditions navigate: ODSP (Ontario Disability Support Program) application and appeals, Developmental Services Ontario (DSO) referral and waitlist process, Passport funding for adults with developmental disabilities, supported living and residential options, Assistive Devices Program (ADP) for equipment funding, transition planning for young adults aging out of children's services at 18/21, Special Services at Home (SSAH), employment supports for people with disabilities, and caregiver support specific to this population.`,
    placeholder:"Ask about disability care — e.g. 'How do I access developmental services for my adult son?'",
    starters:['My son has autism and is turning 21. What services are available for adults?','How do I apply for ODSP for my daughter with a disability?','What is Passport funding and how does my adult child qualify?'],
  },
  sandwich: {
    system:`You are CareGuide AI work-life balance specialist for caregivers in Ontario's "sandwich generation" — those caring for aging parents while also raising children and working. Help with: managing work and caregiving simultaneously, workplace accommodations and flexible work rights in Ontario, financial planning when income is strained by caregiving costs, childcare and eldercare coordination, preventing burnout when responsibilities pile up, setting boundaries with family and employers, when to consider reducing work hours vs. finding care alternatives, Ontario-specific supports for working caregivers including EI caregiving benefits, and practical time management strategies. Be empathetic — this is one of the most stressful situations a person can face.`,
    placeholder:"Ask about balancing work and caregiving — e.g. 'I\'m caring for my mom while raising kids and working full time. I\'m drowning.'",
    starters:["I'm caring for my mom, raising two kids, and working full time. I'm completely overwhelmed.",'Can my employer fire me if I need time off to care for my parent in Ontario?','How do I afford caregiving when it\'s costing me over $1,000 a month?'],
  },
  nutrition: {
    system:`You are CareGuide AI nutrition specialist for Ontario caregivers. Help with meal planning for specific medical conditions common in seniors: diabetes (carb counting, glycemic index, meal timing), heart disease (low sodium, heart-healthy fats), kidney disease (potassium, phosphorus, fluid restrictions), dementia (finger foods, hydration strategies, appetite stimulation), swallowing difficulties/dysphagia (IDDSI texture levels, thickened liquids), cancer treatment (managing nausea, high-calorie foods, appetite loss), and general malnutrition prevention. Also cover: Ontario nutrition programs (Meals on Wheels by region, Grocery Gateway, food banks with senior services), Home and Community Care meal support, and the Ontario Seniors Care at Home Tax Credit for meal delivery expenses.`,
    placeholder:"Ask about nutrition — e.g. 'My diabetic father refuses to eat properly. What can I do?'",
    starters:['My mother has dementia and barely eats anymore. How do I get more nutrition into her?','What foods are safe for my father who has swallowing difficulties after a stroke?','My husband has heart failure and needs a low-sodium diet. What can he eat?'],
  },
  mental: {
    system:`You are CareGuide AI mental health and caregiver wellness specialist. Support caregivers with: recognizing and dealing with caregiver burnout and compassion fatigue, depression and anxiety specific to caregivers, how to ask for and accept help, respite care options in Ontario (Home and Community Care respite, hospice respite, adult day programs), caregiver support groups across Ontario (Alzheimer Society, Ontario Caregiver Organization, local hospital programs), setting healthy boundaries, self-care strategies that realistically work for busy caregivers, when to seek professional mental health support, and Ontario mental health resources (CMHA chapters, 1-800-668-6868 crisis line, Connex Ontario 1-866-531-2600). Be warm, validating, and non-judgmental. If someone expresses thoughts of self-harm, provide crisis resources immediately: call 988 or 1-833-416-2273.`,
    placeholder:"Talk about how you're feeling — this is a safe space…",
    starters:["I'm exhausted and feel guilty about it. Is this normal?",'How do I know if I\'m experiencing caregiver burnout?','Are there any respite programs in Ontario that could give me a break?'],
  },
  legal: {
    system:`You are CareGuide AI legal information specialist for Ontario caregivers. Provide clear information on: Power of Attorney for Personal Care, Power of Attorney for Property (and the difference between them), what happens when a loved one loses capacity and hasn't made a POA (Guardianship application through Ontario courts), patient rights in hospitals and LTC homes, how to dispute medical decisions as a substitute decision maker, what Substitute Decision Makers can and cannot do under Ontario's Health Care Consent Act and Substitute Decisions Act, making and updating wills, estate planning basics, elder abuse — recognizing signs and how to report it (call 1-866-299-1011), and how to access free or low-cost legal help (Legal Aid Ontario 1-800-668-8258, community legal clinics). Always clarify you are providing general information not legal advice and recommend consulting a lawyer.`,
    placeholder:"Ask about legal matters — e.g. 'How do I set up Power of Attorney?'",
    starters:['How do I set up Power of Attorney for my aging parent in Ontario?','My parent can no longer make decisions. What are my legal rights?','How do I recognize and report elder abuse in Ontario?'],
  },
  housing: {
    system:`You are CareGuide AI housing specialist for Ontario seniors and caregivers. Help families understand all housing options: aging in place with home modifications (Home Accessibility Tax Credit, Assistive Devices Program), retirement homes (what they cost — typically $3,000-$8,000+/month — what is and isn't included, how to evaluate quality, red flags to watch for), assisted living and supportive housing, subsidized seniors housing waitlists through local Service Managers, Ontario's Community Housing programs, co-housing options, the critical difference between retirement homes (not regulated the same as LTC) and long-term care (regulated under Ontario's Long-Term Care Homes Act), and how to make the transition to any level of care less traumatic. Be honest about costs — this is often shocking for families.`,
    placeholder:"Ask about housing — e.g. 'What are my mom\'s options besides long-term care?'",
    starters:["What housing options are available for my parent besides long-term care?",'How much do retirement homes cost in Ontario and what is included?','What home modifications can help my parent stay home safely longer?'],
  },
};

const getStorage = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const setStorage = (key, val)  => { try { localStorage.setItem(key, JSON.stringify(val)); }      catch {} };

// Custom non-AI tools
const CUSTOM_TOOLS = new Set(['tasks','local','safety','journal','community']);

export default function Dashboard({ user, onLogout }) {
  const [activeTab,     setActiveTab]     = useState('chat');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [showUpgrade,   setShowUpgrade]   = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [usage,         setUsage]         = useState(() => getStorage('cg_usage', { questions:0, letters:0 }));
  const [currentUser,   setCurrentUser]   = useState(user);

  const plan = PLANS[currentUser?.plan || 'free'];
  const activeTool = TOOLS.find(t => t.id === activeTab);

  const canUse = (type = 'questions') => {
    if (plan.name !== 'Free') return true;
    const used  = usage[type] || 0;
    if (used >= plan[type]) { setUpgradeReason(type); setShowUpgrade(true); return false; }
    return true;
  };

  const recordUsage = (type = 'questions') => {
    const u = { ...usage, [type]: (usage[type] || 0) + 1 };
    setUsage(u); setStorage('cg_usage', u);
  };

  const handleUpgrade = () => {
    // window.location.href = 'https://buy.stripe.com/YOUR_LINK';
    const u = { ...currentUser, plan:'family' };
    setCurrentUser(u); setStorage('cg_user', u);
    setShowUpgrade(false);
    alert('✅ Upgraded to Family plan!\n\nIn production this connects to your Stripe payment link.');
  };

  const usageBarStyle = (used, limit) => {
    if (limit === Infinity) return null;
    const pct = Math.min(100, (used / limit) * 100);
    return { width:`${pct}%`, background: pct > 80 ? '#e07070' : '#7cb88a' };
  };

  const renderTool = () => {
    switch(activeTab) {
      case 'tasks':     return <TaskTracker userEmail={currentUser.email} userName={currentUser.name}/>;
      case 'local':     return <LocalResources/>;
      case 'safety':    return <HomeSafety/>;
      case 'journal':   return <CareJournal/>;
      case 'community': return <CommunityBoard userName={currentUser.name} userCity="Ontario"/>;
      default:
        return PROMPTS[activeTab] ? (
          <ChatPanel
            key={activeTab}
            config={PROMPTS[activeTab]}
            canUse={() => canUse(activeTab==='letter' ? 'letters' : 'questions')}
            onUsed={() => recordUsage(activeTab==='letter' ? 'letters' : 'questions')}
          />
        ) : <div style={{ color:'#5a7a60', padding:20, fontStyle:'italic' }}>Coming soon.</div>;
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#0d1f14,#0a1a10,#0d1f14)', fontFamily:"'DM Sans',sans-serif", color:'#dde8de', display:'flex', flexDirection:'column' }}>

      {/* HEADER */}
      <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(124,184,138,0.12)', background:'rgba(13,31,20,0.92)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{fontSize:20}}>🌿</span>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:'#c8dcc9' }}>CareGuide <span style={{color:'#7cb88a'}}>AI</span></div>
            <div style={{ fontSize:10, color:'#4a6a4f', letterSpacing:'0.08em', textTransform:'uppercase' }}>Serving All of Ontario</div>
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
              <span style={{ fontSize:11, background:'rgba(124,184,138,0.12)', border:'1px solid rgba(124,184,138,0.25)', borderRadius:20, padding:'3px 12px', color:'#7cb88a' }}>
                {plan.name} Plan
              </span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.1)', borderRadius:12, padding:16, marginBottom:18 }}>
              <div style={{ fontSize:11, color:'#5a7a60', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:12 }}>Usage This Month</div>
              {[{label:'AI Questions',key:'questions',limit:plan.questions},{label:'Letter Drafts',key:'letters',limit:plan.letters}].map(item => (
                <div key={item.key} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#6a8a6f', marginBottom:4 }}>
                    <span>{item.label}</span>
                    <span style={{ color:item.limit===Infinity?'#7cb88a':undefined }}>{item.limit===Infinity?'Unlimited':`${usage[item.key]||0} / ${item.limit}`}</span>
                  </div>
                  {item.limit!==Infinity && (
                    <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:2 }}>
                      <div style={{ height:'100%', borderRadius:2, transition:'width 0.3s', ...usageBarStyle(usage[item.key]||0, item.limit) }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {currentUser.plan==='free' && (
              <button onClick={()=>{setShowUpgrade(true);setSidebarOpen(false);}} style={{ width:'100%', background:'#3d7a52', border:'none', borderRadius:10, padding:12, color:'#fff', fontSize:14, cursor:'pointer', marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>
                ⭐ Upgrade to Family — $4.99/mo
              </button>
            )}
            <button onClick={onLogout} style={{ width:'100%', background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:10, color:'#5a7a60', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              Sign Out
            </button>
          </div>
        )}

        {/* MAIN */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px 12px 28px', maxWidth:740, margin:'0 auto', width:'100%' }}>

          {/* TOOL GRID — 4 cols */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5, marginBottom:12 }}>
            {TOOLS.map(t => (
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
                background: activeTab===t.id ? 'rgba(61,107,79,0.45)' : 'rgba(255,255,255,0.03)',
                border:`1px solid ${activeTab===t.id ? 'rgba(124,184,138,0.55)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius:9, padding:'7px 4px', cursor:'pointer', textAlign:'center', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif",
              }}>
                <div style={{fontSize:14, marginBottom:2}}>{t.icon}</div>
                <div style={{ fontSize:9, color:activeTab===t.id?'#c8dcc9':'#4a6a4f', lineHeight:1.2, letterSpacing:'0.01em' }}>{t.label}</div>
              </button>
            ))}
          </div>

          {/* ACTIVE TOOL HEADER */}
          <div style={{ padding:'9px 14px', background:'rgba(124,184,138,0.06)', border:'1px solid rgba(124,184,138,0.11)', borderRadius:10, marginBottom:10, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{fontSize:18}}>{activeTool?.icon}</span>
            <div>
              <div style={{fontSize:13, color:'#c8dcc9', fontWeight:500}}>{activeTool?.label}</div>
              <div style={{fontSize:11, color:'#5a7a60', fontStyle:'italic'}}>{activeTool?.desc}</div>
            </div>
          </div>

          {/* TOOL BODY */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(124,184,138,0.08)', borderRadius:14, padding:14, minHeight:400 }}>
            {renderTool()}
          </div>

          <p style={{ textAlign:'center', fontSize:11, color:'#2e4e34', marginTop:10, fontStyle:'italic' }}>
            CareGuide AI is informational only. Always confirm with qualified professionals.
          </p>
        </div>
      </div>

      {showUpgrade && <UpgradeModal reason={upgradeReason} onClose={()=>setShowUpgrade(false)} onUpgrade={handleUpgrade}/>}
    </div>
  );
}
