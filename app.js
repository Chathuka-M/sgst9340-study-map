const L = [
 {id:"l1", n:"Lecture 1", bands:[1], c:"--c1", title:"Course Introduction", src:"28 slides", tree:[
  {t:"Course aims", c:[
    {t:"Lectures: system integration of power-conversion building blocks (DC-DC, DC-AC, AC-DC) and energy storage"},
    {t:"Labs: build PSIM simulation skills for each building block"},
    {t:"Project: use real field data to make an engineering contribution"}]},
  {t:"Evaluation", c:[
    {t:"Labs 20% (5 lab reports)"},
    {t:"Course project 25%", c:[{t:"Milestone 1: 5%"},{t:"Milestone 2 + final IEEE-format paper: 20%"}]},
    {t:"Other assessments: 15% and 40% (see the evaluation slide)"},
    {t:"AI may not be used to get answers in exams or other assessments where it isn't allowed"}]},
  {t:"Preview of the course", c:[
    {t:"Device packages: through-hole, SMD (D2PAK/TO-263, DPAK/TO-252, TOLL, TOLT, Q-DPAK), power modules (half-bridge, full-bridge, 6-pack)"},
    {t:"EV drive power module: 3-phase 2-level IGBT, 750 V, 450 Adc, Tj max 175 °C, fs up to 10 kHz"},
    {t:"DC-DC: buck, boost, four-switch buck-boost"},
    {t:"DC-AC: bipolar, unipolar and hybrid modulation"},
    {t:"Resonant LLC: soft switching for high efficiency and power density"},
    {t:"Multilevel converters: lower-rated parts for high voltage; FACTS"},
    {t:"Power supplies for digital and low-noise circuits"}]},
  {t:"Product examples", c:[
    {t:"30 kVA solar inverter; 180 kW string inverter"},
    {t:"Commercial Li-ion ESS: 150 kWh, 75 kW, 880 V nominal, 0.5C, 4000 cycles"},
    {t:"Residential ESS and EV chargers"},
    {t:"PV cell efficiency chart (NREL)"}]},
  {t:"Course project", c:[
    {t:"Example system: poly-Si PV, lead-acid battery (235 Ah), 120/240 Vac grid, New Westminster BC"},
    {t:"Each student gets unique field data: 30 s samples over one day"},
    {t:"IEEE paper, 5–8 pages", c:[
      {t:"Title and abstract → introduction and literature review"},
      {t:"Preliminary data analysis → full data analysis"},
      {t:"Proposed design improvements → market potential and conclusions → references"}]},
    {t:"Presentation: 10 min + 5 min Q&A"},
    {t:"Research angles: system optimization, prognostics, health management, AI / data mining"},
    {t:"Suggested venues: ECCE, APEC, EPEC, CIGRE, PEDS, CCECE"}]},
  {t:"Lab: computer-aided design", c:[{t:"PSIM modelling and simulation of power-electronics circuits; five lab reports"}]}
 ]},
 {id:"l2", n:"Lecture 2", bands:[2], c:"--c2", title:"Power Semiconductor Devices", src:"35 slides", tree:[
  {t:"Where devices are used", c:[
    {t:"Battery converter (DC-AC): grid-forming, behaves as an AC voltage source (V/f control)"},
    {t:"PV inverter (DC-AC): grid-feeding, behaves as an AC current source"},
    {t:"PV / storage converter (DC-DC): constant voltage or constant current"},
    {t:"Your system's battery inverter is the grid-forming case", proj:true}]},
  {t:"Device types", c:[
    {t:"Diode, MOSFET, BJT, IGBT, SiC MOSFET, GaN HEMT"},
    {t:"Operating quadrants: single, two and four quadrant"},
    {t:"Kelvin-source pin: separates the gate-drive loop from the power loop → better di/dt immunity, less gate ringing"},
    {t:"Si MOSFET: body diode gives Qrr / Qoss losses and a dv/dt limit"},
    {t:"GaN HEMT: no body diode, zero reverse recovery", c:[
      {t:"E-mode (normally-off): fast, but PCB layout is critical (low-inductance planes)"},
      {t:"Cascode: normally-on GaN + Si MOSFET in series behaves as normally-off"},
      {t:"Packages 100 V / 650 V, top- or bottom-side cooling"}]},
    {t:"On-state model: MOSFET and GaN act as a resistor in both directions; IGBT acts like a diode drop and conducts reverse current through its anti-parallel diode"}]},
  {t:"Design method", c:[
    {t:"Topology → device selection → isolation (reinforced, creepage/clearance, dv/dt) → gate voltages → gate-drive power → driver IC → dead time"},
    {t:"Calculate and simulate (MathCAD, PSpice, PSIM, MATLAB/Simulink, Excel), then verify experimentally"},
    {t:"Check the Safe Operating Area (SOA)"}]},
  {t:"Power loss", c:[
    {t:"Total loss = conduction + switching", f:["P_cond = I_rms² × R_ds(on)(Tj)","P_sw   = (E_on + E_off) × f_s","P_MOS  = P_cond + P_sw"]},
    {t:"E_on and E_off come from the double-pulse test (clamped inductive load)"},
    {t:"Cooling design is sized from this loss estimate"}]},
  {t:"Thermal design", c:[
    {t:"Heat leaves by conduction, convection and radiation (black anodized heat sink radiates about 5–25% more than shiny aluminium)"},
    {t:"Steady state: junction temperature rise follows the thermal resistance chain", f:["Tj = Ta + P × (Rθjc + Rθcs + Rθsa)","Rθsa(max) = (Tj,max − Ta)/P − Rθjc − Rθcs"]},
    {t:"Pulsed power: Tj rises and falls exponentially, like a parallel RC circuit"},
    {t:"Verify with thermal simulation and an infrared camera"}]},
  {t:"Gate drive", c:[
    {t:"Why isolate: high-side switch, safety, voltage-level translation, avoiding ground loops"},
    {t:"Isolation technologies", c:[
      {t:"Optical: noise-immune and cheap; longer delay, LED ageing"},
      {t:"Capacitive: low delay; sensitive to electric fields"},
      {t:"Magnetic (coreless transformer): high CMTI, long life; sensitive to magnetic fields"}]},
    {t:"Problems and fixes", c:[
      {t:"Voltage overshoot → reduce loop inductance, tune gate resistors, limit dv/dt"},
      {t:"Miller (Cgd) false turn-on → negative turn-off bias (e.g. +15 / −5 V), Kelvin connection"},
      {t:"Shoot-through from too-short dead time → interlock delay in the controller (too long hurts power quality)"},
      {t:"Gate ringing → Kelvin source, larger Rg, separate Rg per paralleled device, ferrite bead"}]},
    {t:"Typical driver specs: ±5 A, 5 kV isolation, 8 mm creepage, CMTI 100 V/ns, 50 ns delay, 2 pF barrier capacitance"},
    {t:"Example: 12 kW boost, 100 V → 1000 V"}]}
 ]},
 {id:"l3", n:"Lecture 3", bands:[3], c:"--c3", title:"DC-DC Converters", src:"23 slides", tree:[
  {t:"Overview", c:[
    {t:"Non-isolated and isolated types"},
    {t:"Uses: phones, laptops, servers, energy storage, EV chargers, transport, telecom, lighting, renewables"},
    {t:"Design goals: high efficiency, high power density (higher fs → smaller L and C), low cost, reliability (fewer parts)"}]},
  {t:"Analysis tools (CCM)", c:[
    {t:"Small-ripple approximation: treat v(t) ≈ V"},
    {t:"Inductor volt-second balance: average vL over one period = 0"},
    {t:"Capacitor charge balance: average iC over one period = 0"}]},
  {t:"Buck (step-down, V < Vg)", g:[["buck-circuit","Buck topology: switch T, diode D, inductor L, output capacitor C (L3 slide 7)"]], c:[
    {t:"Switch on: vL = Vg − V; switch off: vL = −V", g:[["buck-states","Buck switching states: T on (left) and T off, diode freewheeling (L3 slide 8)"]]},
    {t:"Volt-second balance gives the conversion ratio", f:["(Vg − V)·D·Ts + (−V)·(1 − D)·Ts = 0","V = D × Vg","Ig = D × IL"], g:[["buck-ratio","Buck: V vs D is a straight line from 0 to Vg; inductor ripple, CCM and DCM waveforms (L3 slide 11)"]]},
    {t:"Inductor sizing (buck)", f:["ΔiL = (Vg − V)·D / (2·L·fs)","L = (Vg − V)·D / (2·ΔiL·fs)"]},
    {t:"Simple, few components"}]},
  {t:"Boost (step-up, V > Vg)", g:[["boost-circuit","Boost topology: inductor on the input side, switch to ground, diode to the output (L3 slide 7)"]], c:[
    {t:"Switch on: vL = Vg; switch off: vL = Vg − V", g:[["boost-states","Boost switching states: T on stores energy in L, T off releases it through D (L3 slide 13)"]]},
    {t:"Volt-second balance", f:["Vg·D·Ts + (Vg − V)·(1 − D)·Ts = 0","V = Vg / (1 − D)","I = IL × (1 − D)"], g:[["boost-ratio","Boost: V rises as 1/(1 − D); the real circuit peaks and collapses near D = 1 because of losses (L3 slide 16)"]]},
    {t:"Inductor and output ripple sizing", f:["ΔiL = Vg·D·Ts / (2L)  →  L = Vg·D·Ts / (2ΔiL)","Δv  = V·D·Ts / (2RC)  →  C = V·D·Ts / (2RΔv)"]},
    {t:"In the off-state the output is not decoupled from the input"},
    {t:"Uses: switching regulators, battery chargers, consumer electronics; synchronous version is more efficient"},
    {t:"Your PV MPPT stage is a DC-DC converter of this family", proj:true}]},
  {t:"Synchronous and combined topologies", c:[
    {t:"Replace the diode with a switch → lower losses and bidirectional power flow", g:[["sync-buck-boost","Buck and boost become synchronous by replacing D with a second switch (L3 slide 21)"]]},
    {t:"A synchronous buck run in reverse is a boost"},
    {t:"Four-switch, one-inductor buck-boost: output can be above or below the input", f:["Buck mode (B1 on, A1/A2 switch):  V = D × Vg","Boost mode (A1 on, B1/B2 switch): V = Vg / (1 − D)"], g:[["four-switch","4-switch buck-boost: legs A and B share one inductor (L3 slide 22)"]]}]}
 ]},
 {id:"l4", n:"Lecture 4", bands:[4], c:"--c4", title:"DC-AC Inverters", src:"27 slides", tree:[
  {t:"Overview", c:[
    {t:"Non-isolated and isolated"},
    {t:"Uses: UPS, voltage-forming inverters, energy storage, telecom, renewables"},
    {t:"Course focus: voltage-controlled (VC-VSI) and current-controlled (CC-VSI) voltage source inverters"},
    {t:"Output shapes: square wave, modified sine wave, sinusoidal"}]},
  {t:"Half-bridge vs full-bridge", g:[["half-full-bridge","Half-bridge (output ±Vdc/2) and full-bridge (output ±Vdc) inverters (L4 slide 8)"]], c:[
    {t:"Half-bridge: output switches between ±Vdc/2; capacitor midpoint tied to neutral", f:["Vdc > 2 × Vg(pk)"]},
    {t:"Full-bridge: output switches between ±Vdc", f:["Vdc > Vg(pk)"]}]},
  {t:"PWM objectives", c:[
    {t:"Reproduce the reference (sinusoid), linear voltage control"},
    {t:"Low harmonics, low switching loss, good use of the DC bus"}]},
  {t:"Sinusoidal modulation", c:[
    {t:"Bipolar: Vab = +Vdc or −Vdc; both legs switch diagonally with the same reference; filter L sees fs", g:[["bipolar","Bipolar PWM: sine reference vs triangle carrier sets A1/A4 and A2/A3 (L4 slide 10)"]]},
    {t:"Unipolar: Vab = 0 / +Vdc in the positive half-cycle, 0 / −Vdc in the negative; mirrored references; filter L sees 2·fs → smaller inductor", g:[["unipolar","Unipolar PWM: two mirrored references; output steps 0/±Vdc (L4 slide 13)"]]},
    {t:"Hybrid: one leg switches at fs, the other at line frequency (50/60 Hz)"},
    {t:"Output vs modulation index (the inverter's \"duty-cycle\" relationship)", f:["m = v̂ctrl / v̂tri","v̄(t) = m × Vdc × sin(2π·f·t + θ)    (full-bridge, linear range m ≤ 1)","V_out,pk = m × Vdc   (half-bridge: m × Vdc/2)","THD = (1/Vo1) × √(Σ Von²),  n = 2, 3, …"], g:[["pwm-summary","Modulation summary, average output equation and THD (L4 slide 18)"]]}]},
  {t:"Grid-connected topologies", g:[["grid-hb-fb","Grid-tied half-bridge (needs Vdc > 2·Vg,pk) and full-bridge (Vdc > Vg,pk) (L4 slide 20)"]], c:[
    {t:"H5: H-bridge + 5th switch (H5)", g:[["h5","H5: extra DC-side switch; zero states when H5 is off (L4 slide 21)"]]},
    {t:"HERIC: H-bridge + bidirectional switch (two back-to-back MOSFETs) on the AC side", g:[["heric","HERIC: AC-side bidirectional switch H1/H2 (L4 slide 22)"]]},
    {t:"H6: H-bridge + two switches + two diodes", g:[["h6","H6: switches H1/H2 and diodes D1/D2 around the bridge (L4 slide 23)"]]},
    {t:"All three add zero-voltage states that disconnect the DC side during freewheeling"}]},
  {t:"Split-phase (120/240 V, 3-wire)", c:[
    {t:"Full-bridge + neutral leg: the third leg compensates unbalanced active and reactive phase currents", g:[["split-phase","Split-phase inverter: neutral leg plus phase a and b legs (L4 slide 25)"]]},
    {t:"3L-TNPC + neutral leg"},
    {t:"Your site's 120/240 Vac grid is this split-phase system", proj:true}]}
 ]},
 {id:"l56", n:"Lectures 5–6", bands:[5,6], c:"--c5", title:"Resonant Converters (LLC)", src:"Part 1 & Part 2", tree:[
  {t:"Why resonant", c:[
    {t:"Parasitic L and C cause switching loss; snubbers limit spikes but add more loss"},
    {t:"High dv/dt and di/dt at high frequency create EMI"},
    {t:"Fix: use L-C resonance so the switch voltage and current don't overlap"}]},
  {t:"Soft switching", c:[
    {t:"ZVS (zero-voltage switching): discharge Coss before the gate turns on; body diode conducts first. Preferred for MOSFETs"},
    {t:"ZCS (zero-current switching): no reverse-recovery loss. Preferred for diodes, BJTs, IGBTs"},
    {t:"Cost: higher RMS circulating current → more conduction loss"}]},
  {t:"LLC basics", g:[["llc-blocks","The four blocks of a half-bridge LLC: 1 switch network, 2 resonant tank (Cr1+Cr2, Lr, Lm), 3 transformer, 4 rectifier and output capacitor (annotated from L1 slide 13)"],["llc","LLC circuits and gain vs switching frequency: regions 1, 2 and 3.1 are inductive (ZVS); 3.2 is capacitive (avoid). Lecture 5/6 numbering; L1 slide 13 labels the capacitive region 3.1 (L1 slide 13)"]], c:[
    {t:"Half-bridge switched at 50% duty gives a square wave into the tank (Lr, Cr, Lm)"},
    {t:"Cr also blocks DC, so the transformer doesn't saturate"},
    {t:"Name: L-L-C = the tank's two inductors (Lr, Lm) and one capacitor (Cr). Sibling designs: LC (series resonant) and LCC"},
    {t:"The tank sits on the primary side, before the transformer; the rectifier and Co come after it", c:[
      {t:"Cr is split into Cr1 and Cr2 (split-capacitor half-bridge, node b); for the AC current they act in parallel", f:["Cr = Cr1 + Cr2"]},
      {t:"Lr is in series from node a to the transformer; with Cr it sets fr1"},
      {t:"Lm is drawn across the primary n1: it is the transformer's own magnetizing inductance (set by the core air gap); Lr is often its leakage inductance"},
      {t:"No load: all tank current flows through Lm, so Lr + Lm resonate → fr2. Heavy load: the reflected load bypasses Lm, so only Lr resonates → fr1"},
      {t:"Current path with A1 on: +rail → A1 → node a → Lr → primary (and Lm) → node b → Cr1/Cr2 → rails; the secondary feeds Co through D1/D4 or D2/D3"}]},
    {t:"Resonance: where the inductor and capacitor reactances are equal and cancel", f:["XL = 2π·f·Lr = XC = 1 / (2π·f·Cr)","f = 1 / (2π·√(Lr·Cr))","Example: Lr = 60 µH, Cr = 22 nF → fr1 = 138.5 kHz, XL = XC = 52.2 Ω"]},
    {t:"Gain M: how much the tank scales the voltage compared with the transformer ratio alone (the LLC's version of duty cycle)", f:["M = n·Vo / (Vin/2)","Vo = M × (Vin/2) / n"]},
    {t:"Tank vs filter: same LC physics, opposite purpose. A filter's resonance sits far below fs to block it; the LLC tank sits at fs to use it"},
    {t:"First Harmonic Approximation (FHA): only the fundamental carries power", f:["fr1 = f0 = 1 / (2π·√(Lr·Cr))","fr2 = 1 / (2π·√((Lr + Lm)·Cr))","Qe = √(Lr / Cr) / Re","Re = (8 / π²) × n² × R","Rcrt = √(Zsc × Zopen)"]},
    {t:"In an LLC, output is set by switching frequency, not duty cycle (duty stays 50%): gain ≈ 1 at fs = fr, < 1 above, > 1 below"},
    {t:"Challenges: best for step-down (gain < 1); hard to regulate at no load; ZVS lost at light load"}]},
  {t:"Operating modes", c:[
    {t:"fs = fr: voltage and current in phase, ZVS via Lm, boundary CCM/DCM → best efficiency"},
    {t:"fs > fr: gain < 1 (buck), inductive region → ZVS; secondary ZCS depends on Q"},
    {t:"3.1) fr2 < fs < fr1 and R > Rcrt: below resonance, still inductive, gain > 1 (boost)", f:["Rcrt = √(Zsc × Zopen)"]},
    {t:"3.2) fr2 < fs < fr1 and R < Rcrt: capacitive mode (current leads voltage), overload or short circuit, avoid"}]},
  {t:"Special conditions", c:[
    {t:"No load: Lr–Lm act as a voltage divider, efficiency drops → burst / pulse-skipping mode"},
    {t:"Overload or short circuit: Lm is shunted, tank becomes series Lr–Cr → limit the current"},
    {t:"Start-up: soft-start from high frequency to avoid inrush and transformer DC offset"}]},
  {t:"Design trade-offs", c:[
    {t:"Higher Lm helps secondary ZCS but weakens primary ZVS; typical Lm/Lr ≈ 3–6"},
    {t:"More circulating energy helps ZVS but raises conduction loss"},
    {t:"Dead-time tuning keeps primary ZVS and secondary ZCS"}]},
  {t:"Topologies (Lecture 6)", c:[
    {t:"Half-bridge primary + full-bridge diode secondary: high-voltage output, bridge gain 0.5"},
    {t:"Half-bridge + centre-tap synchronous rectifier: low voltage, high current; Lr and Lm can be built into the transformer"},
    {t:"Full-bridge primary (gain 1): higher power, with diode or centre-tap SR secondary"},
    {t:"Full-bridge + two paralleled centre-tap secondaries: matrix / PCB planar transformer, about 1 MHz"},
    {t:"Product example: 3 kW, 48 V → 380 V telecom LLC"}]}
 ]},
 {id:"l7", n:"Lecture 7", bands:[7], c:"--c7", title:"Energy Storage Devices", src:"32 slides", tree:[
  {t:"Classification", c:[
    {t:"Electrochemical batteries: primary (non-rechargeable) and secondary (lead-acid, Ni-Cd, Ni-MH, Li-ion, Li-Po)"},
    {t:"Flow batteries, fuel cells, supercapacitors, capacitors"}]},
  {t:"Key terms", c:[
    {t:"Specific energy, Wh/kg: higher = lighter for the same energy"},
    {t:"Energy density, Wh/L: higher = smaller"},
    {t:"C-rate: current relative to capacity", f:["C-rate = I / Q","1C empties the battery in 1 hour"]},
    {t:"Power cell (high current) vs energy cell (high Wh/kg)"}]},
  {t:"Chemistries", c:[
    {t:"Lead-acid: 40 Wh/kg, 2 V/cell, 2.25 V/cell float; cheap, surge current; heavy, short life"},
    {t:"Ni-Cd 60 Wh/kg, Ni-MH 120 Wh/kg: 1.2 V/cell, memory effect"},
    {t:"LTO: 100 Wh/kg, 2.4 V; very safe, 80% capacity at −30 °C; expensive"},
    {t:"LFP: 150 Wh/kg, 3.4 V; safest Li-ion (runaway 270 °C), very flat voltage curve"},
    {t:"Your bank is LFP: the flat curve makes bus voltage a weak SOC signal", proj:true},
    {t:"LMO 150 Wh/kg (3.8 V), LCO 240 (3.6 V), NMC 240 (3.7 V), NCA 270 (3.6 V), Li-Po 250 (3.7 V)"},
    {t:"Trade-off: more Wh/kg usually means a lower thermal-runaway temperature (NCA, LCO 150 °C)"}]},
  {t:"Other electrochemical devices", c:[
    {t:"Fuel cell (PEMFC): H₂ + O₂ → electricity + water; a generator, not storage; boost converter lifts its low, sagging voltage"},
    {t:"Flow battery: electrolyte in external tanks; energy and power scale independently; >20,000 cycles, 100% DoD, ~75% efficiency; grid scale (>200 kWh, 700–1500 Vdc, 4–8 h)"}]},
  {t:"Charging profiles", c:[
    {t:"Li-ion: constant current (trickle → pre-charge at C/10 → fast charge), then constant voltage while current tapers; no float"},
    {t:"Lead-acid: bulk (CC) → absorption (CV, ends by timer or C/20) → float; equalize about 1 h every 2–3 months"}]},
  {t:"Li-ion pack model (PSIM)", c:[
    {t:"Series cells add voltage, parallel cells add capacity", f:["V_pack = Ns × V_cell","Q_pack = Np × Q_cell","R_pack = (Ns / Np) × R_cell"]},
    {t:"OCV–SOC and R–SOC look-up tables"},
    {t:"Lab 3 example: 13s20p, 54.6 V full, 108 Ah, charged at 22 A ≈ 0.2C"}]},
  {t:"BMS", c:[
    {t:"Algorithms: SOC, SOH, SOP, cell balancing"},
    {t:"Protections: over/under-voltage, over-current, short circuit, thermal runaway"},
    {t:"Charge current derated with temperature"},
    {t:"Example pack: 16 × 3.4 V LFP, 5,000–12,000 cycles"}]},
  {t:"Li-ion vs lead-acid", c:[
    {t:"Li-ion: 85–95% efficiency, 90% DoD, 2,000–6,000 cycles"},
    {t:"Lead-acid: 60–80% efficiency, 50–60% DoD, lowest cost"}]}
 ]}
];

