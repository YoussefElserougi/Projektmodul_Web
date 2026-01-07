// app/api/n8n/get-session/route.ts
// GET route to load existing session data from n8n

import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://vmd185817.contaboserver.net/webhook/change-chat";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id parameter" },
        { status: 400 }
      );
    }

    console.log(`[GET Session API] Loading session: ${sessionId}`);
    console.log(`[GET Session API] Using n8n URL: ${N8N_WEBHOOK_URL}`);

    // Call n8n workflow with source=load_session  
    // This triggers IF: Check Source to route to load branch
    let response;
    try {
      response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          source: "load_session",
          message: "Load existing session data"
        }),
      });
    } catch (fetchError: any) {
      // Handle network errors (ECONNREFUSED, timeout, etc.)
      console.error(`[GET Session API] Network error:`, fetchError.message);
      
      if (fetchError.cause?.code === 'ECONNREFUSED' || fetchError.message?.includes('ECONNREFUSED')) {
        return NextResponse.json({
          session_id: sessionId,
          answers: {},
          project_classification: {},
          status: "new",
          missing_fields: [],
          _warning: `n8n ist nicht erreichbar (${N8N_WEBHOOK_URL}). Session wird als neu behandelt.`
        });
      }
      
      // Return empty session data for any network error to allow graceful degradation
      return NextResponse.json({
        session_id: sessionId,
        answers: {},
        project_classification: {},
        status: "new",
        missing_fields: [],
        _warning: `Netzwerkfehler: ${fetchError.message}`
      });
    }

    if (!response.ok) {
      const text = await response.text();
      console.error(`[GET Session API] n8n error (${response.status}):`, text);
      
      // If session not found, return empty data
      if (response.status === 404 || text.includes('not found')) {
        return NextResponse.json({
          session_id: sessionId,
          answers: {},
          project_classification: {},
          status: "new",
          missing_fields: []
        });
      }
      
      return NextResponse.json(
        { error: `n8n error: ${response.status}`, details: text },
        { status: response.status }
      );
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      // Empty response - session probably doesn't exist yet
      return NextResponse.json({
        session_id: sessionId,
        answers: {},
        project_classification: {},
        status: "new",
        missing_fields: []
      });
    }

    const data = JSON.parse(text);
    console.log(`[GET Session API] Loaded session data:`, data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[GET Session API] Error:", error);
    
    // Return graceful fallback for any unexpected error
    const sessionId = new URL(request.url).searchParams.get("session_id") || "unknown";
    return NextResponse.json({
      session_id: sessionId,
      answers: {},
      project_classification: {},
      status: "new",
      missing_fields: [],
      _error: error.message
    });
  }
}
