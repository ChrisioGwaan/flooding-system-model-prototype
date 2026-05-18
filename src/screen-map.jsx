/* Map — OpenStreetMap via Leaflet with real Maribyrnong corridor */

function ScreenMap({ scenario }) {
  const [selected, setSelected] = useState("Z-02");
  const { ZONES } = window.FLOOD_DATA;
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const polyRefs     = useRef({});

  const zoneById = Object.fromEntries(ZONES.map(z => [z.id, z]));

  /* Approximate real-world floodplain polygons along Maribyrnong River */
  const GEO_ZONES = [
    {
      id: "Z-01",
      latlngs: [
        [-37.747, 144.872], [-37.751, 144.877], [-37.758, 144.882],
        [-37.766, 144.883], [-37.770, 144.878], [-37.769, 144.871],
        [-37.762, 144.865], [-37.752, 144.865],
      ],
    },
    {
      id: "Z-02",
      latlngs: [
        [-37.788, 144.886], [-37.793, 144.890], [-37.800, 144.896],
        [-37.806, 144.903], [-37.809, 144.907], [-37.809, 144.895],
        [-37.802, 144.882], [-37.793, 144.879],
      ],
    },
    {
      id: "Z-03",
      latlngs: [
        [-37.737, 144.849], [-37.742, 144.861], [-37.750, 144.865],
        [-37.757, 144.860], [-37.755, 144.844], [-37.746, 144.838],
      ],
    },
    {
      id: "Z-04",
      latlngs: [
        [-37.762, 144.865], [-37.768, 144.872], [-37.776, 144.877],
        [-37.784, 144.876], [-37.782, 144.860], [-37.770, 144.855],
      ],
    },
    {
      id: "Z-05",
      latlngs: [
        [-37.729, 144.876], [-37.734, 144.888], [-37.742, 144.887],
        [-37.745, 144.878], [-37.741, 144.868], [-37.731, 144.869],
      ],
    },
  ];

  /* Sensor field positions (approximate) */
  const GEO_SENSORS = [
    { id: "RG-01", label: "RG-01", lat: -37.742, lng: 144.880 },
    { id: "RG-02", label: "RG-02", lat: -37.800, lng: 144.891 },
    { id: "RF-04", label: "RF-04", lat: -37.751, lng: 144.851 },
    { id: "TT-12", label: "TT-12", lat: -37.805, lng: 144.877 },
  ];

  const LEVEL_COLOR = {
    crit: "#b6321c",
    warn: "#c98a14",
    info: "#2c5fa8",
    ok:   "#2f7d4e",
  };

  function polyStyle(zoneId, data, isSelected) {
    const col = LEVEL_COLOR[data.level] || LEVEL_COLOR.ok;
    return {
      color:       col,
      fillColor:   col,
      fillOpacity: isSelected ? 0.45 : 0.28,
      weight:      isSelected ? 4 : 2,
      dashArray:   data.level === "crit" ? "7 5" : null,
    };
  }

  /* Build and mount Leaflet map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const L = window.L;
    if (!L) { console.warn("Leaflet not loaded"); return; }

    const map = L.map(containerRef.current, {
      center: [-37.771, 144.876],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    /* CartoDB Positron — clean, minimal basemap that matches the design */
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    /* Flood-zone polygons */
    GEO_ZONES.forEach(gz => {
      const data = zoneById[gz.id];
      const poly = L.polygon(gz.latlngs, polyStyle(gz.id, data, gz.id === "Z-02"));

      /* Centroid label (permanent tooltip) */
      const centroid = gz.latlngs.reduce(
        (acc, ll) => [acc[0] + ll[0] / gz.latlngs.length, acc[1] + ll[1] / gz.latlngs.length],
        [0, 0]
      );
      poly.bindTooltip(
        `<div class="mzt-id">${data.id}</div>` +
        `<div class="mzt-name">${data.name}</div>` +
        `<div class="mzt-sub">${data.households}&thinsp;HH &middot; ${data.level.toUpperCase()}</div>`,
        { permanent: true, direction: "center", className: "map-zone-label", interactive: false, offset: [0, 0] }
      );

      poly.on("click", () => setSelected(gz.id));
      poly.addTo(map);
      polyRefs.current[gz.id] = poly;
    });

    /* Sensor markers (custom divIcon) */
    GEO_SENSORS.forEach(s => {
      const icon = L.divIcon({
        className: "sensor-div-root",
        html:
          `<div class="sensor-core"></div>` +
          `<div class="sensor-ring"></div>` +
          `<span class="sensor-lbl">${s.label}</span>`,
        iconSize:   [70, 20],
        iconAnchor: [5, 5],
      });
      L.marker([s.lat, s.lng], { icon, interactive: false }).addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current   = null;
      polyRefs.current = {};
    };
  }, []);

  /* Re-style polygons when selected zone changes */
  useEffect(() => {
    ZONES.forEach(z => {
      const poly = polyRefs.current[z.id];
      if (!poly) return;
      poly.setStyle(polyStyle(z.id, z, z.id === selected));
    });
  }, [selected]);

  const focus = zoneById[selected] || zoneById["Z-02"];

  return (
    <div className="screen">
      <div className="map-canvas">
        {/* Leaflet mount point — fills the canvas */}
        <div ref={containerRef} className="map-leaflet-fill" />

        {/* Warning-level legend */}
        <div className="map-legend">
          <div className="row" style={{ marginBottom: 6, color: "var(--ink-3)" }}>WARNING LEVEL</div>
          {[
            ["crit", "URGENT"],
            ["warn", "PREPARE"],
            ["info", "WATCH"],
            ["ok",   "NORMAL"],
          ].map(([t, l]) => (
            <div className="row" key={t}>
              <span className="sw" style={{
                background: LEVEL_COLOR[t] + "45",
                border: `2px solid ${LEVEL_COLOR[t]}`,
              }} />
              <span>{l}</span>
            </div>
          ))}
        </div>

        {/* Zone detail panel */}
        <div className="map-readout">
          <div className="panel-title" style={{ padding: 0, fontSize: 10 }}>
            <span className="seq">SELECTED</span>
            <span>{focus.id}</span>
          </div>
          <div style={{ marginTop: 10, fontWeight: 600, fontSize: 14 }}>{focus.name}</div>
          <div style={{ marginTop: 6 }}>
            <Pill tone={
              focus.level === "crit" ? "crit" :
              focus.level === "warn" ? "warn" :
              focus.level === "info" ? "info" : "ok"
            }>
              {focus.level.toUpperCase()}
            </Pill>
          </div>
          <div className="kv" style={{ marginTop: 12 }}>
            <span className="k">Households</span>
            <span className="v">{focus.households}</span>
            <span className="k">Risk score</span>
            <span className="v">{focus.risk}/100</span>
            <span className="k">Devices online</span>
            <span className="v">{Math.floor(focus.households * 0.94)}</span>
            <span className="k">Last alert</span>
            <span className="v">14:38</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 10, color: "var(--ink-4)", fontFamily: "'IBM Plex Mono',monospace" }}>
            Click a zone to select
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenMap = ScreenMap;