const bandColor = n => `var(--c${n})`;
const esc = s => s.replace(/[&<>]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));

// overview chips
document.getElementById("chips").innerHTML = L.map(l =>
  `<a class="chip" href="#${l.id}"><span class="band">${l.bands.map(b=>`<i style="background:${bandColor(b)}"></i>`).join("")}</span><span><small>${l.n}</small><strong>${esc(l.title)}</strong></span></a>`).join("");

const EXPLORER = `<div class="explorer" aria-label="Duty-cycle explorer">
  <div class="ex-head"><strong>Duty-cycle explorer</strong><span class="note">Ideal CCM conversion ratios. Move D and see each output.</span></div>
  <div class="ex-ctrl">
    <label for="exD">Duty cycle D <output id="exDv">0.50</output></label>
    <input id="exD" type="range" min="0" max="0.9" step="0.01" value="0.5">
    <label for="exVg">Input Vg (V)</label>
    <input id="exVg" type="number" min="1" max="1000" step="1" value="48">
  </div>
  <div class="ex-out">
    <div><span class="k" style="color:var(--c3)">Buck</span><code>V = D × Vg</code><b id="exBuck"></b></div>
    <div><span class="k" style="color:var(--c6)">Boost</span><code>V = Vg / (1 − D)</code><b id="exBoost"></b></div>
  </div>
  <svg id="exPlot" viewBox="0 0 340 185" role="img" aria-label="Output-to-input ratio V/Vg versus duty cycle D for buck and boost"></svg>
</div>`;

