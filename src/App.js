import React, { useState, useEffect } from "react";
import { COLORS } from "./constants/theme";
import { injectGlobalStyles } from "./styles/GlobalStyles";
import { useDashboardData } from "./hooks/useDashboardData";
import { Sidebar } from "./components/layout/Sidebar";
import { LoginPage } from "./features/auth/LoginPage";
import { OverviewSection } from "./features/dashboard/OverviewSection";
import { MetricsSection } from "./features/dashboard/MetricsSection";
import { LogsSection } from "./features/dashboard/LogsSection";
import { AlertsSection } from "./features/dashboard/AlertsSection";
import { ServicesSection } from "./features/dashboard/ServicesSection";

// Inject global styles once
injectGlobalStyles();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState("normal");
  
  const { data, connected, lastFetch, fetchData, resetData } = useDashboardData(loggedIn, mode);

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

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

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
        onLogout={() => { setLoggedIn(false); resetData(); }}
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
