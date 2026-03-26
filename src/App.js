import { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// ─── THEME & CONSTANTS ─────────────────────────────────────────
const COLORS = {
  bg: "#0a0e17",
  surface: "#111827",
  surfaceHover: "#1a2234",
  border: "#1e293b",
  borderActive: "#334155",
  text: "#e2e8f0",
  textDim: "#64748b",
  textMuted: "#475569",
  accent: "#22d3ee",
  accentDim: "#0891b2",
  green: "#10b981",
  greenDim: "#064e3b",
  yellow: "#f59e0b",
  yellowDim: "#78350f",
  red: "#ef4444",
  redDim: "#7f1d1d",
  purple: "#a78bfa",
  blue: "#3b82f6",
  orange: "#f97316",
};

const MODES = [
  { id: "normal", label: "Normal", icon: "●", color: COLORS.green },
  { id: "traffic_spike", label: "Traffic Spike", icon: "▲", color: COLORS.yellow },
  { id: "database_issue", label: "DB Issue", icon: "◆", color: COLORS.orange },
  { id: "service_outage", label: "Outage", icon: "✕", color: COLORS.red },
];

const SEVERITY_COLORS = {
  info: COLORS.blue,
  warning: COLORS.yellow,
  critical: COLORS.red,
};

const STATUS_COLORS = {
  healthy: COLORS.green,
  degraded: COLORS.yellow,
  down: COLORS.red,
};

const LEVEL_COLORS = {
  INFO: COLORS.blue,
  WARN: COLORS.yellow,
  ERROR: COLORS.red,
  DEBUG: COLORS.textDim,
};

const API_BASE = "http://localhost:8000";

// ─── FONTS (injected via style tag) ────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ─────────────────────────────────────────────
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderActive}; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scanline { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 4px rgba(34,211,238,0.2); } 50% { box-shadow: 0 0 16px rgba(34,211,238,0.4); } }
`;
document.head.appendChild(globalStyle);

// ─── LOGIN PAGE ────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [hover, setHover] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.text,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.04) 0%, transparent 50%),
                   radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.03) 0%, transparent 50%),
                   ${COLORS.bg}`,
      fontFamily: "'Outfit', sans-serif",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${COLORS.accent} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.accent} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{
        width: 400, padding: 40, background: COLORS.surface,
        border: `1px solid ${COLORS.border}`, borderRadius: 16,
        animation: "fadeIn 0.6s ease-out",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple}, ${COLORS.accent})`,
        }} />

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: COLORS.bg,
              fontFamily: "'JetBrains Mono', monospace",
            }}>M</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.5px" }}>
              MetricAnalytics
            </span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
            observability platform
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: COLORS.textDim, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
              Username
            </label>
            <input
              style={inputStyle}
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="operator@MetricAnalytics.io"
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: COLORS.textDim, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
              Password
            </label>
            <input
              type="password"
              style={inputStyle}
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••••"
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
          <button
            onClick={() => onLogin()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              marginTop: 8, padding: "14px", borderRadius: 8, border: "none",
              background: hover
                ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`
                : `linear-gradient(135deg, ${COLORS.accentDim}, #7c3aed)`,
              color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", letterSpacing: "0.3px",
              transition: "all 0.3s", transform: hover ? "translateY(-1px)" : "none",
              boxShadow: hover ? `0 8px 24px rgba(34,211,238,0.25)` : "none",
            }}>
            Access Dashboard →
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          v2.4.1 · region: ap-south-1
        </div>
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ─────────────────────────────────────────
function KpiCard({ label, value, unit, color, icon, trend }) {
  const isOffline = value === "--";
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 160,
      position: "relative", overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, width: 3, height: "100%",
        background: isOffline ? COLORS.textMuted : color, borderRadius: "3px 0 0 3px",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontSize: 11, color: COLORS.textDim, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
          }}>{label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontSize: 28, fontWeight: 700, color: isOffline ? COLORS.textMuted : COLORS.text,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px",
            }}>{value}</span>
            {!isOffline && unit && (
              <span style={{ fontSize: 13, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{unit}</span>
            )}
          </div>
        </div>
        <div style={{
          fontSize: 20, opacity: 0.5, color: isOffline ? COLORS.textMuted : color,
        }}>{icon}</div>
      </div>
      {!isOffline && trend !== undefined && (
        <div style={{
          marginTop: 8, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          color: trend >= 0 ? COLORS.red : COLORS.green,
        }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}% from avg
        </div>
      )}
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6,
      background: color + "18", color: color,
      fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
      textTransform: "uppercase", letterSpacing: "0.5px",
    }}>{text}</span>
  );
}

