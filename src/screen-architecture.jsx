/* System architecture interactive diagram */

function ScreenArchitecture({ killed }) {
  const [selected, setSelected] = useState("CORE");

  // node positions in % of canvas
  const nodes = [
    { id: "RG-01", label: "Sensor", title: "River gauge", x: 6, y: 12, layer: "Sensing" },
    { id: "RF-04", label: "Sensor", title: "Rainfall", x: 6, y: 32, layer: "Sensing" },
    { id: "TT-12", label: "Sensor", title: "Tower telemetry", x: 6, y: 52, layer: "Sensing" },
    { id: "BOM",   label: "Feed",   title: "BOM authority", x: 6, y: 72, layer: "Sensing" },

    { id: "GW",    label: "Edge",   title: "Field gateway", x: 28, y: 32, layer: "Aggregation" },
    { id: "VAL",   label: "Service",title: "Validation & fusion", x: 28, y: 56, layer: "Aggregation" },

    { id: "CORE",  label: "Core",   title: "Decision engine", x: 50, y: 44, layer: "Central" },
    { id: "STBY",  label: "Region", title: "Standby region (AU-SE2)", x: 50, y: 76, layer: "Central" },

    { id: "OPS",   label: "Ops",    title: "Operator console", x: 50, y: 14, layer: "Central" },

    { id: "DEV",   label: "Channel",title: "Household device", x: 76, y: 14, layer: "Delivery" },
    { id: "SMS",   label: "Channel",title: "SMS",           x: 76, y: 30, layer: "Delivery" },
    { id: "PUSH",  label: "Channel",title: "App push",      x: 76, y: 46, layer: "Delivery" },
    { id: "VOICE", label: "Channel",title: "Voice call",    x: 76, y: 62, layer: "Delivery" },
    { id: "PUB",   label: "Channel",title: "Public siren / sign", x: 76, y: 78, layer: "Delivery" },

    { id: "HH",    label: "Endpoint", title: "Households", x: 92, y: 46, layer: "Delivery" },
  ];

  const links = [
    ["RG-01","GW"], ["RF-04","GW"], ["TT-12","GW"], ["BOM","VAL"],
    ["GW","VAL"], ["VAL","CORE"], ["CORE","STBY"],
    ["CORE","OPS"], ["OPS","CORE"],
    ["CORE","DEV"], ["CORE","SMS"], ["CORE","PUSH"], ["CORE","VOICE"], ["CORE","PUB"],
    ["DEV","HH"], ["SMS","HH"], ["PUSH","HH"], ["VOICE","HH"], ["PUB","HH"],
  ];

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const sel = nodeMap[selected];

  const detailMap = {
    "RG-01": { p: "Hydrostatic river-level gauge with telemetry over LTE-M and LoRa fallback. Reports level, temperature, and a heartbeat every 30s.",
      pts: ["Threshold: 2.0 m / 3.2 m / 4.0 m", "Battery: 5-year primary cell", "Health: heartbeat-monitored"] },
    "RF-04": { p: "Tipping-bucket rainfall sensor on a council building. Resolution 0.2 mm; transmits rolling 5/15/60-min intensity.",
      pts: ["Cross-validates river rises", "Drives early-warning thresholds", "Solar + battery"] },
    "TT-12": { p: "Telecom-tower-assisted sensing — uses signal-attenuation patterns from existing infrastructure to estimate rainfall intensity over a wide footprint. Treated as supporting data, not primary.",
      pts: ["Wide-area coverage", "Reduces single-point dependence", "Confidence-weighted"] },
    "BOM":   { p: "Authority feed from the Bureau of Meteorology. Used for thresholds, official warning corroboration, and synoptic context.",
      pts: ["Read-only data", "Latency: ~2 min", "Cross-references VicEmergency"] },
    "GW":    { p: "Edge gateway that aggregates sensor packets, signs them, and forwards to validation. Buffers data if upstream is unreachable.", pts: ["Local store-and-forward","Hardware watchdog","UPS-backed"] },
    "VAL":   { p: "Validation and fusion service. Detects sensor anomalies, weights by confidence, and produces a fused flood-state per zone.", pts: ["Anomaly detection","Sensor-health map","Multi-source consensus"] },
    "CORE":  { p: "Decision engine. Maps fused state to warning levels, selects households, generates messages, and dispatches across channels.", pts: ["Zone-level warning logic","Household routing","Message templating"] },
    "STBY":  { p: "Geo-redundant standby region. Promoted when primary fails; supports operator-led degraded mode.", pts: ["Read-only by default","Operator-authorised writes","Quarterly failover drills"] },
    "OPS":   { p: "Operator console for SES / Council. Manual override, escalation, channel selection, and audit logging.", pts: ["Two-person rule for mass alerts","Full audit trail","Drill mode"] },
    "DEV":   { p: "In-home flood warning device. Shows glanceable state, plays a tone, and confirms acknowledgement back to the system.", pts: ["LoRa + cellular","2–4 week battery","Never shows silent ‘safe’"] },
    "SMS":   { p: "Cell-broadcast and targeted SMS. Carrier-graded path with high reach but vulnerable to congestion.", pts: ["Carrier broadcast","Targeted by zone","Fallback-friendly"] },
    "PUSH":  { p: "Mobile app push for residents who have installed the council app. Rich content; requires data link.", pts: ["Map + actions","Two-way ack","Quiet-hours override"] },
    "VOICE": { p: "Automated voice calls — important for elderly residents and those without smartphones.", pts: ["Multilingual","Re-tries on no answer","Human-readable script"] },
    "PUB":   { p: "Street-level public displays, sirens, and signage. Catches people not in their homes.", pts: ["Solar + battery","Failover to siren","On key roads & crossings"] },
    "HH":    { p: "Households across Maribyrnong flood zones. Routing engine selects the right channel mix per resident profile.", pts: ["~2,078 in active zones","Profile-aware routing","Community fallback"] },
  };

  return (
    <div className="screen">
      <div className="grid-3" style={{gridTemplateColumns: "2.4fr 1fr"}}>
        <div className="arch-canvas">
          <svg className="arch-svg" viewBox="0 0 1000 640" preserveAspectRatio="none">
            {/* layer columns */}
            {["Sensing","Aggregation","Central","Delivery"].map((l, i) => (
              <g key={l}>
                <line x1={[0,220,440,680][i]} y1="0" x2={[0,220,440,680][i]} y2="640" stroke="var(--rule-2)" />
                <text x={[10,230,450,690][i]} y="20" className="flow-node-label" style={{fontSize: 9, fill:"var(--ink-3)"}}>{l.toUpperCase()}</text>
              </g>
            ))}

            {links.map(([a,b], i) => {
              const A = nodeMap[a], B = nodeMap[b];
              const aDown = killed.includes(a) || killed.includes(b);
              const isBackup = (killed.includes("CORE") && (a === "CORE" || a === "STBY")) ||
                               (killed.includes("RG-01") && a === "TT-12");
              const cls = aDown ? "arch-link fail" : (isBackup ? "arch-link backup" : "arch-link live");
              const x1 = A.x*10, y1 = A.y*6.4, x2 = B.x*10, y2 = B.y*6.4;
              const cx = (x1+x2)/2;
              return (
                <path key={i} className={cls} d={`M${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`} />
              );
            })}
          </svg>

          {nodes.map(n => {
            const state = killed.includes(n.id) ? "down" : (n.id === "STBY" && killed.includes("CORE") ? "active" : "ok");
            return (
              <div key={n.id}
                className="arch-node"
                data-active={selected === n.id}
                data-state={state === "down" ? "down" : "ok"}
                style={{left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)"}}
                onClick={() => setSelected(n.id)}
              >
                <div className="nlabel">{n.label}</div>
                <div className="ntitle">{n.title}</div>
                <div className="nstat">
                  {state === "down" ? "● OFFLINE" : (n.id === "STBY" && killed.includes("CORE") ? "● PROMOTED" : "● online")}
                </div>
              </div>
            );
          })}

          {sel && (
            <div className="arch-detail fade-in" key={sel.id}>
              <div className="meta">{sel.layer} · {sel.id}</div>
              <h5>{sel.title}</h5>
              <p>{detailMap[sel.id]?.p}</p>
              <ul>
                {detailMap[sel.id]?.pts.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div style={{display:"grid", gap:16}}>
          <Panel title="Layer reference" seq="REF">
            <div style={{display:"grid", gap: 10, fontSize: 12}}>
              {[
                { l: "L1 — Sensing", d: "Multi-source: river, rain, tower, authority feed." },
                { l: "L2 — Aggregation", d: "Edge gateway + validation/fusion service." },
                { l: "L3 — Central", d: "Decision engine, standby region, ops console." },
                { l: "L4 — Delivery", d: "Device, SMS, push, voice, public signage." },
                { l: "L5 — Resilience", d: "Manual override, community network, printed cards." },
              ].map((r,i) => (
                <div key={i}>
                  <div style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:10, letterSpacing:".1em", color:"var(--ink-3)"}}>{r.l.toUpperCase()}</div>
                  <div style={{marginTop:2}}>{r.d}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Edge legend" seq="LEG">
            <div style={{display:"grid", gap: 10, fontSize: 12}}>
              <div className="row"><span style={{width:24, borderTop:"1.5px dashed var(--c-info)"}} />Live data flow</div>
              <div className="row"><span style={{width:24, borderTop:"1.5px dashed var(--c-warn)"}} />Backup pathway</div>
              <div className="row"><span style={{width:24, borderTop:"1.5px dashed var(--c-crit)"}} />Failed link</div>
              <div className="hr" />
              <div className="dim mono" style={{fontSize:10, letterSpacing:".06em"}}>Click a node for detail. Use Tweaks → Component health to kill nodes and see fallback engage.</div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.ScreenArchitecture = ScreenArchitecture;
