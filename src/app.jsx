/* App shell — nav + tweaks + screen routing */

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "deviceForm": "dial",
  "deviceState": "warn",
  "scenario": "normal",
  "persona": "elderly",
  "killed": [],
  "speed": 1
}/*EDITMODE-END*/;

const SCREENS = [
  { id: "overview",     n: "01", label: "Overview" },
  { id: "architecture", n: "02", label: "Architecture" },
  { id: "map",          n: "03", label: "Map · Maribyrnong" },
  { id: "operator",     n: "04", label: "Operator" },
  { id: "device",       n: "05", label: "Household device" },
  { id: "alerts",       n: "06", label: "Resident alerts" },
  { id: "failure",      n: "07", label: "Failure sim" },
  { id: "community",    n: "08", label: "Community / backup" },
  { id: "simulation",   n: "09", label: "Data simulation" },
];

function App() {
  const [screen, setScreen] = useStateApp("overview");
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // theme
  useEffectApp(() => {
    document.documentElement.setAttribute("data-theme", tw.theme);
  }, [tw.theme]);

  // animation speed CSS var
  useEffectApp(() => {
    document.documentElement.style.setProperty("--anim-speed", String(tw.speed));
  }, [tw.speed]);

  const sc = SCREENS.find(s => s.id === screen) || SCREENS[0];

  const pageHead = pageHeadFor(screen, tw);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24"><path d="M3 14c2 0 2-2 5-2s3 2 5 2 3-2 5-2 5 0 5 2M3 8c2 0 2-2 5-2s3 2 5 2 3-2 5-2 5 0 5 2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
          </div>
          <div className="brand-text">
            <div className="t1">Maribyrnong · Flood</div>
            <div className="t2">Household Warning System</div>
          </div>
        </div>
        <nav className="nav">
          {SCREENS.map(s => (
            <button key={s.id} className="nav-item"
              data-active={screen === s.id}
              onClick={() => setScreen(s.id)}>
              <span className="num">{s.n}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="topbar-right">
          <button className="tb-btn" onClick={() => setTweak("theme", tw.theme === "light" ? "dark" : "light")}>
            <Icon name={tw.theme === "light" ? "moon" : "sun"} width="14" height="14" />
            <span>{tw.theme.toUpperCase()}</span>
          </button>
          <div className="tb-btn">
            <span className="pulse" />
            <span>SYSTEM LIVE · 14:38</span>
          </div>
        </div>
      </header>

      <main className="main">
        <PageHead {...pageHead} />
        {screen === "overview"     && <ScreenOverview goTo={setScreen} />}
        {screen === "architecture" && <ScreenArchitecture killed={tw.killed} />}
        {screen === "map"          && <ScreenMap scenario={tw.scenario} />}
        {screen === "operator"     && <ScreenOperator killed={tw.killed} speed={tw.speed} />}
        {screen === "device"       && <ScreenDevice form={tw.deviceForm} deviceState={tw.deviceState} setTweak={setTweak} />}
        {screen === "alerts"       && <ScreenAlerts persona={tw.persona} scenario={tw.scenario} speed={tw.speed} />}
        {screen === "failure"      && <ScreenFailure scenario={tw.scenario} setScenario={(v) => setTweak("scenario", v)} speed={tw.speed} />}
        {screen === "community"    && <ScreenCommunity />}
        {screen === "simulation"   && <ScreenSimulation />}
      </main>

      <footer className="foot">
        <span>v0.4 · Concept prototype · ENG3000 A3</span>
        <span>Maribyrnong Household Flood Warning System</span>
        <span>Not for operational use</span>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Scenario">
          <TweakSelect label="Active scenario" value={tw.scenario} onChange={(v) => setTweak("scenario", v)}
            options={[
              { value: "normal", label: "S-01 · Normal detection" },
              { value: "sensor", label: "S-02 · Sensor failure" },
              { value: "network", label: "S-03 · Network failure" },
              { value: "device", label: "S-04 · Device offline" },
              { value: "central", label: "S-05 · Central failure" },
            ]} />
        </TweakSection>

        <TweakSection title="Component health">
          {[
            ["RG-01","River gauge"],
            ["RF-04","Rainfall sensor"],
            ["TT-12","Tower telemetry"],
            ["NET","Cellular network"],
            ["CORE","Decision engine"],
            ["PUSH","App push gateway"],
          ].map(([id, label]) => (
            <TweakToggle key={id} label={`Kill ${label}`}
              value={tw.killed.includes(id)}
              onChange={(v) => {
                const next = v ? [...tw.killed, id] : tw.killed.filter(x => x !== id);
                setTweak("killed", next);
              }} />
          ))}
        </TweakSection>

        <TweakSection title="Household device">
          <TweakRadio label="Form factor" value={tw.deviceForm} onChange={(v) => setTweak("deviceForm", v)}
            options={[
              { value: "dial", label: "Dial" },
              { value: "eink", label: "E-ink" },
              { value: "puck", label: "Puck" },
            ]} />
          <TweakSelect label="Device state" value={tw.deviceState} onChange={(v) => setTweak("deviceState", v)}
            options={[
              { value: "ok", label: "All clear" },
              { value: "warn", label: "Prepare" },
              { value: "crit", label: "Urgent" },
              { value: "lost", label: "Connection lost" },
            ]} />
        </TweakSection>

        <TweakSection title="Resident persona">
          <TweakSelect label="Persona" value={tw.persona} onChange={(v) => setTweak("persona", v)}
            options={[
              { value: "elderly", label: "Margaret · 78, lives alone" },
              { value: "family",  label: "Nguyen family · 4" },
              { value: "renter",  label: "Jordan · ground-floor renter" },
              { value: "carer",   label: "Anh · aged-care carer" },
            ]} />
        </TweakSection>

        <TweakSection title="Display">
          <TweakRadio label="Theme" value={tw.theme} onChange={(v) => setTweak("theme", v)}
            options={[{value:"light", label:"Light"},{value:"dark", label:"Dark"}]} />
          <TweakSlider label="Animation speed" value={tw.speed} min={0.25} max={3} step={0.25}
            onChange={(v) => setTweak("speed", v)} suffix="×" />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function pageHeadFor(screen, tw) {
  const heads = {
    overview: {
      eyebrow: ["§01", "Overview", "Concept"],
      title: <>Maribyrnong Household <em>Flood</em> Warning System.</>,
      sub: "Resilient sensing → decisioning → household delivery, with explicit fallback at every layer.",
      meta: [
        { k: "Zones", v: "5" },
        { k: "Households", v: "2,078" },
        { k: "Channels", v: "6" },
      ],
    },
    architecture: {
      eyebrow: ["§02", "Architecture", "L1–L5"],
      title: <>System <em>architecture</em> — five layers, one chain.</>,
      sub: "Click any node for detail. Use Tweaks → Component health to kill nodes and watch backup paths engage.",
      meta: [
        { k: "Nodes", v: "16" },
        { k: "Links", v: "19" },
        { k: "Down", v: tw.killed.length || "0" },
      ],
    },
    map: {
      eyebrow: ["§03", "Geo", "Maribyrnong"],
      title: <>Flood zones, sensors, and <em>households</em>.</>,
      sub: "Schematic of the Maribyrnong River corridor with five at-risk zones and four field sensors.",
      meta: [
        { k: "Zones", v: "5" },
        { k: "Sensors", v: "4" },
        { k: "River km", v: "8.2" },
      ],
    },
    operator: {
      eyebrow: ["§04", "Operator", "SES + Council"],
      title: <>Operator <em>console</em> — live system state.</>,
      sub: "Sensor health, river thresholds, zone warning levels, channel delivery, and manual override — one screen.",
      meta: [
        { k: "Status", v: tw.killed.length ? "DEGRADED" : "AUTO" },
        { k: "Operator", v: "SES-VIC-04" },
        { k: "Mode", v: "Live" },
      ],
    },
    device: {
      eyebrow: ["§05", "Hardware", "In-home"],
      title: <>The household <em>device</em>, up close.</>,
      sub: "A glanceable, mains-powered device with battery backup. Final layer when phones, signal, and apps fail.",
      meta: [
        { k: "Form", v: tw.deviceForm.toUpperCase() },
        { k: "State", v: tw.deviceState.toUpperCase() },
        { k: "Battery", v: "82%" },
      ],
    },
    alerts: {
      eyebrow: ["§06", "Resident", "Multi-channel"],
      title: <>How a resident actually <em>sees</em> the warning.</>,
      sub: "Channel fanout for one resident under the active scenario — including what a failed channel looks like to them.",
      meta: [
        { k: "Persona", v: (window.FLOOD_DATA.PERSONAS[tw.persona] || {}).name || "—" },
        { k: "Scenario", v: tw.scenario.toUpperCase() },
        { k: "Channels", v: "4" },
      ],
    },
    failure: {
      eyebrow: ["§07", "Resilience", "Scenario sim"],
      title: <>What happens when something <em>breaks</em>.</>,
      sub: "Five scenarios spanning sensing, network, device, and central failure. Each runs as a stepwise timeline with engineering KPIs.",
      meta: [
        { k: "Scenarios", v: "5" },
        { k: "Detect SLA", v: "≤ 2m" },
        { k: "Reach SLA", v: "≥ 90%" },
      ],
    },
    community: {
      eyebrow: ["§08", "Resilience", "Layered backup"],
      title: <>Seven backup <em>layers</em>, never silently safe.</>,
      sub: "Hardware, digital, broadcast, human, and printed layers compose the resilience plan.",
      meta: [
        { k: "Layers", v: "7" },
        { k: "Wardens", v: "38" },
        { k: "Print cards", v: "2,300" },
      ],
    },
    simulation: {
      eyebrow: ["§09", "Simulation", "Data-driven"],
      title: <>Real-time <em>flood risk</em> analysis across 10 datasets.</>,
      sub: "Animate all five sensor streams step-by-step. Watch risk levels transition and drainage blockage emerge in real time.",
      meta: [
        { k: "Datasets", v: "10" },
        { k: "Steps", v: "50" },
        { k: "Sources", v: "5" },
      ],
    },
  };
  return heads[screen];
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
