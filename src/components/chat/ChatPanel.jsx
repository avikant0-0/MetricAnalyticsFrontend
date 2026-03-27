import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/theme";
import { useChat } from "../../context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

export function ChatPanel() {
  const { 
    messages, isLoading, isConnected, sendMessage, clearChat, isPanelOpen 
  } = useChat();
  const [inputValue, setInputValue] = useState("");
  const [panelWidth, setPanelWidth] = useState(340);
  const isResizing = useRef(false); 

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.min(Math.max(newWidth, 340), 700)); // min 280, max 700
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className={`chat-panel ${isPanelOpen ? "open" : ""}`} style={{
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      width: panelWidth,
      background: COLORS.bg,
      borderLeft: `1px solid ${COLORS.border}`,
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
      transform: isPanelOpen ? "translateX(0)" : "translateX(100%)",
      transition: "transform 300ms ease-in-out",
    }}>
      {/* Header */}
      {/* Resize handle */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          isResizing.current = true;
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
        }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          cursor: "col-resize",
          background: "transparent",
          zIndex: 51,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = COLORS.accent + "40"}
        onMouseLeave={(e) => {
          if (!isResizing.current) e.currentTarget.style.background = "transparent";
        }}
      />
      <div style={{
        padding: "12px 16px",
        borderBottom: `0.5px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: COLORS.surface,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: "13px", fontWeight: 500, color: COLORS.text }}>AI assistant</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: isConnected ? COLORS.green : COLORS.red,
              boxShadow: isConnected ? `0 0 8px ${COLORS.green}66` : "none",
            }} />
            <span style={{ fontSize: "11px", color: COLORS.textDim }}>
              {isConnected ? "GPT-OSS 20B" : "Offline"}
            </span>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
             <button 
              onClick={clearChat}
              title="Clear chat"
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: "4px",
                color: COLORS.textDim, display: "flex", alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.red}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textDim}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
            <button 
              onClick={() => navigate("/chat")}
              title="Expand"
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: "4px",
                color: COLORS.textDim, display: "flex", alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textDim}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} onSuggestionClick={sendMessage} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px",
        borderTop: `0.5px solid ${COLORS.border}`,
        background: COLORS.surface,
      }}>
        <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your infrastructure..."
            style={{
              flex: 1,
              background: COLORS.bg,
              border: `0.5px solid ${COLORS.border}`,
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "12px",
              color: COLORS.text,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.borderActive}
            onBlur={(e) => e.target.style.borderColor = COLORS.border}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            style={{
              width: "34px",
              height: "34px",
              background: COLORS.accent,
              borderRadius: "8px",
              border: "none",
              cursor: (!inputValue.trim() || isLoading) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
              transition: "transform 0.1s, background 0.2s",
            }}
            onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
