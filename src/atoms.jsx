/* Atoms — small reusable components + icons. Exported via window. */

const { useEffect, useRef, useState, useMemo } = React;

function Icon({ name, ...rest }) {
  const map = {
    river: <path d="M2 14c2 0 2-2 5-2s3 2 5 2 3-2 5-2 5 0 5 2M2 8c2 0 2-2 5-2s3 2 5 2 3-2 5-2 5 0 5 2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>,
    rain:  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"><path d="M5 11a4 4 0 014-4 5 5 0 019.5 2A3.5 3.5 0 0117 16H7a3 3 0 01-2-5z"/><path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2"/></g>,
    tower: <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"><path d="M12 4v16M8 8c1.5 1 1.5 3 0 4M16 8c-1.5 1-1.5 3 0 4M5 6c2.5 2 2.5 6 0 8M19 6c-2.5 2-2.5 6 0 8"/></g>,
    feed:  <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"><circle cx="6" cy="18" r="2"/><path d="M4 12a8 8 0 018 8M4 6a14 14 0 0114 14"/></g>,
    server: <g stroke="currentColor" strokeWidth="1.4" fill="none"><rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><circle cx="7.5" cy="7" r="0.6" fill="currentColor"/><circle cx="7.5" cy="17" r="0.6" fill="currentColor"/></g>,
    home:  <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-7H10v7H5a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    sms:   <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    phone: <path d="M5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A14 14 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    push:  <path d="M5 17h14l-2-3v-3a5 5 0 10-10 0v3l-2 3zM10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    email: <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 7l9 7 9-7"/></g>,
    siren: <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"><path d="M5 16h14v3H5zM7 16v-4a5 5 0 0110 0v4M12 4v3M5 7l2 2M19 7l-2 2"/></g>,
    bolt:  <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    radio: <g stroke="currentColor" strokeWidth="1.4" fill="none"><rect x="3" y="9" width="18" height="11" rx="1"/><circle cx="16" cy="14" r="3"/><path d="M7 13h4M7 16h3M3 9l11-5"/></g>,
    pin:   <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    cog:   <g stroke="currentColor" strokeWidth="1.4" fill="none"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></g>,
    sun:   <g stroke="currentColor" strokeWidth="1.4" fill="none"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1"/></g>,
    moon:  <path d="M20 14a8 8 0 11-10-10 7 7 0 0010 10z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
  };
  return (
    <svg viewBox="0 0 24 24" {...rest}>
      {map[name] || null}
    </svg>
  );
}

function Pill({ tone = "ok", children }) {
  return (
    <span className="pill" data-tone={tone}>
      <span className="led" />
      {children}
    </span>
  );
}

function Sparkline({ data, height = 60, tone = "info" }) {
  const w = 200;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const r = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - 8 - ((v - min) / r) * (height - 16);
    return `${x},${y}`;
  }).join(" ");
  const color = `var(--c-${tone})`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
      <polyline fill={color} opacity="0.1" stroke="none" points={`0,${height} ${pts} ${w},${height}`} />
    </svg>
  );
}

function PageHead({ eyebrow, title, sub, meta }) {
  return (
    <div className="page-head">
      <div>
        <div className="page-eyebrow">
          {eyebrow.map((e, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="dot" />}
              <span>{e}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="page-title">{title}</h1>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      {meta && (
        <div className="page-meta">
          {meta.map((m, i) => (
            <div className="cell" key={i}>
              <div className="k">{m.k}</div>
              <div className="v">{m.v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Panel({ title, seq, right, children, style }) {
  return (
    <div className="panel" style={style}>
      <div className="panel-head">
        <div className="panel-title">
          {seq && <span className="seq">{seq}</span>}
          <span>{title}</span>
        </div>
        {right}
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

function useTicker(intervalMs = 1000, speed = 1) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT(x => x + 1), intervalMs / Math.max(speed, 0.1));
    return () => clearInterval(id);
  }, [intervalMs, speed]);
  return t;
}

Object.assign(window, { Icon, Pill, Sparkline, PageHead, Panel, useTicker });
