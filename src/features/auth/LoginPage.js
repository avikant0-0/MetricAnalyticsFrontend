import React, { useState } from "react";
import { COLORS } from "../../constants/theme";

export function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [hover, setHover] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.text,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.04) 0%, transparent 50%),
                   radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.03) 0%, transparent 50%),
                   ${COLORS.bg}`,
      fontFamily: "'Outfit', sans-serif",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${COLORS.accent} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.accent} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{
        width: 400, padding: 40, background: COLORS.surface,
        border: `1px solid ${COLORS.border}`, borderRadius: 16,
        animation: "fadeIn 0.6s ease-out",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.purple}, ${COLORS.accent})`,
        }} />

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: COLORS.bg,
              fontFamily: "'JetBrains Mono', monospace",
            }}>M</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.5px" }}>
              MetricAnalytics
            </span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
            observability platform
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: COLORS.textDim, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
              Username
            </label>
            <input
              style={inputStyle}
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="operator@MetricAnalytics.io"
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: COLORS.textDim, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
              Password
            </label>
            <input
              type="password"
              style={inputStyle}
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••••"
              onFocus={e => e.target.style.borderColor = COLORS.accent}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
          <button
            onClick={() => onLogin()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              marginTop: 8, padding: "14px", borderRadius: 8, border: "none",
              background: hover
                ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`
                : `linear-gradient(135deg, ${COLORS.accentDim}, #7c3aed)`,
              color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", letterSpacing: "0.3px",
              transition: "all 0.3s", transform: hover ? "translateY(-1px)" : "none",
              boxShadow: hover ? `0 8px 24px rgba(34,211,238,0.25)` : "none",
            }}>
            Access Dashboard →
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          v2.4.1 · region: ap-south-1
        </div>
      </div>
    </div>
  );
}
