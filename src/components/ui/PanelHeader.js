import React from "react";
import { COLORS } from "../../constants/theme";

export function PanelHeader({ title, icon, count, action }) {
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
