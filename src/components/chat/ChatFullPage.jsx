import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/theme";
import { useChat } from "../../context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

export function ChatFullPage() {
  const { 
    messages, isLoading, isConnected, sendMessage, clearChat, setIsPanelOpen 
  } = useChat();
  const [inputValue, setInputValue] = useState("");
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

  const handleBack = () => {
    setIsPanelOpen(true);
    navigate(-1);
  };

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: COLORS.bg,
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 28px",
        borderBottom: `1px solid ${COLORS.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: COLORS.surface,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={handleBack}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: COLORS.textDim, display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.accent}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textDim}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: COLORS.text }}>AI Assistant</h1>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isConnected ? COLORS.green : COLORS.red,
              boxShadow: isConnected ? `0 0 10px ${COLORS.green}66` : "none",
            }} />
            <span style={{ fontSize: "12px", color: COLORS.textDim }}>
              {isConnected ? "Groq-Versatile" : "Offline"}
            </span>
          </div>
          <button 
            onClick={clearChat}
            style={{
              padding: "6px 12px", borderRadius: 6,
              border: `1px solid ${COLORS.border}`, background: COLORS.bg,
              color: COLORS.textDim, fontSize: 12, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.red; e.currentTarget.style.color = COLORS.red; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textDim; }}
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{ width: "100%", maxWidth: "680px", padding: "0 24px" }}>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} onSuggestionClick={sendMessage} isFullPage={true} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{
        padding: "24px 0",
        display: "flex",
        justifyContent: "center",
        background: `linear-gradient(to top, ${COLORS.bg}, transparent)`,
      }}>
        <div style={{ width: "100%", maxWidth: "680px", padding: "0 24px" }}>
          <form onSubmit={handleSend} style={{ 
            display: "flex", gap: "12px", alignItems: "center",
            background: COLORS.surface,
            padding: "12px",
            borderRadius: "12px",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your infrastructure..."
              rows="1"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                fontSize: "14px",
                color: COLORS.text,
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                padding: "8px",
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              style={{
                width: "40px",
                height: "40px",
                background: COLORS.accent,
                borderRadius: "10px",
                border: "none",
                cursor: (!inputValue.trim() || isLoading) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "12px", color: COLORS.textMuted, fontSize: "11px" }}>
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