function PanelHeader({ title, icon, count, action }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 16, paddingBottom: 12,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{
          fontSize: 15, fontWeight: 600, color: COLORS.text,
          fontFamily: "'Outfit', sans-serif",
        }}>{title}</span>
        {count !== undefined && (
          <span style={{
            padding: "2px 8px", borderRadius: 10,
            background: COLORS.accent + "15", color: COLORS.accent,
            fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
          }}>{count}</span>
        )}
      </div>
      {action}
    </div>
  );
}

function Panel({ children, style: extraStyle, delay = 0 }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: 20,
      animation: `fadeIn 0.5s ease-out ${delay}ms both`,
      ...extraStyle,
    }}>
      {children}
    </div>
  );
}

// ─── METRICS CHART ─────────────────────────────────────────────
function MetricsChart({ metrics, metricKey, label, color, unit }) {
  if (!metrics || metrics.length === 0) {
    return (
      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        No data available
      </div>
    );
  }

  const data = metrics.map((m, i) => ({
    time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : `T${i}`,
    value: m[metricKey],
  }));

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 12, color: COLORS.textDim, fontWeight: 500,
          fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.8px",
        }}>{label}</span>
        <span style={{
          fontSize: 12, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
        }}>
          {data[data.length - 1]?.value?.toFixed?.(1) ?? "--"}{unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: COLORS.textMuted, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: COLORS.textMuted, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              borderRadius: 8, fontSize: 12, fontFamily: "JetBrains Mono",
              color: COLORS.text, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
            formatter={(val) => [`${val}${unit}`, label]}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${metricKey})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────
function Sidebar({ activeSection, setActiveSection, connected, mode, setMode, onLogout }) {
  const sections = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "metrics", icon: "◈", label: "Metrics" },
    { id: "logs", icon: "☰", label: "Logs" },
    { id: "alerts", icon: "⚠", label: "Alerts" },
    { id: "services", icon: "◎", label: "Services" },
  ];

  return (
    <div style={{
      width: 240, height: "100vh", background: COLORS.surface,
      borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column",
      fontFamily: "'Outfit', sans-serif",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px", borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: COLORS.bg,
          fontFamily: "'JetBrains Mono', monospace",
        }}>K</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.3px" }}>MetricAnalytics</div>
          <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>observability</div>
        </div>
      </div>

      {/* Connection status */}
      <div style={{
        margin: "16px 16px 4px", padding: "10px 12px",
        borderRadius: 8, background: connected ? COLORS.greenDim + "40" : COLORS.redDim + "40",
        border: `1px solid ${connected ? COLORS.green + "30" : COLORS.red + "30"}`,
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        color: connected ? COLORS.green : COLORS.red,
      }}>
        <span style={{ animation: connected ? "pulse 2s infinite" : "none" }}>●</span>
        {connected ? "Backend Connected" : "Backend Offline"}
      </div>

      {/* Mode selector */}
      <div style={{ padding: "12px 16px 8px" }}>
        <div style={{
          fontSize: 10, color: COLORS.textDim, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "1.5px",
          marginBottom: 8, fontFamily: "'JetBrains Mono', monospace",
        }}>Simulation</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 10px", borderRadius: 6, border: "none",
                background: mode === m.id ? m.color + "18" : "transparent",
                color: mode === m.id ? m.color : COLORS.textDim,
                fontSize: 12, fontWeight: mode === m.id ? 600 : 400,
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.15s", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 10 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: `1px solid ${COLORS.border}`, margin: "8px 16px" }} />

      {/* Navigation */}
      <div style={{ padding: "8px 12px", flex: 1 }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: activeSection === s.id ? COLORS.accent + "12" : "transparent",
              color: activeSection === s.id ? COLORS.accent : COLORS.textDim,
              fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              transition: "all 0.15s", textAlign: "left", marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: 16, borderTop: `1px solid ${COLORS.border}` }}>
        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: "10px", borderRadius: 8,
            border: `1px solid ${COLORS.border}`, background: "transparent",
            color: COLORS.textDim, fontSize: 12, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.red + "60"; e.currentTarget.style.color = COLORS.red; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textDim; }}
        >
          ← Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── OVERVIEW SECTION ──────────────────────────────────────────
