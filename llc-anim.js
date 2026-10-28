// Animated current paths in a half-bridge LLC (one resonant cycle, at fs = fr).
(function(){
const host = document.querySelector("#l56 .explorer");
if(!host) return;
const W = (pts) => `<path d="${pts}" class="aw"/>`;
const hopH = (x,y,dir) => ""; // hops are drawn inside wire paths
function cap(x,y){ return `<rect x="${x-16}" y="${y-6}" width="32" height="12" class="abg"/><line x1="${x-14}" x2="${x+14}" y1="${y-5}" y2="${y-5}" class="ap"/><line x1="${x-14}" x2="${x+14}" y1="${y+5}" y2="${y+5}" class="ap"/>`; }
function coilV(x,y0,y1,side){ const n=4, h=(y1-y0)/n; let d=`M${x} ${y0}`; for(let i=0;i<n;i++) d+=` a${h/2} ${h/2} 0 0 ${side>0?1:0} 0 ${h}`; return `<rect x="${x-(side>0?0:h/2+2)}" y="${y0}" width="${h/2+2}" height="${y1-y0}" class="abg"/><path d="${d}" class="ac"/>`; }
function coilH(x0,x1,y){ const n=4, w=(x1-x0)/n; let d=`M${x0} ${y}`; for(let i=0;i<n;i++) d+=` a${w/2} ${w/2} 0 0 1 ${w} 0`; return `<rect x="${x0}" y="${y-w/2-2}" width="${x1-x0}" height="${w/2+2}" class="abg"/><path d="${d}" class="ac"/>`; }
function diode(x,y,id){ return `<g id="${id}" class="ad"><rect x="${x-11}" y="${y-11}" width="22" height="22" class="abg"/><path d="M${x-10} ${y+8} L${x+10} ${y+8} L${x} ${y-8} Z"/><line x1="${x-10}" x2="${x+10}" y1="${y-8}" y2="${y-8}"/></g>`; }
function sw(x,y,id,label){ return `<g id="${id}" class="asw"><rect x="${x-34}" y="${y-22}" width="68" height="44" rx="6"/><text x="${x}" y="${y-3}" text-anchor="middle" class="al">${label}</text><text x="${x}" y="${y+14}" text-anchor="middle" class="as" id="${id}s">OFF</text></g>`; }
const svg = `
<svg id="aSvg" viewBox="0 0 780 330" class="anim-svg" role="img" aria-label="Half-bridge LLC current paths">
  <!-- wires -->
  ${W("M40 40 H260 M40 300 H260 M40 40 V300 M100 40 V300 M170 40 V300")}
  ${W("M170 130 H255 A5 5 0 0 1 265 130 H440 V200 H260 M260 40 V300 M400 130 V200")}
  ${W("M470 130 H560 M470 200 H555 A5 5 0 0 1 565 200 H640 M560 60 V280 M640 60 V280 M560 60 H750 V280 H560 M700 60 V280")}
  <!-- current paths (drawn on top when active) -->
  <path id="p_s1" class="af ap1" d="M40 300 V40 H170 V130 H255 A5 5 0 0 1 265 130 H440 V200 H260 V300 H40"/>
  <path id="p_s1b" class="af ap1" d="M260 200 V40 H170"/>
  <path id="p_s1m" class="af apm" d="M400 130 V200"/>
  <path id="p_s1s" class="af ap2" d="M470 130 H560 V60 H750 V280 H640 V200 H565 A5 5 0 0 0 555 200 H470"/>
  <path id="p_dt1" class="af apm" d="M170 300 V130 H255 A5 5 0 0 1 265 130 H400 V200 H260 V300 H170"/>
  <path id="p_s2" class="af ap1" d="M40 40 H260 V200 H440 V130 H265 A5 5 0 0 0 255 130 H170 V300 H40 V40"/>
  <path id="p_s2b" class="af ap1" d="M170 300 H260 V200"/>
  <path id="p_s2m" class="af apm" d="M400 200 V130"/>
  <path id="p_s2s" class="af ap2" d="M470 200 H555 A5 5 0 0 1 565 200 H640 V60 H750 V280 H560 V130 H470"/>
  <path id="p_dt2" class="af apm" d="M260 200 H400 V130 H265 A5 5 0 0 0 255 130 H170 V40 H260 V200"/>
  <!-- components -->
  <rect x="22" y="152" width="36" height="36" class="abg"/><circle cx="40" cy="170" r="18" class="ac"/><text x="40" y="166" text-anchor="middle" class="al">+</text><text x="40" y="182" text-anchor="middle" class="al">−</text>
  <text x="14" y="220" class="as">V<tspan baseline-shift="sub" font-size="8">in</tspan></text>
  ${cap(100,170)}<text x="122" y="174" class="as">C<tspan baseline-shift="sub" font-size="8">i</tspan></text>
  ${sw(170,85,"aA1","A1")}${sw(170,215,"aA2","A2")}
  <text x="180" y="124" class="as">a</text><text x="268" y="194" class="as">b</text>
  ${cap(260,100)}<text x="280" y="96" class="as">C<tspan baseline-shift="sub" font-size="8">r1</tspan></text>
  ${cap(260,250)}<text x="280" y="246" class="as">C<tspan baseline-shift="sub" font-size="8">r2</tspan></text>
  ${coilH(300,360,130)}<text x="330" y="110" text-anchor="middle" class="as">L<tspan baseline-shift="sub" font-size="8">r</tspan></text>
  ${coilV(400,145,185,-1)}<text x="374" y="172" text-anchor="end" class="as">L<tspan baseline-shift="sub" font-size="8">m</tspan></text>
  ${coilV(440,145,185,1)}${coilV(470,145,185,-1)}
  <line x1="453" x2="453" y1="138" y2="192" class="ap"/><line x1="458" x2="458" y1="138" y2="192" class="ap"/>
  <text x="455" y="226" text-anchor="middle" class="as">n : 1</text>
  ${diode(560,95,"aD1")}${diode(560,240,"aD2")}${diode(640,120,"aD3")}${diode(640,245,"aD4")}
  <text x="545" y="99" text-anchor="end" class="as">D1</text><text x="545" y="244" text-anchor="end" class="as">D2</text>
  <text x="625" y="124" text-anchor="end" class="as">D3</text><text x="625" y="249" text-anchor="end" class="as">D4</text>
  ${cap(700,170)}<text x="676" y="174" text-anchor="end" class="as">C<tspan baseline-shift="sub" font-size="8">o</tspan></text>
  <rect x="742" y="135" width="16" height="70" class="abg"/><path d="M750 135 l7 6 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 4" class="ac"/>
  <text x="768" y="174" class="as">R</text>
  <text x="120" y="22" text-anchor="middle" class="ah">Primary (high voltage)</text>
  <text x="640" y="22" text-anchor="middle" class="ah">Secondary (isolated output)</text>
  <line x1="455" x2="455" y1="30" y2="320" class="abar"/>
</svg>`;
host.insertAdjacentHTML("afterend", `<div class="explorer" id="llcAnim">
  <div class="ex-head"><strong>Current-flow animation</strong><span class="note">One resonant cycle at f<sub>s</sub> = f<sub>r1</sub>, slowed down about a million times; the short dead times are stretched so you can read them.</span></div>
  <div class="anim-ctrl">
    <button type="button" id="aPlay">Pause</button>
    <button type="button" id="aPrev">◀ Previous step</button>
    <button type="button" id="aNext">Next step ▶</button>
    <label class="fld" for="aSpd" style="flex:1 1 180px"><span class="lab"><span>Speed</span></span><input id="aSpd" type="range" min="0.3" max="2" step="0.1" value="1"></label>
  </div>
  <div class="anim-state"><span class="pill" id="aPill"></span><span id="aCap"></span></div>
  <div class="anim-wrap">${svg}</div>
  <svg id="aWave" class="anim-wave" viewBox="0 0 780 150" role="img" aria-label="Gate signals and currents over one cycle"></svg>
  <div class="legend"><span><i style="border-color:var(--c2)"></i>Primary (resonant) current i<sub>Lr</sub></span><span><i style="border-color:var(--c7);border-top-style:dashed"></i>Magnetizing current i<sub>Lm</sub></span><span><i style="border-color:var(--c6)"></i>Transformer secondary current (rectified into C<sub>o</sub>)</span></div>
</div>`);

const STEPS = [
  {t0:0.00,t1:0.45,on:["p_s1","p_s1b","p_s1m","p_s1s"],sw:{aA1:"ON"},d:["aD1","aD4"],pill:"Step 1: A1 on",st:"good",
   cap:"A1 connects node a to +Vin. The resonant current flows a → Lr → transformer → b, returning through Cr1 and Cr2. On the secondary, D1 and D4 conduct and feed Co and R."},
  {t0:0.45,t1:0.50,on:["p_dt1"],sw:{aA2:"diode"},d:[],pill:"Step 2: dead time",st:"warn",
   cap:"Both switches are off. The primary current has fallen to the magnetizing current, so the secondary current is zero and the diodes turn off at zero current (ZCS). The magnetizing current keeps flowing through Lr and Lm, discharging A2's Coss until A2's body diode conducts."},
  {t0:0.50,t1:0.95,on:["p_s2","p_s2b","p_s2m","p_s2s"],sw:{aA2:"ON"},d:["aD3","aD2"],pill:"Step 3: A2 on (ZVS)",st:"good",
   cap:"A2 turns on with almost no voltage across it (ZVS), because its body diode was already conducting. The current reverses: b → transformer → Lr → a → A2. On the secondary, D3 and D2 conduct, so the output current still flows the same way into Co."},
  {t0:0.95,t1:1.00,on:["p_dt2"],sw:{aA1:"diode"},d:[],pill:"Step 4: dead time",st:"warn",
   cap:"Mirror of step 2. The diodes turn off at zero current, and the magnetizing current discharges A1's Coss through A1's body diode, so A1 can turn on with ZVS in the next cycle."}
];
const PERIOD = 12000; // ms per cycle at speed 1
// Dead times are about 5% of a real cycle; they are stretched here so each step can be read.
const SEG = [[0,0.45,0.36],[0.45,0.5,0.14],[0.5,0.95,0.36],[0.95,1,0.14]];
function warp(v){ let a=0; for(const [t0,t1,d] of SEG){ if(v < a+d) return t0 + (v-a)/d*(t1-t0); a+=d; } return 0; }
function unwarp(tt){ let a=0; for(const [t0,t1,d] of SEG){ if(tt < t1) return a + (tt-t0)/(t1-t0)*d; a+=d; } return 0; }
const all = [...document.querySelectorAll("#aSvg .af")];
const isec = t => t<0.45 ? 0.85*Math.sin(Math.PI*t/0.45) : (t>=0.5 && t<0.95 ? -0.85*Math.sin(Math.PI*(t-0.5)/0.45) : 0);
const ir = t => isec(t) + im(t);
const im = t => t<0.5 ? -0.3+1.2*t : 0.3-1.2*(t-0.5);
let t = 0, u = 0, playing = !matchMedia("(prefers-reduced-motion: reduce)").matches, last = null, cur = -1;
function stepOf(tt){ return STEPS.findIndex(s => tt>=s.t0 && tt<s.t1); }
function drawWave(tt){
  const X = u => 60 + u*700, rows=[[18,"A1 gate"],[44,"A2 gate"],[100,"Currents"]];
  let g = rows.map(([y,l]) => `<text x="4" y="${y+4}" class="as">${l}</text>`).join("");
  const sq = (a,b,y) => `<path d="M${X(0)} ${y+8} H${X(a)} V${y-8} H${X(b)} V${y+8} H${X(1)}" class="aws"/>`;
  g += sq(0,0.45,18) + sq(0.5,0.95,44);
  g += `<line x1="${X(0)}" x2="${X(1)}" y1="100" y2="100" class="gl"/>`;
  const line=(f,cls)=>{ let d=""; for(let k=0;k<=200;k++){ const u=k/200; d+=(k?"L":"M")+X(u).toFixed(1)+" "+(100-f(u)*38).toFixed(1); } return `<path d="${d}" class="${cls}"/>`; };
  g += line(isec,"awsec") + line(im,"awm") + line(ir,"awr");
  STEPS.forEach(s => { if(s.st==="warn") g += `<rect x="${X(s.t0)}" y="4" width="${X(s.t1)-X(s.t0)}" height="140" class="awdt"/>`; });
  g += `<line x1="${X(tt)}" x2="${X(tt)}" y1="4" y2="146" class="cur"/>`;
  $w.innerHTML = g;
}
const $w = document.getElementById("aWave");
function render(){
  const k = stepOf(t), s = STEPS[k];
  if(k !== cur){
    cur = k;
    all.forEach(p => p.classList.toggle("on", s.on.includes(p.id)));
    ["aA1","aA2"].forEach(id => { const st = s.sw[id] || "OFF"; const g=document.getElementById(id); g.dataset.st = st; document.getElementById(id+"s").textContent = st==="diode" ? "body diode" : st; });
    ["aD1","aD2","aD3","aD4"].forEach(id => document.getElementById(id).classList.toggle("on", s.d.includes(id)));
    document.getElementById("aPill").textContent = s.pill; document.getElementById("aPill").dataset.state = s.st;
    document.getElementById("aCap").textContent = s.cap;
  }
  const off = -(u*PERIOD/12) % 40;
  all.forEach(p => { if(p.classList.contains("on")) p.style.strokeDashoffset = off; });
  drawWave(t);
}
function frame(ts){
  if(last!==null && playing){ u = (u + (ts-last)/PERIOD*parseFloat(document.getElementById("aSpd").value)) % 1; t = warp(u); }
  last = ts; render(); requestAnimationFrame(frame);
}
document.getElementById("aPlay").onclick = () => { playing = !playing; document.getElementById("aPlay").textContent = playing ? "Pause" : "Play"; };
const jump = d => { const k = (stepOf(t)+d+STEPS.length)%STEPS.length; t = STEPS[k].t0 + 0.001; u = unwarp(t); playing=false; document.getElementById("aPlay").textContent="Play"; render(); };
document.getElementById("aPrev").onclick = () => jump(-1);
document.getElementById("aNext").onclick = () => jump(1);
if(!playing) document.getElementById("aPlay").textContent="Play";
window.__llcAnimSet = v => { u = v % 1; t = warp(u); playing=false; render(); };
render(); requestAnimationFrame(frame);
})();
