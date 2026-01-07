// components/ChatAssistant.tsx
// Chat-Assistent Widget für das Formular (3 Rollen: On-Demand, Live-Validation, Review)

"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingDots from "./LoadingDots";
import { sendToN8n } from "@/lib/n8n";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatAssistantProps {
  formContext?: {
    projectClass: string;
    currentSection?: string;
    currentField?: string;
    formValues?: Record<string, string>;
  };
  prefillQuestion?: string; // Vorbefüllte Frage für User (nicht auto-senden!)
  sessionId?: string; // Session-ID vom Formular
  email?: string; // E-Mail-Adresse vom Formular
  onClose?: () => void;
}

export default function ChatAssistant({
  formContext,
  prefillQuestion,
  sessionId: externalSessionId,
  email: externalEmail,
  onClose,
}: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prefillText, setPrefillText] = useState<string>(""); // Vorbefüllter Text für Input
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verwende externe Props direkt (kein State nötig!)
  const sessionId = externalSessionId || `chat_assistant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const email = externalEmail || "assistant@example.com";

  // Initialisierung - Welcome Message
  useEffect(() => {
    console.log(`[ChatAssistant] Using session_id: ${sessionId}`);
    console.log(`[ChatAssistant] Using email: ${email}`);

    // Welcome Message
    const welcomeMessage: ChatMessageType = {
      id: "welcome",
      role: "assistant",
      content: `👋 Hallo! Ich bin dein Change-Assistent. Ich helfe dir beim Ausfüllen des Formulars.

**Ich kann:**
• Beispiele und Tipps für einzelne Felder geben
• Deine Eingaben auf Vollständigkeit prüfen
• Fragen zum Change-Prozess beantworten

**Projektklasse:** ${formContext?.projectClass || "Unbekannt"}

Wie kann ich dir helfen?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [formContext?.projectClass]);

  // Prefill für Hilfe-Fragen - mit AUTO_SEND Support
  useEffect(() => {
    if (prefillQuestion) {
      // Check für AUTO_SEND: Prefix
      if (prefillQuestion.startsWith("AUTO_SEND:")) {
        const actualQuestion = prefillQuestion.replace("AUTO_SEND:", "");
        setIsOpen(true); // Öffne Widget automatisch
        // Sende Nachricht automatisch nach kurzem Delay (für UX)
        setTimeout(() => {
          handleSendMessage(actualQuestion);
        }, 300);
      } else {
        // Normale Vorbefüllung (User muss selbst senden)
        setIsOpen(true); // Chat öffnen
        setPrefillText(prefillQuestion); // Frage vorbefüllen
      }
    }
  }, [prefillQuestion]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle User Message
  const handleSendMessage = async (content: string) => {
    // User message
    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Baue Kontext-Nachricht für n8n mit bisherigen Antworten
      let contextualMessage = content;
      if (formContext) {
        // Bisherige Antworten formatieren (nur gefüllte Felder)
        const filledFields = formContext.formValues 
          ? Object.entries(formContext.formValues)
              .filter(([_, value]) => value && value.trim())
              .map(([key, value]) => `- ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`)
              .join('\n')
          : '';

        contextualMessage = `
[CONTEXT]
Projektklasse: ${formContext.projectClass}
${formContext.currentSection ? `Aktuelle Sektion: ${formContext.currentSection}` : ""}
${formContext.currentField ? `Aktuelles Feld: ${formContext.currentField}` : ""}
${filledFields ? `\nBereits ausgefüllte Felder:\n${filledFields}` : ''}

[USER QUESTION]
${content}
        `.trim();
      }

      // Sende an n8n via API-Route (umgeht CORS)
      const response = await fetch("/api/n8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: contextualMessage,
          source: "chat", // Explizit als Chat markieren
          // E-Mail nur senden wenn vorhanden (n8n kennt sie aus Session)
          ...(email !== "assistant@example.com" && { email }),
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Assistant response
      const assistantMessage: ChatMessageType = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.reply_text || "Entschuldigung, ich konnte keine Antwort generieren.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessageType = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "⚠️ Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Chat
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col mb-4 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                💬
              </div>
              <div>
                <h3 className="font-semibold">Change-Assistent</h3>
                <p className="text-xs text-blue-100">Immer für dich da</p>
              </div>
            </div>
            <button
              onClick={onClose || handleToggle}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <LoadingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <ChatInput 
              onSend={(msg) => {
                handleSendMessage(msg);
                setPrefillText(""); // Clear prefill nach Senden
              }} 
              disabled={isLoading}
              initialValue={prefillText}
            />
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          title="Chat-Assistent öffnen"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}
    </div>
  );
}
