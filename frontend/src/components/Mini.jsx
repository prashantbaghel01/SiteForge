const SCHEMES = {
  Modern: ["#0ea5e9","#6366f1"],
  Minimal: ["#94a3b8","#e2e8f0"],
  Bold: ["#ec4899","#f97316"],
  Elegant: ["#c9a96e","#e8d5b7"],
  Playful: ["#22d3ee","#a78bfa"],
  Corporate: ["#0369a1","#0284c7"],
};

export function getColors(styleTag) {
  return SCHEMES[styleTag] || SCHEMES.Modern;
}

export function tagClass(styleTag) {
  return { Modern:"tmod",Minimal:"tmin",Bold:"tbld",Elegant:"telg",Playful:"tply",Corporate:"tcor" }[styleTag] || "tmod";
}

export default function Mini({ colors = ["#7c3aed","#4f46e5"], dark = true }) {
  const [c1, c2] = colors;
  return (
    <div style={{ width:"100%",height:"100%",background:dark?"#08090f":"#f8fafc",overflow:"hidden",borderRadius:8 }}>
      <div style={{ height:"11%",background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",padding:"0 10px",gap:6,borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ width:20,height:5,borderRadius:3,background:`linear-gradient(90deg,${c1},${c2})` }}/>
        <div style={{ flex:1 }}/>
        {[1,2,3].map(i=><div key={i} style={{ width:16,height:3,borderRadius:2,background:"rgba(255,255,255,0.12)" }}/>)}
        <div style={{ width:28,height:14,borderRadius:10,background:`linear-gradient(135deg,${c1},${c2})` }}/>
      </div>
      <div style={{ height:"44%",background:`linear-gradient(160deg,${c1}25,${c2}18,transparent)`,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:5,padding:"0 10px" }}>
        <div style={{ width:"55%",height:9,borderRadius:4,background:`linear-gradient(90deg,${c1}cc,${c2}cc)` }}/>
        <div style={{ width:"40%",height:5,borderRadius:3,background:"rgba(255,255,255,0.15)" }}/>
        <div style={{ width:"30%",height:5,borderRadius:3,background:"rgba(255,255,255,0.1)",marginTop:2 }}/>
        <div style={{ width:36,height:14,borderRadius:6,background:`linear-gradient(135deg,${c1},${c2})`,marginTop:4 }}/>
      </div>
      <div style={{ height:"28%",display:"flex",gap:5,padding:"6px 10px" }}>
        {[c1,c2,`${c1}99`].map((c,i)=>(
          <div key={i} style={{ flex:1,background:"rgba(255,255,255,0.03)",borderRadius:5,padding:5,border:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width:10,height:10,borderRadius:3,background:`${c}80`,marginBottom:4 }}/>
            <div style={{ width:"70%",height:4,borderRadius:2,background:"rgba(255,255,255,0.15)",marginBottom:3 }}/>
            <div style={{ width:"50%",height:3,borderRadius:2,background:"rgba(255,255,255,0.08)" }}/>
          </div>
        ))}
      </div>
    </div>
  );
}
