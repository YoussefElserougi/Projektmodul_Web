// types/chat.ts
// TypeScript Interfaces für den Chat und Form-Workflow

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  // Optional: Structured content for system messages
  systemContent?: {
    title?: string;
    description?: string;
    items?: string[];
    footer?: string;
  };
}

export interface ChatSession {
  sessionId: string;
  email: string;
  status: "open" | "editing" | "confirmed" | "max_rounds_reached" | "submitted_request";
  messages: ChatMessage[];
}

export interface N8nResponse {
  reply_text: string;
  status: string;
  session_id: string;
  missing_fields?: string[];
}

export interface N8nRequestPayload {
  session_id: string;
  message: string;
  email: string;
}

// Form-specific types
export interface FormData {
  beschreibung_vorhaben?: string;
  stichpunkte?: string;
  ansprechpartner_name?: string;
  zielsetzung?: string;
  zeithorizont?: string;
  startdatum?: string;
  dauer_heisse_phasen?: string;
  beitrag_konzernstrategie?: string;
  strategische_ziele?: string;
  was_passiert_wenn_nicht_erfolgreich?: string;
  betroffene_bereiche_personen?: string;
  anzahl_mitarbeitende_fuehrungskraefte?: string;
  erwartungen_change_begleitung?: string;
  changebedarf_pag?: string;
  ziel_change_begleitung_von?: string;
  ziel_change_begleitung_zu?: string;
  erfolg_verhindern?: string;
  erfolg_beitragen?: string;
  sonstiges?: string;
  vereinbarungen?: string;
  [key: string]: string | undefined; // Allow dynamic fields
}

// Auto-save payload
export interface AutosavePayload {
  session_id: string;
  field_update: {
    [fieldName: string]: string;
  };
  source: "form_autosave";
}

// Form submit payload
export interface FormSubmitPayload {
  session_id: string;
  email: string;
  source: "form";
  formData: FormData;
  projectClass?: string;
  classification?: Record<string, any>;
}

// Load session payload
export interface LoadSessionPayload {
  session_id: string;
  source: "load_session";
}

// Session data from backend
export interface SessionData {
  session_id: string;
  requester_email: string;
  status: "editing" | "open" | "confirmed" | "max_rounds_reached" | "submitted_request";
  answers: FormData;
  metadata?: Record<string, any>;
  project_classification?: Record<string, any>;
  missing_fields?: string[];
}
