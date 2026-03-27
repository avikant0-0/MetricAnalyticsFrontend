import React, { createContext, useContext, useState } from "react";
import { useChatApi } from "../hooks/useChatApi";

const ChatContext = createContext();

export function ChatProvider({ children , currentMode}) {
  const chatApi = useChatApi(currentMode);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  const value = {
    ...chatApi,
    isPanelOpen,
    togglePanel,
    setIsPanelOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
