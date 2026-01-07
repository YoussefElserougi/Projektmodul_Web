# Change Chat App - Hybrid Form + Chat Assistant

## Übersicht

Diese App implementiert ein **Hybrid-System** für die Auftragsklärung Changebegleitung bei Stadtwerke München (SWM):
- **Strukturiertes Formular** mit 8 Sektionen als Hauptkanal
- **Intelligenter Chat-Assistent** zur Unterstützung beim Ausfüllen
- **Dynamische Feldkonfiguration** basierend auf Projektklasse (Mini/Standard/Strategisch)

---

## Architektur

### User Flow
```
Landing Page (/)
    ↓
Projektklassifizierung (/form - Step 1)
  • 4 Meta-Fragen → bestimmt Projektklasse
    ↓
Dynamisches Formular (/form - Step 2)
  • 8 Sektionen mit dynamischen Feldern
  • Chat-Assistent Widget (Floating Button)
    ↓
Review & Submit (/form - Step 3)
  • Validierung (Fehler/Warnungen)
  • Submit zu n8n Backend
```

### Kernkomponenten

| Datei | Zweck |
|-------|-------|
| `components/ProjectClassification.tsx` | Initial-Survey: 4 Meta-Fragen → Projektklasse |
| `components/DynamicForm.tsx` | Hauptformular mit 8 Sektionen, dynamische Felder |
| `lib/formRules.ts` | Regel-Engine: PROJECT_RULES, FORM_SECTIONS, Validierung |
| `app/form/page.tsx` | Workflow-Route: Klassifizierung → Formular → Submit |
| `lib/n8n.ts` | n8n Webhook-Kommunikation (unverändert) |
| `app/chat/page.tsx` | Legacy Chat-Modus (Backward Compatibility) |

---

## Projektklassen

**Bestimmung basierend auf 4 Meta-Fragen:**

| Klasse | Kriterien | Pflichtfelder | Optional | Ausgeblendet |
|--------|-----------|---------------|----------|--------------|
| **Mini** | ≤2 Wochen, ≤50 Personen | 8 | 8 | 3 |
| **Standard** | 1-6 Monate, 50-200 Personen | 15 | 4 | 0 |
| **Strategisch** | >6 Monate ODER >200 Personen ODER hohe Relevanz/Risiko | 17 | 1 | 0 |

**Regel-Engine** (`lib/formRules.ts`):
```typescript
function determineProjectClass(classification: ProjectClassification): ProjectClass {
  // Strategisch: Wenn duration=long ODER scope=large ODER relevance/risk=high
  // Standard: Wenn duration=medium ODER scope=medium
  // Mini: Sonst
}
```

---

## 8 Formular-Sektionen

1. **Basisdaten:** Titel, Beschreibung, Ansprechpartner
2. **Ziele & Nutzen:** Zielsetzung, Misserfolgsfolgen
3. **Zeitrahmen:** Startdatum, Horizont, heiße Phasen
4. **Strategie:** Strategische Ziele, Konzernstrategie
5. **Betroffene:** Bereiche, MA/FK-Zahlen
6. **Erwartungen:** Erwartungen, Changebedarf
7. **Risiken:** Von-Zu, Hindernisse, Erfolgsfaktoren
8. **Vereinbarungen:** Vereinbarungen, Sonstiges

**Dynamische Felder:** Basierend auf Projektklasse werden Felder als `required`, `optional` oder `hidden` markiert.

---

## Installation & Start

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND (Next.js + React + Tailwind)                              │
│  • Chat-Interface im Browser                                        │
│  • Session-Management (localStorage)                                │
│  • API-Route /api/chat                                              │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTP POST
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND (n8n Webhook)                                              │
│  • Session-Logik (Data Tables)                                      │
│  • LLM-Integration (GPT-4.1-mini)                                   │
│  • Gibt JSON-Antwort zurück                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Teil 1: Next.js-Projekt einrichten

### Schritt 1.1: Ins Projektverzeichnis wechseln

