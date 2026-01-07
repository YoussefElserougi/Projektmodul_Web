// app/api/chat/route.ts
// Next.js API Route für Chat-Nachrichten

import { NextRequest, NextResponse } from "next/server";
import { sendToN8n } from "@/lib/n8n";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { session_id, message, email } = body;

    // Validierung
    if (!session_id || !message) {
      return NextResponse.json(
        { error: "session_id und message sind erforderlich" },
        { status: 400 }
      );
    }

    // An n8n weiterleiten
    const n8nResponse = await sendToN8n({
      session_id,
      message,
      email: email || "anonymous@chat.local", // Fallback für Chat-User ohne E-Mail
    });

    // Antwort zurückgeben
    return NextResponse.json({
      reply_text: n8nResponse.reply_text,
      status: n8nResponse.status,
      session_id: n8nResponse.session_id,
      missing_fields: n8nResponse.missing_fields,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
