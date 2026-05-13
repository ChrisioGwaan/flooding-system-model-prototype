/* Household device close-up */

function ScreenDevice({ form, deviceState, setTweak }) {
  const { DEVICE_STATES } = window.FLOOD_DATA;
  const ds = DEVICE_STATES[deviceState] || DEVICE_STATES.warn;
  const [acked, setAcked] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { setAcked(false); }, [deviceState]);

  const handleAck = () => {
    setAcked(true);
    setToast("Acknowledged · operator notified");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="screen">
      <div className="grid-2" style={{gridTemplateColumns: "1.4fr 1fr"}}>
        <div className="device-stage">
          {form === "dial" && <DialDevice ds={ds} acked={acked} onAck={handleAck} />}
          {form === "eink" && <EinkDevice ds={ds} acked={acked} onAck={handleAck} />}
          {form === "puck" && <PuckDevice ds={ds} acked={acked} onAck={handleAck} />}
          {toast && (
            <div className="toast fade-in">{toast}</div>
          )}
        </div>

        <div className="device-side">
          <Panel title="Device specification" seq="DEV/01">
            <div className="spec-row">
              <span className="k">Form</span>
              <span>{form === "dial" ? "Round dial · wall or shelf" : form === "eink" ? "E-ink rectangle · shelf" : "Puck · ceiling / wall"}</span>
            </div>
            <div className="spec-row">
              <span className="k">Power</span>
              <span>Mains-powered, 2–4 week backup battery, auto-recharge</span>
            </div>
            <div className="spec-row">
              <span className="k">Comms</span>
              <span>Cellular primary · LoRa fallback · local relay</span>
            </div>
            <div className="spec-row">
              <span className="k">Interaction</span>
              <span>One physical button · acknowledge / more info</span>
            </div>
            <div className="spec-row">
              <span className="k">Audio</span>
              <span>Tone, vibration, optional voice readout</span>
            </div>
            <div className="spec-row">
              <span className="k">Fail-safe</span>
              <span>If link is lost during severe weather, shows CAUTION — never silent ‘safe’.</span>
            </div>
          </Panel>

          <Panel title="State preview" seq="DEV/02">
            <div className="state-pick">
              {[
                ["ok", "All clear"],
                ["warn", "Prepare"],
                ["crit", "Urgent"],
                ["lost", "Lost"],
              ].map(([k, l]) => (
                <button key={k}
                  data-active={deviceState === k}
                  onClick={() => setTweak("deviceState", k)}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="hr" />
            <div className="kv">
              <span className="k">Current state</span><span className="v">{ds.state.toUpperCase()}</span>
              <span className="k">Headline</span><span className="v">{ds.headline}</span>
              <span className="k">Battery</span><span className="v">82%</span>
              <span className="k">Acknowledged</span><span className="v">{acked ? "YES" : "NO"}</span>
              <span className="k">Last sync</span><span className="v">14:38:47</span>
            </div>
          </Panel>

          <Panel title="Why a dedicated device" seq="DEV/03">
            <div style={{fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55}}>
              Phone-only alerts fail when signal drops, batteries die, or notifications are muted —
              and many older residents don&rsquo;t use smartphones well. A glanceable in-home device
              with its own battery and radio path is a final, dependable layer that catches what
              softer channels miss.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function DialDevice({ ds, acked, onAck }) {
  return (
    <div className="dial" data-state={ds.state} data-acked={acked}>
      <div className="dial-bezel" />
      <div className="dial-face">
        <div className="dial-ring" />
        <div className="dial-content">
          <div className="dial-state">{acked ? "Acknowledged" : ds.label}</div>
          <div className="dial-headline">{ds.headline}</div>
          <div className="dial-msg">{ds.msg}</div>
        </div>
        <div className="dial-indicators">
          <div className="ind"><span style={{width:6,height:6,borderRadius:"50%", background: ds.state === "lost" ? "var(--c-offline)" : "var(--c-ok)"}} /> NET</div>
          <div className="ind"><span style={{width:6,height:6,borderRadius:"50%", background: "var(--c-ok)"}} /> 82%</div>
          <div className="ind"><span style={{width:6,height:6,borderRadius:"50%", background: acked ? "var(--c-ok)" : ds.state === "lost" ? "var(--c-warn)" : "var(--c-info)"}} /> {acked ? "OK" : ds.state === "lost" ? "OFF" : "ACK"}</div>
        </div>
      </div>
      <button className="ack-btn" onClick={onAck} title="Acknowledge alert">{acked ? "✓" : "ACK"}</button>
    </div>
  );
}

function EinkDevice({ ds, acked, onAck }) {
  return (
    <div className="eink" data-state={ds.state}>
      <div className="eink-head">
        <span>Council · Maribyrnong</span>
        <span>14:38</span>
      </div>
      <div className="eink-state">{acked ? "Acknowledged" : ds.label}</div>
      <div className="eink-bar" />
      <div className="eink-headline">{ds.headline}</div>
      <div className="eink-msg">{ds.msg}</div>
      <div className="eink-actions">
        <button onClick={onAck} style={{background:"transparent", border:"1px solid currentColor", padding:"4px 10px", fontFamily:"inherit", fontSize:"inherit", letterSpacing:"inherit", textTransform:"inherit", color:"inherit", cursor:"pointer"}}>{acked ? "✓ ACK'D" : "BTN · ACK"}</button>
        <span>BAT · 82%</span>
      </div>
    </div>
  );
}

function PuckDevice({ ds, acked, onAck }) {
  return (
    <div className="puck" data-state={ds.state} onClick={onAck} style={{cursor:"pointer"}} title="Tap to acknowledge">
      <div className="puck-base" />
      <div className="puck-led">
        <div>
          <div className="pl">{acked ? "Acknowledged" : ds.label}</div>
          <div className="pn">{ds.headline}</div>
        </div>
      </div>
    </div>
  );
}

window.ScreenDevice = ScreenDevice;