function OverviewSection({ data, connected }) {
  const s = data?.summary;
  const activeMode = MODES.find(m => m.id === data?.mode) || MODES[0];

  return (
    <div>
      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
        padding: "12px 16px", borderRadius: 10,
        background: connected ? activeMode.color + "08" : COLORS.redDim + "20",
        border: `1px solid ${connected ? activeMode.color + "20" : COLORS.red + "20"}`,
      }}>
        <span style={{ color: connected ? activeMode.color : COLORS.red, fontSize: 14 }}>
          {connected ? activeMode.icon : "✕"}
        </span>
        <span style={{
          fontSize: 13, fontWeight: 500, color: connected ? activeMode.color : COLORS.red,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {connected ? `Mode: ${activeMode.label}` : "Backend not reachable — showing placeholder data"}
        </span>
        <span style={{
          marginLeft: "auto", fontSize: 11, color: COLORS.textDim,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="CPU" value={s?.cpu ?? "--"} unit="%" color={COLORS.accent} icon="⬡" trend={s ? (s.cpu - 55) / 55 * 100 : undefined} />
        <KpiCard label="Memory" value={s?.memory ?? "--"} unit="%" color={COLORS.purple} icon="▦" trend={s ? (s.memory - 50) / 50 * 100 : undefined} />
        <KpiCard label="RPS" value={s?.rps ?? "--"} unit="" color={COLORS.blue} icon="↗" trend={s ? (s.rps - 800) / 800 * 100 : undefined} />
        <KpiCard label="Latency" value={s?.latency ?? "--"} unit="ms" color={COLORS.yellow} icon="◷" trend={s ? (s.latency - 200) / 200 * 100 : undefined} />
        <KpiCard label="Error Rate" value={s?.errorRate ?? "--"} unit="%" color={COLORS.red} icon="⚡" trend={s ? (s.errorRate - 1.5) / 1.5 * 100 : undefined} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <Panel delay={100}>
          <MetricsChart metrics={data?.metrics} metricKey="cpu" label="CPU Usage" color={COLORS.accent} unit="%" />
        </Panel>
        <Panel delay={150}>
          <MetricsChart metrics={data?.metrics} metricKey="latency" label="Latency" color={COLORS.yellow} unit="ms" />
        </Panel>
        <Panel delay={200}>
          <MetricsChart metrics={data?.metrics} metricKey="rps" label="Requests / sec" color={COLORS.blue} unit="" />
        </Panel>
        <Panel delay={250}>
          <MetricsChart metrics={data?.metrics} metricKey="errorRate" label="Error Rate" color={COLORS.red} unit="%" />
        </Panel>
      </div>

      {/* Bottom row: Alerts + Services side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Panel delay={300}>
          <PanelHeader title="Recent Alerts" icon="⚠" count={data?.alerts?.length} />
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {(!data?.alerts || data.alerts.length === 0) ? (
              <div style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "20px 0", textAlign: "center" }}>
                {connected ? "No active alerts" : "--"}
              </div>
            ) : data.alerts.slice(0, 5).map((a, i) => (
              <div key={a.id || i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${COLORS.border}20`,
                animation: `slideIn 0.3s ease-out ${i * 60}ms both`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: SEVERITY_COLORS[a.severity] || COLORS.yellow,
                  flexShrink: 0, boxShadow: `0 0 8px ${(SEVERITY_COLORS[a.severity] || COLORS.yellow)}40`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{a.service}</div>
                </div>
                <Badge text={a.severity} color={SEVERITY_COLORS[a.severity] || COLORS.yellow} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel delay={350}>
          <PanelHeader title="Services" icon="◎" count={data?.services?.length} />
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {(!data?.services || data.services.length === 0) ? (
              <div style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "20px 0", textAlign: "center" }}>
                {connected ? "No services" : "--"}
              </div>
            ) : data.services.map((svc, i) => (
              <div key={svc.name || i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${COLORS.border}20`,
                animation: `slideIn 0.3s ease-out ${i * 60}ms both`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: STATUS_COLORS[svc.status] || COLORS.textMuted,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{svc.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                    {svc.region} · {svc.uptime}
                  </div>
                </div>
                <Badge text={svc.status} color={STATUS_COLORS[svc.status] || COLORS.textMuted} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── METRICS SECTION ───────────────────────────────────────────
function MetricsSection({ data }) {
  const charts = [
    { key: "cpu", label: "CPU Usage", color: COLORS.accent, unit: "%" },
    { key: "memory", label: "Memory Usage", color: COLORS.purple, unit: "%" },
    { key: "rps", label: "Requests Per Second", color: COLORS.blue, unit: "" },
    { key: "latency", label: "Response Latency", color: COLORS.yellow, unit: "ms" },
    { key: "errorRate", label: "Error Rate", color: COLORS.red, unit: "%" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {charts.map((c, i) => (
          <Panel key={c.key} delay={i * 80}>
            <MetricsChart metrics={data?.metrics} metricKey={c.key} label={c.label} color={c.color} unit={c.unit} />
          </Panel>
        ))}
      </div>
    </div>
  );
}

// ─── LOGS SECTION ──────────────────────────────────────────────
function LogsSection({ data, connected }) {
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const logs = data?.logs || [];

  const filtered = logs.filter(l => {
    const matchLevel = levelFilter === "ALL" || l.level === levelFilter;
    const matchText = !filter || l.message?.toLowerCase().includes(filter.toLowerCase()) || l.service?.toLowerCase().includes(filter.toLowerCase()) || l.request_id?.includes(filter);
    return matchLevel && matchText;
  });

  return (
    <Panel>
      <PanelHeader title="System Logs" icon="☰" count={filtered.length} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          placeholder="Search logs... (message, service, request_id)"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            flex: 1, padding: "10px 14px", background: COLORS.bg,
            border: `1px solid ${COLORS.border}`, borderRadius: 8,
            color: COLORS.text, fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.accent}
          onBlur={e => e.target.style.borderColor = COLORS.border}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {["ALL", "INFO", "WARN", "ERROR"].map(lv => (
            <button
              key={lv}
              onClick={() => setLevelFilter(lv)}
              style={{
                padding: "8px 12px", borderRadius: 6, border: "none",
                background: levelFilter === lv ? (lv === "ALL" ? COLORS.accent + "20" : (LEVEL_COLORS[lv] || COLORS.accent) + "20") : COLORS.bg,
                color: levelFilter === lv ? (lv === "ALL" ? COLORS.accent : LEVEL_COLORS[lv]) : COLORS.textDim,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.15s",
              }}
            >{lv}</button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: 500, overflowY: "auto", borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
        {!connected ? (
          <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>--</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>No logs matching filter</div>
        ) : filtered.map((log, i) => (
          <div key={log.id || i} style={{
            display: "grid", gridTemplateColumns: "80px 50px 140px 1fr 100px",
            gap: 12, padding: "10px 14px", alignItems: "center",
            borderBottom: `1px solid ${COLORS.border}20`,
            background: i % 2 === 0 ? "transparent" : COLORS.bg + "40",
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            animation: `fadeIn 0.2s ease-out ${Math.min(i, 20) * 20}ms both`,
          }}>
            <span style={{ color: COLORS.textDim, fontSize: 11 }}>
              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--"}
            </span>
            <Badge text={log.level} color={LEVEL_COLORS[log.level] || COLORS.textDim} />
            <span style={{ color: COLORS.accent, fontSize: 11, opacity: 0.8 }}>{log.service}</span>
            <span style={{ color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.message}</span>
            <span style={{ color: COLORS.textMuted, fontSize: 10, textAlign: "right" }}>{log.request_id}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── ALERTS SECTION ────────────────────────────────────────────
function AlertsSection({ data, connected }) {
  const alerts = data?.alerts || [];

  return (
    <Panel>
      <PanelHeader title="Active Alerts" icon="⚠" count={alerts.length} />
      {!connected ? (
        <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>--</div>
      ) : alerts.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
          <div style={{ color: COLORS.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>All systems nominal</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map((a, i) => (
            <div key={a.id || i} style={{
              padding: "14px 16px", borderRadius: 10,
              background: (SEVERITY_COLORS[a.severity] || COLORS.yellow) + "08",
              border: `1px solid ${(SEVERITY_COLORS[a.severity] || COLORS.yellow)}20`,
              animation: `slideIn 0.4s ease-out ${i * 80}ms both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: SEVERITY_COLORS[a.severity] || COLORS.yellow,
                    boxShadow: `0 0 12px ${(SEVERITY_COLORS[a.severity] || COLORS.yellow)}50`,
                    animation: a.severity === "critical" ? "pulse 1.5s infinite" : "none",
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{a.title}</span>
                </div>
                <Badge text={a.severity} color={SEVERITY_COLORS[a.severity] || COLORS.yellow} />
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textDim }}>
                <span>service: <span style={{ color: COLORS.accent }}>{a.service}</span></span>
                <span>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "--"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ─── SERVICES SECTION ──────────────────────────────────────────
function ServicesSection({ data, connected }) {
  const services = data?.services || [];

  return (
    <Panel>
      <PanelHeader title="Service Registry" icon="◎" count={services.length} />
      {!connected ? (
        <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>--</div>
      ) : services.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>No services registered</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {services.map((svc, i) => (
            <div key={svc.name || i} style={{
              padding: "16px 18px", borderRadius: 10,
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              animation: `fadeIn 0.4s ease-out ${i * 100}ms both`,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = (STATUS_COLORS[svc.status] || COLORS.textMuted) + "60"}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{
                  fontSize: 14, fontWeight: 600, color: COLORS.text,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{svc.name}</span>
                <Badge text={svc.status} color={STATUS_COLORS[svc.status] || COLORS.textMuted} />
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
                <div>
                  <span style={{ color: COLORS.textMuted }}>region </span>
                  <span style={{ color: COLORS.textDim }}>{svc.region}</span>
                </div>
                <div>
                  <span style={{ color: COLORS.textMuted }}>uptime </span>
                  <span style={{ color: COLORS.green }}>{svc.uptime}</span>
                </div>
              </div>
              {/* Mini status bar */}
              <div style={{
                marginTop: 12, height: 3, borderRadius: 2,
                background: COLORS.border,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: svc.status === "healthy" ? "100%" : svc.status === "degraded" ? "60%" : "15%",
                  background: STATUS_COLORS[svc.status] || COLORS.textMuted,
                  transition: "width 0.6s ease-out",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState("normal");
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (m) => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard?mode=${m}`);
      if (!res.ok) throw new Error("Bad response");
      const json = await res.json();
      setData(json);
      setConnected(true);
      setLastFetch(new Date());
    } catch {
      setConnected(false);
      setData(null);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    fetchData(mode);
    intervalRef.current = setInterval(() => fetchData(mode), 5000);
    return () => clearInterval(intervalRef.current);
  }, [loggedIn, mode, fetchData]);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection data={data} connected={connected} />;
      case "metrics": return <MetricsSection data={data} />;
      case "logs": return <LogsSection data={data} connected={connected} />;
      case "alerts": return <AlertsSection data={data} connected={connected} />;
      case "services": return <ServicesSection data={data} connected={connected} />;
      default: return <OverviewSection data={data} connected={connected} />;
    }
  };

  const sectionTitles = {
    overview: "System Overview",
    metrics: "Metrics Explorer",
    logs: "Log Stream",
    alerts: "Alert Center",
    services: "Service Registry",
  };

  return (
    <div style={{
      display: "flex", width: "100vw", height: "100vh",
      background: COLORS.bg, fontFamily: "'Outfit', sans-serif",
      color: COLORS.text, overflow: "hidden",
    }}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        connected={connected}
        mode={mode}
        setMode={setMode}
        onLogout={() => { setLoggedIn(false); setData(null); setConnected(false); }}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "14px 28px", borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: COLORS.surface,
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              {sectionTitles[activeSection]}
            </h1>
            <span style={{
              fontSize: 11, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace",
            }}>
              {lastFetch ? `Last updated: ${lastFetch.toLocaleTimeString()}` : "Waiting for data..."}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => fetchData(mode)}
              style={{
                padding: "8px 16px", borderRadius: 6,
                border: `1px solid ${COLORS.border}`, background: COLORS.bg,
                color: COLORS.textDim, fontSize: 12, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textDim; }}
            >
              ↻ Refresh
            </button>
            <div style={{
              padding: "6px 12px", borderRadius: 6,
              background: COLORS.accent + "10", color: COLORS.accent,
              fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
            }}>
              polling: 5s
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1, overflow: "auto", padding: 24,
        }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}