```powershell
cd "c:\Users\lilly\Documents\MUC.DAI 3. Semester\Projektmodul Web\change-chat-app"
```

### Schritt 1.2: Dependencies installieren

```powershell
npm install
```

Das dauert 1-2 Minuten. Es werden React, Next.js, Tailwind und TypeScript installiert.

### Schritt 1.3: Environment-Variable erstellen

Kopiere die Beispiel-Datei:

```powershell
Copy-Item .env.example .env.local
```

Öffne `.env.local` und prüfe die URL:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/change-chat
```

### Schritt 1.4: Dev-Server starten

```powershell
npm run dev
```

Die App läuft dann unter: **http://localhost:3000**

---

## Teil 2: n8n Webhook-Workflow einrichten

### Schritt 2.1: Workflow importieren

1. Öffne n8n (http://localhost:5678)
2. Gehe zu "Workflows" → "Import from File"
3. Wähle die Datei: `SWM-Change-Chat-Webhook.json` 
   (liegt im `n8n_workflows`-Ordner)

### Schritt 2.2: Credentials anpassen

Der importierte Workflow referenziert Credentials, die du ggf. anpassen musst:

- **OpenAI API**: Prüfe ob dein OpenAI-Account verknüpft ist
- **Data Table**: Die Data Table `agent_sessions` muss existieren

Falls die Data Table nicht existiert, erstelle sie mit diesen Spalten:
| Spalte            | Typ    |
|-------------------|--------|
| session_id        | String |
| requester_email   | String |
| status            | String |
| round_counter     | Number |
| max_rounds        | Number |
| answers           | String |
| required_keys     | String |
| metadata          | String |
| last_question     | String |
| missing_fields    | String |

### Schritt 2.3: Workflow aktivieren

1. Öffne den Workflow "SWM Change Chat - Webhook Version"
2. Klicke oben rechts auf "Activate"
3. Notiere dir die Webhook-URL (sollte `/webhook/change-chat` sein)

### Schritt 2.4: Webhook testen

Du kannst den Webhook manuell testen:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5678/webhook/change-chat" `
  -ContentType "application/json" `
  -Body '{"session_id": "test123", "message": "Hallo, ich möchte ein Projekt starten", "email": "test@example.com"}'
```

---

## Teil 3: Frontend und Backend verbinden

### Schritt 3.1: Beide starten

In **Terminal 1** (n8n):
```powershell
# Falls Docker:
docker start n8n

# Falls npm:
n8n start
```

In **Terminal 2** (Next.js):
```powershell
cd "c:\Users\lilly\Documents\MUC.DAI 3. Semester\Projektmodul Web\change-chat-app"
npm run dev
```

### Schritt 3.2: Chat testen

1. Öffne http://localhost:3000
2. Klicke auf "Jetzt starten"
3. Schreibe eine Nachricht wie: "Ich möchte ein Digitalisierungsprojekt für HR starten"
4. Der Change Agent sollte mit einer Frage antworten

---

## Projektstruktur erklärt

```
change-chat-app/
├── app/
│   ├── layout.tsx          # Root Layout (Fonts, globales CSS)
│   ├── page.tsx            # Landing Page "/"
│   ├── chat/
│   │   └── page.tsx        # Chat-Seite "/chat"
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API-Route für n8n-Kommunikation
│   └── globals.css         # Tailwind Basis-Styles
│
├── components/
│   ├── ChatWindow.tsx      # Haupt-Chat-Container mit State
│   ├── ChatMessage.tsx     # Einzelne Nachricht (User/Bot)
│   ├── ChatInput.tsx       # Eingabefeld
│   └── LoadingDots.tsx     # Lade-Animation
│
├── lib/
│   └── n8n.ts              # Hilfsfunktionen für Webhook-Calls
│
├── types/
│   └── chat.ts             # TypeScript Interfaces
│
└── Konfig-Dateien
    ├── package.json        # Dependencies & Scripts
    ├── tsconfig.json       # TypeScript-Konfiguration
    ├── tailwind.config.ts  # Tailwind-Konfiguration
    └── next.config.mjs     # Next.js-Konfiguration
```

