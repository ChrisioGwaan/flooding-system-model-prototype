/* Resident alert flow — animated multi-channel sequence */

function ScreenAlerts({ persona, scenario, speed }) {
  const { PERSONAS } = window.FLOOD_DATA;
  const p = PERSONAS[persona] || PERSONAS.elderly;
  const [stage, setStage] = useState(0);

  // Channel state by stage and scenario
  // Stages: 0 idle, 1 device, 2 sms, 3 push, 4 voice, 5 done
  useEffect(() => {
    setStage(0);
    const stepMs = 1200 / Math.max(speed, 0.1);
    const ids = [];
    for (let i = 1; i <= 5; i++) {
      ids.push(setTimeout(() => setStage(i), stepMs * i));
    }
    return () => ids.forEach(clearTimeout);
  }, [persona, scenario, speed]);

  const deviceOff = scenario === "device";
  const networkOff = scenario === "network";

  const channelState = (idx) => {
    if (stage < idx) return "waiting";
    if (stage === idx) return "firing";
    return "delivered";
  };

  const channels = [
  { id: 1, icon: "home", name: "Household device", body: deviceOff ? "Device offline — skipping" : "Dial flashes red · tone playing", failed: deviceOff },
  { id: 2, icon: "sms", name: "SMS broadcast", body: "Cell-broadcast issued to flood-zone numbers", failed: false },
  { id: 3, icon: "push", name: "Mobile app push", body: networkOff ? "Push gateway degraded" : "Rich notification with map + actions", failed: networkOff },
  { id: 4, icon: "phone", name: "Voice call", body: "Automated call placed in resident's preferred language", failed: false }];


  return (
    <div className="screen">
      <div className="grid-2" style={{ gridTemplateColumns: "1fr 1.1fr" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="persona-card">
            <div className="persona-avatar">{p.emoji}</div>
            <div>
              <div className="persona-name">{p.name}</div>
              <div className="persona-meta">{p.addr}</div>
              <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>{p.note}</div>
            </div>
          </div>

          <Panel title="Channel sequence" seq="L4"
          right={<button className="btn ghost" style={{ fontSize: 10, padding: "6px 10px" }} onClick={() => setStage(0)}>Replay</button>}>
            <div className="channel-stack">
              {channels.map((c, i) => {
                const st = c.failed && stage >= c.id ? "failed" : channelState(c.id);
                return (
                  <div className="channel" key={c.id} data-state={st}>
                    <div className="icon"><Icon name={c.icon} /></div>
                    <div>
                      <div className="name">{c.name}</div>
                      <div className="body">{c.body}</div>
                    </div>
                    <Pill tone={st === "delivered" ? "ok" : st === "firing" ? "info" : st === "failed" ? "crit" : "off"}>
                      {st === "delivered" ? "DELIVERED" : st === "firing" ? "SENDING" : st === "failed" ? "FAILED" : "QUEUED"}
                    </Pill>
                  </div>);

              })}
            </div>
          </Panel>

          <Panel title="Routing logic" seq="ROUTE">
            <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
              Routing engine considers device health, resident profile, time of day and zone level.
              At least one actionable channel must succeed; the engine fans out in parallel and
              waits for at-least-one-of acknowledgement before standing down.
            </div>
          </Panel>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <Panel title="Resident view" seq="LIVE">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-bar">
                  <span>14:38</span>
                  <span>5G · 84%</span>
                </div>
                <div className="stack">
                {stage >= 2 && !deviceOff &&
                  <div className="sms-bubble fade-in">
                    <div className="from">VICEMERG · MARIBYRNONG</div>
                    Flood warning for FOOTSCRAY RIVERSIDE. Move vehicles & valuables now. Avoid Hopkins St underpass. Reply HELP for support.
                  </div>
                  }
                {stage >= 2 && deviceOff &&
                  <div className="sms-bubble fade-in">
                    <div className="from">VICEMERG · MARIBYRNONG</div>
                    URGENT — Floodwater rising in your zone. Evacuate to higher ground via Hopkins St. Your home device is offline; take this SMS as primary warning.
                  </div>
                  }
                {stage >= 3 && !networkOff &&
                  <div className="push-bubble fade-in">
                    <div className="app">M</div>
                    <div>
                      <div className="ttl">Maribyrnong Council</div>
                      <div className="body">URGENT · Evacuate Footscray Riverside. Tap for map and support hubs.</div>
                    </div>
                    <div className="when">now</div>
                  </div>
                  }
                {stage >= 3 && networkOff &&
                  <div className="push-bubble fade-in" style={{ borderColor: "var(--c-crit)", background: "var(--c-crit-2)" }}>
                    <div className="app" style={{ background: "var(--c-crit)" }}>!</div>
                    <div>
                      <div className="ttl">Push undelivered</div>
                      <div className="body">Network degraded — relying on SMS + voice.</div>
                    </div>
                    <div className="when">now</div>
                  </div>
                  }
                {stage >= 4 &&
                  <div className="push-bubble fade-in" style={{ background: "var(--c-info-2)", borderColor: "var(--c-info)" }}>
                    <div className="app" style={{ background: "var(--c-info)" }}>📞</div>
                    <div>
                      <div className="ttl">Incoming call · 03 9000 0000</div>
                      <div className="body">Maribyrnong Council automated warning</div>
                    </div>
                    <div className="when">now</div>
                  </div>
                  }
                {stage >= 5 &&
                  <div style={{ marginTop: 12, textAlign: "center", paddingTop: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--c-ok)", letterSpacing: ".12em" }}>
                    ✓ AT LEAST ONE CHANNEL CONFIRMED
                  </div>
                  }
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Message templates" seq="MSG">
            <div className="kv">
              <span className="k">PREPARE</span>
              <span className="v" style={{ fontSize: 11, textAlign: "right", maxWidth: 280 }}>“Heavy rain in catchment. Move vehicles & valuables.”</span>
              <span className="k">URGENT</span>
              <span className="v" style={{ fontSize: 11, textAlign: "right", maxWidth: 280 }}>“Evacuate {p.addr.split(",").slice(-1)[0].trim()} via Hopkins St.”</span>
              <span className="k">DEVICE-DOWN</span>
              <span className="v" style={{ fontSize: 11, textAlign: "right", maxWidth: 280 }}>“Your home device is offline; treat this as your primary warning.”</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>);

}

window.ScreenAlerts = ScreenAlerts;