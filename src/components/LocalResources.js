import React, { useState } from 'react';

const RESOURCES = [
  // ── PROVINCE-WIDE ─────────────────────────────────────────────────────────
  { name:'Ontario Caregiver Organization Helpline', phone:'1-833-416-2273', type:'Caregiver Support', address:'Province-wide — free helpline' },
  { name:'Health811 (Health Connect Ontario)',       phone:'811',            type:'Health Advice',    address:'Province-wide — 24/7 nurse line' },
  { name:'Telehealth Ontario',                       phone:'1-866-797-0000', type:'Medical Advice',   address:'Province-wide — 24/7' },
  { name:'Home and Community Care Support',          phone:'310-2222',       type:'Home Care / PSW',  address:'Province-wide — no area code needed' },
  { name:'Alzheimer Society of Ontario',             phone:'1-800-879-4226', type:'Dementia Support', address:'Province-wide' },
  { name:'Ontario Disability Support Program',       phone:'1-888-789-4199', type:'Financial Aid',    address:'Province-wide' },
  { name:'Legal Aid Ontario',                        phone:'1-800-668-8258', type:'Legal Help',       address:'Province-wide' },
  { name:'Distress & Crisis Ontario',                phone:'1-800-452-0688', type:'Crisis Support',   address:'Province-wide' },
  { name:'211 Ontario (Social Services)',            phone:'211',            type:'Social Services',  address:'Province-wide — find any service' },
  { name:'Canadian Mental Health Association Ontario',phone:'1-800-875-6213', type:'Mental Health',   address:'Province-wide' },
  { name:'Seniors Safety Line',                      phone:'1-866-299-1011', type:'Seniors Support',  address:'Province-wide — 24/7' },
  { name:'Caregiver Relief Line',                    phone:'1-888-422-9474', type:'Caregiver Support',address:'Province-wide' },
  { name:'Ontario Lung Association',                 phone:'1-800-972-2636', type:'Health Support',   address:'Province-wide' },
  { name:'Heart & Stroke Foundation Ontario',        phone:'1-888-473-4636', type:'Health Support',   address:'Province-wide' },
  { name:'Canadian Cancer Society Ontario',          phone:'1-888-939-3333', type:'Health Support',   address:'Province-wide' },
  { name:'Parkinson Canada Ontario',                 phone:'1-800-565-3000', type:'Neurological',     address:'Province-wide' },
  { name:'MS Society of Canada Ontario',             phone:'1-800-268-7582', type:'Neurological',     address:'Province-wide' },
  { name:'Arthritis Society Ontario',                phone:'1-800-321-1433', type:'Health Support',   address:'Province-wide' },
  { name:'Registered Disability Savings Plan Info',  phone:'1-800-959-8281', type:'Financial Aid',    address:'Province-wide — CRA' },
  { name:'Ontario Works',                            phone:'1-888-789-4199', type:'Financial Aid',    address:'Province-wide' },

  // ── TORONTO & GTA ─────────────────────────────────────────────────────────
  { name:'Toronto Seniors Helpline',                 phone:'416-217-2077',   type:'Seniors Support',  address:'Toronto' },
  { name:'CAMH Mental Health',                       phone:'416-535-8501',   type:'Mental Health',    address:'Toronto' },
  { name:'Circle of Care',                           phone:'416-635-2860',   type:'Home Care',        address:'Toronto' },
  { name:'Baycrest Health Sciences',                 phone:'416-785-2500',   type:'Geriatric Care',   address:'Toronto' },
  { name:'Sunnybrook Health Sciences',               phone:'416-480-6100',   type:'Hospital',         address:'Toronto' },
  { name:'Toronto General Hospital',                 phone:'416-340-4800',   type:'Hospital',         address:'Toronto' },
  { name:'West Park Healthcare Centre',              phone:'416-243-3600',   type:'Rehabilitation',   address:'Toronto' },
  { name:'Alzheimer Society Toronto',                phone:'416-322-6560',   type:'Dementia Support', address:'Toronto' },
  { name:'VON Canada — Toronto',                     phone:'416-510-8866',   type:'Home Care',        address:'Toronto' },
  { name:'Scarborough Health Network',               phone:'416-438-2911',   type:'Hospital',         address:'Scarborough' },
  { name:'North York General Hospital',              phone:'416-756-6000',   type:'Hospital',         address:'North York' },
  { name:'Trillium Health Partners',                 phone:'905-848-7100',   type:'Hospital',         address:'Mississauga / Brampton' },
  { name:'William Osler Health System',              phone:'905-494-2120',   type:'Hospital',         address:'Brampton / Etobicoke' },
  { name:'Peel Senior Link',                         phone:'905-848-2049',   type:'Seniors Support',  address:'Brampton / Mississauga' },
  { name:'Markham Stouffville Hospital',             phone:'905-472-7000',   type:'Hospital',         address:'Markham' },
  { name:'York Region Community & Health Services',  phone:'1-877-464-9675', type:'Home Care',        address:'York Region' },

  // ── OTTAWA ────────────────────────────────────────────────────────────────
  { name:'Ottawa Distress Centre',                   phone:'613-238-3311',   type:'Crisis Support',   address:'Ottawa' },
  { name:'Carefor Health & Community Services',      phone:'613-744-9207',   type:'Home Care',        address:'Ottawa' },
  { name:'Ottawa Hospital',                          phone:'613-722-7000',   type:'Hospital',         address:'Ottawa' },
  { name:'Alzheimer Society Ottawa',                 phone:'613-523-4004',   type:'Dementia Support', address:'Ottawa' },
  { name:'VON Canada — Ottawa',                      phone:'613-745-4437',   type:'Home Care',        address:'Ottawa' },
  { name:'CMHA Ottawa',                              phone:'613-737-7791',   type:'Mental Health',    address:'Ottawa' },
  { name:'Montfort Hospital',                        phone:'613-746-4621',   type:'Hospital',         address:'Ottawa East' },
  { name:'Bruyère Continuing Care',                  phone:'613-562-6262',   type:'Long-Term Care',   address:'Ottawa' },
  { name:'Eastern Ontario Health Unit',              phone:'1-800-267-7120', type:'Public Health',    address:'Ottawa / Eastern Ontario' },

  // ── HAMILTON & NIAGARA ────────────────────────────────────────────────────
  { name:'Hamilton Health Sciences',                 phone:'905-521-2100',   type:'Hospital',         address:'Hamilton' },
  { name:"St. Joseph's Healthcare Hamilton",         phone:'905-522-1155',   type:'Hospital',         address:'Hamilton' },
  { name:'Alzheimer Society Hamilton',               phone:'905-529-7030',   type:'Dementia Support', address:'Hamilton' },
  { name:'CMHA Hamilton',                            phone:'905-521-0090',   type:'Mental Health',    address:'Hamilton' },
  { name:'VON Canada — Hamilton',                    phone:'905-528-0356',   type:'Home Care',        address:'Hamilton' },
  { name:'Niagara Health System',                    phone:'905-378-4647',   type:'Hospital',         address:'Niagara Region' },
  { name:'Alzheimer Society Niagara',                phone:'905-687-6856',   type:'Dementia Support', address:'Niagara Region' },
  { name:'Community Care St. Catharines',            phone:'905-682-3800',   type:'Home Care',        address:'St. Catharines' },
  { name:'Niagara Falls Community Outreach',         phone:'905-357-5552',   type:'Social Services',  address:'Niagara Falls' },

  // ── LONDON & SOUTHWESTERN ONTARIO ────────────────────────────────────────
  { name:'VON Canada — London',                      phone:'519-642-0601',   type:'Home Care',        address:'London' },
  { name:'Canadian Mental Health — London',          phone:'519-434-9191',   type:'Mental Health',    address:'London' },
  { name:'London Health Sciences Centre',            phone:'519-685-8500',   type:'Hospital',         address:'London' },
  { name:"St. Joseph's Health Care London",          phone:'519-646-6100',   type:'Hospital',         address:'London' },
  { name:'Alzheimer Society London & Middlesex',     phone:'519-680-2404',   type:'Dementia Support', address:'London' },
  { name:'Community Care Access — London',           phone:'519-473-2222',   type:'Home Care',        address:'London' },
  { name:'Windsor Regional Hospital',                phone:'519-254-5577',   type:'Hospital',         address:'Windsor' },
  { name:'Alzheimer Society Windsor-Essex',          phone:'519-974-2220',   type:'Dementia Support', address:'Windsor' },
  { name:'CMHA Windsor-Essex',                       phone:'519-255-7440',   type:'Mental Health',    address:'Windsor' },
  { name:'Chatham-Kent Health Alliance',             phone:'519-352-6400',   type:'Hospital',         address:'Chatham' },
  { name:'Community Living Chatham-Kent',            phone:'519-354-5454',   type:'Disability Support',address:'Chatham' },
  { name:'Sarnia-Lambton Community Health',          phone:'519-344-3017',   type:'Home Care',        address:'Sarnia' },
  { name:'Bluewater Health Sarnia',                  phone:'519-464-4400',   type:'Hospital',         address:'Sarnia' },
  { name:'St. Thomas-Elgin General Hospital',        phone:'519-631-2020',   type:'Hospital',         address:'St. Thomas' },
  { name:'Alzheimer Society Elgin-St. Thomas',       phone:'519-631-1220',   type:'Dementia Support', address:'St. Thomas' },
  { name:'VON Canada — Elgin County',                phone:'519-633-2273',   type:'Home Care',        address:'St. Thomas' },
  { name:'Woodstock Hospital',                       phone:'519-421-4211',   type:'Hospital',         address:'Woodstock' },
  { name:'Stratford General Hospital',               phone:'519-272-8210',   type:'Hospital',         address:'Stratford' },
  { name:'Huron Perth Healthcare Alliance',          phone:'519-272-8210',   type:'Hospital',         address:'Huron / Perth County' },

  // ── KITCHENER-WATERLOO & GUELPH ───────────────────────────────────────────
  { name:'Grand River Hospital',                     phone:'519-749-4300',   type:'Hospital',         address:'Kitchener' },
  { name:"St. Mary's General Hospital",              phone:'519-744-3311',   type:'Hospital',         address:'Kitchener' },
  { name:'Alzheimer Society Waterloo Wellington',    phone:'519-886-8886',   type:'Dementia Support', address:'Kitchener-Waterloo' },
  { name:'CMHA Waterloo Wellington',                 phone:'519-744-1813',   type:'Mental Health',    address:'Kitchener-Waterloo' },
  { name:'Supportive Housing of Waterloo',           phone:'519-742-3334',   type:'Housing Support',  address:'Kitchener-Waterloo' },
  { name:'Guelph General Hospital',                  phone:'519-822-5350',   type:'Hospital',         address:'Guelph' },
  { name:'Wellington-Dufferin-Guelph Public Health', phone:'1-800-265-7293', type:'Public Health',    address:'Guelph / Wellington County' },
  { name:'Community Support Connections Guelph',    phone:'519-823-2460',   type:'Home Care',        address:'Guelph' },

  // ── BARRIE & SIMCOE COUNTY ────────────────────────────────────────────────
  { name:'Royal Victoria Regional Health Centre',   phone:'705-728-9090',   type:'Hospital',         address:'Barrie' },
  { name:'Alzheimer Society Simcoe County',         phone:'705-722-1066',   type:'Dementia Support', address:'Barrie' },
  { name:'CMHA Simcoe County',                      phone:'705-726-5033',   type:'Mental Health',    address:'Barrie' },
  { name:'Home and Community Care — Barrie',        phone:'705-727-0022',   type:'Home Care',        address:'Barrie / Simcoe County' },
  { name:'Hospice Simcoe',                          phone:'705-722-5995',   type:'Palliative Care',  address:'Barrie' },
  { name:'Georgian Bay General Hospital',           phone:'705-526-1300',   type:'Hospital',         address:'Midland' },
  { name:'Orillia Soldiers Memorial Hospital',      phone:'705-325-2201',   type:'Hospital',         address:'Orillia' },

  // ── SUDBURY & NORTHERN ONTARIO ────────────────────────────────────────────
  { name:'Health Sciences North Sudbury',           phone:'705-523-7100',   type:'Hospital',         address:'Sudbury' },
  { name:'Alzheimer Society Sudbury-Manitoulin',    phone:'705-560-2522',   type:'Dementia Support', address:'Sudbury' },
  { name:'CMHA Sudbury-Manitoulin',                 phone:'705-675-7252',   type:'Mental Health',    address:'Sudbury' },
  { name:'VON Canada — Sudbury',                    phone:'705-525-1070',   type:'Home Care',        address:'Sudbury' },
  { name:'Sudbury & District Health Unit',          phone:'705-522-9200',   type:'Public Health',    address:'Sudbury' },
  { name:'North Bay Regional Health Centre',        phone:'705-474-8600',   type:'Hospital',         address:'North Bay' },
  { name:'Alzheimer Society North Bay',             phone:'705-476-1916',   type:'Dementia Support', address:'North Bay' },
  { name:'CMHA North Bay',                          phone:'705-474-1299',   type:'Mental Health',    address:'North Bay' },
  { name:'Sault Area Hospital',                     phone:'705-759-3434',   type:'Hospital',         address:'Sault Ste. Marie' },
  { name:'Alzheimer Society Sault Ste. Marie',      phone:'705-942-2195',   type:'Dementia Support', address:'Sault Ste. Marie' },
  { name:'CMHA Sault Ste. Marie',                   phone:'705-759-0458',   type:'Mental Health',    address:'Sault Ste. Marie' },
  { name:'Timmins & District Hospital',             phone:'705-267-2131',   type:'Hospital',         address:'Timmins' },
  { name:'Alzheimer Society Timmins',               phone:'705-267-6400',   type:'Dementia Support', address:'Timmins' },
  { name:'Cochrane District Social Services',       phone:'705-272-5446',   type:'Social Services',  address:'Timmins / Cochrane District' },
  { name:'Kirkland & District Hospital',            phone:'705-567-5251',   type:'Hospital',         address:'Kirkland Lake' },
  { name:'Temiskaming Hospital',                    phone:'705-647-8121',   type:'Hospital',         address:'New Liskeard' },
  { name:'Manitoulin Health Centre',                phone:'705-368-2300',   type:'Hospital',         address:'Little Current — Manitoulin Island' },
  { name:'Noojmowin Teg Health Centre',             phone:'705-368-0083',   type:'Indigenous Health',address:'Manitoulin Island' },

  // ── THUNDER BAY & NORTHWESTERN ONTARIO ───────────────────────────────────
  { name:'Thunder Bay Regional Health Sciences',    phone:'807-684-6000',   type:'Hospital',         address:'Thunder Bay' },
  { name:'Alzheimer Society Thunder Bay',           phone:'807-345-9556',   type:'Dementia Support', address:'Thunder Bay' },
  { name:'CMHA Thunder Bay',                        phone:'807-345-5564',   type:'Mental Health',    address:'Thunder Bay' },
  { name:'VON Canada — Thunder Bay',                phone:'807-344-7598',   type:'Home Care',        address:'Thunder Bay' },
  { name:'Thunder Bay District Health Unit',        phone:'807-625-5900',   type:'Public Health',    address:'Thunder Bay' },
  { name:'Lakehead Psychiatric Hospital',           phone:'807-343-4300',   type:'Mental Health',    address:'Thunder Bay' },
  { name:'Dryden Regional Health Centre',           phone:'807-223-8200',   type:'Hospital',         address:'Dryden' },
  { name:'Lake of the Woods District Hospital',     phone:'807-468-9861',   type:'Hospital',         address:'Kenora' },
  { name:'Alzheimer Society Northwestern Ontario',  phone:'807-345-9556',   type:'Dementia Support', address:'Northwestern Ontario' },
  { name:'Sioux Lookout Meno Ya Win Health Centre', phone:'807-737-3030',   type:'Hospital',         address:'Sioux Lookout' },
  { name:'Waubetek Business Development',           phone:'705-368-2024',   type:'Indigenous Support',address:'Northwestern Ontario — Indigenous' },

  // ── KINGSTON & EASTERN ONTARIO ────────────────────────────────────────────
  { name:'Kingston Health Sciences Centre',         phone:'613-548-3232',   type:'Hospital',         address:'Kingston' },
  { name:'Alzheimer Society Kingston',              phone:'613-544-3078',   type:'Dementia Support', address:'Kingston' },
  { name:'CMHA Kingston',                           phone:'613-549-7027',   type:'Mental Health',    address:'Kingston' },
  { name:'Frontenac Community Mental Health',       phone:'613-544-1356',   type:'Mental Health',    address:'Kingston' },
  { name:'Belleville General Hospital',             phone:'613-969-7400',   type:'Hospital',         address:'Belleville' },
  { name:'Alzheimer Society Hastings-Prince Edward',phone:'613-962-0892',   type:'Dementia Support', address:'Belleville' },
  { name:'Peterborough Regional Health Centre',     phone:'705-743-2121',   type:'Hospital',         address:'Peterborough' },
  { name:'Alzheimer Society Peterborough',          phone:'705-748-5131',   type:'Dementia Support', address:'Peterborough' },
  { name:'CMHA Haliburton Kawartha Pine Ridge',     phone:'705-748-6711',   type:'Mental Health',    address:'Peterborough' },
  { name:'Brockville General Hospital',             phone:'613-345-5645',   type:'Hospital',         address:'Brockville' },
  { name:'Cornwall Community Hospital',             phone:'613-938-4240',   type:'Hospital',         address:'Cornwall' },
  { name:'Alzheimer Society Cornwall & District',   phone:'613-932-4914',   type:'Dementia Support', address:'Cornwall' },

  // ── COTTAGE COUNTRY & RURAL ───────────────────────────────────────────────
  { name:'Muskoka Algonquin Healthcare',            phone:'705-789-2311',   type:'Hospital',         address:'Huntsville / Bracebridge' },
  { name:'Alzheimer Society Muskoka',               phone:'705-645-5621',   type:'Dementia Support', address:'Muskoka' },
  { name:'Haliburton Highlands Health Services',    phone:'705-457-1392',   type:'Hospital',         address:'Haliburton' },
  { name:'Renfrew Victoria Hospital',               phone:'613-432-4851',   type:'Hospital',         address:'Renfrew — Ottawa Valley' },
  { name:'Pembroke Regional Hospital',              phone:'613-732-2811',   type:'Hospital',         address:'Pembroke' },
  { name:'North Renfrew Family Health Team',        phone:'613-237-8633',   type:'Primary Care',     address:'Deep River / Chalk River' },
  { name:'Grey Bruce Health Services',              phone:'519-376-2121',   type:'Hospital',         address:'Owen Sound / Grey Bruce' },
  { name:'Alzheimer Society Grey-Bruce',            phone:'519-371-1522',   type:'Dementia Support', address:'Owen Sound' },
  { name:'Bruce Peninsula Community Health',        phone:'519-793-3424',   type:'Primary Care',     address:'Lion\'s Head — Bruce Peninsula' },
  { name:'Collingwood General & Marine Hospital',   phone:'705-445-2550',   type:'Hospital',         address:'Collingwood' },
  { name:'South Bruce Grey Health Centre',          phone:'519-364-2340',   type:'Hospital',         address:'Walkerton / Durham' },
  { name:'Prince Edward County Memorial Hospital',  phone:'613-476-1008',   type:'Hospital',         address:'Picton — Prince Edward County' },

  // ── INDIGENOUS & FRANCOPHONE SERVICES ────────────────────────────────────
  { name:'Indigenous Health Line Ontario',          phone:'1-800-567-4514', type:'Indigenous Health', address:'Province-wide' },
  { name:'Shkagamik-Kwe Health Centre',             phone:'705-675-1596',   type:'Indigenous Health', address:'Sudbury' },
  { name:'Anishnawbe Health Toronto',               phone:'416-920-2605',   type:'Indigenous Health', address:'Toronto' },
  { name:'Tungasuvvingat Inuit',                    phone:'613-565-5885',   type:'Indigenous Health', address:'Ottawa' },
  { name:'Réseau francophone santé Ontario',        phone:'1-877-770-0000', type:'Francophone Health',address:'Province-wide' },
  { name:'Hôpital Montfort',                        phone:'613-746-4621',   type:'Hospital',          address:'Ottawa — French language' },
  { name:'Horizon Santé-Nord',                      phone:'705-523-4114',   type:'Francophone Health',address:'Sudbury — French language' },
];

