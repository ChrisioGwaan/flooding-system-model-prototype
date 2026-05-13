/* Community / backup channels */

function ScreenCommunity() {
  const layers = [
    { i: "01", t: "Battery-backed household device", d: "Mains + 2–4 week battery; LoRa fallback when cellular fails. Never displays silent ‘safe’.",
      tags: ["Hardware", "Always-on"] },
    { i: "02", t: "Multi-channel digital alerts", d: "SMS broadcast, app push, automated voice call, email — fanned out in parallel.",
      tags: ["SMS", "Push", "Voice", "Email"] },
    { i: "03", t: "Geographical broadcast fallback", d: "If precise targeting is uncertain, widen to suburb-level alerts via radio and council channels.",
      tags: ["Radio", "Suburb-wide"] },
    { i: "04", t: "Manual operator override", d: "Council / SES staff can issue alerts, escalate, and force fallbacks under a two-person rule.",
      tags: ["Operator", "Audit-logged"] },
    { i: "05", t: "Street-level physical warnings", d: "Flashing beacons, flood signs, and warning lights at key roads, crossings, and public hubs.",
      tags: ["Beacons", "Signage"] },
    { i: "06", t: "Community backup network", d: "Neighbourhood wardens, aged-care managers, and community centres confirm and assist door-to-door.",
      tags: ["Wardens", "Aged care", "Hubs"] },
    { i: "07", t: "Printed preparedness material", d: "Every household receives a fridge-magnet action card and an evacuation checklist for offline reference.",
      tags: ["Offline", "Multilingual"] },
  ];

  return (
    <div className="screen">
      <div className="grid-2" style={{gridTemplateColumns: "1.4fr 1fr"}}>
        <div className="layer-stack">
          {layers.map(l => (
            <div className="layer" key={l.i}>
              <div className="l-idx">{l.i}</div>
              <div>
                <div className="l-title">{l.t}</div>
                <div className="l-desc">{l.d}</div>
                <div className="l-tags">
                  {l.tags.map(t => <span className="l-tag" key={t}>{t}</span>)}
                </div>
              </div>
              <Pill tone="ok">ACTIVE</Pill>
            </div>
          ))}
        </div>

        <div style={{display:"grid", gap:16}}>
          <div className="print-card">
            <div className="pc-eyebrow">Maribyrnong Council · Flood action card</div>
            <h4>If you see RED — go now.</h4>
            <ol>
              <li>Move people, pets, then vehicles to higher ground.</li>
              <li>Take phone, charger, ID, medications.</li>
              <li>Use Hopkins St / Williamstown Rd evacuation route.</li>
              <li>Avoid the underpass and any moving water.</li>
              <li>Check on your two nearest neighbours.</li>
              <li>Listen to ABC Local Radio 774 AM.</li>
            </ol>
            <div style={{marginTop: 14, fontFamily:"'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: ".1em", color:"#76591a", textTransform:"uppercase"}}>
              Keep on fridge · 24/7 helpline 1800 226 226
            </div>
          </div>

          <Panel title="Why layered" seq="DOC">
            <div style={{fontSize:12, color:"var(--ink-2)", lineHeight:1.55}}>
              No single technology is dependable in a flood. The architecture stacks digital,
              physical, human, and printed layers so that when one quietly fails, the others
              are loud enough to compensate. This is the &ldquo;never silently safe&rdquo;
              principle, applied end-to-end.
            </div>
          </Panel>

          <Panel title="Coverage" seq="HH">
            <div className="kv">
              <span className="k">Active zones</span><span className="v">5</span>
              <span className="k">Households reached</span><span className="v">2,078</span>
              <span className="k">Devices deployed</span><span className="v">1,612</span>
              <span className="k">Community wardens</span><span className="v">38</span>
              <span className="k">Public displays</span><span className="v">22</span>
              <span className="k">Print cards issued</span><span className="v">2,300</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.ScreenCommunity = ScreenCommunity;
