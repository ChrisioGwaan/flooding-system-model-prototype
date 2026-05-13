/* Data — sensors, zones, scenarios, copy. Shared via window. */

const SENSORS = [
  { id: "RG-01", name: "Maribyrnong River @ Aberfeldie", kind: "river", value: 2.84, unit: "m", trend: +0.18, status: "ok",   threshold: { ok: 2.0, warn: 3.2, crit: 4.0 } },
  { id: "RG-02", name: "Maribyrnong River @ Footscray",  kind: "river", value: 2.51, unit: "m", trend: +0.22, status: "ok",   threshold: { ok: 2.0, warn: 3.0, crit: 3.8 } },
  { id: "RF-04", name: "Rainfall — Avondale Heights",    kind: "rain",  value: 38.2, unit: "mm/h", trend: +6.4, status: "warn", threshold: { ok: 10, warn: 25, crit: 50 } },
  { id: "RF-07", name: "Rainfall — Maidstone",           kind: "rain",  value: 22.6, unit: "mm/h", trend: +3.1, status: "ok",   threshold: { ok: 10, warn: 25, crit: 50 } },
  { id: "TT-12", name: "Telecom Tower — Footscray West", kind: "tower", value: 0.91, unit: "conf", trend: +0.04, status: "ok",  threshold: { ok: 0.7, warn: 0.5, crit: 0.3 } },
  { id: "TT-15", name: "Telecom Tower — Essendon",       kind: "tower", value: 0.86, unit: "conf", trend: -0.02, status: "ok",  threshold: { ok: 0.7, warn: 0.5, crit: 0.3 } },
  { id: "BOM-AU", name: "BOM Authority Feed",            kind: "feed",  value: 1.0,  unit: "sync", trend: 0.0, status: "ok",    threshold: { ok: 0.9, warn: 0.5, crit: 0.1 } },
];

const ZONES = [
  { id: "Z-01", name: "Maribyrnong Flats",   households: 412,  level: "warn", risk: 78 },
  { id: "Z-02", name: "Footscray Riverside",  households: 638,  level: "crit", risk: 91 },
  { id: "Z-03", name: "Avondale Heights West",households: 524,  level: "warn", risk: 64 },
  { id: "Z-04", name: "Maidstone South",      households: 308,  level: "info", risk: 32 },
  { id: "Z-05", name: "Essendon Lowlands",    households: 196,  level: "ok",   risk: 12 },
];

const CHANNELS = [
  { id: "device", name: "Household Device",  delivered: 96, status: "ok"   },
  { id: "sms",    name: "SMS Broadcast",     delivered: 94, status: "ok"   },
  { id: "push",   name: "App Push",          delivered: 78, status: "warn" },
  { id: "voice",  name: "Voice Call",        delivered: 88, status: "ok"   },
  { id: "email",  name: "Email",             delivered: 62, status: "ok"   },
  { id: "siren",  name: "Public Siren / Sign", delivered: 100, status: "ok" },
];

const EVENTS = [
  { t: "14:32:08", level: "ok",   m: "System nominal — all sensors reporting" },
  { t: "14:34:21", level: "info", m: "RF-04 rainfall crossed 25 mm/h threshold" },
  { t: "14:35:02", level: "warn", m: "Zone Z-01 elevated to PREPARE" },
  { t: "14:36:44", level: "info", m: "Cross-validation: TT-12 confirms RG-01 rise" },
  { t: "14:38:10", level: "crit", m: "Zone Z-02 elevated to URGENT — 638 households" },
  { t: "14:38:12", level: "info", m: "Multi-channel dispatch initiated" },
  { t: "14:38:47", level: "ok",   m: "Device acks received: 612 / 638 (95.9%)" },
  { t: "14:39:30", level: "warn", m: "Push delivery degraded — failover to SMS" },
];

