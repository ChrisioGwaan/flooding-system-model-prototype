/* Map of Maribyrnong — schematic */

function ScreenMap({ scenario }) {
  const [selected, setSelected] = useState("Z-02");
  const ZONES = window.FLOOD_DATA.ZONES;

  // Schematic zone polygons
  const zones = [
    { id: "Z-01", name: "Maribyrnong Flats",    d: "M180,140 L320,120 L360,200 L300,260 L200,250 Z" },
    { id: "Z-02", name: "Footscray Riverside",  d: "M360,200 L460,220 L500,310 L420,360 L320,310 L300,260 Z" },
    { id: "Z-03", name: "Avondale Heights West",d: "M80,80 L180,140 L160,230 L70,210 Z" },
    { id: "Z-04", name: "Maidstone South",      d: "M70,210 L160,230 L200,250 L180,330 L80,330 Z" },
    { id: "Z-05", name: "Essendon Lowlands",    d: "M320,40 L460,60 L470,150 L360,140 L320,120 Z" },
  ];
  const zoneById = Object.fromEntries(ZONES.map(z => [z.id, z]));

  const fillFor = (level) => ({
    crit: "rgba(182,50,28,0.35)",
    warn: "rgba(201,138,20,0.32)",
    info: "rgba(44,95,168,0.22)",
    ok:   "rgba(47,125,78,0.20)",
  }[level]);

  const strokeFor = (level) => ({
    crit: "var(--c-crit)",
    warn: "var(--c-warn)",
    info: "var(--c-info)",
    ok:   "var(--c-ok)",
  }[level]);

  const sensors = [
    { id: "RG-01", x: 280, y: 180, label: "RG-01" },
    { id: "RG-02", x: 410, y: 280, label: "RG-02" },
    { id: "RF-04", x: 130, y: 140, label: "RF-04" },
    { id: "TT-12", x: 380, y: 320, label: "TT-12" },
  ];

  const focus = zoneById[selected] || zoneById["Z-02"];

  return (
    <div className="screen">
      <div className="map-canvas">
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
          {/* River */}
          <path d="M50,40 C 200,80 220,180 320,200 S 480,330 580,360"
            stroke="var(--c-info)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.45" />
          <path d="M50,40 C 200,80 220,180 320,200 S 480,330 580,360"
            stroke="var(--c-info)" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Zones */}
          {zones.map(z => {
            const data = zoneById[z.id];
            return (
              <g key={z.id}>
                <path
                  className="map-zone"
                  d={z.d}
                  fill={fillFor(data.level)}
                  stroke={strokeFor(data.level)}
                  strokeWidth={selected === z.id ? "3" : "1.5"}
                  strokeDasharray={data.level === "crit" ? "4 3" : "0"}
                  onClick={() => setSelected(z.id)}
                  style={{cursor:"pointer"}}
                />
              </g>
            );
          })}

          {/* Zone labels */}
          {zones.map(z => {
            const data = zoneById[z.id];
            // approximate centroid
            const path = z.d.match(/[\d.]+/g).map(Number);
            let cx = 0, cy = 0, n = 0;
            for (let i = 0; i < path.length; i += 2) { cx += path[i]; cy += path[i+1]; n++; }
            cx /= n; cy /= n;
            return (
              <g key={"l"+z.id} transform={`translate(${cx} ${cy})`}>
                <text textAnchor="middle" y="-2" style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:9, letterSpacing:".12em", fill:"var(--ink-2)"}}>
                  {z.id}
                </text>
                <text textAnchor="middle" y="12" style={{fontSize:11, fontWeight:600, fill:"var(--ink)"}}>
                  {z.name}
                </text>
                <text textAnchor="middle" y="26" style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:9, letterSpacing:".08em", fill:"var(--ink-3)"}}>
                  {data.households} HH · {data.level.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Sensors */}
          {sensors.map(s => (
            <g key={s.id} transform={`translate(${s.x} ${s.y})`} className="map-marker">
              <circle className="ring" cx="0" cy="0" />
              <circle cx="0" cy="0" r="5" fill="var(--bg-elev)" stroke="var(--ink)" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2" fill="var(--ink)" />
              <text x="8" y="4" style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:9, fill:"var(--ink-2)", letterSpacing:".08em"}}>{s.label}</text>
            </g>
          ))}

          {/* Compass */}
          <g transform="translate(40 360)" style={{fontFamily:"'IBM Plex Mono', monospace", fontSize: 9, fill: "var(--ink-3)"}}>
            <circle cx="0" cy="0" r="14" fill="none" stroke="var(--rule)" />
            <path d="M0 -10 L3 0 L0 10 L-3 0 Z" fill="var(--ink-2)" />
            <text x="0" y="-18" textAnchor="middle">N</text>
          </g>

          {/* Scale */}
          <g transform="translate(500 380)" style={{fontFamily:"'IBM Plex Mono', monospace", fontSize: 8, fill: "var(--ink-3)"}}>
            <line x1="0" y1="0" x2="60" y2="0" stroke="var(--ink-3)" strokeWidth="1" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--ink-3)" />
            <line x1="60" y1="-3" x2="60" y2="3" stroke="var(--ink-3)" />
            <text x="30" y="14" textAnchor="middle">1 KM</text>
          </g>
        </svg>

        <div className="map-legend">
          <div className="row" style={{marginBottom: 6, color: "var(--ink-3)"}}>WARNING LEVEL</div>
          {[["crit","URGENT"],["warn","PREPARE"],["info","WATCH"],["ok","NORMAL"]].map(([t, l]) => (
            <div className="row" key={t}>
              <span className="sw" style={{background: fillFor(t), borderColor: strokeFor(t)}} />
              <span>{l}</span>
            </div>
          ))}
        </div>

        <div className="map-readout">
          <div className="panel-title" style={{padding:0, fontSize:10}}>
            <span className="seq">SELECTED</span><span>{focus.id}</span>
          </div>
          <div style={{marginTop:10, fontWeight:600, fontSize:14}}>{focus.name}</div>
          <div style={{marginTop:6}}><Pill tone={focus.level === "crit" ? "crit" : focus.level === "warn" ? "warn" : focus.level === "info" ? "info" : "ok"}>{focus.level.toUpperCase()}</Pill></div>
          <div className="kv" style={{marginTop:12}}>
            <span className="k">Households</span><span className="v">{focus.households}</span>
            <span className="k">Risk score</span><span className="v">{focus.risk}/100</span>
            <span className="k">Devices online</span><span className="v">{Math.floor(focus.households * 0.94)}</span>
            <span className="k">Last alert</span><span className="v">14:38</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenMap = ScreenMap;
