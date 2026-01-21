// components/ChatInput.tsx
// Eingabefeld für Chat-Nachrichten

"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  initialValue?: string; // Vorbefüllter Text
}

export default function ChatInput({ 
  onSend, 
  disabled = false,
  placeholder = "Schreibe eine Nachricht...",
  initialValue = ""
}: ChatInputProps) {
  const [input, setInput] = useState(initialValue);

  // Update input wenn initialValue sich ändert
  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter ohne Shift sendet die Nachricht
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Textarea für mehrzeilige Eingabe */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm leading-snug
                     placeholder:text-gray-400
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     max-h-32 overflow-y-auto"
          style={{ minHeight: "44px" }}
        />
        
        {/* Senden-Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-white text-sm font-medium
                     hover:bg-blue-700 transition-colors
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     flex items-center gap-2"
        >
          <span>Senden</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-4 h-4"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      
      {/* Hinweis */}
      <p className="text-xs text-gray-400 mt-2">
        Drücke Enter zum Senden, Shift+Enter für neue Zeile
      </p>
    </div>
  );
}
