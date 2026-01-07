// app/api/n8n/update-field/route.ts
// API-Route für Auto-Save einzelner Formular-Felder

import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://vmd185817.contaboserver.net/webhook/change-chat";

// Mapping von Frontend-Feld-IDs zu n8n required_keys
const FIELD_MAPPING: Record<string, string> = {
  titel: "beschreibung_vorhaben",
  beschreibung: "stichpunkte",
  ansprechpartner: "ansprechpartner_name",
  zielsetzung: "zielsetzung",
  was_passiert_misserfolg: "was_passiert_wenn_nicht_erfolgreich",
  startdatum: "startdatum",
  zeithorizont: "zeithorizont",
  heisse_phasen: "dauer_heisse_phasen",
  strategische_ziele: "strategische_ziele",
  beitrag_konzernstrategie: "beitrag_konzernstrategie",
  betroffene_bereiche: "betroffene_bereiche_personen",
  anzahl_ma_fk: "anzahl_mitarbeitende_fuehrungskraefte",
  erwartungen: "erwartungen_change_begleitung",
  changebedarf: "changebedarf_pag",
  von_zu: "ziel_change_begleitung_von", // Note: von_zu maps to both _von and _zu
  hindernisse: "erfolg_verhindern",
  erfolgsfaktoren: "erfolg_beitragen",
  vereinbarungen: "vereinbarungen",
  sonstiges: "sonstiges",
  projektklasse: "projektklasse", // Classification field
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, field, value, source, classification, projectClass, field_update: directFieldUpdate } = body;

    console.log(`[API] Auto-saving for session: ${session_id}`);
    console.log(`[API] Field: ${field}, Value: ${value}`);
    console.log(`[API] Direct field_update:`, directFieldUpdate);
    console.log(`[API] Classification:`, classification);
    console.log(`[API] ProjectClass:`, projectClass);

    // Build field_update with mapped field name
    const fieldUpdate: Record<string, string> = {};
    
    // Option 1: Single field + value (from DynamicForm blur events)
    if (field && value !== undefined) {
      // Map the field name to n8n required_keys format
      const mappedFieldName = FIELD_MAPPING[field] || field;
      fieldUpdate[mappedFieldName] = value;
      
      // Note: von_zu is now stored as a single combined field, not split
      // The mapping already handles: von_zu -> ziel_change_begleitung_von
      // Both "von" and "zu" parts are stored together in this one field
      
      console.log(`[API] Mapped field ${field} -> ${mappedFieldName}`);
    }
    
    // Option 2: field_update object directly (from classification step)
    if (directFieldUpdate && typeof directFieldUpdate === 'object') {
      for (const [key, val] of Object.entries(directFieldUpdate)) {
        const mappedKey = FIELD_MAPPING[key] || key;
        fieldUpdate[mappedKey] = val as string;
        console.log(`[API] Mapped direct field ${key} -> ${mappedKey}`);
      }
    }

    // Payload für n8n
    const payload: Record<string, any> = {
      session_id,
      field_update: fieldUpdate,
      source: source || "form_autosave",
    };
    
    // Add classification if provided (from classification step)
    if (classification) {
      payload.classification = classification;
    }
    if (projectClass) {
      payload.projectClass = projectClass;
    }
    
    console.log(`[API] Sending payload to n8n:`, JSON.stringify(payload, null, 2));

    // Forward to n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] n8n auto-save error:", errorText);
      
      // Fehler nicht blockieren - Frontend kann weiterarbeiten
      return NextResponse.json(
        { success: false, error: errorText },
        { status: 200 } // 200 damit Frontend nicht bricht
      );
    }

    const data = await response.json();
    console.log(`[API] Auto-save successful for field: ${field}`);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API] Auto-save error:", error);
    
    // Fehler nicht blockieren
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 200 }
    );
  }
}
