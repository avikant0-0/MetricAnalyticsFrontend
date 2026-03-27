import React from "react";
import { COLORS, MODES } from "../../constants/theme";
import { useChat } from "../../context/ChatContext";

export function Sidebar({ activeSection, setActiveSection, connected, mode, setMode, onLogout }) {
  const { isPanelOpen, togglePanel } = useChat();
  
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
      {/* Logo ... */}
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
        }}>M</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.3px" }}>MetricAnalytics</div>
          <div style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>observability</div>
        </div>
      </div>

      {/* Connection status ... */}
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

      {/* Mode selector ... */}
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

      {/* Navigation ... */}
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
        
        {/* Chat Toggle Button */}
        <button
          onClick={togglePanel}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: isPanelOpen ? COLORS.accent + "22" : "transparent",
            color: isPanelOpen ? COLORS.accent : COLORS.textDim,
            fontSize: 13, fontWeight: isPanelOpen ? 600 : 400,
            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            transition: "all 0.15s", textAlign: "left", marginTop: 8,
          }}
        >
          <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          AI Assistant
        </button>
      </div>

      {/* Logout ... */}
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
