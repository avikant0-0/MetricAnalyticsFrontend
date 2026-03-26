import React from "react";
import { COLORS, SEVERITY_COLORS } from "../../constants/theme";
import { Panel } from "../../components/ui/Panel";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { Badge } from "../../components/ui/Badge";

export function AlertsSection({ data, connected }) {
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
