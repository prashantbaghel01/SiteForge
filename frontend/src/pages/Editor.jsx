import { useState } from 'react'
import { publishSite } from '../api'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.cel{cursor:pointer;transition:outline .15s ease;}
.cel:hover{outline:2px solid rgba(124,58,237,.5);outline-offset:3px;}
.cel.sel{outline:2px solid #7c3aed;outline-offset:3px;}
.sbi{cursor:pointer;transition:all .2s ease;}
.sbi:hover{background:rgba(124,58,237,.15)!important;color:#a78bfa!important;}
.sbi.active{background:rgba(124,58,237,.2)!important;color:#a78bfa!important;border-left:2px solid #7c3aed!important;}
.toast{animation:fadeIn .3s ease;}
.prop-input{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:inherit;font-size:12px;outline:none;padding:7px 10px;border-radius:8px;width:100%;transition:border .2s;}
.prop-input:focus{border-color:rgba(124,58,237,.6);}
.ai-btn{background:linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.25));border:1px solid rgba(124,58,237,0.4);color:#a78bfa;font-family:inherit;font-size:11px;font-weight:600;padding:7px 10px;border-radius:8px;cursor:pointer;width:100%;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;}
.ai-btn:hover{background:linear-gradient(135deg,rgba(124,58,237,0.4),rgba(79,70,229,0.4));}
.ai-btn:disabled{opacity:0.5;cursor:not-allowed;}
.scr::-webkit-scrollbar{width:3px;}
.scr::-webkit-scrollbar-thumb{background:rgba(124,58,237,.4);border-radius:2px;}
.add-section-input{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-family:inherit;font-size:13px;outline:none;padding:10px 14px;border-radius:10px;width:100%;transition:border .2s;}
.add-section-input:focus{border-color:rgba(124,58,237,.6);}
.add-section-input::placeholder{color:rgba(255,255,255,.3);}
`

const LAYERS = [
  ['nav', 'Navigation'], ['hero', 'Hero Section'],
  ['features', 'Features'], ['cta', 'Call to Action'], ['footer', 'Footer'],
]
const TOOLS = [
  ['T','Heading'],['¶','Text'],['◻','Button'],['⬚','Image'],['▭','Section'],['—','Divider'],
]
const COLOR_PRESETS = [
  ['#7c3aed','#4f46e5'],['#2563eb','#0ea5e9'],
  ['#ec4899','#f97316'],['#10b981','#06b6d4'],
  ['#f59e0b','#ef4444'],['#8b5cf6','#a78bfa'],
]

// ── Backend AI helper ─────────────────────────────────
async function callBackendAI(endpoint, body) {
  const token = localStorage.getItem('sf_token')
  const res = await fetch('/api/ai/' + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export default function Editor({ template: initialTemplate, onBack, user }) {
  const [sel, setSel] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState(null)
  const [pubError, setPubError] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiNotify, setAiNotify] = useState('')
  const [sectionPrompt, setSectionPrompt] = useState('')
  const [sectionLoading, setSectionLoading] = useState(false)
  const [showSectionAdder, setShowSectionAdder] = useState(false)
  const [extraSections, setExtraSections] = useState([])

  const [site, setSite] = useState({
    colors: initialTemplate?.colors || ['#7c3aed', '#4f46e5'],
    nav: initialTemplate?.nav || {
      brand: initialTemplate?.title || 'My Site',
      links: ['Home', 'About', 'Features', 'Contact'],
    },
    hero: initialTemplate?.hero || {
      badge: '✦ Welcome',
      headline: initialTemplate?.title || 'My Website',
      subheadline: 'Your compelling subtitle here.',
      primaryCTA: 'Get Started',
      secondaryCTA: 'Learn More',
    },
    features: initialTemplate?.features || [
      { icon: '⚡', title: 'Feature One', description: 'Click to customize.' },
      { icon: '🎨', title: 'Feature Two', description: 'Click to customize.' },
      { icon: '📱', title: 'Feature Three', description: 'Click to customize.' },
    ],
    cta: initialTemplate?.cta || {
      headline: 'Ready to get started?',
      subtext: 'Join thousands of happy customers today.',
      button: 'Start Free Trial',
    },
    footer: initialTemplate?.footer || { tagline: 'Built with SiteForge' },
  })

  const [c1, c2] = site.colors

  const update = (section, field, value) =>
    setSite(s => ({ ...s, [section]: { ...s[section], [field]: value } }))

  const updateFeature = (idx, field, value) =>
    setSite(s => ({ ...s, features: s.features.map((f, i) => i === idx ? { ...f, [field]: value } : f) }))

  const updateNavLink = (idx, value) =>
    setSite(s => ({ ...s, nav: { ...s.nav, links: s.nav.links.map((l, i) => i === idx ? value : l) } }))

  const applyColors = (pair) => setSite(s => ({ ...s, colors: pair }))

  const notify = (msg) => { setAiNotify(msg); setTimeout(() => setAiNotify(''), 3500) }

  // ── AI Copy Editor ────────────────────────────────────
  const improveSection = async (section) => {
    setAiLoading(true)
    try {
      const context = `Website: ${site.nav.brand}, Industry: ${initialTemplate?.industry || 'general'}, Style: ${initialTemplate?.styleTag || 'Modern'}`
      const dataMap = {
        hero: site.hero,
        features: site.features,
        cta: site.cta,
        nav: site.nav,
      }
      const { improved } = await callBackendAI('improve', {
        section,
        data: dataMap[section],
        context,
      })
      if (section === 'hero') setSite(s => ({ ...s, hero: { ...s.hero, ...improved } }))
      if (section === 'features') setSite(s => ({ ...s, features: improved }))
      if (section === 'cta') setSite(s => ({ ...s, cta: { ...s.cta, ...improved } }))
      if (section === 'nav') setSite(s => ({ ...s, nav: { ...s.nav, links: improved } }))
      notify('✨ ' + section.charAt(0).toUpperCase() + section.slice(1) + ' copy improved!')
    } catch (e) {
      notify('❌ ' + e.message)
    } finally {
      setAiLoading(false)
    }
  }

  // ── AI Section Generator ──────────────────────────────
  const generateSection = async () => {
    if (!sectionPrompt.trim()) return
    setSectionLoading(true)
    try {
      const context = `${site.nav.brand}, ${initialTemplate?.industry || 'general'} industry, ${initialTemplate?.styleTag || 'Modern'} style`
      const { section } = await callBackendAI('section', { prompt: sectionPrompt, context })
      setExtraSections(s => [...s, section])
      setSectionPrompt('')
      setShowSectionAdder(false)
      notify(`✨ "${section.title}" section added!`)
    } catch (e) {
      notify('❌ ' + e.message)
    } finally {
      setSectionLoading(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true); setPubError(null)
    try {
      const { data } = await publishSite(initialTemplate?.id, { site, extraSections }, site.nav.brand)
      setPublishResult(data)
    } catch (err) {
      setPubError(err.response?.data?.error || 'Publish failed')
    } finally { setPublishing(false) }
  }

  // ── Properties Panel ──────────────────────────────────
  const renderProperties = () => {
    if (!sel) return (
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, paddingTop: 20 }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>👆</div>
        Click any section to edit it
      </div>
    )
    const canImprove = ['hero', 'features', 'cta', 'nav'].includes(sel)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', padding: '7px 10px', borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
          {LAYERS.find(([id]) => id === sel)?.[1]}
        </div>

        {canImprove && (
          <button className="ai-btn" onClick={() => improveSection(sel)} disabled={aiLoading}>
            {aiLoading
              ? <><div style={{ width: 12, height: 12, border: '2px solid rgba(167,139,250,.3)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Improving…</>
              : <>✨ Improve Copy with AI</>}
          </button>
        )}

        <div>
          <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 8 }}>Accent Colors</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {COLOR_PRESETS.map(([a, b]) => (
              <div key={a} onClick={() => applyColors([a, b])} style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${a},${b})`, cursor: 'pointer', border: a === c1 ? '2px solid #fff' : '2px solid transparent', transition: 'all .15s', transform: a === c1 ? 'scale(1.12)' : 'scale(1)' }} />
            ))}
          </div>
        </div>

        {sel === 'nav' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Brand Name</label>
            <input className="prop-input" value={site.nav.brand} onChange={e => update('nav', 'brand', e.target.value)} />
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>Nav Links</label>
            {site.nav.links.map((l, i) => (
              <input key={i} className="prop-input" value={l} onChange={e => updateNavLink(i, e.target.value)} />
            ))}
          </div>
        )}

        {sel === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[['Badge','badge'],['Headline','headline'],['Subheadline','subheadline'],['Primary Button','primaryCTA'],['Secondary Button','secondaryCTA']].map(([label, field]) => (
              <div key={field}>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 4 }}>{label}</label>
                <input className="prop-input" value={site.hero[field] || ''} onChange={e => update('hero', field, e.target.value)} />
              </div>
            ))}
          </div>
        )}

        {sel === 'features' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {site.features.map((f, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>Feature {i + 1}</div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                  <input className="prop-input" value={f.icon} onChange={e => updateFeature(i, 'icon', e.target.value)} style={{ width: 44 }} placeholder="🔥" />
                  <input className="prop-input" value={f.title} onChange={e => updateFeature(i, 'title', e.target.value)} placeholder="Title" />
                </div>
                <input className="prop-input" value={f.description} onChange={e => updateFeature(i, 'description', e.target.value)} placeholder="Description" />
              </div>
            ))}
          </div>
        )}

        {sel === 'cta' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[['Headline','headline'],['Subtext','subtext'],['Button Text','button']].map(([label, field]) => (
              <div key={field}>
                <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 4 }}>{label}</label>
                <input className="prop-input" value={site.cta[field] || ''} onChange={e => update('cta', field, e.target.value)} />
              </div>
            ))}
          </div>
        )}

        {sel === 'footer' && (
          <div>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>Tagline</label>
            <input className="prop-input" value={site.footer.tagline || ''} onChange={e => update('footer', 'tagline', e.target.value)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0d18' }}>
      <style>{CSS}</style>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ padding: '7px 12px', borderRadius: 9, fontSize: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 15, fontWeight: 700 }}>SiteForge</span>
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{site.nav.brand}</span>
        <div style={{ flex: 1 }} />
        {pubError && <span style={{ fontSize: 12, color: '#fca5a5' }}>{pubError}</span>}
        <button onClick={() => setShowSectionAdder(v => !v)} style={{ padding: '7px 14px', borderRadius: 9, fontSize: 13, background: showSectionAdder ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)', border: showSectionAdder ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.1)', color: showSectionAdder ? '#a78bfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
          ✦ Add Section
        </button>
        <button onClick={handlePublish} disabled={publishing} style={{ padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', opacity: publishing ? 0.7 : 1 }}>
          {publishing ? '…' : '🚀 Publish'}
        </button>
      </div>

      {/* AI Section Adder bar */}
      {showSectionAdder && (
        <div style={{ padding: '12px 20px', background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.2)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, whiteSpace: 'nowrap' }}>✦ AI Section Generator</span>
          <input className="add-section-input" value={sectionPrompt} onChange={e => setSectionPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateSection()} placeholder='e.g. "pricing with 3 tiers", "team of 3 people", "FAQ with 4 questions"' style={{ flex: 1 }} />
          <button onClick={generateSection} disabled={sectionLoading || !sectionPrompt.trim()} style={{ padding: '10px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: sectionLoading ? 0.6 : 1 }}>
            {sectionLoading ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block', marginRight: 6 }} />Generating…</> : 'Generate →'}
          </button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Icon toolbar */}
        <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 6px', gap: 4, background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {TOOLS.map(([ic, lb]) => (
            <button key={lb} title={lb} style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit', gap: 1 }}>
              <span style={{ fontSize: 14 }}>{ic}</span>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{lb}</span>
            </button>
          ))}
        </div>

        {/* Layers panel */}
        <div style={{ width: 168, padding: 12, background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Layers</div>
          {LAYERS.map(([id, lb]) => (
            <div key={id} className={`sbi${sel === id ? ' active' : ''}`} onClick={() => setSel(id === sel ? null : id)}
              style={{ padding: '9px 10px', borderRadius: 9, marginBottom: 4, fontSize: 12, color: sel === id ? '#a78bfa' : 'rgba(255,255,255,0.5)', background: sel === id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 7, borderLeft: sel === id ? '2px solid #7c3aed' : '2px solid transparent' }}>
              <div style={{ width: 5, height: 5, borderRadius: 2, background: sel === id ? '#7c3aed' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />{lb}
            </div>
          ))}
          {extraSections.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(124,58,237,0.6)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '12px 0 8px' }}>✦ AI Generated</div>
              {extraSections.map((s, i) => (
                <div key={i} style={{ padding: '9px 10px', borderRadius: 9, marginBottom: 4, fontSize: 12, color: 'rgba(167,139,250,0.7)', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(124,58,237,0.15)' }}>
                  <span>{s.title}</span>
                  <span onClick={() => setExtraSections(es => es.filter((_, j) => j !== i))} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16, lineHeight: 1 }}>×</span>
                </div>
              ))}
            </>
          )}
          <div style={{ marginTop: 16, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Pages</div>
          {['Home', '+ Add Page'].map((p, i) => (
            <div key={p} style={{ padding: '8px 10px', borderRadius: 9, marginBottom: 4, fontSize: 12, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)', background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>{p}</div>
          ))}
        </div>

        {/* Canvas */}
        <div className="scr" style={{ flex: 1, overflow: 'auto', background: '#060810', display: 'flex', justifyContent: 'center', padding: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
          <div style={{ width: '100%', maxWidth: 900, background: '#08090f', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: `0 30px 80px rgba(0,0,0,0.5),0 0 40px ${c1}10`, position: 'relative', zIndex: 10, alignSelf: 'start' }}>

            {/* Nav */}
            <div className={`cel${sel==='nav'?' sel':''}`} onClick={() => setSel('nav')} style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 24 }}>
              <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 14, fontWeight: 700, background: `linear-gradient(90deg,${c1},${c2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0 }}>{site.nav.brand}</span>
              <div style={{ flex: 1, display: 'flex', gap: 20, justifyContent: 'center' }}>
                {site.nav.links.map((l, i) => <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans,sans-serif' }}>{l}</span>)}
              </div>
              <button style={{ padding: '6px 16px', borderRadius: 8, background: `linear-gradient(135deg,${c1},${c2})`, border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, flexShrink: 0 }}>{site.hero.primaryCTA}</button>
            </div>

            {/* Hero */}
            <div className={`cel${sel==='hero'?' sel':''}`} onClick={() => setSel('hero')} style={{ padding: '60px 32px', textAlign: 'center', background: `radial-gradient(ellipse at top,${c1}14 0%,transparent 70%)`, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 100, background: `${c1}18`, border: `1px solid ${c1}30`, fontSize: 12, color: c1, marginBottom: 18, fontFamily: 'DM Sans,sans-serif' }}>{site.hero.badge}</div>
              <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: 14 }}>
                {site.hero.headline}<br />
                <span style={{ background: `linear-gradient(135deg,${c1},${c2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Click to Edit</span>
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto 26px', lineHeight: 1.65, fontFamily: 'DM Sans,sans-serif' }}>{site.hero.subheadline}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button style={{ padding: '11px 26px', borderRadius: 9, background: `linear-gradient(135deg,${c1},${c2})`, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{site.hero.primaryCTA}</button>
                <button style={{ padding: '11px 22px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{site.hero.secondaryCTA}</button>
              </div>
            </div>

            {/* Features */}
            <div className={`cel${sel==='features'?' sel':''}`} onClick={() => setSel('features')} style={{ padding: '44px 32px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {site.features.map((f, i) => (
                <div key={i} style={{ padding: 18, borderRadius: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${c1}35,${c2}35)`, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'DM Sans,sans-serif' }}>{f.description}</p>
                </div>
              ))}
            </div>

            {/* AI Generated Extra Sections */}
            {extraSections.map((s, idx) => (
              <div key={idx} style={{ padding: '44px 32px', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 10, color: '#a78bfa', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', padding: '2px 8px', borderRadius: 100 }}>✦ AI Generated</div>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8, textAlign: 'center' }}>{s.title}</h2>
                {s.subtitle && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 28, fontFamily: 'DM Sans,sans-serif' }}>{s.subtitle}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(s.items?.length || 3, 3)},1fr)`, gap: 14 }}>
                  {(s.items || []).map((item, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {item.icon && <div style={{ fontSize: 22, marginBottom: 10 }}>{item.icon}</div>}
                      <h3 style={{ fontFamily: 'Sora,sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontFamily: 'DM Sans,sans-serif' }}>{item.description}</p>
                      {item.extra && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: c1 }}>{item.extra}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className={`cel${sel==='cta'?' sel':''}`} onClick={() => setSel('cta')} style={{ padding: '48px 32px', textAlign: 'center', background: `linear-gradient(135deg,${c1}10,${c2}08)`, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 10 }}>{site.cta.headline}</h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 22, fontFamily: 'DM Sans,sans-serif' }}>{site.cta.subtext}</p>
              <button style={{ padding: '12px 28px', borderRadius: 9, background: `linear-gradient(135deg,${c1},${c2})`, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{site.cta.button}</button>
            </div>

            {/* Footer */}
            <div className={`cel${sel==='footer'?' sel':''}`} onClick={() => setSel('footer')} style={{ padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontFamily: 'Sora,sans-serif', fontSize: 13, fontWeight: 700, background: `linear-gradient(90deg,${c1},${c2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{site.nav.brand}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans,sans-serif' }}>{site.footer.tagline}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans,sans-serif' }}>© 2026 · Built with SiteForge</span>
            </div>
          </div>
        </div>

        {/* Properties panel */}
        <div className="scr" style={{ width: 210, padding: 14, background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Properties</div>
          {renderProperties()}
        </div>
      </div>

      {/* AI notification toast */}
      {aiNotify && (
        <div className="toast" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', padding: '12px 22px', borderRadius: 100, background: aiNotify.startsWith('❌') ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 10px 40px rgba(124,58,237,0.4)', zIndex: 1000, whiteSpace: 'nowrap', fontFamily: 'DM Sans,sans-serif' }}>
          {aiNotify}
        </div>
      )}

      {/* Publish toast */}
      {publishResult && (
        <div className="toast" onClick={() => setPublishResult(null)} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', padding: '13px 24px', borderRadius: 100, background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 10px 40px rgba(16,185,129,0.4)', zIndex: 1000, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans,sans-serif' }}>
          ✓ Live at siteforge.ai/{publishResult.slug} · click to dismiss
        </div>
      )}
    </div>
  )
}
