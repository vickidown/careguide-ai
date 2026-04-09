import React, { useState } from 'react';

const S = {
  // Nav
  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(13,31,20,0.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(124,184,138,0.12)', padding:'0 5%', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 },
  logo: { display:'flex', alignItems:'center', gap:10, textDecoration:'none' },
  logoText: { fontFamily:"'Playfair Display',serif", fontSize:20, color:'#c8dcc9' },
  logoAI: { color:'#7cb88a' },
  navBadge: { fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#5a7a60', border:'1px solid rgba(61,122,82,0.3)', padding:'3px 10px', borderRadius:20 },
  navCta: { background:'#3d7a52', color:'#fff', border:'none', borderRadius:8, padding:'9px 20px', fontSize:14, fontWeight:500, cursor:'pointer', transition:'background 0.2s' },
  // Hero
  hero: { background:'linear-gradient(160deg,#0d1f14 0%,#112819 60%,#1a3d26 100%)', color:'#c8dcc9', padding:'90px 5% 80px', position:'relative', overflow:'hidden' },
  heroInner: { maxWidth:900, margin:'0 auto', position:'relative', zIndex:1 },
  heroTag: { display:'inline-block', background:'rgba(124,184,138,0.15)', border:'1px solid rgba(124,184,138,0.3)', color:'#7cb88a', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', padding:'5px 14px', borderRadius:20, marginBottom:28 },
  heroH1: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,6vw,64px)', fontWeight:700, lineHeight:1.12, color:'#fff', marginBottom:20 },
  heroEm: { fontStyle:'italic', color:'#7cb88a' },
  heroSub: { fontSize:'clamp(15px,2vw,19px)', color:'rgba(200,220,201,0.8)', maxWidth:540, marginBottom:40, fontWeight:300, lineHeight:1.75 },
  heroActions: { display:'flex', gap:14, flexWrap:'wrap', alignItems:'center' },
  btnPrimary: { background:'#7cb88a', color:'#0d1f14', border:'none', borderRadius:10, padding:'14px 28px', fontSize:15, fontWeight:600, cursor:'pointer', transition:'all 0.2s', textDecoration:'none', display:'inline-block' },
  btnGhost: { background:'transparent', color:'#c8dcc9', border:'1px solid rgba(200,220,201,0.3)', borderRadius:10, padding:'14px 28px', fontSize:15, cursor:'pointer', transition:'all 0.2s', textDecoration:'none', display:'inline-block' },
  // Stats strip
  statsStrip: { display:'flex', gap:40, marginTop:60, paddingTop:40, borderTop:'1px solid rgba(124,184,138,0.2)', flexWrap:'wrap' },
  statNum: { fontFamily:"'Playfair Display',serif", fontSize:30, color:'#fff', fontWeight:700 },
  statLabel: { fontSize:11, color:'rgba(200,220,201,0.55)', marginTop:2, letterSpacing:'0.05em' },
  // Sections
  section: { padding:'72px 5%' },
  sectionInner: { maxWidth:1100, margin:'0 auto' },
  sectionTag: { fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#3d7a52', marginBottom:14, fontWeight:600 },
  sectionTitle: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,4vw,42px)', lineHeight:1.2, color:'#1a2e1e', marginBottom:16 },
  sectionTitleLight: { color:'#fff' },
  sectionDesc: { fontSize:16, color:'#5a7a60', maxWidth:520, lineHeight:1.75, fontWeight:300 },
  // Pain section
  painSection: { background:'#f5f0e8' },
  painGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, marginTop:44 },
  painCard: { background:'#fff', border:'1px solid rgba(61,122,82,0.1)', borderRadius:16, padding:'26px 22px', position:'relative', overflow:'hidden' },
  painBar: { position:'absolute', top:0, left:0, width:3, height:'100%', background:'#7cb88a', borderRadius:'3px 0 0 3px' },
  painIcon: { fontSize:26, marginBottom:12 },
  painTitle: { fontSize:16, marginBottom:8, color:'#1a2e1e', fontWeight:600 },
  painDesc: { fontSize:13, color:'#5a7a60', lineHeight:1.65 },
  // Features
  featuresSection: { background:'#faf8f4' },
  featuresGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:22, marginTop:50 },
  featureCard: { background:'#fff', border:'1px solid rgba(61,122,82,0.1)', borderRadius:20, padding:'30px 26px', transition:'all 0.25s' },
  featIcon: { width:46, height:46, background:'linear-gradient(135deg,rgba(61,122,82,0.14),rgba(124,184,138,0.08))', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, marginBottom:16 },
  featTitle: { fontSize:17, marginBottom:9, color:'#1a2e1e', fontWeight:600 },
  featDesc: { fontSize:13, color:'#5a7a60', lineHeight:1.7 },
  // How it works
  howSection: { background:'#0d1f14' },
  stepsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:30, marginTop:50 },
  stepNum: { width:50, height:50, border:'1px solid rgba(124,184,138,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:21, color:'#7cb88a', margin:'0 auto 16px' },
  stepTitle: { fontSize:15, color:'#fff', marginBottom:8, textAlign:'center', fontWeight:500 },
  stepDesc: { fontSize:13, color:'rgba(200,220,201,0.55)', lineHeight:1.7, textAlign:'center' },
  // Testimonials
  testiSection: { background:'#f5f0e8' },
  testiGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:18, marginTop:44 },
  testiCard: { background:'#fff', border:'1px solid rgba(61,122,82,0.1)', borderRadius:20, padding:26 },
  stars: { color:'#c9a84c', fontSize:14, marginBottom:14 },
  testiText: { fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:15, color:'#1a2e1e', lineHeight:1.65, marginBottom:18 },
  testiAuthor: { fontSize:12, color:'#5a7a60' },
  testiName: { color:'#1a2e1e', fontWeight:600, display:'block', marginBottom:2 },
  // Pricing
  pricingSection: { background:'#faf8f4' },
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:18, marginTop:44, alignItems:'start' },
  priceCard: { background:'#fff', border:'1px solid rgba(61,122,82,0.14)', borderRadius:20, padding:'30px 26px' },
  priceCardFeatured: { background:'#0d1f14', border:'2px solid #3d7a52', borderRadius:20, padding:'30px 26px', position:'relative' },
  featuredBadge: { position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#7cb88a', color:'#0d1f14', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 16px', borderRadius:20, whiteSpace:'nowrap' },
  planName: { fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:'#5a7a60', marginBottom:10 },
  planNameLight: { color:'#7cb88a' },
  priceAmt: { fontFamily:"'Playfair Display',serif", fontSize:46, fontWeight:700, color:'#1a2e1e', lineHeight:1 },
  priceAmtLight: { color:'#fff' },
  pricePeriod: { fontSize:13, color:'#5a7a60', marginBottom:22 },
  pricePeriodLight: { color:'rgba(200,220,201,0.6)' },
  priceDesc: { fontSize:13, color:'#5a7a60', marginBottom:22, lineHeight:1.65 },
  priceDescLight: { color:'rgba(200,220,201,0.65)' },
  featureList: { listStyle:'none', marginBottom:26 },
  featureItem: { fontSize:13, padding:'6px 0', borderBottom:'1px solid rgba(61,122,82,0.08)', display:'flex', alignItems:'center', gap:9, color:'#1a2e1e' },
  featureItemLight: { color:'#c8dcc9', borderColor:'rgba(124,184,138,0.12)' },
  checkMark: { color:'#3d7a52', fontSize:15, flexShrink:0 },
  checkMarkLight: { color:'#7cb88a' },
  btnPriceOutline: { width:'100%', padding:12, borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer', border:'1px solid rgba(61,122,82,0.3)', background:'transparent', color:'#3d7a52', transition:'all 0.2s' },
  btnPriceSolid: { width:'100%', padding:12, borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', border:'none', background:'#7cb88a', color:'#0d1f14', transition:'all 0.2s' },
  // FAQ
  faqSection: { background:'#f5f0e8' },
  faqList: { marginTop:44, maxWidth:700 },
  faqItem: { borderBottom:'1px solid rgba(61,122,82,0.15)', padding:'18px 0' },
  faqQ: { fontSize:15, fontWeight:500, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', color:'#1a2e1e', userSelect:'none' },
  faqIcon: { fontSize:20, color:'#3d7a52', transition:'transform 0.2s', flexShrink:0 },
  faqA: { fontSize:13, color:'#5a7a60', lineHeight:1.75, paddingTop:12 },
  // CTA
  ctaSection: { background:'linear-gradient(135deg,#1a3d26,#0d1f14)', padding:'72px 5%', textAlign:'center' },
  ctaTitle: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,4vw,44px)', color:'#fff', marginBottom:14 },
  ctaDesc: { color:'rgba(200,220,201,0.7)', fontSize:16, marginBottom:34, fontWeight:300 },
  ctaForm: { display:'flex', gap:12, maxWidth:420, margin:'0 auto', flexWrap:'wrap', justifyContent:'center' },
  ctaInput: { flex:1, minWidth:210, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(200,220,201,0.25)', borderRadius:10, padding:'12px 15px', color:'#fff', fontSize:14, outline:'none', fontFamily:"'DM Sans',sans-serif" },
  noCC: { fontSize:11, color:'rgba(200,220,201,0.45)', marginTop:12 },
  // Footer
  footer: { background:'#0d1f14', color:'rgba(200,220,201,0.45)', padding:'40px 5% 26px', fontSize:13 },
  footerInner: { maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:22 },
  footerBrand: { fontFamily:"'Playfair Display',serif", fontSize:18, color:'rgba(200,220,201,0.85)', marginBottom:6 },
  footerCopy: { marginTop:28, paddingTop:18, borderTop:'1px solid rgba(124,184,138,0.1)', textAlign:'center', fontSize:11 },
};

const PAINS = [
  { icon:'📞', title:'Hours on hold', desc:'Navigating OHIP, PSW, and insurance requires dozens of calls most caregivers don\'t have time to make.' },
  { icon:'📝', title:'Confusing paperwork', desc:'Government forms, benefit applications, and medical documents written in language nobody understands.' },
  { icon:'💊', title:'Medication anxiety', desc:'Managing 8–12 medications while worried about dangerous interactions, missed doses, and side effects.' },
  { icon:'💸', title:'Missed benefits', desc:'Most caregivers don\'t know about the Ontario Caregiver Tax Credit, RDSP, or PSW funding they\'re entitled to.' },
];

const FEATURES = [
  { icon:'💬', title:'AI Care Assistant', desc:'Ask anything about Ontario\'s health system — PSW, OHIP, LTC waitlists — plain-language answers, 24/7.' },
  { icon:'📄', title:'Insurance Letter Drafts', desc:'Complete, professional appeal letters drafted in minutes — ready to print and send.' },
  { icon:'💊', title:'Medication Guide', desc:'Medication explanations, interaction warnings, and caregiver tips in plain language.' },
  { icon:'💰', title:'Tax Credits Finder', desc:'Find every caregiver tax credit you qualify for — Canada Caregiver Credit, DTC, Medical Expenses and more.' },
  { icon:'💼', title:'EI & Job Rights', desc:'EI Compassionate Care Benefits, Family Medical Leave, and job protection rights explained.' },
  { icon:'🏨', title:'Hospital Discharge Guide', desc:'Bring your loved one home safely — checklists, warning signs, and home care setup.' },
  { icon:'🧩', title:'Dementia Care Guide', desc:'Stage-by-stage guidance for caring for someone with Alzheimer\'s or dementia.' },
  { icon:'🔒', title:'Home Safety Assessment', desc:'Room-by-room fall prevention assessment with personalized AI recommendations.' },
  { icon:'📓', title:'Care Journal', desc:'Shareable health log — track symptoms, vitals, and visits to share with your healthcare team.' },
  { icon:'🚨', title:'Emergency Planning', desc:'Build a backup plan so your loved one is never without care if something happens to you.' },
  { icon:'👥', title:'Caregiver Community', desc:'Connect with other Ontario caregivers — share experiences, ask questions, find support.' },
  { icon:'📍', title:'Local Resource Finder', desc:'120+ Ontario services — from Toronto to Thunder Bay, Sudbury to Windsor.' },
];

const STEPS = [
  { num:'1', title:'Tell us your situation', desc:'Type your question in plain everyday language — just like texting a knowledgeable friend.' },
  { num:'2', title:'Get instant guidance', desc:'CareGuide AI responds immediately with Ontario-specific advice, letters, or step-by-step guides.' },
  { num:'3', title:'Take action', desc:'Copy letters, download info, or follow clear checklists. Everything is ready to use right away.' },
  { num:'4', title:'Feel in control', desc:'Stop dreading the paperwork. Know your rights. Navigate the system with confidence.' },
];

const TESTIMONIALS = [
  { text:'"I spent three weeks trying to understand how to appeal my mom\'s PSW hour reduction. CareGuide wrote the letter in five minutes. We got the hours reinstated."', name:'Sandra M.', role:'St. Thomas, ON — caring for her 81-year-old mother' },
  { text:'"My dad takes 9 medications. I was terrified of interactions. The medication tool explained everything clearly and flagged something his own doctor had missed."', name:'James K.', role:'Aylmer, ON — caring for his father with Parkinson\'s' },
  { text:'"I didn\'t even know the Ontario Caregiver Tax Credit existed. CareGuide walked me through the whole application. I got $1,600 back."', name:'Diane R.', role:'Elgin County — caring for her husband after his stroke' },
];

const PLANS = [
  { name:'Personal', price:'$0', period:'forever free', desc:'Get started and see how CareGuide can help.', features:['10 AI questions per month','1 insurance letter draft','Medication checker (up to 3 meds)','Ontario resource directory'], featured:false },
  { name:'Family', price:'$4.99', period:'/month', desc:'Everything you need to confidently manage care for a loved one.', features:['Unlimited AI conversations','Unlimited letter drafts','Medication tracker (unlimited)','Benefits navigator','Care task tracker','Local Elgin County resources','Priority email support'], featured:true },
  { name:'Organization', price:'$79', period:'/month · up to 10 staff', desc:'For home care agencies and social workers in Elgin County.', features:['Everything in Family','10 team accounts','Client management dashboard','Custom intake forms','Dedicated onboarding call','Phone support'], featured:false },
];

const FAQS = [
  { q:'Is CareGuide AI a substitute for a doctor or lawyer?', a:'No. CareGuide AI is an informational tool to help you understand your options, prepare documents, and navigate systems. Always consult a qualified healthcare provider for medical decisions and a lawyer for legal matters. Think of us as a very knowledgeable friend — not a professional.' },
  { q:'Is my information private and secure?', a:'Yes. We use encryption and never sell your data. Conversations are used only to provide your answers and are not stored long-term. We comply with Canadian privacy law (PIPEDA).' },
  { q:'Does it work for all of Ontario or just Elgin County?', a:'CareGuide AI works for all of Ontario — the AI assistant knows Ontario\'s provincial programs province-wide. The local resource directory is focused on St. Thomas and Elgin County, with more regions added regularly.' },
  { q:'How accurate is the AI?', a:'CareGuide AI is powered by Claude, one of the most accurate and safety-focused AI models available. It\'s built around Ontario health policy and caregiver information. We recommend verifying important program details with the relevant government office before taking action.' },
  { q:'Can I use this for my organization or care agency?', a:'Absolutely. The Organization plan ($79/month) supports up to 10 staff accounts and includes a client management dashboard — ideal for home care agencies, social workers, and retirement communities.' },
];

export default function Landing({ onGetStarted }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitWaitlist = async () => {
    if (!email.includes('@')) return;
    setSubmitting(true);
    try {
      await fetch('/api/waitlist', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, source:'landing_cta' }) });
    } catch {}
    setSubmitted(true); setSubmitting(false);
  };
  const [email, setEmail] = useState('');

  return (
    <div style={{ background:'#0d1f14' }}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <span style={{fontSize:20}}>🌿</span>
          <span style={S.logoText}>CareGuide <span style={S.logoAI}>AI</span></span>
        </div>
        <span style={S.navBadge}>Serving All of Ontario</span>
        <div style={{display:"flex",gap:10}}><button style={{background:"transparent",color:"#c8dcc9",border:"1px solid rgba(200,220,201,0.3)",borderRadius:8,padding:"8px 16px",fontSize:14,cursor:"pointer"}} onClick={onGetStarted}>Log In</button><button style={S.navCta} onClick={onGetStarted}>Start Free Trial</button></div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, background:'radial-gradient(ellipse at 70% 50%,rgba(61,122,82,0.14) 0%,transparent 60%)', pointerEvents:'none' }}/>
        <div style={S.heroInner}>
          <div style={S.heroTag}>🍁 Built for Every Ontario Caregiver</div>
          <h1 style={S.heroH1}>You're carrying<br/><em style={S.heroEm}>too much</em> alone.</h1>
          <p style={S.heroSub}>CareGuide AI is your 24/7 personal assistant for navigating Ontario's health system, fighting insurance battles, and managing the endless paperwork of caring for a loved one.</p>
          <div style={S.heroActions}>
            <button style={S.btnPrimary} onClick={onGetStarted}>Start Free — 14 Days</button>
            <a href="#features" style={S.btnGhost}>See How It Works ↓</a>
          </div>
          <div style={S.statsStrip}>
            {[{n:'4M+',l:'Ontario caregivers'},{n:'22',l:'specialized tools'},{n:'73%',l:'feel overwhelmed'},{n:'50K+',l:'on LTC waitlist'}].map((s,i)=>(
              <div key={i}>
                <div style={S.statNum}>{s.n}</div>
                <div style={S.statLabel}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{...S.section, ...S.painSection}}>
        <div style={S.sectionInner}>
          <div style={S.sectionTag}>The Problem</div>
          <h2 style={S.sectionTitle}>Sound familiar?</h2>
          <p style={S.sectionDesc}>Every day, Ontario caregivers face a maze of systems with no guide, no time, and no support.</p>
          <div style={S.painGrid}>
            {PAINS.map((p,i)=>(
              <div key={i} style={S.painCard}>
                <div style={S.painBar}/>
                <div style={S.painIcon}>{p.icon}</div>
                <h3 style={S.painTitle}>{p.title}</h3>
                <p style={S.painDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{...S.section, ...S.featuresSection}}>
        <div style={S.sectionInner}>
          <div style={S.sectionTag}>What CareGuide Does</div>
          <h2 style={S.sectionTitle}>Your AI-powered<br/>caregiving team</h2>
          <p style={S.sectionDesc}>22 specialized tools in one app — each built around the real challenges Ontario caregivers face every day.</p>
          <div style={S.featuresGrid}>
            {FEATURES.map((f,i)=>(
              <div key={i} style={S.featureCard}>
                <div style={S.featIcon}>{f.icon}</div>
                <h3 style={S.featTitle}>{f.title}</h3>
                <p style={S.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{...S.section, ...S.howSection}}>
        <div style={S.sectionInner}>
          <div style={{...S.sectionTag, color:'#7cb88a'}}>How It Works</div>
          <h2 style={{...S.sectionTitle, ...S.sectionTitleLight}}>Simple as a conversation</h2>
          <p style={{...S.sectionDesc, color:'rgba(200,220,201,0.6)'}}>No training required. If you can text, you can use CareGuide AI.</p>
          <div style={S.stepsGrid}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{textAlign:'center'}}>
                <div style={S.stepNum}>{s.num}</div>
                <h3 style={S.stepTitle}>{s.title}</h3>
                <p style={S.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{...S.section, ...S.testiSection}}>
        <div style={S.sectionInner}>
          <div style={S.sectionTag}>Early Feedback</div>
          <h2 style={S.sectionTitle}>What caregivers are saying</h2>
          <div style={S.testiGrid}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={S.testiCard}>
                <div style={S.stars}>★★★★★</div>
                <p style={S.testiText}>{t.text}</p>
                <div style={S.testiAuthor}><strong style={S.testiName}>{t.name}</strong>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{...S.section, ...S.pricingSection}}>
        <div style={S.sectionInner}>
          <div style={S.sectionTag}>Pricing</div>
          <h2 style={S.sectionTitle}>Plans that fit your life</h2>
          <p style={S.sectionDesc}>No long-term contracts. Cancel any time. Start free for 14 days — no credit card required.</p>
          <div style={S.pricingGrid}>
            {PLANS.map((p,i)=>(
              <div key={i} style={p.featured ? S.priceCardFeatured : S.priceCard}>
                {p.featured && <div style={S.featuredBadge}>Most Popular</div>}
                <div style={p.featured ? {...S.planName,...S.planNameLight} : S.planName}>{p.name}</div>
                <div style={p.featured ? {...S.priceAmt,...S.priceAmtLight} : S.priceAmt}>{p.price}</div>
                <div style={p.featured ? {...S.pricePeriod,...S.pricePeriodLight} : S.pricePeriod}>{p.period}</div>
                <div style={p.featured ? {...S.priceDesc,...S.priceDescLight} : S.priceDesc}>{p.desc}</div>
                <ul style={S.featureList}>
                  {p.features.map((f,j)=>(
                    <li key={j} style={p.featured ? {...S.featureItem,...S.featureItemLight} : S.featureItem}>
                      <span style={p.featured ? S.checkMarkLight : S.checkMark}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  style={p.featured ? S.btnPriceSolid : S.btnPriceOutline}
                  onClick={onGetStarted}
                >{p.name === 'Personal' ? 'Get Started Free' : p.name === 'Organization' ? 'Contact Us' : 'Start Free Trial'}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{...S.section, ...S.faqSection}}>
        <div style={S.sectionInner}>
          <div style={S.sectionTag}>FAQ</div>
          <h2 style={S.sectionTitle}>Common questions</h2>
          <div style={S.faqList}>
            {FAQS.map((f,i)=>(
              <div key={i} style={S.faqItem}>
                <div style={S.faqQ} onClick={()=>setOpenFaq(openFaq===i ? null : i)}>
                  {f.q}
                  <span style={{...S.faqIcon, transform: openFaq===i ? 'rotate(45deg)' : 'none'}}>+</span>
                </div>
                {openFaq===i && <p style={S.faqA}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.ctaSection}>
        <h2 style={S.ctaTitle}>You deserve support too.</h2>
        <p style={S.ctaDesc}>Start your free 14-day trial. No credit card required. Cancel any time.</p>
        <div style={S.ctaForm}>
          <input style={S.ctaInput} type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submitWaitlist();}}/>
          {submitted ? (<span style={{color:"#7cb88a",fontSize:14,padding:"12px 0"}}>✓ You're on the list!</span>) : (<button style={S.btnPrimary} onClick={submitWaitlist} disabled={submitting}>{submitting ? "..." : "Start Free Trial →"}</button>)}
        </div>
        <p style={S.noCC}>✓ No credit card &nbsp;&nbsp; ✓ 14 days free &nbsp;&nbsp; ✓ Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div>
            <div style={S.footerBrand}>🌿 CareGuide AI</div>
            <div>Supporting Ontario caregivers, one family at a time.</div>
            <div style={{marginTop:6}}>Serving all of Ontario 🍁</div>
          </div>
          <div style={{display:'flex', gap:40, flexWrap:'wrap'}}>
            <div>
              <div style={{marginBottom:10,color:'rgba(200,220,201,0.7)'}}>Product</div>
              {['Features','Pricing','Try the App'].map(l=><div key={l} style={{marginBottom:7,cursor:'pointer'}}>{l}</div>)}
            </div>
            <div>
              <div style={{marginBottom:10,color:'rgba(200,220,201,0.7)'}}>Contact</div>
              <div style={{marginBottom:7}}>hello@careguideai.ca</div>
              <div>St. Thomas, Ontario</div>
            </div>
          </div>
        </div>
        <div style={S.footerCopy}>
          © 2026 CareGuide AI · Informational purposes only · Always consult qualified professionals for medical, legal and financial decisions.
        </div>
      </footer>
    </div>
  );
}
