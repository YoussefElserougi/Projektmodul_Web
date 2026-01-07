// components/ChatMessage.tsx
// Einzelne Chat-Nachricht (User oder Bot)

"use client";

import React, { useState, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  // Zeitstempel nur auf dem Client rendern um Hydration-Fehler zu vermeiden
  const [timeString, setTimeString] = useState<string>("");
  
  useEffect(() => {
    setTimeString(
      message.timestamp.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [message.timestamp]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        {/* Rolle-Indikator */}
        <div className={`text-xs mb-1 ${isUser ? "text-blue-200" : "text-gray-500"}`}>
          {isUser ? "Du" : "Change Agent"}
        </div>
        
        {/* Nachrichteninhalt - unterstützt Zeilenumbrüche */}
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
        
        {/* Zeitstempel - nur auf Client gerendert */}
        {timeString && (
          <div className={`text-xs mt-2 ${isUser ? "text-blue-200" : "text-gray-400"}`}>
            {timeString}
          </div>
        )}
      </div>
    </div>
  );
}
