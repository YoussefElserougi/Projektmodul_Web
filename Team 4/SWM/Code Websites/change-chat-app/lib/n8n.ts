// lib/n8n.ts
// Hilfsfunktionen für die Kommunikation mit n8n

import { N8nRequestPayload, N8nResponse } from "@/types/chat";

// TEST_MODE: Setze auf true für den vereinfachten Test-Workflow (nur 2 Fragen)
const TEST_MODE = process.env.N8N_TEST_MODE === "true";

// n8n Webhook URL
// Auf dem Server: Entweder intern via Docker-Netzwerk (http://n8n:5678) 
// oder via Caddy Reverse Proxy (https://vmd185817.contaboserver.net)
// Lokal: http://localhost:5678
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 
  (TEST_MODE 
    ? "https://vmd185817.contaboserver.net/webhook/change-chat-test"
    : "https://vmd185817.contaboserver.net/webhook/change-chat");

/**
 * Sendet eine Nachricht an den n8n-Webhook und gibt die Antwort zurück.
 * Diese Funktion läuft serverseitig in der API-Route.
 */
export async function sendToN8n(payload: N8nRequestPayload): Promise<N8nResponse> {
  console.log(`[n8n] Sending request to: ${N8N_WEBHOOK_URL}`);
  console.log(`[n8n] Payload:`, JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`[n8n] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[n8n] Error response body:`, errorText);
      
      // Spezifische Fehlermeldungen je nach Status
      if (response.status === 404) {
        return {
          reply_text: `⚠️ Der n8n Webhook wurde nicht gefunden (404).\n\nBitte prüfe:\n1. Ist n8n gestartet?\n2. Ist der Workflow aktiviert?\n3. Stimmt der Webhook-Pfad?\n\nAktuell konfiguriert: ${N8N_WEBHOOK_URL}`,
          status: "error",
          session_id: payload.session_id,
        };
      }
      
      if (response.status === 403 || response.status === 0) {
        console.error(`[n8n] Possible CORS issue - Status: ${response.status}`);
      }
      
      throw new Error(`n8n responded with status ${response.status}: ${errorText}`);
    }

    // Hole den Raw-Text zuerst, um leere Antworten zu erkennen
    const responseText = await response.text();
    console.log(`[n8n] Raw response text:`, responseText);
    
    // Prüfe auf leere Antwort
    if (!responseText || responseText.trim() === "") {
      console.error(`[n8n] Empty response from n8n - workflow may have failed or not reached Respond node`);
      return {
        reply_text: "⚠️ n8n hat eine leere Antwort gesendet.\n\nDer Workflow ist möglicherweise:\n1. Nicht bis zum 'Respond to Webhook' Node durchgelaufen\n2. Bei einem Node fehlgeschlagen (z.B. Data Table, OpenAI)\n\nPrüfe die Execution in n8n für Details.",
        status: "error",
        session_id: payload.session_id,
      };
    }
    
    // Versuche JSON zu parsen
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[n8n] Failed to parse JSON:`, parseError);
      console.error(`[n8n] Response was:`, responseText.substring(0, 500));
      return {
        reply_text: `⚠️ n8n hat ungültiges JSON zurückgegeben.\n\nAntwort war: ${responseText.substring(0, 200)}...`,
        status: "error",
        session_id: payload.session_id,
      };
    }
    
    console.log(`[n8n] Success response:`, JSON.stringify(data, null, 2));
    return data as N8nResponse;
  } catch (error) {
    console.error("[n8n] Error calling webhook:", error);
    
    // Prüfe ob es ein Netzwerk-Fehler ist (n8n nicht erreichbar)
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed")) {
      return {
        reply_text: `⚠️ n8n ist nicht erreichbar.\n\nBitte stelle sicher, dass n8n läuft.\nKonfigurierte URL: ${N8N_WEBHOOK_URL}`,
        status: "error",
        session_id: payload.session_id,
      };
    }
    
    return {
      reply_text: `Es gab einen technischen Fehler: ${errorMessage}`,
      status: "error",
      session_id: payload.session_id,
    };
  }
}

/**
 * Generiert eine eindeutige Session-ID
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

/**
 * Sendet strukturierte Formular-Daten an n8n (für SWM-Change-Combined Workflow)
 * Mapped Frontend-Felder auf n8n-erwartete Feldnamen
 */
export async function sendFormToN8n({
  session_id,
  email,
  projectClass,
  classification,
  formValues,
}: {
  session_id: string;
  email: string;
  projectClass: string;
  classification: any;
  formValues: Record<string, string>;
}): Promise<N8nResponse> {
  // Map Frontend-Felder auf n8n-erwartete Feldnamen (aus SWM-Change-Combined.json requiredKeys)
  // Frontend-IDs: siehe lib/formRules.ts
  const mappedData = {
    // Basisdaten
    beschreibung_vorhaben: formValues.titel || "",
    stichpunkte: formValues.beschreibung || "",
    ansprechpartner_name: formValues.ansprechpartner || "",
    
    // Ziele
    zielsetzung: formValues.zielsetzung || "",
    was_passiert_wenn_nicht_erfolgreich: formValues.was_passiert_misserfolg || "",
    
    // Zeitrahmen
    startdatum: formValues.startdatum || "",
    zeithorizont: formValues.zeithorizont || "",
    dauer_heisse_phasen: formValues.heisse_phasen || "",
    
    // Strategie
    strategische_ziele: formValues.strategische_ziele || "",
    beitrag_konzernstrategie: formValues.beitrag_konzernstrategie || "",
    
    // Betroffene
    betroffene_bereiche_personen: formValues.betroffene_bereiche || "",
    anzahl_mitarbeitende_fuehrungskraefte: formValues.anzahl_ma_fk || "",
    
    // Erwartungen
    erwartungen_change_begleitung: formValues.erwartungen || "",
    changebedarf_pag: formValues.changebedarf || "",
    
    // Risiken & Zielzustand
    ziel_change_begleitung_von: formValues.von_zu ? formValues.von_zu.split('→')[0]?.trim() : "",
    ziel_change_begleitung_zu: formValues.von_zu ? formValues.von_zu.split('→')[1]?.trim() : "",
    erfolg_verhindern: formValues.hindernisse || "",
    erfolg_beitragen: formValues.erfolgsfaktoren || "",
    
    // Vereinbarungen
    vereinbarungen: formValues.vereinbarungen || "",
    sonstiges: formValues.sonstiges || "",
    
    // Metadaten
    projektklasse: projectClass,
    klassifizierung: JSON.stringify(classification),
  };

  // Baue message mit allen Daten (für LLM-Kontext)
  const message = `
