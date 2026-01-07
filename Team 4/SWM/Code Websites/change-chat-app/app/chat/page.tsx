// app/chat/page.tsx
// Hauptroute für Hybrid-Workflow: Klassifizierung → Formular → Submit
// Ersetzt altes 20-Fragen-Chat-UI

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProjectClassification from "@/components/ProjectClassification";
import DynamicForm from "@/components/DynamicForm";
import {
  ProjectClass,
  ProjectClassification as ProjectClassificationType,
  ValidationIssue,
} from "@/lib/formRules";
import { sendFormToN8n } from "@/lib/n8n";

type WorkflowStep = "classification" | "form" | "review" | "submitted";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const sessionFromUrl = searchParams.get("session");
  
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("classification");
  const [projectClass, setProjectClass] = useState<ProjectClass>("mini");
  const [classification, setClassification] = useState<ProjectClassificationType | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSessionId, setSubmittedSessionId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  // Session-ID Initialisierung (aus URL oder neu generieren)
  useEffect(() => {
    const initSession = async () => {
      if (sessionFromUrl) {
        setSessionId(sessionFromUrl);
        console.log(`[ChatPage] Using session from URL: ${sessionFromUrl}`);
        
        // Load existing session data
        try {
          const response = await fetch(`/api/n8n/get-session?session_id=${sessionFromUrl}`);
          if (response.ok) {
            const data = await response.json();
            console.log('[ChatPage] Loaded session data:', data);
            
            // Parse answers if they're a string (from n8n JSON storage)
            let parsedAnswers = data.answers;
            if (typeof parsedAnswers === 'string') {
              try {
                parsedAnswers = JSON.parse(parsedAnswers);
              } catch (e) {
                console.warn('[ChatPage] Could not parse answers string:', e);
                parsedAnswers = {};
              }
            }
            
            // Parse project_classification if it's a string
            let parsedClassification = data.project_classification;
            if (typeof parsedClassification === 'string') {
              try {
                parsedClassification = JSON.parse(parsedClassification);
              } catch (e) {
                console.warn('[ChatPage] Could not parse classification string:', e);
                parsedClassification = null;
              }
            }
            
            console.log('[ChatPage] Parsed answers:', parsedAnswers);
            console.log('[ChatPage] Parsed classification:', parsedClassification);
            
            // Check if session has any data (answers or classification)
            const hasAnswers = parsedAnswers && Object.keys(parsedAnswers).length > 0;
            const hasClassification = parsedClassification && Object.keys(parsedClassification).length > 0;
            
            // Restore form values (map from n8n keys back to frontend keys)
            if (hasAnswers) {
              const frontendValues: Record<string, string> = {};
              const reverseMapping: Record<string, string> = {
                beschreibung_vorhaben: 'titel',
                stichpunkte: 'beschreibung',
                ansprechpartner_name: 'ansprechpartner',
                zielsetzung: 'zielsetzung',
                was_passiert_wenn_nicht_erfolgreich: 'was_passiert_misserfolg',
                startdatum: 'startdatum',
                zeithorizont: 'zeithorizont',
                dauer_heisse_phasen: 'heisse_phasen',
                strategische_ziele: 'strategische_ziele',
                beitrag_konzernstrategie: 'beitrag_konzernstrategie',
                betroffene_bereiche_personen: 'betroffene_bereiche',
                anzahl_mitarbeitende_fuehrungskraefte: 'anzahl_ma_fk',
                erwartungen_change_begleitung: 'erwartungen',
                changebedarf_pag: 'changebedarf',
                ziel_change_begleitung_von: 'von_zu', // Combined field
                erfolg_verhindern: 'hindernisse',
                erfolg_beitragen: 'erfolgsfaktoren',
                vereinbarungen: 'vereinbarungen',
                sonstiges: 'sonstiges',
              };
              
              for (const [n8nKey, value] of Object.entries(parsedAnswers)) {
                if (value && typeof value === 'string') {
                  const frontendKey = reverseMapping[n8nKey] || n8nKey;
                  frontendValues[frontendKey] = value;
                }
              }
              
              console.log('[ChatPage] Mapped frontend values:', frontendValues);
              setFormValues(frontendValues);
            }
            
            // Restore classification and project class
            if (hasClassification) {
              setClassification(parsedClassification);
              
              // Determine project class from classification or stored projectClass
              const storedClass = parsedClassification.projectClass || parsedAnswers?.projektklasse;
              if (storedClass && ['mini', 'standard', 'strategic'].includes(storedClass)) {
                setProjectClass(storedClass as ProjectClass);
              }
            }
            
            // Skip classification step if we have existing data
            if (hasAnswers || hasClassification) {
              console.log('[ChatPage] Session has existing data, skipping to form');
              setCurrentStep("form");
            }
          } else {
            console.warn('[ChatPage] Could not load session, starting fresh');
          }
        } catch (error) {
          console.error('[ChatPage] Error loading session:', error);
        }
      } else {
        const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        console.log(`[ChatPage] Generated new session: ${newSessionId}`);
      }
    };
    
    initSession();
  }, [sessionFromUrl]);

  // Klassifizierung abgeschlossen - speichert Classification zu n8n
  const handleClassificationComplete = async (
    classificationData: ProjectClassificationType,
    determinedClass: ProjectClass
  ) => {
    setClassification(classificationData);
    setProjectClass(determinedClass);
    
    // POST Classification an n8n senden
    try {
      console.log(`[ChatPage] Sending classification to n8n for session: ${sessionId}`);
      const response = await fetch("/api/n8n/update-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          source: "form_autosave",
          classification: classificationData,
          projectClass: determinedClass,
          field_update: {
            projektklasse: determinedClass,
          },
        }),
      });
      
      if (response.ok) {
        console.log(`[ChatPage] Classification saved successfully`);
      } else {
        console.warn(`[ChatPage] Classification save returned non-ok status`);
      }
    } catch (error) {
      console.error("[ChatPage] Error saving classification:", error);
      // Nicht blockieren - User kann trotzdem weitermachen
    }
    
    setCurrentStep("form");
  };

  // Formular abgesendet
  const handleFormSubmit = async (
    values: Record<string, string>,
    issues: ValidationIssue[]
  ) => {
    setFormValues(values);
    setValidationIssues(issues);

    // Kritische Fehler blockieren Absenden
    const errors = issues.filter((issue) => issue.severity === "error");
    if (errors.length > 0) {
      alert(
        `Es gibt noch ${errors.length} kritische Fehler. Bitte korrigiere diese vor dem Absenden.`
      );
      return;
    }

    // Bei Warnungen: Review-Dialog zeigen
    const warnings = issues.filter((issue) => issue.severity === "warning");
    if (warnings.length > 0) {
      setCurrentStep("review");
      return;
    }

    // Keine Probleme: Direkt absenden
    await submitToBackend(values);
  };

  // Review: Nutzer bestätigt trotz Warnungen
  const handleReviewConfirm = async () => {
    await submitToBackend(formValues);
  };

  // Review: Nutzer will Änderungen vornehmen
  const handleReviewEdit = () => {
    setCurrentStep("form");
  };

  // Tatsächliche Submission an n8n Backend
  const submitToBackend = async (values: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      // Verwende bestehende Session-ID (aus URL oder generiert)
      const finalSessionId = sessionId || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log(`[ChatPage] Submitting with session_id: ${finalSessionId}`);

      // Sende strukturierte Daten an n8n
      const response = await sendFormToN8n({
        session_id: finalSessionId,
        email: values.ansprechpartner_email || "noreply@example.com",
        projectClass,
        classification,
        formValues: values,
      });

      // Prüfe Response
      if (response.status === "error") {
        throw new Error(response.reply_text || "Unbekannter Fehler");
      }

      setSubmittedSessionId(finalSessionId);
      setCurrentStep("submitted");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
      alert(`Fehler beim Absenden: ${errorMsg}\n\nBitte versuche es erneut oder kontaktiere das Change-Team.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendering basierend auf Workflow-Schritt
  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === "classification" && (
        <ProjectClassification onComplete={handleClassificationComplete} />
      )}

      {currentStep === "form" && (
        <DynamicForm 
          projectClass={projectClass} 
          onSubmit={handleFormSubmit}
          sessionId={sessionId}
          initialValues={formValues}
        />
      )}

      {currentStep === "review" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⚠️ Review vor Absenden
            </h2>
            <p className="text-gray-700 mb-6">
              Dein Formular enthält {validationIssues.length} Warnung(en). Du kannst trotzdem
              absenden oder Änderungen vornehmen.
            </p>

            {/* Liste der Warnungen */}
            <div className="space-y-3 mb-8">
              {validationIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    issue.severity === "error"
                      ? "bg-red-50 border-red-400"
                      : issue.severity === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">
                      {issue.severity === "error" ? "❌" : issue.severity === "warning" ? "⚠️" : "💡"}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{issue.fieldLabel}</p>
                      <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleReviewEdit}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                ← Änderungen vornehmen
              </button>
              <button
                onClick={handleReviewConfirm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Sende..." : "Trotzdem absenden ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === "submitted" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ✅ Erfolgreich abgesendet!
            </h2>
            <p className="text-gray-700 mb-6">
              Deine Change-Anfrage wurde an das Change-Team weitergeleitet.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600">Session-ID:</p>
              <p className="text-lg font-mono text-gray-900">{submittedSessionId}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/chat"}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Neue Anfrage starten
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
