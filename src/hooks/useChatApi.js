import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE } from "../constants/theme";

export function useChatApi(currentMode) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I can help you analyze your observability data. Ask me anything about your metrics, logs, alerts, or services.",
      tools_used: [],
      suggestion: "What's the current system status?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const pollingIntervalRef = useRef(null);

  // Check connection
  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`, { method: "GET" });
      setIsConnected(response.ok);
    } catch (error) {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    pollingIntervalRef.current = setInterval(checkHealth, 10000);
    return () => clearInterval(pollingIntervalRef.current);
  }, [checkHealth]);

  console.log("Sending mode:", currentMode);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((msg) => ({ role: msg.role, content: msg.content })),
          mode : currentMode
        }),
      });

      if (!response.ok) throw new Error("Backend unreachable");

      const data = await response.json();
      
      const aiMessage = {
        role: "assistant",
        content: data.response,
        tools_used: data.tools_used || [],
        suggestion: data.suggestion || null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't reach the AI backend. Make sure LM Studio and the FastAPI server are running.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hey! I can help you analyze your observability data. Ask me anything about your metrics, logs, alerts, or services.",
        tools_used: [],
        suggestion: "What's the current system status?",
        timestamp: new Date(),
      },
    ]);
  };

  return {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    clearChat,
  };
}
