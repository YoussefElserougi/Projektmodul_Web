// app/dashboard/page.tsx
// Master Dashboard für Change Manager - modernisierte React-Version

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

interface Session {
  session_id: string;
  requester_email: string;
  status: string;
  created_at: string;
  updated_at: string;
  round_counter: number;
  max_rounds: number;
  missing_fields?: string[];
  total_questions?: number;
  has_communication?: boolean;
  has_partner_selection?: boolean;
  project_classification?: {
    class?: string;
    complexity?: string;
  };
  answers?: Record<string, string>;
}

interface WorkflowResult {
  success: boolean;
  session_id?: string;
  filename?: string;
  change_story?: string;
  communication_plan?: string;
  separate_documents?: {
    requirements_profile?: string;
    rfp_document?: string;
  };
  error?: string;
}

// Helper function to parse missing_fields (can be string or array)
const getMissingFieldsCount = (missingFields: string[] | string | undefined): number => {
  if (!missingFields) return -1; // -1 = unbekannt
  if (Array.isArray(missingFields)) return missingFields.length;
  if (typeof missingFields === 'string') {
    try {
      const parsed = JSON.parse(missingFields);
      return Array.isArray(parsed) ? parsed.length : -1;
    } catch {
      return -1;
    }
  }
  return -1;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [n8nBaseUrl, setN8nBaseUrl] = useState("https://vmd185817.contaboserver.net");
  const [dataTableId, setDataTableId] = useState("cQJ0PWxEInNEL92O");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgetRange, setBudgetRange] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [workflowResults, setWorkflowResults] = useState<{
    uc3?: WorkflowResult;
    uc4?: WorkflowResult;
  }>({});
  const [isGenerating, setIsGenerating] = useState<{
    uc3: boolean;
    uc4: boolean;
  }>({ uc3: false, uc4: false });
  const [detailSession, setDetailSession] = useState<Session | null>(null);
  
  // Editierbare Inhalte für UC3
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [editableChangeStory, setEditableChangeStory] = useState("");
  const [editableCommunicationPlan, setEditableCommunicationPlan] = useState("");
  const [isUC3EditMode, setIsUC3EditMode] = useState(false);

  // PDF Download Funktion mit Markdown-Parsing
  const downloadAsPdf = (title: string, content: string, filename: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    
    // Header
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 22);
    
    // Datum
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Erstellt: ${new Date().toLocaleDateString("de-DE")}`, margin, 30);
    
    // Session Info
    if (selectedSession) {
      doc.setTextColor(255, 255, 255);
      doc.text(`Session: ${selectedSession.session_id}`, pageWidth - margin - 50, 30);
    }
    
    let y = 50;
    
    // Hilfsfunktion für Seitenumbruch
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Markdown-Zeilen parsen
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Leere Zeile
      if (trimmedLine === '') {
        y += 4;
        continue;
      }
      
      // Horizontale Linie (---, ___, ***)
      if (/^[-_*]{3,}$/.test(trimmedLine)) {
        checkPageBreak(8);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        continue;
      }
      
      // H1 Überschrift (# oder ===)
      if (trimmedLine.startsWith('# ') || /^=+$/.test(trimmedLine)) {
        if (/^=+$/.test(trimmedLine)) continue; // Skip === lines
        const text = trimmedLine.replace(/^#+\s*/, '');
        checkPageBreak(14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235); // blue-600
        const wrappedLines = doc.splitTextToSize(text, maxWidth);
        doc.text(wrappedLines, margin, y);
        y += wrappedLines.length * 7 + 4;
        continue;
      }
      
      // H2 Überschrift (##)
      if (trimmedLine.startsWith('## ')) {
        const text = trimmedLine.replace(/^##\s*/, '');
        checkPageBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(55, 65, 81); // gray-700
        const wrappedLines = doc.splitTextToSize(text, maxWidth);
        doc.text(wrappedLines, margin, y);
        y += wrappedLines.length * 6 + 3;
        continue;
      }
      
      // H3 Überschrift (###)
      if (trimmedLine.startsWith('### ')) {
        const text = trimmedLine.replace(/^###\s*/, '');
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99); // gray-600
        const wrappedLines = doc.splitTextToSize(text, maxWidth);
        doc.text(wrappedLines, margin, y);
        y += wrappedLines.length * 5 + 2;
        continue;
      }
      
      // H4+ Überschrift (####)
      if (trimmedLine.startsWith('####')) {
        const text = trimmedLine.replace(/^#+\s*/, '');
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(107, 114, 128); // gray-500
        const wrappedLines = doc.splitTextToSize(text, maxWidth);
        doc.text(wrappedLines, margin, y);
        y += wrappedLines.length * 5 + 2;
        continue;
      }
      
      // Aufzählung (- oder * oder Nummer.)
      if (/^[-*]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine)) {
        const isBullet = /^[-*]\s/.test(trimmedLine);
        const text = trimmedLine.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
        const bulletChar = isBullet ? '•' : trimmedLine.match(/^\d+\./)?.[0] || '•';
        
        checkPageBreak(8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        
        // Bullet/Nummer
        doc.text(bulletChar, margin + 2, y);
        
        // Text (mit Einrückung)
        const bulletWidth = isBullet ? 8 : 12;
        const wrappedLines = doc.splitTextToSize(text.replace(/\*\*/g, ''), maxWidth - bulletWidth);
        
        // Prüfen ob fett (**text**)
        if (text.includes('**')) {
          doc.setFont("helvetica", "bold");
        }
        
        doc.text(wrappedLines, margin + bulletWidth, y);
        y += wrappedLines.length * 5 + 1;
        continue;
      }
      
      // Normaler Text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      // Fettdruck erkennen und Text aufteilen
      let processedLine = trimmedLine;
      
      // **fett** entfernen für die Ausgabe (jsPDF kann kein inline-Styling)
      // Aber wenn die ganze Zeile fett ist, machen wir sie fett
      if (processedLine.startsWith('**') && processedLine.endsWith('**')) {
        processedLine = processedLine.slice(2, -2);
        doc.setFont("helvetica", "bold");
      } else {
        // Entferne ** für normale Darstellung
        processedLine = processedLine.replace(/\*\*/g, '');
      }
      
      checkPageBreak(6);
      const wrappedLines = doc.splitTextToSize(processedLine, maxWidth);
      doc.text(wrappedLines, margin, y);
      y += wrappedLines.length * 5;
    }
    
    // Footer auf jeder Seite
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `SWM Change Management | Seite ${i} von ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
    
    doc.save(filename);
  };

  // UC3 komplett als PDF (verwendet editierte Versionen)
  const downloadUC3AsPdf = () => {
    if (!workflowResults.uc3?.success && !editableChangeStory) return;
    
    // Verwende editierte Inhalte wenn vorhanden, sonst Original
    const changeStory = editableChangeStory || workflowResults.uc3?.change_story || "Keine Change Story verfügbar";
    const commPlan = editableCommunicationPlan || workflowResults.uc3?.communication_plan || "Kein Kommunikationsplan verfügbar";
    
    const content = `# Change Story

${changeStory}

---

# Kommunikationsplan

${commPlan}`;
    
    downloadAsPdf(
      "UC3: Changekommunikation",
      content,
      `UC3_Changekommunikation_${selectedSession?.session_id || "export"}.pdf`
    );
  };

  // UC4 komplett als PDF
  const downloadUC4AsPdf = () => {
    if (!workflowResults.uc4?.success) return;
    
    const content = `# Anforderungsprofil

${workflowResults.uc4.separate_documents?.requirements_profile || "Kein Anforderungsprofil verfügbar"}

---

# RFP-Dokument

${workflowResults.uc4.separate_documents?.rfp_document || "Kein RFP-Dokument verfügbar"}`;
    
    downloadAsPdf(
      "UC4: Partner-Auswahl",
      content,
      `UC4_Partner_Auswahl_${selectedSession?.session_id || "export"}.pdf`
    );
  };

  // Auth Check
  useEffect(() => {
    const auth = localStorage.getItem("swm_dashboard_auth");
    if (auth !== "true") {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Load saved config
  useEffect(() => {
    const savedUrl = localStorage.getItem("n8n_base_url");
    const savedTableId = localStorage.getItem("n8n_datatable_id");
    if (savedUrl) setN8nBaseUrl(savedUrl);
    if (savedTableId) setDataTableId(savedTableId);
  }, []);

  // Reset editor state when session changes
  useEffect(() => {
    setWorkflowResults({});
    setAdditionalInfo("");
    setEditableChangeStory("");
    setEditableCommunicationPlan("");
    setIsUC3EditMode(false);
  }, [selectedSession]);

  // Save config
  const saveConfig = () => {
    localStorage.setItem("n8n_base_url", n8nBaseUrl);
    localStorage.setItem("n8n_datatable_id", dataTableId);
  };

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    saveConfig();

    try {
      const response = await fetch(`${n8nBaseUrl}/webhook/list-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datatable_id: dataTableId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error("Leere Antwort vom Server");
      }

      const data = JSON.parse(text);
      if (!data.success) {
        throw new Error(data.error || "Unbekannter Fehler");
      }

      // Debug: Log session data structure
      console.log("[Dashboard] Received sessions:", data.sessions);
      if (data.sessions?.length > 0) {
        console.log("[Dashboard] First session structure:", JSON.stringify(data.sessions[0], null, 2));
        console.log("[Dashboard] missing_fields value:", data.sessions[0].missing_fields);
        console.log("[Dashboard] missing_fields type:", typeof data.sessions[0].missing_fields);
      }

      setSessions(data.sessions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  const generateCommunication = async () => {
    if (!selectedSession) return;
    setIsGenerating((prev) => ({ ...prev, uc3: true }));

    try {
      const response = await fetch(`${n8nBaseUrl}/webhook/change-communication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: selectedSession.session_id,
          email: selectedSession.requester_email,
          additional_info: additionalInfo, // Zusatzinfos für Rückfragen
        }),
      });

      const text = await response.text();
      if (!text) throw new Error("Keine Antwort vom Workflow");

      const data = JSON.parse(text);
      setWorkflowResults((prev) => ({ ...prev, uc3: data }));
      
      // Editierbare Felder mit Ergebnis initialisieren
      if (data.success) {
        setEditableChangeStory(data.change_story || "");
        setEditableCommunicationPlan(data.communication_plan || "");
        setIsUC3EditMode(true);
      }
    } catch (err) {
      setWorkflowResults((prev) => ({
        ...prev,
        uc3: { success: false, error: err instanceof Error ? err.message : "Fehler" },
      }));
    } finally {
      setIsGenerating((prev) => ({ ...prev, uc3: false }));
    }
  };

  const generatePartnerSelection = async () => {
    if (!selectedSession) return;
    setIsGenerating((prev) => ({ ...prev, uc4: true }));

    try {
      const response = await fetch(`${n8nBaseUrl}/webhook/change-partner-selection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: selectedSession.session_id,
          email: selectedSession.requester_email,
          budget_range: budgetRange,
          preferred_partner_type: partnerType,
        }),
      });

      const text = await response.text();
      if (!text) throw new Error("Keine Antwort vom Workflow");

      const data = JSON.parse(text);
      setWorkflowResults((prev) => ({ ...prev, uc4: data }));
    } catch (err) {
      setWorkflowResults((prev) => ({
        ...prev,
        uc4: { success: false, error: err instanceof Error ? err.message : "Fehler" },
      }));
    } finally {
      setIsGenerating((prev) => ({ ...prev, uc4: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "submitted_request":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "open":
      case "in_progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProjectClassBadge = (projectClass?: string) => {
    switch (projectClass?.toLowerCase()) {
      case "mini":
        return "bg-green-100 text-green-700";
      case "standard":
        return "bg-blue-100 text-blue-700";
      case "major":
        return "bg-purple-100 text-purple-700";
      case "mega":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Change Management Dashboard
                </h1>
                <p className="text-gray-600">Master-Übersicht für Workflow-Steuerung</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Verbunden mit</p>
                <p className="text-gray-900 font-medium text-sm">{n8nBaseUrl}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Config Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span> n8n Konfiguration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                n8n Base URL
              </label>
              <input
                type="text"
                value={n8nBaseUrl}
                onChange={(e) => setN8nBaseUrl(e.target.value)}
                placeholder="https://n8n.swm.de"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DataTable ID (agent_sessions)
              </label>
              <input
                type="text"
                value={dataTableId}
                onChange={(e) => setDataTableId(e.target.value)}
                placeholder="cQJ0PWxEInNEL92O"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            onClick={loadSessions}
            disabled={isLoading}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Laden...
              </>
            ) : (
              <>
                <span>📥</span> Sessions laden
              </>
            )}
          </button>
        </section>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <h3 className="font-bold text-red-800">Fehler beim Laden</h3>
                <p className="text-red-700">{error}</p>
                <div className="mt-2 text-sm text-red-600">
                  <p>Checkliste:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Ist n8n erreichbar? ({n8nBaseUrl})</li>
                    <li>Ist der Workflow &quot;SWM-Change-List-Sessions&quot; importiert?</li>
                    <li>Ist der Workflow aktiviert?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Grid */}
        <section className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> Change-Sessions
            {sessions.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {sessions.length}
              </span>
            )}
          </h2>

          {sessions.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4 opacity-30">📭</div>
              <p>Klicke auf &quot;Sessions laden&quot; um zu starten</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.filter(s => s.session_id).map((session) => (
                <div
                  key={session.session_id}
                  onClick={() => {
                    setSelectedSession(session);
                    setWorkflowResults({});
                  }}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedSession?.session_id === session.session_id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-blue-600 text-lg">
                      {session.session_id ? `${session.session_id.slice(0, 8)}...` : "N/A"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(session.status)}`}>
                      {session.status || "unknown"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <span>📧</span> {session.requester_email || "Keine E-Mail"}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📅</span> {new Date(session.created_at || Date.now()).toLocaleDateString("de-DE")}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📝</span> 
                      {(() => {
                        const missingCount = Array.isArray(session.missing_fields) ? session.missing_fields.length : 0;
                        const filledCount = session.answers ? Object.keys(session.answers).length : 0;
                        if (missingCount === 0 && filledCount > 0) {
                          return <span className="text-green-600 font-medium">Vollständig ✓</span>;
                        }
                        if (missingCount > 0) {
                          return <span className="text-amber-600">{missingCount} Felder offen</span>;
                        }
                        return <span>{filledCount} Felder ausgefüllt</span>;
                      })()}
                    </p>
                    {session.project_classification?.class && (
                      <p className="flex items-center gap-2">
                        <span>📊</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getProjectClassBadge(session.project_classification.class)}`}>
                          {session.project_classification.class.toUpperCase()}
                        </span>
                      </p>
                    )}
                  </div>

                  {session.answers?.beschreibung_vorhaben && (
                    <p className="mt-3 pt-3 border-t text-sm text-gray-500 line-clamp-2">
                      {session.answers.beschreibung_vorhaben}
                    </p>
                  )}

                  {/* Detail Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailSession(session);
                    }}
                    className="mt-3 w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🔍</span> Details anzeigen
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Action Panel */}
        {selectedSession && (
          <section className="bg-white rounded-2xl shadow-xl p-6 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span> Aktionen für Session
            </h2>

            {/* Selected Session Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Session ID</p>
                  <p className="font-mono font-bold text-blue-600">{selectedSession.session_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-Mail</p>
                  <p className="font-medium">{selectedSession.requester_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(selectedSession.status)}`}>
                    {selectedSession.status}
                  </span>
                </div>
              </div>
              {selectedSession.answers?.zielsetzung && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-500">Zielsetzung</p>
                  <p className="text-gray-700">{selectedSession.answers.zielsetzung}</p>
                </div>
              )}
            </div>

            {/* Optional Fields for UC4 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>📝</span> Optional: Zusatzinfos für UC4 (Partner-Auswahl)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="z.B. 50.000 - 100.000 EUR"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Präferierter Partner-Typ
                  </label>
                  <input
                    type="text"
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    placeholder="z.B. Change Beratung & Training"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateCommunication}
                disabled={isGenerating.uc3}
                className="flex-1 min-w-[200px] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating.uc3 ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generiere...
                  </>
                ) : (
                  <>
                    <span>📢</span> UC3: Changekommunikation
                  </>
                )}
              </button>

              <button
                onClick={generatePartnerSelection}
                disabled={isGenerating.uc4}
                className="flex-1 min-w-[200px] px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating.uc4 ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generiere...
                  </>
                ) : (
                  <>
                    <span>🤝</span> UC4: Partner-Auswahl
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  generateCommunication();
                  generatePartnerSelection();
                }}
                disabled={isGenerating.uc3 || isGenerating.uc4}
                className="flex-1 min-w-[200px] px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>⚡</span> Beide generieren
              </button>
            </div>

            {/* Results */}
            {(workflowResults.uc3 || workflowResults.uc4 || isUC3EditMode) && (
              <div className="mt-6 space-y-4">
                {/* UC3 Result - Erweiterter Editor-Bereich */}
                {(workflowResults.uc3 || isUC3EditMode) && (
                  <div className={`rounded-xl p-4 border-l-4 ${
                    workflowResults.uc3?.success || isUC3EditMode
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-red-50 border-red-500"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-bold ${(workflowResults.uc3?.success || isUC3EditMode) ? "text-emerald-700" : "text-red-700"}`}>
                        {(workflowResults.uc3?.success || isUC3EditMode) ? "✅ UC3: Changekommunikation" : "❌ UC3: Fehler"}
                      </h4>
                      {(workflowResults.uc3?.success || editableChangeStory) && (
                        <button
                          onClick={downloadUC3AsPdf}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                        >
                          📥 Als PDF herunterladen
                        </button>
                      )}
                    </div>
                    
                    {workflowResults.uc3?.error ? (
                      <p className="mt-2 text-red-600">{workflowResults.uc3.error}</p>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Linke Spalte: Zusatzinfos */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span>💬</span> Zusatzinfos / Rückfragen
                          </h5>
                          <p className="text-sm text-gray-500 mb-3">
                            Ergänzen Sie hier zusätzliche Informationen oder Rückfragen, um die Change Story zu verbessern.
                          </p>
                          <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="z.B. Bitte den Fokus mehr auf die Vorteile für Endkunden legen... / Budget wurde auf 150.000€ erhöht... / Zeitplan hat sich geändert..."
                            className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
                          />
                          <button
                            onClick={generateCommunication}
                            disabled={isGenerating.uc3}
                            className="mt-3 w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isGenerating.uc3 ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Generiere...
                              </>
                            ) : (
                              <>
                                <span>🔄</span> Mit Zusatzinfos neu generieren
                              </>
                            )}
                          </button>
                        </div>
                        
                        {/* Rechte Spalte: Editierbare Dokumente */}
                        <div className="space-y-4">
                          {/* Change Story Editor */}
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <span>📖</span> Change Story
                              <span className="text-xs font-normal text-gray-400">(editierbar)</span>
                            </h5>
                            <textarea
                              value={editableChangeStory}
                              onChange={(e) => setEditableChangeStory(e.target.value)}
                              className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm font-mono"
                              placeholder="Die Change Story wird hier erscheinen..."
                            />
                          </div>
                          
                          {/* Kommunikationsplan Editor */}
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <span>📋</span> Kommunikationsplan
                              <span className="text-xs font-normal text-gray-400">(editierbar)</span>
                            </h5>
                            <textarea
                              value={editableCommunicationPlan}
                              onChange={(e) => setEditableCommunicationPlan(e.target.value)}
                              className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm font-mono"
                              placeholder="Der Kommunikationsplan wird hier erscheinen..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* UC4 Result */}
                {workflowResults.uc4 && (
                  <div className={`rounded-xl p-4 border-l-4 ${
                    workflowResults.uc4.success
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-red-50 border-red-500"
                  }`}>
                    <h4 className={`font-bold ${workflowResults.uc4.success ? "text-emerald-700" : "text-red-700"}`}>
                      {workflowResults.uc4.success ? "✅ UC4: Partner-Auswahl generiert!" : "❌ UC4: Fehler"}
                    </h4>
                    {workflowResults.uc4.success ? (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            <strong>Dokument:</strong> {workflowResults.uc4.filename}
                          </p>
                          <button
                            onClick={downloadUC4AsPdf}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                          >
                            📥 Als PDF herunterladen
                          </button>
                        </div>
                        <details className="bg-white rounded-lg p-3">
                          <summary className="cursor-pointer font-medium text-gray-700">Anforderungsprofil anzeigen</summary>
                          <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {workflowResults.uc4.separate_documents?.requirements_profile}
                          </pre>
                        </details>
                        <details className="bg-white rounded-lg p-3">
                          <summary className="cursor-pointer font-medium text-gray-700">RFP-Dokument anzeigen</summary>
                          <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {workflowResults.uc4.separate_documents?.rfp_document}
                          </pre>
                        </details>
                      </div>
                    ) : (
                      <p className="mt-2 text-red-600">{workflowResults.uc4.error}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-4">
          <p>SWM Change Management System • Dashboard v2.0</p>
        </footer>
      </div>

      {/* Detail Modal */}
      {detailSession && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setDetailSession(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">Session Details</h2>
                  <p className="text-blue-200 font-mono text-sm mt-1">{detailSession.session_id}</p>
                </div>
                <button
                  onClick={() => setDetailSession(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(detailSession.status)}`}>
                  {detailSession.status}
                </span>
                {detailSession.project_classification?.class && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProjectClassBadge(detailSession.project_classification.class)}`}>
                    {detailSession.project_classification.class.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">E-Mail</p>
                  <p className="font-medium text-gray-900">{detailSession.requester_email || "-"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Erstellt am</p>
                  <p className="font-medium text-gray-900">
                    {new Date(detailSession.created_at || Date.now()).toLocaleString("de-DE")}
                  </p>
                </div>
              </div>

              {/* Answers */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📝</span> Ausgefüllte Felder
                </h3>
                {detailSession.answers && Object.keys(detailSession.answers).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(detailSession.answers).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {typeof value === 'string' && value.length > 300 
                            ? value.substring(0, 300) + "..." 
                            : value || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Keine Felder ausgefüllt</p>
                )}
              </div>

              {/* Missing Fields */}
              {Array.isArray(detailSession.missing_fields) && detailSession.missing_fields.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Fehlende Felder ({detailSession.missing_fields.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detailSession.missing_fields.map((field, idx) => (
                      <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                        {field.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setDetailSession(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Schließen
              </button>
              <button
                onClick={() => {
                  setSelectedSession(detailSession);
                  setDetailSession(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Session auswählen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
