/* Operator dashboard */

function OperatorControls() {
  const [logEntries, setLogEntries] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [drill, setDrill] = useState(false);

  const addLog = (m) => setLogEntries(l => [{ t: new Date().toLocaleTimeString('en-AU', {hour12:false}), m }, ...l].slice(0, 4));

  const fire = (action) => {
    if (action === "override") {
      addLog("Manual override · alert issued to Z-02 (638 hh)");
    } else if (action === "escalate") {
      addLog("Z-02 escalated → URGENT · all channels engaged");
    } else if (action === "drill") {
      const next = !drill;
      setDrill(next);
      addLog(next ? "Drill mode ON · alerts marked TEST" : "Drill mode OFF");
    }
    setConfirm(null);
  };

  return (
    <>
      <div style={{display:"grid", gap: 8}}>
        <button className="btn danger" style={{justifyContent:"center"}} onClick={() => setConfirm("override")}>
          Manual override · Issue alert
        </button>
        <button className="btn ghost" style={{justifyContent:"center"}} onClick={() => setConfirm("escalate")}>Escalate Z-02 → URGENT</button>
        <button className="btn ghost" style={{justifyContent:"center"}} onClick={() => fire("drill")} data-active={drill}>
          {drill ? "✓ Drill mode active" : "Drill mode"}
        </button>
      </div>
      {confirm && (
        <div style={{marginTop:10, padding:10, background:"var(--c-warn-2)", border:"1px solid var(--c-warn)", borderRadius:4, fontSize:12}}>
          <div style={{color:"var(--c-warn)", fontFamily:"'IBM Plex Mono', monospace", fontSize:10, letterSpacing:".1em", marginBottom:6}}>TWO-PERSON RULE — CONFIRM</div>
          <div style={{color:"var(--ink-2)", marginBottom:8}}>{confirm === "override" ? "Issue manual flood alert to all affected zones?" : "Escalate Footscray Riverside (Z-02) to URGENT?"}</div>
          <div style={{display:"flex", gap:6}}>
            <button className="btn danger" style={{padding:"6px 10px", fontSize:10}} onClick={() => fire(confirm)}>Confirm</button>
            <button className="btn ghost" style={{padding:"6px 10px", fontSize:10}} onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}
      {logEntries.length > 0 && (
        <div style={{marginTop:10, padding:10, background:"var(--bg)", border:"1px solid var(--rule)", borderRadius:4, fontSize:11, fontFamily:"'IBM Plex Mono', monospace"}}>
          {logEntries.map((e, i) => (
            <div key={i} style={{display:"flex", gap:8, padding:"3px 0", color:"var(--ink-2)"}}>
              <span style={{color:"var(--ink-3)"}}>{e.t}</span><span>{e.m}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ScreenOperator({ killed, speed }) {
  const { SENSORS, ZONES, CHANNELS, EVENTS } = window.FLOOD_DATA;
  const tick = useTicker(1500, speed);

  const liveSensors = SENSORS.map(s => {
    const isDown = killed.includes(s.id);
    const noise = Math.sin((tick + s.id.charCodeAt(0)) * 0.7) * 0.06;
    return {
      ...s,
      value: isDown ? 0 : +(s.value + s.trend * 0.02 + noise).toFixed(2),
      status: isDown ? "off" : s.status,
    };
  });

  const networkDown = killed.includes("NET") || killed.includes("PUSH");
  const channelsLive = CHANNELS.map(c => {
    if (killed.includes(c.id.toUpperCase())) return { ...c, delivered: 0, status: "down" };
    if (networkDown && c.id === "push") return { ...c, delivered: 18, status: "down" };
    return c;
  });

  const sparkData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => 2.0 + 0.1 * Math.sin(i * 0.4) + 0.04 * i);
  }, []);

  const primary = liveSensors.find(s => s.id === "RG-01");
  const pinPct = killed.includes("RG-01")
    ? 0
    : Math.min(100, ((primary.value - primary.threshold.ok) / (primary.threshold.crit - primary.threshold.ok)) * 100);

  return (
    <div className="screen">
      <div className="op-grid">
        {/* LEFT — sensors */}
        <Panel title="Sensor health" seq="L1"
          right={<Pill tone={killed.length ? "warn" : "ok"}>{killed.length ? `${killed.length} OFFLINE` : "ALL ONLINE"}</Pill>}>
          <div style={{margin: "-16px"}}>
            {liveSensors.map(s => (
              <div className="sensor-row" key={s.id}>
                <div>
                  <div className="id">{s.id}</div>
                  <Pill tone={s.status === "off" ? "off" : s.status === "warn" ? "warn" : "ok"}>
                    {s.status === "off" ? "OFFLINE" : s.status === "warn" ? "ELEVATED" : "OK"}
                  </Pill>
                </div>
                <div>
                  <div className="name">{s.name}</div>
                  <div className="sub">{s.kind.toUpperCase()} · heartbeat {s.status === "off" ? "—" : "30s"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="mono tabular" style={{fontSize: 14}}>{s.status === "off" ? "—" : s.value}</div>
                  <div className="sub">{s.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* CENTER */}
        <div style={{display:"grid", gap: 16}}>
          <Panel title="Maribyrnong River — RG-01" seq="L1.A"
            right={
              <div className="row">
                <Pill tone={killed.includes("RG-01") ? "off" : pinPct > 65 ? "crit" : pinPct > 30 ? "warn" : "ok"}>
                  {killed.includes("RG-01") ? "OFFLINE" : pinPct > 65 ? "URGENT" : pinPct > 30 ? "PREPARE" : "WATCH"}
                </Pill>
              </div>
            }>
            <div className="spread">
              <div className="bigval">
                <div className="n">{killed.includes("RG-01") ? "—" : (primary.value).toFixed(2)}</div>
                <div className="u">m AHD</div>
                <div className={`delta ${primary.trend > 0 ? "up" : "down"}`}>
                  {primary.trend > 0 ? "▲" : "▼"} {Math.abs(primary.trend).toFixed(2)}/h
                </div>
              </div>
              <div style={{flex:1, marginLeft: 24}}>
                <Sparkline data={sparkData} tone={pinPct > 65 ? "crit" : pinPct > 30 ? "warn" : "info"} />
              </div>
            </div>

            <div className="threshold-bar">
              <div className="pin" style={{left: `${pinPct}%`}} />
            </div>
            <div className="threshold-marks">
              <span>NORMAL · 2.0 m</span>
              <span>PREPARE · 3.2 m</span>
              <span>URGENT · 4.0 m</span>
            </div>

            {killed.includes("RG-01") && (
              <div style={{marginTop: 12, padding: 10, background: "var(--c-warn-2)", border: "1px solid var(--c-warn)", borderRadius: 4, fontSize: 12, color:"var(--c-warn)"}}>
                <span className="mono">⚠ FALLBACK ACTIVE</span> — TT-12 telemetry promoted as primary. Confidence 0.82.
              </div>
            )}
          </Panel>

          <Panel title="Affected zones" seq="L3.A"
            right={<span className="mono dim" style={{fontSize:10, letterSpacing:".08em"}}>5 ZONES · 2,078 HH</span>}>
            <div style={{margin: "-16px"}}>
              {ZONES.map(z => (
                <div className="zone-row" key={z.id}>
                  <div>
                    <div className="zn">{z.name}</div>
                    <div className="zh">{z.id} · {z.households} households</div>
                  </div>
                  <div className="zh">RISK {z.risk}</div>
                  <Pill tone={z.level === "crit" ? "crit" : z.level === "warn" ? "warn" : z.level === "info" ? "info" : "ok"}>
                    {z.level === "crit" ? "URGENT" : z.level === "warn" ? "PREPARE" : z.level === "info" ? "WATCH" : "NORMAL"}
                  </Pill>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Delivery channels" seq="L4">
            <div className="delivery-grid">
              {channelsLive.map(c => (
                <div className="delivery-card" key={c.id} data-state={c.status === "down" ? "down" : c.status === "warn" ? "warn" : "ok"}>
                  <div className="ch">{c.name}</div>
                  <div className="pct">{c.delivered}<span style={{fontSize:12, color:"var(--ink-3)"}}>%</span></div>
                  <div className="barbg"><div className="barfg" style={{width: `${c.delivered}%`}} /></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* RIGHT */}
        <div style={{display:"grid", gap: 16}}>
          <Panel title="Operator controls" seq="OPS">
            <OperatorControls />
            <div className="hr" />
            <div className="kv">
              <span className="k">Mode</span><span className="v">{killed.length ? "DEGRADED" : "AUTO"}</span>
              <span className="k">Operator</span><span className="v">SES-VIC-04</span>
              <span className="k">Two-person rule</span><span className="v">ON</span>
              <span className="k">Audit log</span><span className="v">writing</span>
            </div>
          </Panel>

          <Panel title="Event log" seq="LOG"
            right={<span className="mono dim" style={{fontSize:10}}>UTC+10</span>}>
            <div style={{margin: "-16px", maxHeight: 280, overflow: "auto"}}>
              {EVENTS.slice().reverse().map((e, i) => (
                <div className="ev-row" key={i}>
                  <span className="t">{e.t}</span>
                  <span className="m">{e.m}</span>
                  <span className="lvl" data-tone={e.level}>{e.level}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.ScreenOperator = ScreenOperator;
