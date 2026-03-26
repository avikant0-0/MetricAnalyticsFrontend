import React from "react";
import { COLORS } from "../../constants/theme";

export function KpiCard({ label, value, unit, color, icon, trend }) {
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
