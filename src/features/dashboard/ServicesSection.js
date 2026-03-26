import React from "react";
import { COLORS, STATUS_COLORS } from "../../constants/theme";
import { Panel } from "../../components/ui/Panel";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { Badge } from "../../components/ui/Badge";

export function ServicesSection({ data, connected }) {
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
