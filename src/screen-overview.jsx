/* Overview / landing */

function ScreenOverview({ goTo }) {
  return (
    <div className="screen">
      <div className="hero">
        <div className="hero-l">
          <div className="hero-tag">
            <span className="bar" />
            <span>Maribyrnong council × SES</span>
            <span>·</span>
            <span>Concept prototype</span>
          </div>
          <h1 className="hero-h">
            A resilient flood<br/>
            warning <em>chain</em>,<br/>
            from river to home.
          </h1>
          <p className="hero-p">
            Multi-source sensing feeds a decision system that targets at-risk households across
            Maribyrnong. Every link is observed, redundant, and degrades to a louder signal — never
            a silent &ldquo;safe.&rdquo;
          </p>
          <div className="hero-cta">
            <button className="btn" onClick={() => goTo("operator")}>
              View operator dashboard <span className="arrow">→</span>
            </button>
            <button className="btn ghost" onClick={() => goTo("failure")}>
              Run a failure scenario
            </button>
            <button className="btn ghost" onClick={() => goTo("device")}>
              Inspect household device
            </button>
          </div>

          <div className="hero-stats">
            <div className="s"><div className="n">7</div><div className="l">Sensing nodes</div></div>
            <div className="s"><div className="n">2,078</div><div className="l">Households in zone</div></div>
            <div className="s"><div className="n">6</div><div className="l">Alert channels</div></div>
            <div className="s"><div className="n">5</div><div className="l">Backup layers</div></div>
          </div>
        </div>

        <div className="hero-r">
          <FlowDiagram />
        </div>
      </div>

      <div className="grid-4">
        <ConceptTile ix="01" glyph="river" h="Multi-source sensing"
          d="River gauges, rainfall, telecom-tower telemetry, and BOM data — cross-checked before any decision." />
        <ConceptTile ix="02" glyph="server" h="Decision engine"
          d="Fuses signals, maps to flood zones, computes warning level per zone, and selects households." />
        <ConceptTile ix="03" glyph="home" h="Household device"
          d="A glanceable in-home dial. Mains-powered, 2–4 week battery. Never silently shows ‘safe.’" />
        <ConceptTile ix="04" glyph="bolt" h="Five backup layers"
          d="Redundant sensing, multi-channel alerts, manual override, area broadcast, community network." />
      </div>
    </div>
  );
}

function ConceptTile({ ix, glyph, h, d }) {
  return (
    <div className="tile">
      <div className="ix">{ix}</div>
      <div className="glyph"><Icon name={glyph} /></div>
      <h4>{h}</h4>
      <p>{d}</p>
    </div>
  );
}

function FlowDiagram() {
  // Sensing → Centre → Households, with a pulse traveling along
  return (
    <div className="flow">
      <svg className="flow-svg" viewBox="0 0 540 480" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-3)" />
          </marker>
        </defs>

        {/* sensing column */}
        {[
          { y: 60, label: "RIVER GAUGE", sub: "RG-01", icon: "river" },
          { y: 140, label: "RAINFALL", sub: "RF-04", icon: "rain" },
          { y: 220, label: "TOWER TELEMETRY", sub: "TT-12", icon: "tower" },
          { y: 300, label: "BOM FEED", sub: "AU-VIC", icon: "feed" },
        ].map((s, i) => (
          <g key={i} transform={`translate(20 ${s.y})`}>
            <rect x="0" y="0" width="140" height="50" rx="4" fill="var(--bg-elev)" stroke="var(--rule)" />
            <rect x="0" y="0" width="3" height="50" fill="var(--c-info)" />
            <text x="14" y="22" className="flow-node-label">{s.label}</text>
            <text x="14" y="36" className="flow-node-sub">{s.sub} · live</text>
          </g>
        ))}

        {/* centre */}
        <g transform="translate(220 170)">
          <rect x="0" y="0" width="120" height="100" rx="4" fill="var(--bg-elev)" stroke="var(--ink)" strokeWidth="1.5" />
          <text x="14" y="22" className="flow-node-label">DECISION ENGINE</text>
          <text x="14" y="36" className="flow-node-sub">Fuse · validate · route</text>
          <text x="14" y="62" className="flow-node-sub" style={{fontSize: 14, fill: "var(--ink)"}}>3 of 4</text>
          <text x="14" y="78" className="flow-node-sub">sources confirm</text>
        </g>

        {/* households */}
        {[
          { y: 60, label: "DEVICE", sub: "412 hh", icon: "home" },
          { y: 140, label: "SMS", sub: "638 hh", icon: "sms" },
          { y: 220, label: "PUSH", sub: "528 hh", icon: "push" },
          { y: 300, label: "VOICE", sub: "212 hh", icon: "phone" },
        ].map((s, i) => (
          <g key={i} transform={`translate(390 ${s.y})`}>
            <rect x="0" y="0" width="130" height="50" rx="4" fill="var(--bg-elev)" stroke="var(--rule)" />
            <rect x="127" y="0" width="3" height="50" fill="var(--c-warn)" />
            <text x="14" y="22" className="flow-node-label">{s.label}</text>
            <text x="14" y="36" className="flow-node-sub">{s.sub}</text>
          </g>
        ))}

        {/* connectors: sensing → centre */}
        {[85, 165, 245, 325].map((y, i) => (
          <path key={"a"+i}
            d={`M160 ${y} C 200 ${y}, 200 220, 220 220`}
            className="arch-link live"
          />
        ))}

        {/* connectors: centre → channels */}
        {[85, 165, 245, 325].map((y, i) => (
          <path key={"b"+i}
            d={`M340 220 C 370 220, 370 ${y}, 390 ${y}`}
            className="arch-link live"
          />
        ))}

        {/* labels above */}
        <text x="20" y="36" className="flow-node-label" style={{fill:"var(--ink-3)"}}>SENSING</text>
        <text x="220" y="160" className="flow-node-label" style={{fill:"var(--ink-3)"}}>CENTRAL</text>
        <text x="390" y="36" className="flow-node-label" style={{fill:"var(--ink-3)"}}>DELIVERY</text>

        {/* legend stripe */}
        <g transform="translate(20 380)">
          <text x="0" y="0" className="flow-node-label" style={{fill:"var(--ink-3)"}}>FLOW</text>
          <line x1="50" y1="-4" x2="160" y2="-4" stroke="var(--c-info)" strokeWidth="1.5" strokeDasharray="3 5" />
          <text x="170" y="0" className="flow-node-label" style={{fill:"var(--ink-3)"}}>BACKUP</text>
          <line x1="220" y1="-4" x2="320" y2="-4" stroke="var(--c-warn)" strokeWidth="1.5" strokeDasharray="6 3" />
        </g>
      </svg>
    </div>
  );
}

window.ScreenOverview = ScreenOverview;