Change-Anfrage (Projektklasse: ${projectClass.toUpperCase()})

=== FORMULAR-DATEN ===
${Object.entries(mappedData).map(([key, value]) => `${key}: ${value || "(leer)"}`).join("\n")}
  `.trim();

  // Sende an n8n mit erweitertem Payload
  const payload = {
    session_id,
    email,
    message,
    formData: mappedData, // Strukturierte Daten für direkten Zugriff
    source: "form", // Marker für n8n
  };

  console.log(`[n8n] Sending form data via API route`);
  console.log(`[n8n] Form payload:`, JSON.stringify(payload, null, 2));

  try {
    // Verwende API-Route statt direktem n8n Call (umgeht CORS)
    const response = await fetch("/api/n8n", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`[n8n] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[n8n] Error response body:`, errorText);
      
      if (response.status === 404) {
        return {
          reply_text: `⚠️ Der n8n Webhook wurde nicht gefunden (404).\n\nBitte prüfe:\n1. Ist n8n gestartet?\n2. Ist der Workflow SWM-Change-Combined aktiviert?\n3. Stimmt der Webhook-Pfad (/webhook/change-chat)?\n\nAktuell: ${N8N_WEBHOOK_URL}`,
          status: "error",
          session_id,
        };
      }
      
      throw new Error(`n8n responded with status ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log(`[n8n] Raw response text:`, responseText);
    
    if (!responseText || responseText.trim() === "") {
      console.error(`[n8n] Empty response from n8n`);
      return {
        reply_text: "⚠️ n8n hat eine leere Antwort gesendet. Prüfe die Execution in n8n.",
        status: "error",
        session_id,
      };
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[n8n] Failed to parse JSON:`, parseError);
      return {
        reply_text: `⚠️ n8n hat ungültiges JSON zurückgegeben.\n\nAntwort war: ${responseText.substring(0, 200)}...`,
        status: "error",
        session_id,
      };
    }
    
    console.log(`[n8n] Form submission success:`, JSON.stringify(data, null, 2));
    return data as N8nResponse;
  } catch (error) {
    console.error("[n8n] Form submission failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed")) {
      return {
        reply_text: `⚠️ n8n ist nicht erreichbar.\n\nBitte stelle sicher, dass n8n läuft.\nKonfigurierte URL: ${N8N_WEBHOOK_URL}`,
        status: "error",
        session_id,
      };
    }
    
    return {
      reply_text: `Fehler beim Absenden: ${errorMessage}`,
      status: "error",
      session_id,
    };
  }
}