let uid = 0;
function renderNode(n, depth){
  const id = "n" + (uid++);
  const kids = n.c && n.c.length;
  const eqs = (n.f||[]).map(e => `<code class="eq">${esc(e)}</code>`).join("");
  const tag = n.proj ? `<span class="proj">project</span>` : "";
  const figs = (window.NO_FIGS ? [] : (n.g||[])).map(([src,cap]) => `<figure class="fig"><button type="button" class="fig-btn" data-src="img/${src}.png" data-cap="${esc(cap)}" aria-label="Enlarge: ${esc(cap)}"><img src="img/${src}.png" alt="${esc(cap)}" loading="lazy"></button><figcaption>${esc(cap)}</figcaption></figure>`).join("");
  return `<li class="lvl${depth}" data-text="${esc((n.t+" "+(n.f||[]).join(" ")+" "+(n.g||[]).map(x=>x[1]).join(" ")).toLowerCase())}">
    <div class="node">${kids ? `<button class="tog" type="button" aria-expanded="true" aria-controls="${id}" aria-label="Fold or unfold">−</button>` : ""}
      <div class="txt">${tag}<span class="label">${esc(n.t)}</span>${eqs}${figs}</div></div>
    ${kids ? `<ul id="${id}">${n.c.map(k=>renderNode(k, depth+1)).join("")}</ul>` : ""}</li>`;
}
document.getElementById("map").innerHTML = L.map(l =>
  `<section class="lec" id="${l.id}" style="--c:var(${l.c})">
     <div class="lec-head"><span class="num">${l.n.toUpperCase()}</span><h2>${esc(l.title)}</h2><span class="src">${l.src}</span></div>
     ${l.id==="l3" ? EXPLORER : ""}<ul class="tree">${l.tree.map(n=>renderNode(n,1)).join("")}</ul>
   </section>`).join("");

