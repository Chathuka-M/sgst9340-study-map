// Interactive explorers for Lectures 2, 4, 5-6 and 7.
// Each one is injected under its lecture heading, after app.js has drawn the map.
(function(){
const $ = id => document.getElementById(id);
const num = id => { const v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
const fmt = (v, d=1) => isFinite(v) ? v.toFixed(d) : "–";

// Generic line plot in an SVG (viewBox 340 x 190).
function plot(svg, o){
  const W=340, H=190, L=42, R=(o.right2||o.padR) ? 44 : 14, T=16, B=34;
  const X = x => L + (x-o.x0)/(o.x1-o.x0)*(W-L-R);
  const Y = y => H-B - (Math.max(o.y0, Math.min(o.y1, y))-o.y0)/(o.y1-o.y0)*(H-T-B);
  let g = "";
  o.yt.forEach(v => { g += `<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" class="tl">${v}</text>`; });
  o.xt.forEach(v => { g += `<text x="${X(v)}" y="${H-B+13}" text-anchor="middle" class="tl">${v}</text>`; });
  if(o.right2){ const r=o.right2; const Y2 = y => H-B - (y-r.y0)/(r.y1-r.y0)*(H-T-B);
    r.yt.forEach(v => { g += `<text x="${W-R+6}" y="${Y2(v)+4}" class="tl">${v}</text>`; });
    g += `<text x="${W-R+6}" y="10" class="tl">${r.label}</text>`;
    r.series.forEach(s => { g += `<polyline points="${s.pts.map(([x,y])=>`${X(x).toFixed(1)},${Y2(y).toFixed(1)}`).join(" ")}" fill="none" stroke="${s.color}" stroke-width="${s.w||2.2}" ${s.dash?`stroke-dasharray="${s.dash}"`:""}/>`; });
  }
  (o.bands||[]).forEach(b => { g += `<rect x="${X(b.x0)}" y="${T}" width="${X(b.x1)-X(b.x0)}" height="${H-T-B}" fill="${b.fill}" opacity="${b.op||0.12}"/>`; if(b.label) g += `<text x="${X(b.x0)+4}" y="${H-B-6}" class="tl">${b.label}</text>`; });
  g += `<text x="${L}" y="10" class="tl">${o.yl}</text><text x="${W-R}" y="${H-2}" text-anchor="end" class="tl">${o.xl}</text>`;
  o.series.forEach(s => { g += `<polyline points="${s.pts.map(([x,y])=>`${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" fill="none" stroke="${s.color}" stroke-width="${s.w||2.2}" ${s.dash?`stroke-dasharray="${s.dash}"`:""} stroke-linejoin="round"/>`; });
  (o.vlines||[]).forEach(x => { g += `<line x1="${X(x)}" x2="${X(x)}" y1="${T}" y2="${H-B}" class="cur"/>`; });
  (o.dots||[]).forEach(d => { g += `<circle cx="${X(d.x)}" cy="${Y(d.y)}" r="4.5" fill="${d.color}"/>`; });
  (o.labels||[]).forEach(l => { g += `<text x="${X(l.x)}" y="${Y(l.y)}" text-anchor="${l.anchor||'start'}" class="tl" style="fill:${l.color||'var(--muted)'}">${l.text}</text>`; });
  svg.innerHTML = g;
}

const field = (id, label, val, attrs="") => `<label class="fld" for="${id}"><span class="lab"><span>${label}</span></span><input id="${id}" type="number" value="${val}" ${attrs}></label>`;
const slider = (id, label, val, min, max, step) => `<label class="fld wide" for="${id}"><span class="lab"><span>${label}</span><output id="${id}v"></output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
const stat = (id, label, eq) => `<div class="stat"><span class="k">${label}</span>${eq?`<code>${eq}</code>`:"<code></code>"}<b id="${id}"></b></div>`;
function mount(lecId, html){
  const head = document.querySelector(`#${lecId} .lec-head`);
  if(head) head.insertAdjacentHTML("afterend", html);
}
function wire(ids, fn){ ids.forEach(id => $(id).addEventListener("input", fn)); fn(); }

/* ---------- Lecture 2: loss and junction temperature ---------- */
mount("l2", `<div class="explorer">
  <div class="ex-head"><strong>Loss &amp; junction-temperature explorer</strong><span class="note">Change the switch current, frequency or heat sink and watch Tj move.</span></div>
  <div class="ex-grid">
    ${field("tI","I<sub>rms</sub> (A)",20,'min="0" step="1"')}
    ${field("tR","R<sub>ds(on)</sub> at Tj (mΩ)",25,'min="0" step="1"')}
    ${field("tE","E<sub>on</sub> + E<sub>off</sub> (µJ)",300,'min="0" step="10"')}
    ${field("tF","f<sub>s</sub> (kHz)",50,'min="1" step="5"')}
    ${field("tA","T<sub>a</sub> (°C)",40,'step="1"')}
    ${field("tJC","Rθ<sub>jc</sub> (°C/W)",0.5,'min="0" step="0.1"')}
    ${field("tCS","Rθ<sub>cs</sub> (°C/W)",0.3,'min="0" step="0.1"')}
    ${field("tSA","Rθ<sub>sa</sub> heat sink (°C/W)",2,'min="0" step="0.1"')}
    ${field("tMax","T<sub>j,max</sub> (°C)",150,'step="5"')}
  </div>
  <div class="ex-out ex-stats">
    ${stat("tPc","Conduction","P = I² × R")}
    ${stat("tPs","Switching","P = E × fs")}
    ${stat("tPt","Total loss","")}
    ${stat("tTj","Junction","Tj = Ta + P × ΣRθ")}
    ${stat("tSAreq","Max sink Rθsa","for Tj = Tj,max")}
  </div>
  <div class="meter-wrap"><div class="meter"><div class="meter-fill" id="tBar"></div></div><span class="pill" id="tPill"></span></div>
  <svg id="tPlot" class="ex-plot" viewBox="0 0 340 190" role="img" aria-label="Loss versus switching frequency"></svg>
  <p class="note ex-foot">Conduction loss stays flat with frequency; switching loss grows in a straight line. That is why higher f<sub>s</sub> shrinks L and C (Lecture 3) but heats the switch.</p>
</div>`);
function thermal(){
  const I=num("tI"), R=num("tR")/1000, E=num("tE")*1e-6, fs=num("tF")*1000, Ta=num("tA");
  const rth = num("tJC")+num("tCS")+num("tSA"), Tmax=num("tMax");
  const Pc=I*I*R, Ps=E*fs, P=Pc+Ps, Tj=Ta+P*rth;
  const saReq = P>0 ? (Tmax-Ta)/P - num("tJC") - num("tCS") : Infinity;
  $("tPc").textContent = fmt(Pc)+" W"; $("tPs").textContent = fmt(Ps)+" W"; $("tPt").textContent = fmt(P)+" W";
  $("tTj").textContent = fmt(Tj,0)+" °C";
  $("tSAreq").textContent = saReq>0 ? fmt(saReq,2)+" °C/W" : "not possible";
  const frac = Math.max(0, Math.min(1, (Tj-Ta)/Math.max(1,(Tmax-Ta))));
  const st = Tj > Tmax ? ["Over Tj,max","bad"] : Tj > Tmax-25 ? ["Under 25 °C margin","warn"] : ["Safe margin","good"];
  $("tBar").style.width = (frac*100)+"%"; $("tBar").dataset.state = st[1];
  $("tPill").textContent = st[0]; $("tPill").dataset.state = st[1];
  const fmaxk = Math.max(200, num("tF")*1.5), pts=[], ptsS=[], ptsT=[];
  for(let k=0;k<=40;k++){ const f=fmaxk*k/40; pts.push([f,Pc]); ptsS.push([f,E*f*1000]); ptsT.push([f,Pc+E*f*1000]); }
  const ymax = Math.max(10, Math.ceil((Pc+E*fmaxk*1000)/10)*10);
  plot($("tPlot"), {x0:0,x1:fmaxk,y0:0,y1:ymax,xt:[0,Math.round(fmaxk/4),Math.round(fmaxk/2),Math.round(3*fmaxk/4),Math.round(fmaxk)],yt:[0,ymax/2,ymax].map(v=>Math.round(v)),
    xl:"fs (kHz)", yl:"Loss (W)", series:[{pts,color:"var(--c2)",dash:"5 4"},{pts:ptsS,color:"var(--c3)",dash:"2 3"},{pts:ptsT,color:"var(--fg)"}],
    vlines:[num("tF")], dots:[{x:num("tF"),y:P,color:"var(--fg)"}]});
}
wire(["tI","tR","tE","tF","tA","tJC","tCS","tSA","tMax"], thermal);
document.querySelector("#l2 .ex-foot").insertAdjacentHTML("beforebegin", `<div class="legend"><span><i style="border-color:var(--c2);border-top-style:dashed"></i>Conduction</span><span><i style="border-color:var(--c3);border-top-style:dotted"></i>Switching</span><span><i style="border-color:var(--fg)"></i>Total</span></div>`);

/* ---------- Lecture 3: duty cycle vs switching frequency ---------- */
mount("l3", `<div class="explorer">
  <div class="ex-head"><strong>Duty cycle vs switching frequency</strong><span class="note">Same buck converter, two different knobs. Watch what each one changes.</span></div>
  <div class="ex-grid">
    ${slider("dD","Duty cycle D (share of each period the switch is on)",0.5,0.05,0.95,0.01)}
    ${slider("dF","Switching frequency f<sub>s</sub> (kHz)",20,10,100,1)}
    ${field("dVg","V<sub>g</sub> (V)",48,'min="1" step="1"')}
    ${field("dL","L (µH)",200,'min="10" step="10"')}
    ${field("dR","Load R (Ω)",5,'min="0.5" step="0.5"')}
  </div>
  <div class="ex-out ex-stats">
    ${stat("dT","Period","T = 1 / fs")}
    ${stat("dOn","On / off time","ton = D × T")}
    ${stat("dV","Output voltage","V = D × Vg")}
    ${stat("dI","Average current","IL = V / R")}
    ${stat("dRip","Ripple ΔiL","(Vg−V)·D / (L·fs)")}
  </div>
  <svg id="dGate" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="Gate signal over 200 microseconds"></svg>
  <svg id="dIL" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="Inductor current over 200 microseconds"></svg>
  <div class="legend"><span><i style="border-color:var(--c3)"></i>Gate signal (switch on = 1)</span><span><i style="border-color:var(--c6)"></i>Inductor current</span><span><i style="border-color:var(--fg);border-top-style:dashed"></i>Average current</span></div>
  <div class="cmp">
    <div><b>Duty cycle D</b> = <i>how long</i> the switch stays on in each period, as a fraction. It sets the <b>average output</b>: V = D × Vg.</div>
    <div><b>Switching frequency f<sub>s</sub></b> = <i>how often</i> the switch turns on per second. It does <b>not</b> change the average output; it sets the <b>ripple</b> and the size of L and C, and it costs switching loss (Lecture 2).</div>
  </div>
  <p class="note ex-foot" id="dNote"></p>
</div>`);
function dfs(){
  const D=num("dD"), fk=num("dF"), fs=fk*1000, Vg=num("dVg"), L=num("dL")*1e-6, R=Math.max(0.1,num("dR"));
  $("dDv").textContent=D.toFixed(2); $("dFv").textContent=fk.toFixed(0)+" kHz";
  const T=1e6/fs, ton=D*T, V=D*Vg, IL=V/R, dI=(Vg-V)*D/(L*fs);
  $("dT").textContent=fmt(T,1)+" µs"; $("dOn").textContent=fmt(ton,1)+" / "+fmt(T-ton,1)+" µs";
  $("dV").textContent=fmt(V,1)+" V"; $("dI").textContent=fmt(IL,2)+" A"; $("dRip").textContent=fmt(dI,2)+" A";
  const W=200, g=[], i=[]; const imin=IL-dI/2, imax=IL+dI/2;
  for(let t0=0; t0<W; t0+=T){
    g.push([t0,0],[t0,1],[Math.min(t0+ton,W),1],[Math.min(t0+ton,W),0],[Math.min(t0+T,W),0]);
    i.push([t0,imin]);
    if(t0+ton<=W){ i.push([t0+ton,imax]); i.push([Math.min(t0+T,W), t0+T<=W ? imin : imax-(imax-imin)*(W-t0-ton)/(T-ton)]); }
    else i.push([W, imin+(imax-imin)*(W-t0)/ton]);
  }
  plot($("dGate"),{padR:true,x0:0,x1:W,y0:-0.15,y1:1.25,xt:[0,50,100,150,200],yt:[0,1],xl:"t (µs)",yl:"Gate signal",series:[{pts:g,color:"var(--c3)",w:2}]});
  const ytop=Math.max(1,Math.ceil((imax)*1.2)), ybot=Math.min(0,Math.floor(imin));
  plot($("dIL"),{padR:true,x0:0,x1:W,y0:ybot,y1:ytop,xt:[0,50,100,150,200],yt:[ybot,Math.round((ybot+ytop)/2),ytop],xl:"t (µs)",yl:"iL (A)",
    series:[{pts:[[0,IL],[W,IL]],color:"var(--fg)",w:1.5,dash:"5 4"},{pts:i,color:"var(--c6)",w:2.4}]});
  const n=W/T;
  $("dNote").innerHTML = `In this 200 µs window the switch turns on ${fmt(n,0)} times. `
    + (imin<0 ? "<b>The current dips below zero:</b> the converter would really enter DCM (discontinuous mode) and V = D × Vg no longer holds. Raise fs or L, or lower R. "
              : "Try it: double fs and the pulses get twice as frequent and the ripple halves, but V stays at "+fmt(V,1)+" V. Change D and V moves, while the period stays "+fmt(T,1)+" µs. ");
}
wire(["dD","dF","dVg","dL","dR"], dfs);

/* ---------- Lecture 4: sinusoidal PWM ---------- */
mount("l4", `<div class="explorer">
  <div class="ex-head"><strong>PWM explorer</strong><span class="note">Compare a sine reference with the triangle carrier and see the bridge output it produces.</span></div>
  <div class="ex-grid">
    ${slider("pM","Modulation index m",0.8,0,1.2,0.01)}
    <label class="fld" for="pMf"><span class="lab"><span>Carrier ratio m<sub>f</sub> = f<sub>s</sub>/60 Hz</span></span><select id="pMf"><option>9</option><option selected>15</option><option>21</option><option>33</option></select></label>
    ${field("pV","V<sub>dc</sub> (V)",400,'min="0" step="10"')}
    <fieldset class="seg"><legend>Modulation</legend>
      <label><input type="radio" name="pMode" value="bi" checked> Bipolar</label>
      <label><input type="radio" name="pMode" value="uni"> Unipolar</label></fieldset>
  </div>
  <div class="ex-out ex-stats">
    ${stat("pPk","Fundamental peak","V = m × Vdc")}
    ${stat("pRms","Fundamental RMS","V = m × Vdc / √2")}
    ${stat("pLev","Output levels","")}
    ${stat("pRip","Filter L sees","")}
    ${stat("pFs","Switching freq.","fs = mf × 60 Hz")}
    ${stat("pRipV","Ripple after filter","LC, cutoff 180 Hz")}
    ${stat("pOut","Blue line peaks","+max / −min")}
  </div>
  <svg id="pTop" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="Reference and carrier"></svg>
  <svg id="pBot" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="Bridge output voltage"></svg>
  <div class="legend"><span><i style="border-color:var(--c4)"></i>Bridge output pulses</span><span><i style="border-color:var(--c6)"></i>After LC filter (what the grid sees)</span><span><i style="border-color:var(--fg);border-top-style:dashed"></i>Ideal fundamental, m × Vdc</span></div>
  <p class="note ex-foot" id="pNote"></p>
</div>`);
function pwm(){
  const m=num("pM"), mf=+$("pMf").value, Vdc=num("pV"), uni=document.querySelector('input[name="pMode"]:checked').value==="uni";
  $("pMv").textContent = m.toFixed(2);
  const N=1500, T=1000/60, ref=[], ref2=[], tri=[], vab=[], fund=[], filt=[];
  const triv = t => { const ph=((t*mf)%1+1)%1; return ph<0.5 ? 1-4*ph : -3+4*ph; };
  const vOf = t => { const r=m*Math.sin(2*Math.PI*t), c=triv(t); return uni ? ((r>c?1:0)-(-r>c?1:0)) : (r>c?1:-1); };
  // 2nd-order LC filter (Butterworth, cutoff 3 x 60 Hz), simulated for 5 cycles; the last cycle is drawn
  const wc=2*Math.PI*3, z=0.707, dt=1/N; let x=0, xd=0;
  for(let i=0;i<5*N;i++){ const t=i*dt, u=vOf(t); xd += (wc*wc*(u-x) - 2*z*wc*xd)*dt; x += xd*dt;
    if(i>=4*N) filt.push([(t-4)*T, x]); }
  const r0=1/3, Hm=1/Math.sqrt((1-r0*r0)**2+(2*z*r0)**2), ph=Math.atan2(2*z*r0,1-r0*r0);
  for(let i=0;i<=N;i++){ const t=i/N, r=m*Math.sin(2*Math.PI*t), c=triv(t);
    ref.push([t*T, r]); ref2.push([t*T,-r]); tri.push([t*T,c]);
    vab.push([t*T, vOf(t)]); fund.push([t*T, Hm*Math.min(m,1.27)*Math.sin(2*Math.PI*t-ph)]); }
  const series=[{pts:tri,color:"var(--muted)",w:1},{pts:ref,color:"var(--c4)",w:2.4}];
  if(uni) series.push({pts:ref2,color:"var(--c7)",w:2.4,dash:"5 3"});
  const xt=[0,4,8,12,16];
  plot($("pTop"),{padR:true,x0:0,x1:T,y0:-1.3,y1:1.3,xt,yt:[-1,0,1],xl:"t (ms, 60 Hz)",yl:"Reference vs carrier",series});
  plot($("pBot"),{x0:0,x1:T,y0:-1.3,y1:1.3,xt,yt:[-1,0,1],xl:"t (ms)",yl:"vab / Vdc",
    right2:{y0:-1.3*Vdc,y1:1.3*Vdc,yt:[-Vdc,0,Vdc].map(v=>Math.round(v)),label:"volts",series:[]},
    series:[{pts:vab,color:"var(--c4)",w:1},{pts:fund,color:"var(--fg)",w:2,dash:"6 4"},{pts:filt,color:"var(--c6)",w:2.6}]});
  let rip=0; filt.forEach(([tt,v])=>{ const ideal=Hm*Math.min(m,1.27)*Math.sin(2*Math.PI*tt/T-ph); rip=Math.max(rip,Math.abs(v-ideal)); });
  $("pFs").textContent = fmt(mf*60,0)+" Hz";
  $("pRipV").textContent = "± "+fmt(rip*Vdc,0)+" V";
  const fpk = Math.max(...filt.map(q=>q[1])), fmin = Math.min(...filt.map(q=>q[1]));
  $("pOut").textContent = "+"+fmt(fpk*Vdc,0)+" / "+fmt(fmin*Vdc,0)+" V";
  const lin = m<=1;
  $("pPk").textContent = lin ? fmt(m*Vdc,0)+" V" : "> "+fmt(Vdc,0)+" V (non-linear)";
  $("pRms").textContent = lin ? fmt(m*Vdc/Math.SQRT2,0)+" V" : "over-modulated";
  $("pLev").textContent = uni ? "0, ±Vdc" : "±Vdc";
  $("pRip").textContent = uni ? "2 × fs" : "fs";
  $("pNote").innerHTML = (lin ? "" : "<b>m &gt; 1 is over-modulation:</b> pulses start to drop out, the output stops following m × Vdc and low-order harmonics appear. ")
    + (uni ? "Unipolar: two mirrored references give a three-level output (0, ±Vdc), so the inductor ripple is at 2·fs and the filter can be smaller."
           : "Bipolar: one reference drives both legs diagonally, so the output only jumps between +Vdc and −Vdc.")
    + " Raise m<sub>f</sub> and the blue filtered line gets smoother while its size stays the same: m sets the amplitude, m<sub>f</sub> sets the ripple. The dashed line is shifted by the filter’s small delay so the two can be compared. A 240 V grid has a 339 V peak, so Vdc must stay above that for a full-bridge.";
}
document.querySelectorAll('input[name="pMode"]').forEach(r => r.addEventListener("change", pwm));
$("pMf").addEventListener("change", pwm);
wire(["pM","pV"], pwm);

/* ---------- Lectures 5-6: LLC gain (FHA) ---------- */
mount("l56", `<div class="explorer">
  <div class="ex-head"><strong>LLC gain explorer (FHA)</strong><span class="note">An LLC is steered by switching frequency. Move f<sub>s</sub> and the load to see which region you land in.</span></div>
  <div class="ex-grid">
    ${slider("lFn","Normalised frequency fn = fs / fr1",1,0.3,2.5,0.01)}
    ${slider("lQ","Load: quality factor Qe (heavier load → higher Qe)",0.4,0.05,1.5,0.01)}
    ${slider("lLn","Inductance ratio Ln = Lm / Lr",5,2,10,0.1)}
    ${field("lLr","L<sub>r</sub> (µH)",60,'min="1" step="1"')}
    ${field("lCr","C<sub>r</sub> (nF)",22,'min="1" step="1"')}
  </div>
  <div class="ex-out ex-stats">
    ${stat("lFr","Series resonance","fr1 = 1/(2π√(Lr·Cr))")}
    ${stat("lFr2","Lower resonance","fr2 = fr1 / √(1 + Ln)")}
    ${stat("lFs","Switching freq.","fs = fn × fr1")}
    ${stat("lM","Gain M","")}
  </div>
  <div class="meter-wrap"><span class="pill" id="lPill"></span><span class="note" id="lReg"></span></div>
  <svg id="lPlot" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="LLC gain versus normalised frequency"></svg>
  <div class="legend"><span><i style="border-color:var(--c5);border-top-width:4px"></i>Your load (Qe slider)</span><span><i style="border-color:var(--muted)"></i>Light load (Qe ÷ 3): tall peak</span><span><i style="border-color:var(--muted)"></i>Heavy load (Qe × 2.5): flat</span></div>
  <div class="ex-sub"><strong>One switching period, simulated</strong><span class="note">The same sliders drive a time-domain simulation of the half-bridge LLC (V<sub>in</sub> = 400 V, so 200 V into the tank). Watch the current at each switch turn-on and the secondary current at each turn-off.</span></div>
  <div class="ex-out ex-stats">
    ${stat("lZvs","ZVS at turn-on","needs iLr < 0")}
    ${stat("lZcs","Rectifier ZCS","at turn-off")}
    ${stat("lIdle","Secondary idle time","per half-cycle")}
    ${stat("lMsim","Simulated gain","vs FHA")}
    ${stat("lIpk","Peak primary current","iLr")}
  </div>
  <svg id="lTime" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="Simulated tank currents over one switching period"></svg>
  <div class="legend"><span><i style="border-color:var(--c2)"></i>Primary (resonant) current i<sub>Lr</sub></span><span><i style="border-color:var(--c7);border-top-style:dashed"></i>Magnetizing current i<sub>Lm</sub></span><span><i style="border-color:var(--c6)"></i>Secondary current (referred to primary) = i<sub>Lr</sub> − i<sub>Lm</sub></span></div>
  <p class="note ex-foot" id="lTimeNote"></p>
  <p class="note ex-foot">Gain from first-harmonic approximation: M = Ln·fn² / √[((Ln+1)·fn² − 1)² + (fn² − 1)²·fn²·Ln²·Qe²]. The two faint curves are the same converter at one third and 2.5 times your load. All curves pass through M = 1 at fn = 1, which is why fs = fr is the efficient design point.</p>
</div>`);
// Time-domain half-bridge LLC, normalised: Lr = Cr = 1 (so wr = 1, Z0 = 1), tank input +/-1 (= Vin/2), ideal diodes.
function llcSim(fn, Ln, Q){
  const Lr=1, Lm=Ln, Ts=2*Math.PI/fn, N=1200, dt=Ts/N, Rp=(Math.PI**2/8)/Q, Co=40;
  let iLr=0, vCr=0, iLm=0, vo=Math.max(0.3, Math.min(2, llcM(fn,Ln,Q))), on=0, rec=null;
  const P=240;
  for(let p=0;p<P;p++){
    const last = p===P-1; if(last) rec={t:[],ir:[],im:[],is:[]};
    for(let k=0;k<N;k++){
      const vab = k<N/2 ? 1 : -1; let isec=0;
      if(on===0){ const vLm=Lm*(vab-vCr)/(Lr+Lm); if(Math.abs(vLm)>=vo) on=Math.sign(vLm); }
      if(on!==0 && (iLr-iLm)*on<0){ on=0; iLm=iLr; }
      if(on===0){ iLr += (vab-vCr)/(Lr+Lm)*dt; iLm=iLr; vCr += iLr*dt; vo += (-vo/Rp)/Co*dt; }
      else { const vL=on*vo; iLr += (vab-vCr-vL)/Lr*dt; iLm += vL/Lm*dt; vCr += iLr*dt; isec=iLr-iLm; vo += (Math.abs(isec)-vo/Rp)/Co*dt; }
      if(last){ rec.t.push(k*dt); rec.ir.push(iLr); rec.im.push(iLm); rec.is.push(isec); }
    }
  }
  rec.vo=vo; rec.Ts=Ts; rec.N=N; return rec;
}
const llcM = (fn, Ln, Q) => { const f2=fn*fn; return Ln*f2/Math.sqrt(((Ln+1)*f2-1)**2 + ((f2-1)*fn*Ln*Q)**2); };
function llc(){
  const fn=num("lFn"), Q=num("lQ"), Ln=num("lLn");
  $("lFnv").textContent=fn.toFixed(2); $("lQv").textContent=Q.toFixed(2); $("lLnv").textContent=Ln.toFixed(1);
  const okLC = num("lLr")>0 && num("lCr")>0;
  const fr1 = okLC ? 1/(2*Math.PI*Math.sqrt(num("lLr")*1e-6*num("lCr")*1e-9))/1000 : NaN;
  const kHz = v => okLC ? fmt(v,1)+" kHz" : "enter Lr and Cr";
  $("lFr").textContent = kHz(fr1); $("lFr2").textContent = kHz(fr1/Math.sqrt(1+Ln)); $("lFs").textContent = kHz(fn*fr1);
  const M = llcM(fn,Ln,Q); $("lM").textContent = fmt(M,2);
  let peakF=0.3, peakM=0;
  for(let f=0.2; f<=1.0001; f+=0.002){ const v=llcM(f,Ln,Q); if(v>peakM){peakM=v;peakF=f;} }
  let reg, st;
  if(Math.abs(fn-1)<0.02){ reg="fs ≈ fr: gain ≈ 1, ZVS on the primary, ZCS on the rectifiers. Best efficiency."; st=["Region 1: at resonance","good"]; }
  else if(fn>1){ reg="Above resonance: gain < 1 (buck), inductive so ZVS holds; rectifier ZCS is lost."; st=["Region 2: above resonance","good"]; }
  else if(fn>peakF){ reg="Below resonance, right of the peak: gain > 1 (boost), still inductive so ZVS holds."; st=["Region 3.1: below resonance (inductive)","warn"]; }
  else { reg="Left of the gain peak: capacitive mode, current leads voltage, ZVS is lost. Overload or short-circuit territory: avoid."; st=["Region 3.2: capacitive","bad"]; }
  $("lPill").textContent=st[0]; $("lPill").dataset.state=st[1]; $("lReg").textContent=reg;
  const curve = q => { const p=[]; for(let f=0.3; f<=2.5001; f+=0.01) p.push([f, llcM(f,Ln,q)]); return p; };
  const qL=Math.max(0.05,Q/3), qH=Q*2.5; let pkL=0; for(let f=0.2; f<=1.0001; f+=0.002) pkL=Math.max(pkL, llcM(f,Ln,qL));
  const labels=[{x:0.6,y:2.02,text:`← light, Qe ${qL.toFixed(2)}`+(pkL>2.2?` (peak ${pkL.toFixed(1)})`:"")},
    {x:2.45,y:llcM(2.45,Ln,qH)-0.12,text:`heavy, Qe ${qH.toFixed(2)}`,anchor:"end"}];
  plot($("lPlot"),{x0:0.3,x1:2.5,y0:0,y1:2.2,xt:[0.5,1,1.5,2,2.5],yt:[0,0.5,1,1.5,2],xl:"fn = fs / fr1",yl:"Gain M",
    bands:[{x0:0.3,x1:peakF,fill:"var(--c2)",label:"capacitive"},{x0:1,x1:2.5,fill:"var(--c5)",label:"buck, ZVS"}],
    series:[{pts:curve(Math.max(0.05,Q/3)),color:"var(--muted)",w:1},{pts:curve(Q*2.5),color:"var(--muted)",w:1},{pts:curve(Q),color:"var(--c5)",w:2.6},
            {pts:[[0.3,1],[2.5,1]],color:"var(--muted)",w:1,dash:"3 3"}],
    vlines:[fn], dots:[{x:fn,y:M,color:"var(--c5)"}], labels});
  // time-domain panel
  const r = llcSim(fn, Ln, Q), N=r.N, h=N/2;
  const Z0 = okLC ? Math.sqrt(num("lLr")*1e-6/(num("lCr")*1e-9)) : 52.2, Ib = 200/Z0;
  const tb = (okLC ? Math.sqrt(num("lLr")*1e-6*num("lCr")*1e-9) : 1.149e-6)*1e6, TsUs = r.Ts*tb;
  const pick = (arr) => arr.filter((_,k)=>k%3===0).map((v,j)=>[r.t[j*3]*tb, v*Ib]);
  const ir0 = r.ir[0]*Ib, isEnd = r.is[h-2]*Ib, ipk = Math.max(...r.ir.map(Math.abs))*Ib;
  let idle=0; for(let k=0;k<h;k++) if(Math.abs(r.is[k])<1e-4) idle++;
  const zvs = ir0 < 0, zcs = Math.abs(isEnd) < 0.02*ipk;
  $("lZvs").textContent = zvs ? `✓ yes (${fmt(ir0,2)} A)` : `✗ lost (+${fmt(ir0,2)} A)`;
  $("lZcs").textContent = zcs ? "✓ reaches zero" : `✗ cut at ${fmt(Math.abs(isEnd),2)} A`;
  $("lIdle").textContent = idle>2 ? fmt(idle/N*TsUs,2)+" µs" : "none";
  $("lMsim").textContent = `${fmt(r.vo,2)} (FHA ${fmt(M,2)})`;
  $("lIpk").textContent = fmt(ipk,2)+" A";
  const ym = Math.max(1, Math.ceil(ipk*1.2));
  plot($("lTime"),{x0:0,x1:TsUs,y0:-ym,y1:ym,xt:[0,TsUs/4,TsUs/2,3*TsUs/4,TsUs].map(v=>+v.toFixed(1)),yt:[-ym,0,ym],xl:"t (µs)",yl:"Current (A)",
    bands:[{x0:0,x1:TsUs/2,fill:"var(--c5)",op:0.06,label:"A1 on"},{x0:TsUs/2,x1:TsUs,fill:"var(--c6)",op:0.06,label:"A2 on"}],
    series:[{pts:[[0,0],[TsUs,0]],color:"var(--muted)",w:1},{pts:pick(r.is),color:"var(--c6)",w:1.8},{pts:pick(r.im),color:"var(--c7)",w:2,dash:"5 4"},{pts:pick(r.ir),color:"var(--c2)",w:2.6}],
    vlines:[TsUs/2], dots:[{x:0,y:ir0,color:zvs?"var(--good)":"var(--bad)"},{x:TsUs/2,y:r.is[h-2]*Ib,color:zcs?"var(--good)":"var(--bad)"}]});
  let note = `Switching period ${fmt(TsUs,2)} µs. `;
  note += zvs ? "At A1 turn-on (left dot) the primary current is negative: it flows back through A1's body diode, so A1 turns on at zero voltage. "
              : "At A1 turn-on (left dot) the primary current is already positive, so there is nothing to discharge Coss: A1 turns on with full voltage across it (hard switching). This is capacitive mode. ";
  note += zcs ? (idle>2 ? `The secondary current finishes its half-sine early and sits at zero for ${fmt(idle/N*TsUs,2)} µs before the switch turns off (secondary DCM): ZCS with margin, but only magnetizing current circulates in that gap. `
                        : "The secondary current reaches zero just as the switch turns off: ZCS with no idle time, the most efficient case. ")
              : `The next half-cycle starts before the secondary current reaches zero, so the diodes are forced off while still carrying ${fmt(Math.abs(isEnd),2)} A (no ZCS, reverse recovery). `;
  note += Math.abs(r.vo-M)>0.03 ? "The simulated gain differs a little from the FHA curve: FHA is an approximation that is exact only near resonance." : "";
  $("lTimeNote").textContent = note;
}
wire(["lFn","lQ","lLn","lLr","lCr"], llc);

/* ---------- Lecture 7: battery pack builder ---------- */
const CHEM = {
  lab3:{n:"Lab 3 Li-ion cell", vn:3.6, vmax:4.2, ah:5.4, whkg:240, float:false},
  lfp:{n:"LFP", vn:3.4, vmax:3.65, ah:100, whkg:150, float:false},
  nmc:{n:"NMC", vn:3.7, vmax:4.2, ah:50, whkg:240, float:false},
  nca:{n:"NCA", vn:3.6, vmax:4.2, ah:5, whkg:270, float:false},
  lto:{n:"LTO", vn:2.4, vmax:2.8, ah:20, whkg:100, float:false},
  pb:{n:"Lead-acid", vn:2.0, vmax:2.4, ah:200, whkg:40, float:true}
};
mount("l7", `<div class="explorer">
  <div class="ex-head"><strong>Battery pack builder</strong><span class="note">Pick a cell, set series and parallel counts, and see the pack and its charge profile.</span></div>
  <div class="ex-grid">
    <label class="fld" for="bChem"><span class="lab"><span>Cell chemistry</span></span><select id="bChem">${Object.entries(CHEM).map(([k,c])=>`<option value="${k}">${c.n} (${c.vn} V)</option>`).join("")}</select></label>
    ${field("bNs","Series cells N<sub>s</sub>",13,'min="1" step="1"')}
    ${field("bNp","Parallel cells N<sub>p</sub>",20,'min="1" step="1"')}
    ${field("bAh","Cell capacity (Ah)",5.4,'min="0.1" step="0.1"')}
    ${field("bR","Cell resistance (mΩ)",20,'min="0" step="1"')}
    ${field("bI","Charge current (A)",22,'min="0.1" step="1"')}
  </div>
  <div class="ex-out ex-stats">
    ${stat("bV","Nominal voltage","Ns × Vcell,nom")}
    ${stat("bVf","Full-charge voltage","Ns × Vcell,max")}
    ${stat("bQ","Pack capacity","Np × Qcell")}
    ${stat("bE","Energy","V × Q")}
    ${stat("bRp","Pack resistance","(Ns/Np) × Rcell")}
    ${stat("bC","C-rate","I / Q")}
    ${stat("bT","Charge time ≈","Q / I")}
    ${stat("bKg","Cell mass ≈","E / (Wh/kg)")}
  </div>
  <svg id="bPlot" class="ex-plot wide" viewBox="0 0 340 190" role="img" aria-label="Charge profile: current and voltage over time"></svg>
  <div class="legend"><span><i style="border-color:var(--c7)"></i>Current (left axis)</span><span><i style="border-color:var(--fg);border-top-style:dashed"></i>Voltage (right axis)</span></div>
  <p class="note ex-foot" id="bNote"></p>
</div>`);
function pack(){
  const c = CHEM[$("bChem").value], Ns=Math.max(1,Math.round(num("bNs"))), Np=Math.max(1,Math.round(num("bNp")));
  const Q=Np*num("bAh"), Vn=Ns*c.vn, Vmax=Ns*c.vmax, E=Vn*Q/1000, I=Math.max(0.01,num("bI")), Rp=Ns/Np*num("bR")/1000;
  $("bV").textContent = fmt(Vn,1)+" V"; $("bVf").textContent = fmt(Vmax,1)+" V";
  $("bQ").textContent = fmt(Q,1)+" Ah"; $("bE").textContent = fmt(E,2)+" kWh"; $("bRp").textContent = fmt(Rp*1000,1)+" mΩ";
  const C=I/Q; $("bC").textContent = fmt(C,2)+"C"; $("bT").textContent = fmt(Q/I,1)+" h"; $("bKg").textContent = fmt(E*1000/c.whkg,0)+" kg";
  // illustrative CC/CV (or bulk/absorption/float) shape
  const tcc = 0.8*Q/I, tau = 0.2*Q/I/1.0, tend = tcc + 3*tau, Vlow = Vn - (Vmax-Vn)*1.2;
  const iP=[], vP=[];
  for(let k=0;k<=120;k++){ const t=tend*k/120; let i,v;
    if(t<=tcc){ i=I; v=Vlow+(Vmax-Vlow)*Math.pow(t/tcc,0.6); } else { i=I*Math.exp(-(t-tcc)/tau); v=Vmax; }
    if(c.float && t>tcc+2*tau){ v=Ns*2.25; i=I*0.02; }
    iP.push([t,i]); vP.push([t,v]); }
  const tx = [0, tend/4, tend/2, 3*tend/4, tend].map(v=>+v.toFixed(1));
  const vlo = Math.floor(Vlow*0.97), vhi = Math.ceil(Vmax*1.02);
  plot($("bPlot"),{x0:0,x1:tend,y0:0,y1:I*1.15,xt:tx,yt:[0,+(I/2).toFixed(1),+I.toFixed(1)],xl:"t (h)",yl:"I (A)",
    series:[{pts:iP,color:"var(--c7)",w:2.6}], vlines:[tcc],
    right2:{y0:vlo,y1:vhi,yt:[vlo,Math.round((vlo+vhi)/2),vhi],label:"V",series:[{pts:vP,color:"var(--fg)",dash:"5 3"}]}});
  const warn = C>1 ? " <b>Above 1C:</b> most Li-ion cells limit charging to about 1C (slides: LFP 1C, NCA 0.7C)." : "";
  $("bNote").innerHTML = (c.float
    ? "Lead-acid: bulk (constant current) → absorption (constant voltage, ends by timer or at C/20) → float at 2.25 V/cell."
    : "Li-ion: constant current until the pack reaches full voltage (dotted line), then constant voltage while the current tapers. No float stage.")
    + " The curve shape is illustrative; real timing comes from the cell's OCV–SOC table." + warn
    + " Full voltage uses typical cell limits (Lecture 7 gives nominal voltages).";
}
$("bChem").addEventListener("change", () => { const c=CHEM[$("bChem").value]; $("bAh").value=c.ah; if($("bChem").value==="lab3"){ $("bNs").value=13; $("bNp").value=20; $("bI").value=22; } pack(); });
wire(["bNs","bNp","bAh","bR","bI"], pack);
})();