export function LocalResources() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const types = ['All', 'Caregiver Support', 'Home Care / PSW', 'Hospital', 'Dementia Support',
    'Mental Health', 'Crisis Support', 'Seniors Support', 'Financial Aid', 'Indigenous Health',
    'Palliative Care', 'Long-Term Care', 'Legal Help'];

  const filtered = RESOURCES.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Search */}
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="Search by city, type, or name — e.g. Sudbury, palliative, VON…"
        style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(124,184,138,0.22)', borderRadius:10, padding:'9px 14px', color:'#dde8de', fontSize:14, outline:'none', marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}/>

      {/* Filter chips */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
        {types.map(t => (
          <button key={t} onClick={()=>setFilter(t)} style={{
            background: filter===t ? 'rgba(61,107,79,0.5)' : 'rgba(255,255,255,0.04)',
            border:`1px solid ${filter===t ? 'rgba(124,184,138,0.6)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius:20, padding:'4px 12px', color: filter===t ? '#c8dcc9' : '#5a7a60',
            fontSize:11, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
          }}>{t}</button>
        ))}
      </div>

      {/* Result count */}
      <p style={{ fontSize:11, color:'#4a6a4f', marginBottom:10 }}>
        {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <p style={{ color:'#4a6a4f', fontStyle:'italic', fontSize:14, textAlign:'center', padding:'24px 0' }}>
          No results found. Try searching for your city or a different type.
        </p>
      ) : (
        filtered.map((r,i) => (
          <div key={i} style={{ padding:'13px 15px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(124,184,138,0.09)', borderRadius:12, marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
              <div>
                <div style={{ fontSize:14, color:'#dde8de', marginBottom:3, fontWeight:500 }}>{r.name}</div>
                <div style={{ fontSize:12, color:'#5a7a60' }}>{r.address}</div>
              </div>
              <span style={{ fontSize:10, background:'rgba(124,184,138,0.11)', color:'#7cb88a', padding:'3px 10px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, letterSpacing:'0.04em' }}>{r.type}</span>
            </div>
            <a href={`tel:${r.phone}`} style={{ display:'inline-block', marginTop:8, fontSize:13, color:'#7cb88a', textDecoration:'none' }}>
              📞 {r.phone}
            </a>
          </div>
        ))
      )}
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
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:40, color:'#fff', fontWeight:700 }}>$4.99</span>
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