function setOpen(btn, open){
  btn.setAttribute("aria-expanded", open);
  btn.textContent = open ? "−" : "+";
  document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
}
document.getElementById("map").addEventListener("click", e => {
  const b = e.target.closest(".tog"); if(!b) return;
  setOpen(b, b.getAttribute("aria-expanded") !== "true");
});
const allTogs = () => document.querySelectorAll(".tog");
document.getElementById("exp").onclick = () => allTogs().forEach(b => setOpen(b, true));
document.getElementById("col").onclick = () => allTogs().forEach(b => setOpen(b, false));

// search
const q = document.getElementById("q"), count = document.getElementById("count");
function clearMarks(){ document.querySelectorAll(".label").forEach(s => { s.innerHTML = esc(s.textContent); }); }
q.addEventListener("input", () => {
  const term = q.value.trim().toLowerCase();
  clearMarks();
  const lis = [...document.querySelectorAll("#map li")];
  if(!term){ lis.forEach(li => li.classList.remove("hide")); document.querySelectorAll(".lec").forEach(s=>s.classList.remove("hide")); count.textContent=""; return; }
  let hits = 0;
  lis.forEach(li => li.classList.add("hide"));
  lis.forEach(li => {
    if(li.dataset.text.includes(term)){
      hits++;
      const lab = li.querySelector(":scope > .node .label");
      const t = lab.textContent, i = t.toLowerCase().indexOf(term);
      if(i >= 0) lab.innerHTML = esc(t.slice(0,i)) + "<mark>" + esc(t.slice(i,i+term.length)) + "</mark>" + esc(t.slice(i+term.length));
      li.classList.remove("hide");
      li.querySelectorAll("li").forEach(d => d.classList.remove("hide"));
      let p = li.parentElement.closest("li");
      while(p){ p.classList.remove("hide"); const b = p.querySelector(":scope > .node .tog"); if(b) setOpen(b,true); p = p.parentElement.closest("li"); }
    }
  });
  document.querySelectorAll(".lec").forEach(s => s.classList.toggle("hide", !s.querySelector("li:not(.hide)")));
  count.textContent = hits ? `${hits} match${hits>1?"es":""}` : "No matches. Try a shorter term";
});