---

## Datenfluss im Detail

### 1. User schreibt Nachricht

```typescript
// components/ChatWindow.tsx
const handleSend = async (content: string) => {
  // User-Nachricht zum State hinzufügen
  setMessages([...messages, { role: "user", content }]);
  
  // API aufrufen
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      message: content,
      email: "web-user@chat.local"
    })
  });
  
  // Bot-Antwort verarbeiten
  const data = await response.json();
  setMessages([...messages, { role: "assistant", content: data.reply_text }]);
};
```

### 2. API-Route leitet an n8n weiter

```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { session_id, message, email } = await request.json();
  
  // An n8n-Webhook weiterleiten
  const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({ session_id, message, email })
  });
  
  return NextResponse.json(await n8nResponse.json());
}
```

### 3. n8n verarbeitet und antwortet

```
Webhook → Normalize → Get/Create Session → LLM → Parse → Update → Respond
```

---

## State-Management erklärt

### Session-ID
- Wird beim ersten Laden generiert (random string + timestamp)
- Gespeichert in `localStorage` (bleibt bei Refresh erhalten)
- Erlaubt Fortsetzen einer begonnenen Konversation

### Chat-Verlauf
- Array von `ChatMessage`-Objekten im React-State
- Wird bei jeder Nachricht aktualisiert
- Automatisch in `localStorage` gesichert

### Status-Tracking
- `open`: Fragen werden gestellt
- `waiting_for_approval`: Zusammenfassung zur Bestätigung
- `confirmed`: Abgeschlossen
- `max_rounds_reached`: Persönliche Beratung empfohlen

---

## Deployment auf Vercel

### Vorbereitung

1. GitHub-Repository erstellen
2. Code pushen

```powershell
cd change-chat-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/DEIN-USER/change-chat-app.git
git push -u origin main
```

### Vercel Setup

1. Gehe zu [vercel.com](https://vercel.com)
2. "Import Project" → Wähle dein GitHub Repo
3. Environment Variables hinzufügen:
   - `N8N_WEBHOOK_URL` = deine öffentliche n8n-URL

### n8n öffentlich erreichbar machen

Optionen:
- **n8n Cloud**: Automatisch öffentlich
- **Self-Hosted**: Tunnel mit ngrok, cloudflared oder öffentlicher Server

Beispiel mit ngrok:
```powershell
ngrok http 5678
# Gibt dir eine URL wie: https://abc123.ngrok.io
```

Dann in Vercel: `N8N_WEBHOOK_URL=https://abc123.ngrok.io/webhook/change-chat`

---

## Troubleshooting

### "Connection refused" beim API-Call

**Ursache:** n8n läuft nicht oder Webhook ist nicht aktiv

**Lösung:**
1. Prüfe ob n8n läuft: http://localhost:5678
2. Prüfe ob Workflow aktiv ist (Toggle oben rechts)
3. Prüfe Webhook-URL in `.env.local`

### "Es gab ein technisches Problem" im Chat

**Ursache:** LLM-Antwort konnte nicht geparst werden

**Lösung:**
1. In n8n: Executions prüfen
2. Console-Logs der Code-Nodes ansehen
3. OpenAI-Credentials prüfen

### Chat-Verlauf verschwindet

**Ursache:** localStorage wird gelöscht (Private Mode, Cache Clear)

**Lösung:** Das ist erwartetes Verhalten. Für persistente Sessions müsstest du eine Datenbank integrieren.

---

## Nächste Schritte

- [ ] Eigenes Styling/Branding hinzufügen
- [ ] Authentifizierung (z.B. mit NextAuth.js)
- [ ] E-Mail-Benachrichtigung bei Abschluss (optional parallel zum Chat)
- [ ] Admin-Dashboard für Change Team
- [ ] Export der Anfragen als PDF
