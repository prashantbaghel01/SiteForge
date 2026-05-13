import { useState } from 'react'
import Mini from '../components/Mini'

export default function Landing({ onGo, onAuthClick, user }) {
  const [v, setV] = useState('')
  const go = () => v.trim() && onGo(v.trim())

  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",padding:"0 clamp(16px,4vw,48px)" }}>
      <div className="orb" style={{ width:500,height:500,background:"rgba(124,58,237,0.18)",top:-100,left:-100 }}/>
      <div className="orb" style={{ width:400,height:400,background:"rgba(79,70,229,0.12)",bottom:100,right:-80,animationDelay:"2s" }}/>
      <div className="orb" style={{ width:300,height:300,background:"rgba(37,99,235,0.1)",top:"30%",right:"20%",animationDelay:"4s" }}/>
      <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)",backgroundSize:"32px 32px",pointerEvents:"none" }}/>

      <nav style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 0",position:"relative",zIndex:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily:"'Sora',sans-serif",fontSize:18,fontWeight:700,letterSpacing:"-0.02em" }}>SiteForge</span>
        </div>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          {user ? (
            <span style={{ fontSize:14,color:"rgba(255,255,255,0.6)" }}>Hi, {user.name}</span>
          ) : (
            <>
              <button className="btn-g" onClick={onAuthClick} style={{ padding:"8px 18px",borderRadius:10,fontSize:14 }}>Sign In</button>
              <button className="btn-p" onClick={onAuthClick} style={{ padding:"8px 18px",borderRadius:10,fontSize:14 }}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1100,margin:"0 auto",width:"100%",gap:60,paddingTop:20,flexWrap:"wrap" }}>
        <div style={{ flex:1,minWidth:280,maxWidth:560 }}>
          <div className="fu" style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.25)",borderRadius:100,padding:"6px 14px",marginBottom:28,fontSize:13,color:"#a78bfa" }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#7c3aed",boxShadow:"0 0 8px #7c3aed" }}/>
            AI-Powered Website Builder
          </div>
          <h1 className="fu1" style={{ fontFamily:"'Sora',sans-serif",fontSize:"clamp(42px,5vw,70px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.04em",marginBottom:20 }}>
            Build Websites<br/>
            <span style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5,#2563eb)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>with AI</span>
          </h1>
          <p className="fu2" style={{ fontSize:17,color:"rgba(255,255,255,0.5)",lineHeight:1.65,marginBottom:36,maxWidth:430 }}>
            Describe your dream website and let AI generate stunning templates in seconds. No code, no hassle.
          </p>
          <div className="fu3" style={{ marginBottom:14 }}>
            <div style={{ display:"flex",gap:10,padding:10,background:"rgba(255,255,255,0.04)",borderRadius:16,border:"1px solid rgba(124,58,237,0.25)",backdropFilter:"blur(20px)" }}>
              <input className="sfinput" id="landing-prompt" value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="A modern SaaS landing page for project management..." style={{ flex:1,padding:"11px 14px",borderRadius:10,border:"none",background:"transparent",fontSize:15 }}/>
              <button className="btn-p" id="landing-generate-btn" onClick={go} style={{ padding:"11px 22px",borderRadius:10,fontSize:15,whiteSpace:"nowrap" }}>Generate ✦</button>
            </div>
          </div>
          <div className="fu4" style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {["Portfolio site","E-commerce store","Agency website","SaaS landing page"].map(s=>(
              <button key={s} onClick={()=>setV(s)} style={{ padding:"6px 14px",borderRadius:100,fontSize:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.45)",cursor:"pointer",transition:"all .2s",fontFamily:"DM Sans,sans-serif" }}
                onMouseEnter={e=>{e.target.style.background="rgba(124,58,237,0.15)";e.target.style.color="#a78bfa";e.target.style.borderColor="rgba(124,58,237,0.3)";}}
                onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,0.05)";e.target.style.color="rgba(255,255,255,0.45)";e.target.style.borderColor="rgba(255,255,255,0.08)";}}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="afl" style={{ flex:"0 0 auto",width:"clamp(260px,32vw,340px)",position:"relative" }}>
          <div className="glass2" style={{ borderRadius:20,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.06),inset 0 1px 0 rgba(255,255,255,0.1)" }}>
            <div style={{ padding:"10px 16px",background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex",gap:5 }}>
                {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{ width:10,height:10,borderRadius:"50%",background:c,opacity:.8 }}/>)}
              </div>
              <div style={{ flex:1,height:20,background:"rgba(255,255,255,0.05)",borderRadius:6 }}/>
            </div>
            <div style={{ height:260 }}><Mini colors={["#7c3aed","#4f46e5"]} dark={true}/></div>
          </div>
          <div className="glass" style={{ position:"absolute",top:-16,right:-20,padding:"10px 14px",borderRadius:12,display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:9,background:"linear-gradient(135deg,#22d3ee,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>✦</div>
            <div>
              <div style={{ fontSize:12,fontWeight:600 }}>AI Generated</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)" }}>in 3 seconds</div>
            </div>
          </div>
          <div className="glass" style={{ position:"absolute",bottom:-16,left:-20,padding:"10px 14px",borderRadius:12 }}>
            <div style={{ fontSize:12,fontWeight:600,marginBottom:6 }}>Templates ready</div>
            <div style={{ display:"flex",alignItems:"center",gap:4 }}>
              {["#7c3aed","#4f46e5","#2563eb","#0ea5e9"].map((c,i)=>(
                <div key={c} style={{ width:20,height:20,borderRadius:"50%",background:c,border:"2px solid #0a0d18",marginLeft:i>0?-6:0 }}/>
              ))}
              <span style={{ fontSize:10,color:"rgba(255,255,255,0.4)",marginLeft:6 }}>+24 more</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex",justifyContent:"center",gap:"clamp(24px,4vw,60px)",padding:"40px 0 60px",position:"relative",zIndex:10,flexWrap:"wrap" }}>
        {[["10K+","Websites Built"],["3s","Avg Generate Time"],["50+","Templates"],["99%","Satisfaction"]].map(([n,l])=>(
          <div key={n} style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:700,background:"linear-gradient(135deg,#a78bfa,#6366f1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>{n}</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
