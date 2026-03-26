import { COLORS } from "../constants/theme";

// ─── FONTS (injected via style tag) ────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ─────────────────────────────────────────────
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderActive}; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scanline { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 4px rgba(34,211,238,0.2); } 50% { box-shadow: 0 0 16px rgba(34,211,238,0.4); } }
`;
document.head.appendChild(globalStyle);

export const injectGlobalStyles = () => {
    // This is just to ensure the file is imported and side-effects run
};