// duty-cycle explorer
function drawExplorer(){
  const D = +document.getElementById("exD").value, Vg = +document.getElementById("exVg").value || 0;
  document.getElementById("exDv").textContent = D.toFixed(2);
  document.getElementById("exBuck").textContent = (D*Vg).toFixed(1) + " V";
  document.getElementById("exBoost").textContent = (Vg/(1-D)).toFixed(1) + " V";
  const x0=36,x1=300,y0=160,y1=24,maxR=10;
  const X=d=>x0+(d/1)*(x1-x0), Y=r=>y0-(Math.min(r,maxR)/maxR)*(y0-y1);
  let buck="",boost="";
  for(let d=0; d<=0.9001; d+=0.01){ buck+=`${X(d).toFixed(1)},${Y(d).toFixed(1)} `; boost+=`${X(d).toFixed(1)},${Y(1/(1-d)).toFixed(1)} `; }
  let grid="";
  [0,2,4,6,8,10].forEach(r=>{ grid+=`<line x1="${x0}" x2="${x1}" y1="${Y(r)}" y2="${Y(r)}" class="gl"/><text x="${x0-6}" y="${Y(r)+4}" text-anchor="end" class="tl">${r}</text>`; });
  [0,0.2,0.4,0.6,0.8,1].forEach(d=>{ grid+=`<text x="${X(d)}" y="${y0+14}" text-anchor="middle" class="tl">${d}</text>`; });
  document.getElementById("exPlot").innerHTML = `${grid}
    <text x="${x0}" y="12" class="tl">V / Vg</text><text x="${x1+14}" y="${y0+4}" class="tl">D</text>
    <polyline points="${buck}" fill="none" stroke="var(--c3)" stroke-width="2.5"/>
    <polyline points="${boost}" fill="none" stroke="var(--c6)" stroke-width="2.5"/>
    <line x1="${X(D)}" x2="${X(D)}" y1="${y1}" y2="${y0}" class="cur"/>
    <circle cx="${X(D)}" cy="${Y(D)}" r="4.5" fill="var(--c3)"/><circle cx="${X(D)}" cy="${Y(1/(1-D))}" r="4.5" fill="var(--c6)"/>`;
}
["exD","exVg"].forEach(id => document.getElementById(id).addEventListener("input", drawExplorer));
drawExplorer();

// figure lightbox
const lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg"), lbCap = document.getElementById("lbCap");
let lastFocus = null;
document.getElementById("map").addEventListener("click", e => {
  const f = e.target.closest(".fig-btn"); if(!f) return;
  lastFocus = f; lbImg.src = f.dataset.src; lbImg.alt = f.dataset.cap; lbCap.textContent = f.dataset.cap;
  lb.hidden = false; document.getElementById("lbClose").focus();
});
function closeLb(){ lb.hidden = true; if(lastFocus) lastFocus.focus(); }
document.getElementById("lbClose").onclick = closeLb;
lb.addEventListener("click", e => { if(e.target === lb) closeLb(); });
document.addEventListener("keydown", e => { if(e.key === "Escape" && !lb.hidden) closeLb(); });
