/* Failure scenario simulator */

function ScreenFailure({ scenario, setScenario, speed }) {
  const { SCENARIOS } = window.FLOOD_DATA;
  const sc = SCENARIOS.find(s => s.id === scenario) || SCENARIOS[0];

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setStep(0);
    setRunning(true);
    const stepMs = 1400 / Math.max(speed, 0.1);
    const ids = sc.steps.map((_, i) =>
      setTimeout(() => setStep(i + 1), stepMs * (i + 1))
    );
    ids.push(setTimeout(() => setRunning(false), stepMs * (sc.steps.length + 0.5)));
    return () => ids.forEach(clearTimeout);
  }, [scenario, speed]);

  const stateFor = (i) => {
    if (i < step - 1) return "done";
    if (i === step - 1) return sc.failure && i === 0 ? "fail" : "active";
    return "waiting";
  };

  return (
    <div className="screen">
      <Panel title="Choose scenario" seq="SIM">
        <div className="scen-pick">
          {SCENARIOS.map(s => (
            <button key={s.id} className="scen-card"
              data-active={scenario === s.id}
              onClick={() => setScenario(s.id)}>
              <div className="num">{s.num}</div>
              <div className="ttl">{s.title}</div>
              <div className="desc">{s.desc}</div>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid-2" style={{gridTemplateColumns: "1.4fr 1fr"}}>
        <Panel title={`Run · ${sc.title}`} seq={sc.num}
          right={
            <button className="btn ghost" style={{fontSize:10, padding:"6px 10px"}}
              onClick={() => setStep(0)}>
              Restart
            </button>
          }>
          <div className="timeline">
            {sc.steps.map((s, i) => (
              <div className="tl-step" data-state={stateFor(i)} key={i}>
                <span className="tl-time">{s.time}</span>
                <div>
                  <div className="tl-title">{s.title}</div>
                  <div className="tl-desc">{s.desc}</div>
                </div>
                <span />
              </div>
            ))}
          </div>
          <div className="runbar">
            <span className="mono dim" style={{fontSize:10}}>STEP</span>
            <span className="mono" style={{fontSize:11}}>{step} / {sc.steps.length}</span>
            <div className="progress"><div className="progress-fg" style={{width: `${(step / sc.steps.length) * 100}%`}} /></div>
            <span className="mono dim" style={{fontSize:10}}>{running ? "RUNNING" : "COMPLETE"}</span>
          </div>
        </Panel>

        <div style={{display:"grid", gap:16}}>
          <Panel title="Outcome" seq="KPI">
            <div className="kpi">
              {sc.kpis.map((k, i) => (
                <div className={`cell ${k.tone}`} key={i}>
                  <div className="k">{k.k}</div>
                  <div className="v">{k.v}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Critical aspect" seq="ENG">
            <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55}}>
              Whether the warning chain still delivers a timely, actionable alert when part of
              sensing or communication fails. Success means: failures are <em>detected</em>, the
              fallback engages within target time, and at least one channel reaches the resident
              with the correct action.
            </div>
            <div className="hr" />
            <div className="kv">
              <span className="k">Detect target</span><span className="v">≤ 2 min</span>
              <span className="k">Failover target</span><span className="v">≤ 5 min</span>
              <span className="k">Reach target</span><span className="v">≥ 90%</span>
              <span className="k">Silent ‘safe’</span><span className="v">never</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.ScreenFailure = ScreenFailure;
