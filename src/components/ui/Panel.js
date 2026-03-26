import React from "react";
import { COLORS } from "../../constants/theme";

export function Panel({ children, style: extraStyle, delay = 0 }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: 20,
      animation: `fadeIn 0.5s ease-out ${delay}ms both`,
      ...extraStyle,
    }}>
      {children}
    </div>
  );
}
