// components/ChatWindow.tsx
// Haupt-Chat-Container mit State-Management

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingDots from "./LoadingDots";

// Session-ID Generator
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Willkommensnachricht
const WELCOME_MESSAGE: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content: `Hallo! 👋

Ich bin dein Change Agent und helfe dir, eine Change-Anfrage für die Stadtwerke München zu erstellen.

Ich werde dir Schritt für Schritt Fragen stellen, um alle wichtigen Informationen zu sammeln. Am Ende erhältst du eine Zusammenfassung zur Bestätigung.

**Lass uns starten!** Beschreibe mir kurz dein Vorhaben oder Projekt.`,
  timestamp: new Date(),
};

// Willkommensnachricht für E-Mail-Session (fortsetzen)
const CONTINUE_MESSAGE: ChatMessageType = {
  id: "continue",
  role: "assistant",
  content: `Willkommen zurück! 👋

Ich habe deine E-Mail erhalten und eine Change-Anfrage für dich vorbereitet.

Ich werde dir nun Schritt für Schritt Fragen stellen, um alle wichtigen Informationen für deinen Change-Antrag zu sammeln.

**Lass uns starten!** Beschreibe mir bitte zunächst dein Vorhaben oder Projekt.`,
  timestamp: new Date(),
};

export default function ChatWindow() {
  // URL-Parameter lesen
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("session");
  
  // Chat-State
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [status, setStatus] = useState<string>("open");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Ref für Auto-Scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session-ID beim ersten Laden: URL hat Priorität vor localStorage
  useEffect(() => {
    // 1. Priorität: URL-Parameter (von E-Mail-Link)
    if (urlSessionId) {
      console.log("[Chat] Using session from URL:", urlSessionId);
      setSessionId(urlSessionId);
      setMessages([CONTINUE_MESSAGE]);
      setStatus("open");
      // Speichere die URL-Session im localStorage
      localStorage.setItem("change-chat-session", JSON.stringify({
        sessionId: urlSessionId,
        messages: [CONTINUE_MESSAGE],
        status: "open",
      }));
      setIsInitialized(true);
      return;
    }
    
    // 2. Priorität: localStorage (vorherige Session)
    const storedSession = localStorage.getItem("change-chat-session");
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed.sessionId) {
          console.log("[Chat] Using session from localStorage:", parsed.sessionId);
          setSessionId(parsed.sessionId);
        } else {
          const newId = generateSessionId();
          console.log("[Chat] Generated new session:", newId);
          setSessionId(newId);
        }
        if (parsed.messages && Array.isArray(parsed.messages)) {
          setMessages(parsed.messages.map((m: ChatMessageType) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
        }
        setStatus(parsed.status || "open");
      } catch (e) {
        console.error("Error parsing stored session:", e);
        const newId = generateSessionId();
        setSessionId(newId);
      }
    } else {
      // 3. Fallback: Neue Session erstellen
      const newId = generateSessionId();
      console.log("[Chat] No existing session, generated new:", newId);
      setSessionId(newId);
    }
    setIsInitialized(true);
  }, [urlSessionId]);

  // Session in localStorage speichern bei Änderungen
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("change-chat-session", JSON.stringify({
        sessionId,
        messages,
        status,
      }));
    }
  }, [sessionId, messages, status]);

  // Auto-Scroll bei neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Nachricht senden
  const handleSend = async (content: string) => {
    // Sicherstellen dass sessionId existiert
    const currentSessionId = sessionId || generateSessionId();
    if (!sessionId) {
      setSessionId(currentSessionId);
    }
    
    console.log("[Chat] Sending message with session_id:", currentSessionId);
    
    // User-Nachricht hinzufügen
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API aufrufen
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: currentSessionId,
          message: content,
          email: "web-user@chat.local", // Kann später durch echte Auth ersetzt werden
        }),
      });

      const data = await response.json();

      // Bot-Antwort hinzufügen
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply_text || "Keine Antwort erhalten.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Status aktualisieren
      if (data.status) {
        setStatus(data.status);
      }

    } catch (error) {
      console.error("Chat error:", error);
      // Fehlernachricht
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Es gab einen Fehler bei der Verbindung. Bitte versuche es erneut.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Session zurücksetzen
  const handleReset = () => {
    localStorage.removeItem("change-chat-session");
    setSessionId(generateSessionId());
    setMessages([WELCOME_MESSAGE]);
    setStatus("open");
  };

  // Status-Badge
  const getStatusBadge = () => {
    const badges: Record<string, { text: string; color: string }> = {
      open: { text: "In Bearbeitung", color: "bg-blue-100 text-blue-800" },
      waiting_for_approval: { text: "Warte auf Bestätigung", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { text: "Abgeschlossen", color: "bg-green-100 text-green-800" },
      max_rounds_reached: { text: "Persönliche Beratung empfohlen", color: "bg-orange-100 text-orange-800" },
    };
    const badge = badges[status] || badges.open;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Change Request Portal</h1>
            <p className="text-blue-100 text-sm">Stadtwerke München</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <button
              onClick={handleReset}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
            >
              Neue Anfrage
            </button>
          </div>
        </div>
      </div>

      {/* Nachrichten-Bereich */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <LoadingDots />}
        <div ref={messagesEndRef} />
      </div>

      {/* Eingabe-Bereich */}
      <ChatInput 
        onSend={handleSend} 
        disabled={isLoading || status === "confirmed"}
        placeholder={
          status === "confirmed" 
            ? "Anfrage wurde abgeschlossen" 
            : "Schreibe eine Nachricht..."
        }
      />
    </div>
  );
}
