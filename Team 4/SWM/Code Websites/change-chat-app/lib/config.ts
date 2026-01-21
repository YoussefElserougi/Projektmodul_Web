// lib/config.ts
// Zentrale Konfiguration für n8n-Endpoints (Static Export)

export const N8N_BASE_URL = "https://vmd185817.contaboserver.net";

// Webhook-Endpoints
export const N8N_ENDPOINTS = {
  // Chat-Workflow (UC1/UC2)
  CHAT: `${N8N_BASE_URL}/webhook/change-chat`,
  
  // Field-Update für Auto-Save
  UPDATE_FIELD: `${N8N_BASE_URL}/webhook/update-field`,
  
  // Welcome-Email nach Formular-Submit
  WELCOME_EMAIL: `${N8N_BASE_URL}/webhook/welcome-email`,
  
  // Session-Liste für Dashboard
  LIST_SESSIONS: `${N8N_BASE_URL}/webhook/list-sessions`,
  
  // UC3: Changekommunikation
  COMMUNICATION: `${N8N_BASE_URL}/webhook/change-communication`,
  
  // UC4: Partner-Auswahl
  PARTNER_SELECTION: `${N8N_BASE_URL}/webhook/change-partner-selection`,
};

// Helper für direkte n8n-Aufrufe
export async function callN8n<T = unknown>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`n8n error (${response.status}): ${errorText}`);
  }

  const text = await response.text();
  if (!text) {
    throw new Error("Empty response from n8n");
  }

  return JSON.parse(text) as T;
}