const SCENARIOS = [
  {
    id: "normal",
    num: "S-01",
    title: "Normal Detection",
    desc: "Water rises, system confirms, targeted households alerted.",
    steps: [
      { time: "T+00:00", title: "RG-01 reading exceeds 2.5 m", desc: "River level above seasonal mean." },
      { time: "T+00:42", title: "Cross-validate with rainfall + tower telemetry", desc: "Two of three sources confirm rising trend." },
      { time: "T+01:18", title: "Decision engine elevates Z-01 → PREPARE", desc: "Warning level computed from fused data." },
      { time: "T+01:24", title: "Multi-channel dispatch begins", desc: "Device, SMS, app, voice fanout starts." },
      { time: "T+02:11", title: "94% household delivery confirmed", desc: "Within 3-minute SLA target." },
    ],
    kpis: [
      { k: "Detection → alert", v: "1m 24s", tone: "ok" },
      { k: "Channels active", v: "6 / 6", tone: "ok" },
      { k: "Households reached", v: "94%", tone: "ok" },
      { k: "Backups engaged", v: "0", tone: "ok" },
    ],
    failure: null,
  },
  {
    id: "sensor",
    num: "S-02",
    title: "Sensor Failure",
    desc: "Primary river gauge silent — tower telemetry takes over.",
    steps: [
      { time: "T+00:00", title: "RG-01 stops sending heartbeat", desc: "Gauge silent for 90 seconds." },
      { time: "T+01:30", title: "Health monitor flags RG-01 OFFLINE", desc: "Sensor never returns silent ‘safe’." },
      { time: "T+01:42", title: "Tower telemetry TT-12 promoted to primary", desc: "Backup sensing source activated." },
      { time: "T+02:08", title: "Confidence recomputed using rainfall + BOM feed", desc: "Decision engine continues with degraded fusion." },
      { time: "T+03:02", title: "Operator alerted; warning still issued", desc: "Maintenance dispatched to RG-01 site." },
    ],
    kpis: [
      { k: "Failure detected", v: "1m 30s", tone: "ok" },
      { k: "Backup source", v: "TT-12", tone: "warn" },
      { k: "False ‘safe’ avoided", v: "Yes", tone: "ok" },
      { k: "Confidence", v: "0.82", tone: "warn" },
    ],
    failure: { node: "RG-01" },
  },
  {
    id: "network",
    num: "S-03",
    title: "Network Failure",
    desc: "Cellular link drops; LoRa relay + manual override engage.",
    steps: [
      { time: "T+00:00", title: "Cellular uplink to data centre lost", desc: "Three consecutive packets dropped." },
      { time: "T+00:34", title: "LoRa relay path activates", desc: "Long-range radio fallback transmits compact alert frames." },
      { time: "T+01:10", title: "Operator notified — manual override available", desc: "SES staff can issue area-wide broadcast." },
      { time: "T+01:48", title: "Suburb-level broadcast issued via radio", desc: "Targeting widened to flood-zone suburbs." },
      { time: "T+02:30", title: "Cellular restored; system reconciles state", desc: "Duplicate suppression prevents double-alerts." },
    ],
    kpis: [
      { k: "Failover time", v: "34s", tone: "ok" },
      { k: "Broadcast mode", v: "Suburb", tone: "warn" },
      { k: "Households reached", v: "88%", tone: "warn" },
      { k: "Channels lost", v: "1 of 6", tone: "warn" },
    ],
    failure: { node: "NET" },
  },
  {
    id: "device",
    num: "S-04",
    title: "Household Device Offline",
    desc: "Device unreachable — SMS, voice, app push fill the gap.",
    steps: [
      { time: "T+00:00", title: "Device DV-2841 offline (battery / power)", desc: "Last heartbeat 22 minutes ago." },
      { time: "T+00:08", title: "Resident profile flagged as device-down", desc: "Routing engine adjusts channel mix." },
      { time: "T+00:22", title: "SMS + voice call dispatched as primary", desc: "App push sent in parallel." },
      { time: "T+01:04", title: "Voice call answered — confirmation captured", desc: "At least one actionable channel succeeded." },
      { time: "T+01:30", title: "Device reconnects; last warning state synced", desc: "Caution light shown until manual ack." },
    ],
    kpis: [
      { k: "Alt channel success", v: "Voice", tone: "ok" },
      { k: "Resident reached", v: "Yes", tone: "ok" },
      { k: "Time-to-confirm", v: "1m 04s", tone: "ok" },
      { k: "Devices offline", v: "26", tone: "warn" },
    ],
    failure: { node: "DEV" },
  },
  {
    id: "central",
    num: "S-05",
    title: "Central Platform Failure",
    desc: "Decision engine degraded — operator-led degraded mode.",
    steps: [
      { time: "T+00:00", title: "Primary decision engine unreachable", desc: "Health probe fails on three nodes." },
      { time: "T+00:25", title: "Standby region promoted (geo-redundant)", desc: "Read-only fallback initially." },
      { time: "T+01:12", title: "Operator authorises degraded write mode", desc: "Manual override unlocks warning issuance." },
      { time: "T+01:40", title: "Area-wide broadcast issued from standby", desc: "All zones marked as CAUTION pending recovery." },
      { time: "T+05:18", title: "Primary recovers; reconciliation underway", desc: "Operator audit log captured for review." },
    ],
    kpis: [
      { k: "Failover region", v: "AU-SE2", tone: "warn" },
      { k: "Manual auth", v: "Required", tone: "warn" },
      { k: "Silent ‘safe’ shown", v: "Never", tone: "ok" },
      { k: "Recovery", v: "5m 18s", tone: "warn" },
    ],
    failure: { node: "CORE" },
  },
];

const PERSONAS = {
  elderly: { name: "Margaret O.", age: 78, addr: "12 Riverside Cr, Maribyrnong", note: "Lives alone. No smartphone.", emoji: "M" },
  family:  { name: "The Nguyen family", age: 4, addr: "44 Hopkins St, Footscray", note: "Two children, one car.", emoji: "N" },
  renter:  { name: "Jordan T.", age: 27, addr: "8/2 Riverview Tce, Footscray", note: "Apartment, ground floor.", emoji: "J" },
  carer:   { name: "Anh P. (carer)", age: 41, addr: "Aged-care, Aberfeldie", note: "Coordinates 14 residents.", emoji: "A" },
};

const DEVICE_STATES = {
  ok:    { label: "All clear",    state: "ok",   headline: "All clear",      msg: "No active flood warnings for your area. River levels nominal." },
  warn:  { label: "Prepare",      state: "warn", headline: "Prepare",         msg: "Heavy rain in catchment. Move vehicles and valuables to higher ground." },
  crit:  { label: "Urgent",       state: "crit", headline: "Evacuate now",    msg: "Floodwater rising in your zone. Leave for higher ground via Hopkins St." },
  lost:  { label: "Connection lost", state: "lost", headline: "Stay alert",  msg: "Connection lost. System cannot confirm safety — check radio / SMS." },
};

window.FLOOD_DATA = { SENSORS, ZONES, CHANNELS, EVENTS, SCENARIOS, PERSONAS, DEVICE_STATES };
