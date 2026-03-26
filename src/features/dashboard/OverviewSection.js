import React from "react";
import { COLORS, MODES, SEVERITY_COLORS, STATUS_COLORS } from "../../constants/theme";
import { KpiCard } from "../../components/ui/KpiCard";
import { MetricsChart } from "../../components/ui/MetricsChart";
import { Panel } from "../../components/ui/Panel";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { Badge } from "../../components/ui/Badge";

export function OverviewSection({ data, connected }) {
  const s = data?.summary;
  const activeMode = MODES.find(m => m.id === data?.mode) || MODES[0];

  return (
    <div>
      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
        padding: "12px 16px", borderRadius: 10,
        background: connected ? activeMode.color + "08" : COLORS.redDim + "20",
        border: `1px solid ${connected ? activeMode.color + "20" : COLORS.red + "20"}`,
      }}>
        <span style={{ color: connected ? activeMode.color : COLORS.red, fontSize: 14 }}>
          {connected ? activeMode.icon : "✕"}
        </span>
        <span style={{
          fontSize: 13, fontWeight: 500, color: connected ? activeMode.color : COLORS.red,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {connected ? `Mode: ${activeMode.label}` : "Backend not reachable — showing placeholder data"}
        </span>
        <span style={{
          marginLeft: "auto", fontSize: 11, color: COLORS.textDim,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="CPU" value={s?.cpu ?? "--"} unit="%" color={COLORS.accent} icon="⬡" trend={s ? (s.cpu - 55) / 55 * 100 : undefined} />
        <KpiCard label="Memory" value={s?.memory ?? "--"} unit="%" color={COLORS.purple} icon="▦" trend={s ? (s.memory - 50) / 50 * 100 : undefined} />
        <KpiCard label="RPS" value={s?.rps ?? "--"} unit="" color={COLORS.blue} icon="↗" trend={s ? (s.rps - 800) / 800 * 100 : undefined} />
        <KpiCard label="Latency" value={s?.latency ?? "--"} unit="ms" color={COLORS.yellow} icon="◷" trend={s ? (s.latency - 200) / 200 * 100 : undefined} />
        <KpiCard label="Error Rate" value={s?.errorRate ?? "--"} unit="%" color={COLORS.red} icon="⚡" trend={s ? (s.errorRate - 1.5) / 1.5 * 100 : undefined} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <Panel delay={100}>
          <MetricsChart metrics={data?.metrics} metricKey="cpu" label="CPU Usage" color={COLORS.accent} unit="%" />
        </Panel>
        <Panel delay={150}>
          <MetricsChart metrics={data?.metrics} metricKey="latency" label="Latency" color={COLORS.yellow} unit="ms" />
        </Panel>
        <Panel delay={200}>
          <MetricsChart metrics={data?.metrics} metricKey="rps" label="Requests / sec" color={COLORS.blue} unit="" />
        </Panel>
        <Panel delay={250}>
          <MetricsChart metrics={data?.metrics} metricKey="errorRate" label="Error Rate" color={COLORS.red} unit="%" />
        </Panel>
      </div>

      {/* Bottom row: Alerts + Services side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Panel delay={300}>
          <PanelHeader title="Recent Alerts" icon="⚠" count={data?.alerts?.length} />
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {(!data?.alerts || data.alerts.length === 0) ? (
              <div style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "20px 0", textAlign: "center" }}>
                {connected ? "No active alerts" : "--"}
              </div>
            ) : data.alerts.slice(0, 5).map((a, i) => (
              <div key={a.id || i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${COLORS.border}20`,
                animation: `slideIn 0.3s ease-out ${i * 60}ms both`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: SEVERITY_COLORS[a.severity] || COLORS.yellow,
                  flexShrink: 0, boxShadow: `0 0 8px ${(SEVERITY_COLORS[a.severity] || COLORS.yellow)}40`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{a.service}</div>
                </div>
                <Badge text={a.severity} color={SEVERITY_COLORS[a.severity] || COLORS.yellow} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel delay={350}>
          <PanelHeader title="Services" icon="◎" count={data?.services?.length} />
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {(!data?.services || data.services.length === 0) ? (
              <div style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "20px 0", textAlign: "center" }}>
                {connected ? "No services" : "--"}
              </div>
            ) : data.services.map((svc, i) => (
              <div key={svc.name || i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${COLORS.border}20`,
                animation: `slideIn 0.3s ease-out ${i * 60}ms both`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: STATUS_COLORS[svc.status] || COLORS.textMuted,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{svc.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                    {svc.region} · {svc.uptime}
                  </div>
                </div>
                <Badge text={svc.status} color={STATUS_COLORS[svc.status] || COLORS.textMuted} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
