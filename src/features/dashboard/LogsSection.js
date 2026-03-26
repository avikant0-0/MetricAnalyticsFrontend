import React, { useState } from "react";
import { COLORS, LEVEL_COLORS } from "../../constants/theme";
import { Panel } from "../../components/ui/Panel";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { Badge } from "../../components/ui/Badge";

export function LogsSection({ data, connected }) {
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
