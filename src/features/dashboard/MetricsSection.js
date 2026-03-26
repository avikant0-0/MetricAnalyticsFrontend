import React from "react";
import { COLORS } from "../../constants/theme";
import { MetricsChart } from "../../components/ui/MetricsChart";
import { Panel } from "../../components/ui/Panel";

export function MetricsSection({ data }) {
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
