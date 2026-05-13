import { useState, useEffect } from 'react'
import { generateTemplates, saveTemplate } from '../api'

const TAG_CLS = { Modern:'tmod',Minimal:'tmin',Bold:'tbld',Elegant:'telg',Playful:'tply',Corporate:'tcor' }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;800&family=Space+Mono:wght@400;700&display=swap');
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.shimmer{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 75%);background-size:600px 100%;animation:shimmer 1.6s infinite;}
.tcard{cursor:pointer;transition:all .35s cubic-bezier(.4,0,.2,1);border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);}
.tcard:hover{transform:translateY(-6px) scale(1.015);box-shadow:0 24px 60px rgba(0,0,0,.4);}
.fu{animation:fadeUp .5s ease both;}
.sbadge{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:20px;}
.tmod{background:rgba(59,130,246,.2);color:#93c5fd;border:1px solid rgba(59,130,246,.25);}
.tmin{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.12);}
.tbld{background:rgba(236,72,153,.2);color:#f9a8d4;border:1px solid rgba(236,72,153,.25);}
.telg{background:rgba(201,169,110,.2);color:#fde68a;border:1px solid rgba(201,169,110,.25);}
.tply{background:rgba(34,211,238,.2);color:#67e8f9;border:1px solid rgba(34,211,238,.25);}
.tcor{background:rgba(3,105,161,.2);color:#7dd3fc;border:1px solid rgba(3,105,161,.25);}
.llayout{font-size:9px;font-weight:600;padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.08);text-transform:uppercase;letter-spacing:.05em;}
.scr::-webkit-scrollbar{width:3px;}
.scr::-webkit-scrollbar-thumb{background:rgba(124,58,237,.4);border-radius:2px;}
.sfinput{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:inherit;font-size:15px;transition:border .2s;outline:none;width:100%;}
.sfinput:focus{border-color:rgba(124,58,237,.6);box-shadow:0 0 0 3px rgba(124,58,237,.1);}
.sfinput::placeholder{color:rgba(255,255,255,.3);}
`

// ── 5 distinct mini preview layouts ──────────────────
function SplitPreview({ t }) {
  const [c1, c2] = t.colors || ['#7c3aed','#4f46e5']
  return (
    <div style={{ width:'100%',height:'100%',background:'#08090f',display:'flex',flexDirection:'column' }}>
      <div style={{ padding:'6px 10px',display:'flex',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,.05)',background:'rgba(255,255,255,.03)' }}>
        <span style={{ fontSize:8,fontWeight:700,background:`linear-gradient(90deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{t.nav?.brand||t.title}</span>
        <div style={{ flex:1 }}/>
        {(t.nav?.links||[]).slice(0,3).map(l=><span key={l} style={{ fontSize:7,color:'rgba(255,255,255,.3)',marginLeft:8 }}>{l}</span>)}
        <div style={{ marginLeft:8,padding:'2px 7px',borderRadius:4,background:`linear-gradient(135deg,${c1},${c2})`,fontSize:7,color:'#fff' }}>{t.hero?.primaryCTA}</div>
      </div>
      <div style={{ flex:1,display:'flex' }}>
        <div style={{ flex:1,padding:'16px 12px',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <div style={{ fontSize:7,color:c1,marginBottom:5,background:`${c1}15`,display:'inline-block',padding:'2px 6px',borderRadius:8 }}>{t.hero?.badge}</div>
          <div style={{ fontSize:11,fontWeight:800,lineHeight:1.2,marginBottom:6,letterSpacing:'-0.02em' }}>{t.hero?.headline}</div>
          <div style={{ fontSize:7,color:'rgba(255,255,255,.4)',lineHeight:1.4,marginBottom:8 }}>{t.hero?.subheadline}</div>
          <div style={{ display:'flex',gap:5 }}>
            <div style={{ padding:'3px 9px',borderRadius:4,background:`linear-gradient(135deg,${c1},${c2})`,fontSize:7,color:'#fff',fontWeight:600 }}>{t.hero?.primaryCTA}</div>
            <div style={{ padding:'3px 7px',borderRadius:4,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',fontSize:7,color:'rgba(255,255,255,.6)' }}>{t.hero?.secondaryCTA}</div>
          </div>
        </div>
        <div style={{ width:90,background:`linear-gradient(160deg,${c1}25,${c2}15)`,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:6,padding:8,borderLeft:'1px solid rgba(255,255,255,.05)' }}>
          {[t.hero?.metric1,t.hero?.metric2,t.hero?.metric3].filter(Boolean).map((m,i)=>(
            <div key={i} style={{ textAlign:'center',padding:'5px 8px',borderRadius:6,background:'rgba(255,255,255,.05)',width:'100%' }}>
              <div style={{ fontSize:11,fontWeight:700,color:c1 }}>{m.value}</div>
              <div style={{ fontSize:6,color:'rgba(255,255,255,.4)',marginTop:1 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CenteredPreview({ t }) {
  const [c1, c2] = t.colors || ['#7c3aed','#4f46e5']
  return (
    <div style={{ width:'100%',height:'100%',background:'#fafafa',display:'flex',flexDirection:'column' }}>
      <div style={{ padding:'6px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(0,0,0,.06)' }}>
        <span style={{ fontSize:8,fontWeight:700,color:'#111' }}>{t.nav?.brand||t.title}</span>
        <div style={{ display:'flex',gap:10 }}>{(t.nav?.links||[]).slice(0,3).map(l=><span key={l} style={{ fontSize:7,color:'#555' }}>{l}</span>)}</div>
      </div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'10px 16px',textAlign:'center' }}>
        <div style={{ fontSize:7,color:c1,marginBottom:6,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600 }}>{t.hero?.badge}</div>
        <div style={{ fontSize:14,fontWeight:800,lineHeight:1.1,marginBottom:6,color:'#111',letterSpacing:'-0.03em',fontFamily:'serif' }}>{t.hero?.headline}</div>
        <div style={{ width:32,height:2,background:`linear-gradient(90deg,${c1},${c2})`,borderRadius:2,marginBottom:6 }}/>
        <div style={{ fontSize:7,color:'#666',lineHeight:1.5,marginBottom:10,maxWidth:140 }}>{t.hero?.subheadline}</div>
        <div style={{ padding:'5px 14px',borderRadius:100,background:`linear-gradient(135deg,${c1},${c2})`,fontSize:7,color:'#fff',fontWeight:600 }}>{t.hero?.primaryCTA}</div>
      </div>
    </div>
  )
}

function BoldPreview({ t }) {
  const [c1, c2] = t.colors || ['#ec4899','#f97316']
  return (
    <div style={{ width:'100%',height:'100%',background:'#050505',display:'flex',flexDirection:'column',overflow:'hidden' }}>
      <div style={{ padding:'6px 10px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <span style={{ fontSize:8,fontWeight:700,color:'#fff',letterSpacing:'-.01em' }}>{t.nav?.brand||t.title}</span>
        <div style={{ padding:'2px 8px',borderRadius:3,background:`linear-gradient(135deg,${c1},${c2})`,fontSize:7,color:'#fff',fontWeight:700 }}>{t.hero?.primaryCTA}</div>
      </div>
      <div style={{ flex:1,position:'relative',overflow:'hidden',padding:'10px 10px 8px' }}>
        <div style={{ position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:`radial-gradient(circle,${c1}40,transparent)`,filter:'blur(20px)' }}/>
        <div style={{ fontSize:6,color:c1,marginBottom:4,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase' }}>{t.hero?.badge}</div>
        <div style={{ fontSize:16,fontWeight:800,lineHeight:1.0,marginBottom:6,letterSpacing:'-0.04em',textTransform:'uppercase' }}>
          <span style={{ color:'#fff' }}>{(t.hero?.headline||'').split(' ').slice(0,3).join(' ')}</span>{' '}
          <span style={{ background:`linear-gradient(135deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{(t.hero?.headline||'').split(' ').slice(3).join(' ')}</span>
        </div>
        <div style={{ display:'flex',gap:4,marginBottom:8 }}>
          {(t.features||[]).slice(0,3).map((f,i)=>(
            <div key={i} style={{ flex:1,padding:'4px 5px',borderRadius:4,background:'rgba(255,255,255,.04)',border:`1px solid ${c1}25` }}>
              <div style={{ fontSize:10,marginBottom:2 }}>{f.icon}</div>
              <div style={{ fontSize:7,fontWeight:600,color:'rgba(255,255,255,.8)' }}>{f.title}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'4px 10px',borderRadius:4,background:`linear-gradient(135deg,${c1},${c2})`,fontSize:7,color:'#fff',fontWeight:700,display:'inline-block' }}>{t.hero?.primaryCTA} →</div>
      </div>
    </div>
  )
}

function MagazinePreview({ t }) {
  const [c1, c2] = t.colors || ['#c9a96e','#e8d5b7']
  const isDark = true
  return (
    <div style={{ width:'100%',height:'100%',background:isDark?'#0d0d0d':'#fff',display:'flex',flexDirection:'column' }}>
      <div style={{ padding:'6px 10px',display:'flex',alignItems:'center',borderBottom:`1px solid ${c1}30` }}>
        <span style={{ fontSize:8,fontWeight:700,fontFamily:'serif',color:c1 }}>{t.nav?.brand||t.title}</span>
        <div style={{ flex:1,textAlign:'center' }}>
          <div style={{ width:60,height:1,background:`linear-gradient(90deg,transparent,${c1},transparent)`,margin:'0 auto' }}/>
        </div>
        <div style={{ fontSize:7,color:'rgba(255,255,255,.4)' }}>{t.hero?.primaryCTA}</div>
      </div>
      <div style={{ flex:1,display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:0 }}>
        <div style={{ padding:'10px 10px 8px',borderRight:`1px solid rgba(255,255,255,.06)`,display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <div style={{ fontSize:6,color:c1,letterSpacing:'.12em',textTransform:'uppercase',marginBottom:5,fontWeight:600 }}>{t.hero?.badge}</div>
          <div style={{ fontSize:12,fontWeight:700,lineHeight:1.15,marginBottom:5,fontFamily:'serif',color:'#fff' }}>{t.hero?.headline}</div>
          <div style={{ fontSize:7,color:'rgba(255,255,255,.4)',lineHeight:1.5,marginBottom:8 }}>{(t.hero?.subheadline||'').slice(0,60)}...</div>
          <div style={{ display:'flex',alignItems:'center',gap:6 }}>
            <div style={{ width:16,height:16,borderRadius:'50%',background:`linear-gradient(135deg,${c1},${c2})` }}/>
            <span style={{ fontSize:7,color:'rgba(255,255,255,.5)' }}>By {t.nav?.brand}</span>
          </div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
          {(t.features||[]).slice(0,3).map((f,i)=>(
            <div key={i} style={{ flex:1,padding:'7px 8px',borderBottom:'1px solid rgba(255,255,255,.04)',display:'flex',alignItems:'center',gap:6 }}>
              <div style={{ width:20,height:20,borderRadius:4,background:`${c1}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:7,fontWeight:600,color:'rgba(255,255,255,.8)',marginBottom:1 }}>{f.title}</div>
                <div style={{ fontSize:6,color:'rgba(255,255,255,.35)' }}>{(f.description||'').slice(0,35)}...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SidebarPreview({ t }) {
  const [c1, c2] = t.colors || ['#0369a1','#0284c7']
  return (
    <div style={{ width:'100%',height:'100%',background:'#0a0a12',display:'flex' }}>
      <div style={{ width:55,background:'rgba(255,255,255,.03)',borderRight:'1px solid rgba(255,255,255,.06)',padding:'8px 0',display:'flex',flexDirection:'column',gap:1 }}>
        <div style={{ padding:'5px 8px',marginBottom:4 }}>
          <div style={{ width:22,height:22,borderRadius:6,background:`linear-gradient(135deg,${c1},${c2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10 }}>⚡</div>
        </div>
        {(t.nav?.links||[]).map((l,i)=>(
          <div key={i} style={{ padding:'5px 8px',borderRadius:4,margin:'0 4px',background:i===0?`${c1}20`:'transparent',borderLeft:i===0?`2px solid ${c1}`:'2px solid transparent' }}>
            <div style={{ fontSize:7,color:i===0?c1:'rgba(255,255,255,.35)',fontWeight:i===0?600:400 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1,display:'flex',flexDirection:'column' }}>
        <div style={{ padding:'7px 10px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontSize:8,fontWeight:600,color:'rgba(255,255,255,.7)' }}>{t.hero?.headline}</span>
          <div style={{ padding:'2px 8px',borderRadius:4,background:`linear-gradient(135deg,${c1},${c2})`,fontSize:6,color:'#fff',fontWeight:600 }}>{t.hero?.primaryCTA}</div>
        </div>
        <div style={{ flex:1,padding:'8px 10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:5 }}>
          {(t.hero?.metric1?[t.hero.metric1,t.hero.metric2,t.hero.metric3].filter(Boolean):[]).map((m,i)=>(
            <div key={i} style={{ padding:'7px 8px',borderRadius:6,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:12,fontWeight:700,color:c1 }}>{m.value}</div>
              <div style={{ fontSize:6,color:'rgba(255,255,255,.4)',marginTop:1 }}>{m.label}</div>
            </div>
          ))}
          <div style={{ padding:'7px 8px',borderRadius:6,background:`${c1}15`,border:`1px solid ${c1}30`,gridColumn:'span 1' }}>
            <div style={{ fontSize:7,color:c1,fontWeight:600,marginBottom:3 }}>{t.hero?.badge}</div>
            <div style={{ fontSize:6,color:'rgba(255,255,255,.5)',lineHeight:1.4 }}>{(t.hero?.subheadline||'').slice(0,45)}...</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PREVIEW_MAP = { split:SplitPreview, centered:CenteredPreview, bold:BoldPreview, magazine:MagazinePreview, sidebar:SidebarPreview }
const LAYOUT_LABELS = { split:'Split Hero', centered:'Centered', bold:'Bold & Dark', magazine:'Magazine', sidebar:'Dashboard' }

function TemplateCard({ t, onPreview, onSave, saved }) {
  const [c1, c2] = t.colors || ['#7c3aed','#4f46e5']
  const PreviewComp = PREVIEW_MAP[t.layout] || SplitPreview
  return (
    <div className="tcard fu" style={{ borderRadius:16,overflow:'hidden' }} onClick={() => onPreview(t)}>
      <div style={{ height:200,position:'relative',overflow:'hidden' }}>
        <PreviewComp t={t} />
        <div style={{ position:'absolute',top:8,right:8,display:'flex',gap:4,alignItems:'center' }}>
          <span className={`sbadge ${TAG_CLS[t.styleTag]||'tmod'}`}>{t.styleTag}</span>
        </div>
        <div style={{ position:'absolute',bottom:8,left:8 }}>
          <span className="llayout">{LAYOUT_LABELS[t.layout]||t.layout}</span>
        </div>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 60%,rgba(0,0,0,.6))',pointerEvents:'none' }}/>
      </div>
      <div style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4 }}>
          <h3 style={{ fontFamily:'Sora,sans-serif',fontSize:13,fontWeight:700 }}>{t.title}</h3>
          <span style={{ fontSize:10,color:'rgba(255,255,255,.3)',background:'rgba(255,255,255,.05)',padding:'2px 7px',borderRadius:100 }}>{t.industry}</span>
        </div>
        <p style={{ fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.5,marginBottom:11 }}>{t.footer?.tagline}</p>
        <div style={{ display:'flex',gap:7 }}>
          <button onClick={e=>{e.stopPropagation();onPreview(t)}} style={{ flex:1,padding:'8px',borderRadius:9,fontSize:12,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)',cursor:'pointer',fontFamily:'inherit' }}>Preview</button>
          <button onClick={e=>{e.stopPropagation();onSave(t)}} style={{ flex:1,padding:'8px',borderRadius:9,fontSize:12,background:saved?'rgba(16,185,129,.2)':`linear-gradient(135deg,${c1},${c2})`,border:saved?'1px solid rgba(16,185,129,.4)':'none',color:saved?'#6ee7b7':'#fff',cursor:'pointer',fontFamily:'inherit',fontWeight:500 }}>
            {saved?'✓ Saved':'Use'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Generator({ initialPrompt, onPreview, onBack, user, onAuthClick }) {
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState({})

  useEffect(() => { if (initialPrompt) run(initialPrompt) }, [])

  const run = async (p = prompt) => {
    if (!p.trim()) return
    setLoading(true); setError(null); setTemplates([])
    try {
      const { data } = await generateTemplates(p)
      setTemplates(data.templates)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed — please try again.')
    } finally { setLoading(false) }
  }

  const handleSave = async (t) => {
    if (!user) { onAuthClick(); return }
    try { await saveTemplate(t); setSaved(s => ({ ...s, [t.id]: true })) } catch {}
  }

  return (
    <div style={{ height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden' }}>
      <style>{CSS}</style>
      <div style={{ display:'flex',alignItems:'center',gap:14,padding:'12px 22px',background:'rgba(255,255,255,0.04)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onBack} style={{ padding:'7px 14px',borderRadius:9,fontSize:13,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)',cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:5 }}>← Back</button>
        <span style={{ fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700 }}>SiteForge</span>
        <div style={{ flex:1 }}/>
        {user ? <span style={{ fontSize:13,color:'rgba(255,255,255,.4)' }}>👋 {user.name}</span>
          : <button onClick={onAuthClick} style={{ padding:'7px 16px',borderRadius:9,fontSize:13,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',color:'#fff',cursor:'pointer',fontFamily:'inherit',fontWeight:600 }}>Sign In</button>}
      </div>

      <div style={{ flex:1,display:'flex',overflow:'hidden' }}>
        <div className="scr" style={{ width:290,padding:20,display:'flex',flexDirection:'column',gap:16,overflowY:'auto',background:'rgba(255,255,255,.02)',borderRight:'1px solid rgba(255,255,255,.06)' }}>
          <div>
            <h2 style={{ fontFamily:'Sora,sans-serif',fontSize:17,fontWeight:700,marginBottom:4 }}>Your Idea</h2>
            <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.55 }}>AI generates 5 completely different layouts — split, centered, bold, magazine, and dashboard styles.</p>
          </div>
          <textarea className="sfinput" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. A luxury jewelry e-commerce store..." rows={5} style={{ padding:12,borderRadius:10,resize:'none',lineHeight:1.6 }}/>
          <div>
            <div style={{ fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:8 }}>Quick Examples</div>
            {['Portfolio for a creative UX designer','SaaS tool for remote team collaboration','Luxury e-commerce for handmade jewelry','Tech startup landing page for an AI tool','Blog for a travel photographer'].map(ex=>(
              <button key={ex} onClick={()=>setPrompt(ex)} style={{ display:'block',width:'100%',padding:'9px 12px',borderRadius:9,fontSize:12,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',color:'rgba(255,255,255,.5)',cursor:'pointer',textAlign:'left',fontFamily:'inherit',marginBottom:5 }}>{ex}</button>
            ))}
          </div>
          <button onClick={()=>run()} disabled={loading} style={{ padding:14,borderRadius:12,fontSize:15,background:'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)',border:'none',color:'#fff',fontWeight:600,cursor:'pointer',fontFamily:'inherit',marginTop:'auto',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:loading?.6:1 }}>
            {loading?<><div style={{ width:15,height:15,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }}/>Generating…</>:'✦ Generate Templates'}
          </button>
        </div>

        <div className="scr" style={{ flex:1,padding:20,overflowY:'auto' }}>
          {error && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',borderRadius:12,padding:14,color:'#fca5a5',fontSize:14,marginBottom:16 }}>{error}</div>}
          {!loading&&!templates.length&&!error&&(
            <div style={{ height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,color:'rgba(255,255,255,.2)' }}>
              <div style={{ width:56,height:56,borderRadius:16,background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>✦</div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:15,fontWeight:600,color:'rgba(255,255,255,.25)',marginBottom:5 }}>5 unique layouts await</div>
                <div style={{ fontSize:13 }}>Split · Centered · Bold · Magazine · Dashboard</div>
              </div>
            </div>
          )}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18 }}>
            {loading
              ? Array(5).fill(0).map((_,i)=><div key={i} className="shimmer" style={{ height:330,borderRadius:16 }}/>)
              : templates.map((t,i)=>(
                <div key={t.id} style={{ animationDelay:`${i*.08}s` }}>
                  <TemplateCard t={t} onPreview={onPreview} onSave={handleSave} saved={!!saved[t.id]}/>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
