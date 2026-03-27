import React from "react";
import { COLORS } from "../../constants/theme";
import ReactMarkdown from 'react-markdown';

function getRelativeTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export function ChatMessage({ message, onSuggestionClick, isFullPage }) {
  const isAI = message.role === "assistant";
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isAI ? "flex-start" : "flex-end",
      gap: "4px",
      marginBottom: "12px",
      animation: "fadeIn 0.3s ease-out",
    }}>
      <div style={{
        display: "flex",
        flexDirection: isAI ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: "8px",
        maxWidth: isFullPage ? "680px" : "100%",
        width: "100%",
      }}>
        {/* Avatar */}
        <div style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: isAI ? COLORS.border : COLORS.accent + "22",
          display: "flex",
          alignItems: "center",
          justifyChild: "center",
          flexShrink: 0,
        }}>
          {isAI ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "auto" }}>
              <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "auto" }}>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        {/* Bubble */}
        <div style={{
          maxWidth: "80%",
          padding: "10px 12px",
          borderRadius: "8px",
          borderTopLeftRadius: isAI ? "2px" : "8px",
          borderTopRightRadius: isAI ? "8px" : "2px",
          background: isAI ? (message.isError ? COLORS.red + "20" : COLORS.surface) : COLORS.accentDim + "33",
          border: isAI && message.isError ? `1px solid ${COLORS.red}40` : "none",
          fontSize: "16px",
          lineHeight: "1.5",
          color: message.isError ? COLORS.red : COLORS.text,
          position: "relative",
        }}>
          {/* Tool usage chips */}
          {isAI && message.tools_used && message.tools_used.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
              {message.tools_used.map((tool, idx) => (
                <span key={idx} style={{
                  fontSize: "10px",
                  color: COLORS.accent,
                  background: COLORS.accent + "15",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}>
                  used {tool}
                </span>
              ))}
            </div>
          )}
          
          <ReactMarkdown>
  {message.content.replace(/\\n/g, '\n')}
</ReactMarkdown>
          
          {/* Relative Timestamp */}
          <div style={{
            fontSize: "9px",
            color: COLORS.textMuted,
            marginTop: "4px",
            textAlign: isAI ? "left" : "right",
          }}>
            {getRelativeTime(message.timestamp)}
          </div>
        </div>
      </div>

      {/* Suggested actions */}
      {isAI && message.suggestion && (
        <div 
          onClick={() => onSuggestionClick(message.suggestion)}
          style={{
            fontSize: "12px",
            color: COLORS.textDim,
            fontStyle: "italic",
            marginTop: "4px",
            cursor: "pointer",
            paddingLeft: "32px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.color = COLORS.accent}
          onMouseLeave={(e) => e.target.style.color = COLORS.textDim}
        >
          {message.suggestion}
        </div>
      )}
    </div>
  );
}
