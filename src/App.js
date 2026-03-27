import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { ChatProvider, useChat } from "./context/ChatContext";
import { ChatPanel } from "./components/chat/ChatPanel";
import { ChatFullPage } from "./components/chat/ChatFullPage";

// Inject global styles once
injectGlobalStyles();

function DashboardContent({ activeSection, setActiveSection, mode, setMode, data, connected, lastFetch, fetchData, onLogout }) {
  const { isPanelOpen } = useChat();

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
        onLogout={onLogout}
      />

      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden",
        marginRight: isPanelOpen ? "340px" : "0",
        transition: "margin-right 300ms ease-in-out",
      }}>
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

      <ChatPanel />
    </div>
  );
}

function MainApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState("normal");
  
  const { data, connected, lastFetch, fetchData, resetData } = useDashboardData(loggedIn, mode);

  const handleLogout = () => {
    setLoggedIn(false);
    resetData();
  };

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <ChatProvider currentMode = {mode}>
    <Routes>
      <Route path="/" element={
        <DashboardContent 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          mode={mode}
          setMode={setMode}
          data={data}
          connected={connected}
          lastFetch={lastFetch}
          fetchData={fetchData}
          onLogout={handleLogout}
        />
      } />
      <Route path="/chat" element={
        <div style={{ display: "flex", width: "100vw", height: "100vh", background: COLORS.bg }}>
          <Sidebar 
            activeSection="chat" 
            setActiveSection={() => {}} 
            connected={connected} 
            mode={mode} 
            setMode={setMode} 
            onLogout={handleLogout} 
          />
          <ChatFullPage />
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ChatProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}