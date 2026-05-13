const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.pv{animation:fadeIn .4s ease;}
`

const FONT_MAP = {
  sora: 'Sora, sans-serif',
  inter: 'DM Sans, sans-serif',
  playfair: 'Playfair Display, serif',
  mono: 'Space Mono, monospace',
  clash: 'Sora, sans-serif',
}

// ── Layout: Split ─────────────────────────────────────
function SplitLayout({ t, c1, c2, font }) {
  return (
    <div style={{ background:'#08090f',minHeight:'100%' }}>
      {/* Nav */}
      <div style={{ padding:'18px 48px',display:'flex',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,.06)',background:'rgba(255,255,255,.02)' }}>
        <span style={{ fontFamily:font,fontSize:18,fontWeight:700,background:`linear-gradient(90deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{t.nav?.brand}</span>
        <div style={{ flex:1,display:'flex',gap:28,justifyContent:'center' }}>
          {(t.nav?.links||[]).map(l=><span key={l} style={{ fontSize:14,color:'rgba(255,255,255,.5)',fontFamily:'DM Sans,sans-serif',cursor:'pointer' }}>{l}</span>)}
        </div>
        <button style={{ padding:'9px 22px',borderRadius:9,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
      </div>
      {/* Split Hero */}
      <div style={{ display:'flex',minHeight:480,borderBottom:'1px solid rgba(255,255,255,.05)' }}>
        <div style={{ flex:1,padding:'60px 48px',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <div style={{ display:'inline-flex',padding:'5px 14px',borderRadius:100,background:`${c1}15`,border:`1px solid ${c1}30`,fontSize:13,color:c1,marginBottom:22,fontFamily:'DM Sans,sans-serif',alignSelf:'flex-start' }}>{t.hero?.badge}</div>
          <h1 style={{ fontFamily:font,fontSize:52,fontWeight:800,letterSpacing:'-0.04em',lineHeight:1.05,marginBottom:18,maxWidth:500 }}>{t.hero?.headline}</h1>
          <p style={{ fontSize:16,color:'rgba(255,255,255,.5)',lineHeight:1.7,marginBottom:32,maxWidth:420,fontFamily:'DM Sans,sans-serif' }}>{t.hero?.subheadline}</p>
          <div style={{ display:'flex',gap:14 }}>
            <button style={{ padding:'13px 30px',borderRadius:11,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
            <button style={{ padding:'13px 26px',borderRadius:11,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',fontSize:15,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.secondaryCTA}</button>
          </div>
        </div>
        <div style={{ width:340,background:`linear-gradient(160deg,${c1}20,${c2}12,transparent)`,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:14,padding:32,borderLeft:'1px solid rgba(255,255,255,.05)' }}>
          {[t.hero?.metric1,t.hero?.metric2,t.hero?.metric3].filter(Boolean).map((m,i)=>(
            <div key={i} style={{ width:'100%',padding:'20px 24px',borderRadius:14,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',textAlign:'center' }}>
              <div style={{ fontFamily:font,fontSize:36,fontWeight:700,background:`linear-gradient(135deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{m.value}</div>
              <div style={{ fontSize:13,color:'rgba(255,255,255,.45)',marginTop:5,fontFamily:'DM Sans,sans-serif' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Features t={t} c1={c1} c2={c2} font={font}/>
      <CTA t={t} c1={c1} c2={c2} font={font}/>
      <Footer t={t} c1={c1} c2={c2}/>
    </div>
  )
}

// ── Layout: Centered ──────────────────────────────────
function CenteredLayout({ t, c1, c2, font }) {
  return (
    <div style={{ background:'#f8f8f6',minHeight:'100%',color:'#111' }}>
      <div style={{ padding:'18px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(0,0,0,.08)' }}>
        <span style={{ fontFamily:font,fontSize:18,fontWeight:700,color:'#111' }}>{t.nav?.brand}</span>
        <div style={{ display:'flex',gap:28 }}>{(t.nav?.links||[]).map(l=><span key={l} style={{ fontSize:14,color:'#555',cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{l}</span>)}</div>
        <button style={{ padding:'9px 20px',borderRadius:100,background:'#111',color:'#fff',border:'none',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
      </div>
      <div style={{ padding:'100px 48px',textAlign:'center',borderBottom:'1px solid rgba(0,0,0,.08)' }}>
        <div style={{ fontSize:12,color:c1,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,marginBottom:20,fontFamily:'DM Sans,sans-serif' }}>{t.hero?.badge}</div>
        <h1 style={{ fontFamily:font,fontSize:72,fontWeight:800,letterSpacing:'-0.05em',lineHeight:1.0,marginBottom:8,color:'#111',maxWidth:800,margin:'0 auto 16px' }}>{t.hero?.headline}</h1>
        <div style={{ width:60,height:3,background:`linear-gradient(90deg,${c1},${c2})`,borderRadius:3,margin:'0 auto 28px' }}/>
        <p style={{ fontSize:18,color:'#555',lineHeight:1.7,maxWidth:520,margin:'0 auto 40px',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.subheadline}</p>
        <div style={{ display:'flex',gap:14,justifyContent:'center' }}>
          <button style={{ padding:'14px 36px',borderRadius:100,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
          <button style={{ padding:'14px 30px',borderRadius:100,background:'transparent',border:'2px solid #ddd',color:'#555',fontSize:15,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.secondaryCTA}</button>
        </div>
      </div>
      <div style={{ padding:'70px 48px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,borderBottom:'1px solid rgba(0,0,0,.08)' }}>
        {[t.hero?.metric1,t.hero?.metric2,t.hero?.metric3].filter(Boolean).map((m,i)=>(
          <div key={i} style={{ textAlign:'center',padding:'30px 20px',borderRight:'1px solid rgba(0,0,0,.06)' }}>
            <div style={{ fontFamily:font,fontSize:42,fontWeight:700,color:c1 }}>{m.value}</div>
            <div style={{ fontSize:14,color:'#888',marginTop:6,fontFamily:'DM Sans,sans-serif' }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'70px 48px',borderBottom:'1px solid rgba(0,0,0,.08)' }}>
        <h2 style={{ fontFamily:font,fontSize:38,fontWeight:700,textAlign:'center',marginBottom:48,color:'#111',letterSpacing:'-0.03em' }}>Everything you need</h2>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24 }}>
          {(t.features||[]).map((f,i)=>(
            <div key={i} style={{ display:'flex',gap:16,padding:24,borderRadius:12,background:'#fff',border:'1px solid rgba(0,0,0,.08)' }}>
              <div style={{ width:44,height:44,borderRadius:12,background:`${c1}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontFamily:font,fontSize:16,fontWeight:600,marginBottom:6,color:'#111' }}>{f.title}</h3>
                <p style={{ fontSize:14,color:'#777',lineHeight:1.6,fontFamily:'DM Sans,sans-serif' }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'80px 48px',textAlign:'center',background:'#111',color:'#fff' }}>
        <h2 style={{ fontFamily:font,fontSize:44,fontWeight:700,letterSpacing:'-0.03em',marginBottom:14 }}>{t.cta?.headline}</h2>
        <p style={{ fontSize:16,color:'rgba(255,255,255,.5)',marginBottom:32,fontFamily:'DM Sans,sans-serif' }}>{t.cta?.subtext}</p>
        <button style={{ padding:'15px 40px',borderRadius:100,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.cta?.button}</button>
      </div>
      <div style={{ padding:'24px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#0a0a0a',color:'rgba(255,255,255,.3)' }}>
        <span style={{ fontFamily:font,fontSize:14,fontWeight:700,color:'rgba(255,255,255,.7)' }}>{t.nav?.brand}</span>
        <span style={{ fontSize:13,fontFamily:'DM Sans,sans-serif' }}>{t.footer?.tagline}</span>
        <span style={{ fontSize:12,fontFamily:'DM Sans,sans-serif' }}>© 2026 SiteForge</span>
      </div>
    </div>
  )
}

// ── Layout: Bold ──────────────────────────────────────
function BoldLayout({ t, c1, c2, font }) {
  return (
    <div style={{ background:'#050505',minHeight:'100%' }}>
      <div style={{ padding:'18px 48px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <span style={{ fontFamily:font,fontSize:18,fontWeight:700,color:'#fff',letterSpacing:'-.02em' }}>{t.nav?.brand}</span>
        <div style={{ display:'flex',gap:5 }}>
          {(t.nav?.links||[]).map(l=><span key={l} style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginLeft:22,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{l}</span>)}
        </div>
        <button style={{ padding:'9px 22px',borderRadius:6,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'DM Sans,sans-serif',letterSpacing:'.02em' }}>{t.hero?.primaryCTA}</button>
      </div>
      <div style={{ padding:'80px 48px 60px',position:'relative',overflow:'hidden',borderBottom:`1px solid ${c1}20` }}>
        <div style={{ position:'absolute',top:-100,right:-100,width:500,height:500,borderRadius:'50%',background:`radial-gradient(circle,${c1}25,transparent)`,filter:'blur(60px)',pointerEvents:'none' }}/>
        <div style={{ fontSize:11,color:c1,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,marginBottom:20,fontFamily:'DM Sans,sans-serif',display:'flex',alignItems:'center',gap:8 }}>
          <div style={{ width:20,height:1,background:c1 }}/>{t.hero?.badge}
        </div>
        <h1 style={{ fontFamily:font,fontSize:'clamp(52px,7vw,90px)',fontWeight:800,letterSpacing:'-0.05em',lineHeight:0.95,marginBottom:28,textTransform:'uppercase' }}>
          <span style={{ color:'#fff' }}>{(t.hero?.headline||'').split(' ').slice(0,Math.ceil((t.hero?.headline||'').split(' ').length/2)).join(' ')}</span><br/>
          <span style={{ background:`linear-gradient(135deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{(t.hero?.headline||'').split(' ').slice(Math.ceil((t.hero?.headline||'').split(' ').length/2)).join(' ')}</span>
        </h1>
        <div style={{ display:'flex',gap:24,alignItems:'center',flexWrap:'wrap' }}>
          <button style={{ padding:'14px 32px',borderRadius:6,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'DM Sans,sans-serif',letterSpacing:'.02em' }}>{t.hero?.primaryCTA} →</button>
          <p style={{ fontSize:14,color:'rgba(255,255,255,.4)',lineHeight:1.6,maxWidth:380,fontFamily:'DM Sans,sans-serif' }}>{t.hero?.subheadline}</p>
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',borderBottom:`1px solid ${c1}20` }}>
        {[t.hero?.metric1,t.hero?.metric2,t.hero?.metric3].filter(Boolean).map((m,i)=>(
          <div key={i} style={{ padding:'32px 36px',borderRight:i<2?`1px solid ${c1}20`:'none' }}>
            <div style={{ fontFamily:font,fontSize:46,fontWeight:700,background:`linear-gradient(135deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{m.value}</div>
            <div style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginTop:6,textTransform:'uppercase',letterSpacing:'.06em',fontFamily:'DM Sans,sans-serif' }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'70px 48px',display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:2,borderBottom:`1px solid ${c1}20` }}>
        {(t.features||[]).map((f,i)=>(
          <div key={i} style={{ padding:'32px',borderRight:i%2===0?`1px solid ${c1}20`:'none',borderBottom:i<2?`1px solid ${c1}20`:'none' }}>
            <div style={{ fontSize:28,marginBottom:12 }}>{f.icon}</div>
            <h3 style={{ fontFamily:font,fontSize:18,fontWeight:700,marginBottom:10,letterSpacing:'-0.02em' }}>{f.title}</h3>
            <p style={{ fontSize:14,color:'rgba(255,255,255,.45)',lineHeight:1.65,fontFamily:'DM Sans,sans-serif' }}>{f.description}</p>
          </div>
        ))}
      </div>
      <div style={{ padding:'80px 48px',background:`linear-gradient(135deg,${c1}15,${c2}10)`,borderBottom:`1px solid ${c1}20`,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:24 }}>
        <div>
          <h2 style={{ fontFamily:font,fontSize:46,fontWeight:800,letterSpacing:'-0.04em',marginBottom:10,textTransform:'uppercase' }}>{t.cta?.headline}</h2>
          <p style={{ fontSize:15,color:'rgba(255,255,255,.45)',fontFamily:'DM Sans,sans-serif' }}>{t.cta?.subtext}</p>
        </div>
        <button style={{ padding:'16px 40px',borderRadius:6,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'DM Sans,sans-serif',whiteSpace:'nowrap' }}>{t.cta?.button} →</button>
      </div>
      <div style={{ padding:'24px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid ${c1}15` }}>
        <span style={{ fontFamily:font,fontSize:15,fontWeight:700,color:'rgba(255,255,255,.6)' }}>{t.nav?.brand}</span>
        <span style={{ fontSize:12,color:'rgba(255,255,255,.25)',fontFamily:'DM Sans,sans-serif' }}>{t.footer?.tagline} · © 2026</span>
      </div>
    </div>
  )
}

// ── Layout: Magazine ──────────────────────────────────
function MagazineLayout({ t, c1, c2, font }) {
  return (
    <div style={{ background:'#0d0d0d',minHeight:'100%' }}>
      <div style={{ padding:'16px 48px',display:'flex',alignItems:'center',borderBottom:`1px solid ${c1}30`,justifyContent:'space-between' }}>
        <span style={{ fontFamily:'Playfair Display, serif',fontSize:20,fontWeight:700,color:c1 }}>{t.nav?.brand}</span>
        <div style={{ display:'flex',gap:24 }}>{(t.nav?.links||[]).map(l=><span key={l} style={{ fontSize:13,color:'rgba(255,255,255,.4)',cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{l}</span>)}</div>
        <button style={{ padding:'8px 20px',borderRadius:100,background:'transparent',border:`1px solid ${c1}`,color:c1,fontSize:13,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1.6fr 1fr',borderBottom:`1px solid rgba(255,255,255,.08)`,minHeight:400 }}>
        <div style={{ padding:'52px 48px',borderRight:`1px solid rgba(255,255,255,.06)`,display:'flex',flexDirection:'column',justifyContent:'flex-end' }}>
          <div style={{ flex:1,background:`linear-gradient(160deg,${c1}12,transparent)`,borderRadius:12,marginBottom:28,minHeight:200,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <div style={{ fontFamily:'Playfair Display,serif',fontSize:80,fontWeight:900,color:'rgba(255,255,255,.04)',letterSpacing:'-0.06em',userSelect:'none' }}>{t.industry}</div>
            <div style={{ position:'absolute',bottom:20,left:20,right:20 }}>
              <div style={{ fontSize:10,color:c1,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600,marginBottom:6 }}>{t.hero?.badge}</div>
              <div style={{ fontFamily:'Playfair Display,serif',fontSize:32,fontWeight:700,lineHeight:1.2,color:'#fff' }}>{t.hero?.headline}</div>
            </div>
          </div>
          <p style={{ fontSize:15,color:'rgba(255,255,255,.45)',lineHeight:1.7,marginBottom:24,fontFamily:'DM Sans,sans-serif' }}>{t.hero?.subheadline}</p>
          <div style={{ display:'flex',gap:12,alignItems:'center' }}>
            <button style={{ padding:'11px 26px',borderRadius:100,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
            <span style={{ fontSize:13,color:'rgba(255,255,255,.3)',fontFamily:'DM Sans,sans-serif' }}>→ {t.hero?.secondaryCTA}</span>
          </div>
        </div>
        <div style={{ display:'flex',flexDirection:'column' }}>
          {(t.features||[]).slice(0,3).map((f,i)=>(
            <div key={i} style={{ flex:1,padding:'24px 28px',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',gap:14,alignItems:'center' }}>
              <div style={{ width:40,height:40,borderRadius:10,background:`${c1}20`,border:`1px solid ${c1}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontFamily:'Playfair Display,serif',fontSize:15,fontWeight:600,marginBottom:4,color:'rgba(255,255,255,.9)' }}>{f.title}</h3>
                <p style={{ fontSize:12,color:'rgba(255,255,255,.4)',lineHeight:1.5,fontFamily:'DM Sans,sans-serif' }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'52px 48px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        {[t.hero?.metric1,t.hero?.metric2,t.hero?.metric3].filter(Boolean).map((m,i)=>(
          <div key={i} style={{ padding:'28px',borderRight:i<2?'1px solid rgba(255,255,255,.06)':'none',textAlign:'center' }}>
            <div style={{ fontFamily:'Playfair Display,serif',fontSize:38,fontWeight:700,color:c1 }}>{m.value}</div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,.4)',marginTop:6,fontFamily:'DM Sans,sans-serif' }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'52px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,.06)',flexWrap:'wrap',gap:20 }}>
        <div>
          <div style={{ fontSize:10,color:c1,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600,marginBottom:10 }}>Next Chapter</div>
          <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:38,fontWeight:700,letterSpacing:'-0.02em',maxWidth:500 }}>{t.cta?.headline}</h2>
        </div>
        <div style={{ textAlign:'right' }}>
          <p style={{ fontSize:14,color:'rgba(255,255,255,.45)',marginBottom:18,fontFamily:'DM Sans,sans-serif',maxWidth:280 }}>{t.cta?.subtext}</p>
          <button style={{ padding:'12px 28px',borderRadius:100,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.cta?.button}</button>
        </div>
      </div>
      <div style={{ padding:'22px 48px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ fontFamily:'Playfair Display,serif',fontSize:15,fontWeight:700,color:c1 }}>{t.nav?.brand}</span>
        <span style={{ fontSize:12,color:'rgba(255,255,255,.25)',fontFamily:'DM Sans,sans-serif' }}>{t.footer?.tagline} · © 2026</span>
      </div>
    </div>
  )
}

// ── Layout: Sidebar / Dashboard ───────────────────────
function SidebarLayout({ t, c1, c2, font }) {
  return (
    <div style={{ background:'#0a0a12',minHeight:'100%',display:'flex' }}>
      <div style={{ width:220,background:'rgba(255,255,255,.02)',borderRight:'1px solid rgba(255,255,255,.06)',display:'flex',flexDirection:'column',padding:'20px 0',flexShrink:0 }}>
        <div style={{ padding:'0 20px 20px',borderBottom:'1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:4 }}>
            <div style={{ width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${c1},${c2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>⚡</div>
            <span style={{ fontFamily:font,fontSize:15,fontWeight:700 }}>{t.nav?.brand}</span>
          </div>
        </div>
        <div style={{ padding:'14px 10px',flex:1 }}>
          {(t.nav?.links||[]).map((l,i)=>(
            <div key={i} style={{ padding:'10px 12px',borderRadius:8,marginBottom:2,background:i===0?`${c1}20`:'transparent',borderLeft:i===0?`3px solid ${c1}`:'3px solid transparent',cursor:'pointer' }}>
              <span style={{ fontSize:13,color:i===0?c1:'rgba(255,255,255,.45)',fontFamily:'DM Sans,sans-serif',fontWeight:i===0?600:400 }}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:'14px 12px',borderTop:'1px solid rgba(255,255,255,.06)' }}>
          <button style={{ width:'100%',padding:'10px',borderRadius:8,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.primaryCTA}</button>
        </div>
      </div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'auto' }}>
        <div style={{ padding:'20px 28px',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10,color:c1,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600,marginBottom:4 }}>{t.hero?.badge}</div>
            <h1 style={{ fontFamily:font,fontSize:24,fontWeight:700,letterSpacing:'-0.03em' }}>{t.hero?.headline}</h1>
          </div>
          <button style={{ padding:'9px 20px',borderRadius:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',fontSize:13,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.hero?.secondaryCTA}</button>
        </div>
        <div style={{ padding:'20px 28px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,borderBottom:'1px solid rgba(255,255,255,.06)' }}>
          {[t.hero?.metric1,t.hero?.metric2,t.hero?.metric3].filter(Boolean).map((m,i)=>(
            <div key={i} style={{ padding:'18px 20px',borderRadius:12,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)' }}>
              <div style={{ fontFamily:font,fontSize:32,fontWeight:700,background:`linear-gradient(135deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{m.value}</div>
              <div style={{ fontSize:12,color:'rgba(255,255,255,.4)',marginTop:5,fontFamily:'DM Sans,sans-serif' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'20px 28px',borderBottom:'1px solid rgba(255,255,255,.06)' }}>
          <h2 style={{ fontFamily:font,fontSize:16,fontWeight:600,marginBottom:14,color:'rgba(255,255,255,.7)' }}>Features</h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10 }}>
            {(t.features||[]).map((f,i)=>(
              <div key={i} style={{ display:'flex',gap:12,padding:'14px 16px',borderRadius:10,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)' }}>
                <div style={{ width:34,height:34,borderRadius:8,background:`${c1}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontFamily:font,fontSize:13,fontWeight:600,marginBottom:4 }}>{f.title}</h3>
                  <p style={{ fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.5,fontFamily:'DM Sans,sans-serif' }}>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:'24px 28px',background:`linear-gradient(135deg,${c1}12,${c2}08)`,borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div>
            <h3 style={{ fontFamily:font,fontSize:18,fontWeight:700,marginBottom:6 }}>{t.cta?.headline}</h3>
            <p style={{ fontSize:13,color:'rgba(255,255,255,.45)',fontFamily:'DM Sans,sans-serif' }}>{t.cta?.subtext}</p>
          </div>
          <button style={{ padding:'11px 24px',borderRadius:9,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif',whiteSpace:'nowrap',marginLeft:20 }}>{t.cta?.button}</button>
        </div>
        <div style={{ padding:'16px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <span style={{ fontSize:12,color:'rgba(255,255,255,.25)',fontFamily:'DM Sans,sans-serif' }}>{t.footer?.tagline}</span>
          <span style={{ fontSize:11,color:'rgba(255,255,255,.2)',fontFamily:'DM Sans,sans-serif' }}>© 2026 · SiteForge</span>
        </div>
      </div>
    </div>
  )
}

// ── Shared sub-sections ───────────────────────────────
function Features({ t, c1, c2, font }) {
  return (
    <div style={{ padding:'60px 48px',borderBottom:'1px solid rgba(255,255,255,.06)' }}>
      <h2 style={{ fontFamily:font,fontSize:34,fontWeight:700,textAlign:'center',marginBottom:42,letterSpacing:'-0.03em' }}>Everything you need</h2>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:18 }}>
        {(t.features||[]).map((f,i)=>(
          <div key={i} style={{ padding:24,borderRadius:14,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',display:'flex',gap:14 }}>
            <div style={{ width:42,height:42,borderRadius:11,background:`linear-gradient(135deg,${c1}35,${c2}35)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{f.icon}</div>
            <div>
              <h3 style={{ fontFamily:font,fontSize:15,fontWeight:600,marginBottom:6 }}>{f.title}</h3>
              <p style={{ fontSize:13,color:'rgba(255,255,255,.45)',lineHeight:1.65,fontFamily:'DM Sans,sans-serif' }}>{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CTA({ t, c1, c2, font }) {
  return (
    <div style={{ padding:'72px 48px',textAlign:'center',background:`linear-gradient(135deg,${c1}12,${c2}08)`,borderBottom:'1px solid rgba(255,255,255,.06)' }}>
      <h2 style={{ fontFamily:font,fontSize:38,fontWeight:700,letterSpacing:'-0.03em',marginBottom:14 }}>{t.cta?.headline}</h2>
      <p style={{ fontSize:16,color:'rgba(255,255,255,.45)',marginBottom:32,fontFamily:'DM Sans,sans-serif' }}>{t.cta?.subtext}</p>
      <button style={{ padding:'14px 36px',borderRadius:12,background:`linear-gradient(135deg,${c1},${c2})`,border:'none',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>{t.cta?.button}</button>
    </div>
  )
}

function Footer({ t, c1, c2 }) {
  return (
    <div style={{ padding:'24px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,0,0,.2)' }}>
      <span style={{ fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,background:`linear-gradient(90deg,${c1},${c2})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{t.nav?.brand}</span>
      <span style={{ fontSize:13,color:'rgba(255,255,255,.3)',fontFamily:'DM Sans,sans-serif' }}>{t.footer?.tagline}</span>
      <span style={{ fontSize:12,color:'rgba(255,255,255,.2)',fontFamily:'DM Sans,sans-serif' }}>© 2026 · Built with SiteForge</span>
    </div>
  )
}

const LAYOUT_MAP = { split:SplitLayout, centered:CenteredLayout, bold:BoldLayout, magazine:MagazineLayout, sidebar:SidebarLayout }
const LAYOUT_LABELS = { split:'Split Hero', centered:'Centered Minimal', bold:'Bold & Dark', magazine:'Magazine Editorial', sidebar:'Dashboard' }

export default function PreviewPage({ template: t, onBack, onUse }) {
  if (!t) return null
  const [c1, c2] = t.colors || ['#7c3aed','#4f46e5']
  const font = FONT_MAP[t.font] || 'Sora, sans-serif'
  const LayoutComp = LAYOUT_MAP[t.layout] || SplitLayout

  return (
    <div style={{ height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden',background:'#0a0d18' }}>
      <style>{CSS}</style>
      <div style={{ display:'flex',alignItems:'center',gap:14,padding:'12px 22px',background:'rgba(255,255,255,0.04)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0 }}>
        <button onClick={onBack} style={{ padding:'7px 14px',borderRadius:9,fontSize:13,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'#fff',cursor:'pointer',fontFamily:'inherit' }}>← Back</button>
        <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}>
          <span style={{ fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700 }}>{t.title}</span>
          <span style={{ fontSize:10,fontWeight:600,padding:'3px 9px',borderRadius:20,background:'rgba(124,58,237,.2)',color:'#a78bfa',border:'1px solid rgba(124,58,237,.3)' }}>{LAYOUT_LABELS[t.layout]||t.layout}</span>
          <span style={{ fontSize:10,color:'rgba(255,255,255,.3)',background:'rgba(255,255,255,.05)',padding:'3px 9px',borderRadius:20 }}>{t.styleTag}</span>
        </div>
        <button onClick={onUse} style={{ padding:'9px 22px',borderRadius:10,fontSize:14,fontWeight:600,background:'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)',border:'none',color:'#fff',cursor:'pointer',fontFamily:'inherit' }}>Use Template →</button>
      </div>

      <div style={{ flex:1,display:'flex',padding:20,gap:18,overflow:'hidden' }}>
        <div style={{ flex:1,borderRadius:16,overflow:'hidden',border:'1px solid rgba(255,255,255,.08)',boxShadow:`0 40px 80px rgba(0,0,0,.5),0 0 50px ${c1}12` }}>
          <div style={{ background:'rgba(255,255,255,.04)',padding:'9px 16px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid rgba(255,255,255,.06)',flexShrink:0 }}>
            <div style={{ display:'flex',gap:5 }}>{['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c,opacity:.8 }}/>)}</div>
            <div style={{ flex:1,background:'rgba(255,255,255,.05)',borderRadius:6,padding:'3px 12px',fontSize:12,color:'rgba(255,255,255,.3)',fontFamily:'DM Sans,sans-serif' }}>siteforge.ai/preview/{t.id}</div>
          </div>
          <div style={{ height:'calc(100% - 38px)',overflowY:'auto' }} className="pv">
            <LayoutComp t={t} c1={c1} c2={c2} font={font}/>
          </div>
        </div>

        <div style={{ width:210,display:'flex',flexDirection:'column',gap:12,flexShrink:0 }}>
          <div style={{ padding:16,borderRadius:14,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)' }}>
            <h3 style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12 }}>Template Info</h3>
            {[['Layout',LAYOUT_LABELS[t.layout]||t.layout],['Style',t.styleTag],['Industry',t.industry],['Font',t.font||'sora']].map(([k,v])=>(
              <div key={k} style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <span style={{ fontSize:12,color:'rgba(255,255,255,.4)',fontFamily:'DM Sans,sans-serif' }}>{k}</span>
                <span style={{ fontSize:12,fontWeight:500,fontFamily:'DM Sans,sans-serif' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:16,borderRadius:14,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)' }}>
            <h3 style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12 }}>Color Palette</h3>
            <div style={{ display:'flex',gap:8 }}>
              <div style={{ flex:1,height:32,borderRadius:8,background:c1 }}/>
              <div style={{ flex:1,height:32,borderRadius:8,background:c2 }}/>
              <div style={{ flex:1,height:32,borderRadius:8,background:`linear-gradient(135deg,${c1},${c2})` }}/>
            </div>
          </div>
          <div style={{ padding:16,borderRadius:14,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)' }}>
            <h3 style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12 }}>Sections</h3>
            {['Navigation','Hero','Metrics','Features','CTA','Footer'].map(s=>(
              <div key={s} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:7 }}>
                <div style={{ width:14,height:14,borderRadius:'50%',background:`${c1}30`,border:`1px solid ${c1}60`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:c1,flexShrink:0 }}>✓</div>
                <span style={{ fontSize:12,color:'rgba(255,255,255,.5)',fontFamily:'DM Sans,sans-serif' }}>{s}</span>
              </div>
            ))}
          </div>
          <button onClick={onUse} style={{ padding:14,borderRadius:12,fontSize:14,fontWeight:600,background:'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)',border:'none',color:'#fff',cursor:'pointer',fontFamily:'inherit' }}>Use This Template</button>
        </div>
      </div>
    </div>
  )
}
