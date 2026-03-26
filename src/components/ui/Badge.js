import React from "react";

export function Badge({ text, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6,
      background: color + "18", color: color,
      fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
      textTransform: "uppercase", letterSpacing: "0.5px",
    }}>{text}</span>
  );
}
