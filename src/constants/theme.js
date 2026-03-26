export const COLORS = {
  bg: "#0a0e17",
  surface: "#111827",
  surfaceHover: "#1a2234",
  border: "#1e293b",
  borderActive: "#334155",
  text: "#e2e8f0",
  textDim: "#64748b",
  textMuted: "#475569",
  accent: "#22d3ee",
  accentDim: "#0891b2",
  green: "#10b981",
  greenDim: "#064e3b",
  yellow: "#f59e0b",
  yellowDim: "#78350f",
  red: "#ef4444",
  redDim: "#7f1d1d",
  purple: "#a78bfa",
  blue: "#3b82f6",
  orange: "#f97316",
};

export const MODES = [
  { id: "normal", label: "Normal", icon: "●", color: COLORS.green },
  { id: "traffic_spike", label: "Traffic Spike", icon: "▲", color: COLORS.yellow },
  { id: "database_issue", label: "DB Issue", icon: "◆", color: COLORS.orange },
  { id: "service_outage", label: "Outage", icon: "✕", color: COLORS.red },
];

export const SEVERITY_COLORS = {
  info: COLORS.blue,
  warning: COLORS.yellow,
  critical: COLORS.red,
};

export const STATUS_COLORS = {
  healthy: COLORS.green,
  degraded: COLORS.yellow,
  down: COLORS.red,
};

export const LEVEL_COLORS = {
  INFO: COLORS.blue,
  WARN: COLORS.yellow,
  ERROR: COLORS.red,
  DEBUG: COLORS.textDim,
};

export const API_BASE = "http://localhost:8000";
