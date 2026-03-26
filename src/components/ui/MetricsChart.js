import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../../constants/theme";

export function MetricsChart({ metrics, metricKey, label, color, unit }) {
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
