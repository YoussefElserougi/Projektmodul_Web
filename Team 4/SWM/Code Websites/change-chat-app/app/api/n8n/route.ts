// app/api/n8n/route.ts
// API-Route für n8n Communication (umgeht CORS-Problem)

import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://vmd185817.contaboserver.net/webhook/change-chat";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("[API] Forwarding request to n8n:", N8N_WEBHOOK_URL);
    console.log("[API] Payload:", JSON.stringify(body, null, 2));

    // Forward request to n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[API] n8n response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] n8n error:", errorText);
      
      // Spezialfall: Session not found für Form-Kontext
      // In diesem Fall geben wir eine hilfreiche Antwort zurück
      if (errorText.includes("Session nicht gefunden")) {
        return NextResponse.json({
          reply_text: "💡 Um den Chat-Assistenten zu nutzen, fülle zunächst das Formular aus und sende es ab. Der Chat-Assistent hilft dir dann beim Verfeinern deiner Antworten.\n\nFür allgemeine Fragen kannst du auch direkt eine E-Mail an das Change-Team senden.",
          status: "info",
          session_id: body.session_id,
        });
      }
      
      return NextResponse.json(
        {
          reply_text: `n8n Fehler (${response.status}): ${errorText}`,
          status: "error",
          session_id: body.session_id,
        },
        { status: response.status }
      );
    }

    // Handle empty response body
    const text = await response.text();
    console.log("[API] n8n raw response:", text);
    
    if (!text || text.trim() === '') {
      console.error("[API] Empty response from n8n");
      return NextResponse.json(
        {
          reply_text: "Technischer Fehler: n8n hat keine Antwort gesendet. Bitte prüfe den Workflow.",
          status: "error",
        },
        { status: 500 }
      );
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("[API] JSON parse error:", parseError);
      console.error("[API] Raw text was:", text);
      return NextResponse.json(
        {
          reply_text: `Technischer Fehler: Ungültige Antwort von n8n (${parseError instanceof Error ? parseError.message : 'Parse error'})`,
          status: "error",
        },
        { status: 500 }
      );
    }
    
    console.log("[API] n8n response data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      {
        reply_text: `Technischer Fehler: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
        status: "error",
      },
      { status: 500 }
    );
  }
}
