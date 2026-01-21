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
  const isSystem = message.role === "system";
  
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

  // System Message (strukturiert, ohne Markdown)
  if (isSystem && message.systemContent) {
    return (
      <div className="mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-5 py-4 border border-blue-100">
          {/* Title */}
          {message.systemContent.title && (
            <div className="flex items-start gap-2 mb-3">
              <span className="text-2xl">👋</span>
              <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                {message.systemContent.title}
              </h3>
            </div>
          )}
          
          {/* Description */}
          {message.systemContent.description && (
            <p className="text-gray-700 mb-3 text-sm">
              {message.systemContent.description}
            </p>
          )}
          
          {/* Items List */}
          {message.systemContent.items && message.systemContent.items.length > 0 && (
            <ul className="space-y-2 mb-3">
              {message.systemContent.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Footer */}
          {message.systemContent.footer && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600">
                {message.systemContent.footer}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular User/Assistant Message
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
