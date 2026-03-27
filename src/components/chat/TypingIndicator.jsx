import React from "react";
import { COLORS } from "../../constants/theme";

export function TypingIndicator() {
  return (
    <div style={{
      display: "flex",
      gap: "4px",
      padding: "10px 12px",
      background: COLORS.surface,
      borderRadius: "8px",
      borderTopLeftRadius: "2px",
      width: "fit-content",
      marginBottom: "12px",
    }}>
      <style>{`
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "6px",
            background: COLORS.accent,
            borderRadius: "50%",
            animation: `typing-bounce 1.4s infinite ease-in-out both`,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}
