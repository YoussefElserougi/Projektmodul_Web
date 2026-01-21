// app/chat/page.tsx
// Hauptroute für Hybrid-Workflow: Klassifizierung → Formular → Submit
// Ersetzt altes 20-Fragen-Chat-UI

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectClassification from "@/components/ProjectClassification";
import DynamicForm from "@/components/DynamicForm";
import { N8N_ENDPOINTS } from "@/lib/config";
import {
  ProjectClass,
  ProjectClassification as ProjectClassificationType,
  ValidationIssue,
} from "@/lib/formRules";
import { sendFormToN8n } from "@/lib/n8n";

type WorkflowStep = "loading" | "email_input" | "classification" | "form" | "review" | "submitted_request" | "already_submitted_request";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const sessionFromUrl = searchParams.get("session");
  
  // Start with loading if we have a session URL (to prevent flicker)
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(
    sessionFromUrl ? "loading" : "email_input"
  );
  const [projectClass, setProjectClass] = useState<ProjectClass>("mini");
  const [classification, setClassification] = useState<ProjectClassificationType | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSessionId, setSubmittedSessionId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [requesterEmail, setRequesterEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isSendingWelcomeEmail, setIsSendingWelcomeEmail] = useState(false);

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
            console.log('[ChatPage] Session status:', data.status);
            
            // Check if session was already submitted
            if (data.status === 'submitted_request') {
              console.log('[ChatPage] Session already submitted_request, showing info page');
              setSubmittedSessionId(sessionFromUrl);
              setCurrentStep("already_submitted_request");
              return; // Early exit - don't load form
            }
            
            // Restore requester email if available
            if (data.requester_email && data.requester_email !== 'noreply@example.com') {
              setRequesterEmail(data.requester_email);
            }
            
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
            
            // Determine workflow step based on session state
            // Priority: 1) Has data -> form, 2) Has email -> classification, 3) No email -> email_input
            const sessionHasEmail = (data.requester_email && data.requester_email !== 'noreply@example.com' && data.requester_email !== 'anonymous@chat.local');
            
            if (hasAnswers || hasClassification) {
              // Session has data - go directly to form
              console.log('[ChatPage] Session has existing data (answers or classification), going to form');
              setCurrentStep("form");
            } else if (sessionHasEmail) {
              // Session has email but no data yet - start with classification
              console.log('[ChatPage] Session has email, starting classification');
              setCurrentStep("classification");
            } else {
              // No email in session - need email input first
              console.log('[ChatPage] Session has no valid email, starting with email_input');
              setCurrentStep("email_input");
            }
          } else {
            console.warn('[ChatPage] Could not load session, starting fresh with email input');
            setCurrentStep("email_input");
          }
        } catch (error) {
          console.error('[ChatPage] Error loading session:', error);
          setCurrentStep("email_input");
        }
      } else {
        // No session URL - generate new session and redirect to URL with session param
        const newSessionId = Math.random().toString(36).substring(2, 10);
        console.log(`[ChatPage] Generated new session: ${newSessionId}, redirecting...`);
        window.location.href = `/chat?session=${newSessionId}`;
        return; // Will redirect, so don't continue
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
      const response = await fetch(N8N_ENDPOINTS.UPDATE_FIELD, {
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
      // Use requesterEmail if available, otherwise fall back to form field or default
      const emailToUse = requesterEmail || values.ansprechpartner_email || "noreply@example.com";
      const response = await sendFormToN8n({
        session_id: finalSessionId,
        email: emailToUse,
        projectClass,
        classification,
        formValues: values,
      });

      // Prüfe Response
      if (response.status === "error") {
        throw new Error(response.reply_text || "Unbekannter Fehler");
      }

      // Success! Form was submitted and status is already updated by n8n workflow
      console.log(`[ChatPage] Form submitted successfully`);
      setSubmittedSessionId(finalSessionId);
      setCurrentStep("submitted_request");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
      alert(`Fehler beim Absenden: ${errorMsg}\n\nBitte versuche es erneut oder kontaktiere das Change-Team.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email-Input: Validiere und sende Willkommens-Mail
  const handleEmailSubmit = async () => {
    // Validiere E-Mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!requesterEmail.trim()) {
      setEmailError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    if (!emailRegex.test(requesterEmail)) {
      setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    
    setEmailError("");
    setIsSendingWelcomeEmail(true);
    
    try {
      console.log(`[ChatPage] Sending welcome email for session: ${sessionId}`);
      
      // Sende Willkommens-Mail direkt an n8n
      const response = await fetch(N8N_ENDPOINTS.WELCOME_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          email: requesterEmail,
        }),
      });
      
      if (response.ok) {
        console.log(`[ChatPage] Welcome email sent successfully`);
      } else {
        console.warn(`[ChatPage] Welcome email send returned non-ok status`);
        // Don't block - user can continue
      }
    } catch (error) {
      console.error("[ChatPage] Error sending welcome email:", error);
      // Don't block - user can continue
    } finally {
      setIsSendingWelcomeEmail(false);
    }
    
    // Weiter zur Klassifizierung
    setCurrentStep("classification");
  };

  // Rendering basierend auf Workflow-Schritt
  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === "loading" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Session-Daten...</p>
          </div>
        </div>
      )}

      {currentStep === "email_input" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Willkommen beim Change-Portal
              </h2>
              <p className="text-gray-600">
                Bitte gib deine E-Mail-Adresse ein, damit wir dich über den Status deiner Anfrage informieren können.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  id="email"
                  value={requesterEmail}
                  onChange={(e) => {
                    setRequesterEmail(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEmailSubmit();
                    }
                  }}
                  placeholder="deine.email@beispiel.de"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    emailError ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              
              <button
                onClick={handleEmailSubmit}
                disabled={isSendingWelcomeEmail}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSendingWelcomeEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Wird gesendet...
                  </>
                ) : (
                  "Weiter →"
                )}
              </button>
            </div>
            
            <p className="mt-6 text-xs text-gray-500 text-center">
              Du erhältst eine Bestätigungs-E-Mail mit einem Link zu deiner Anfrage.
            </p>
          </div>
        </div>
      )}

      {currentStep === "already_submitted_request" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📋 Anfrage bereits eingereicht
            </h2>
            <p className="text-gray-700 mb-6">
              Diese Change-Anfrage wurde bereits eingereicht und an das Change-Team weitergeleitet.
              Sie werden in Kürze kontaktiert.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600">Session-ID:</p>
              <p className="text-lg font-mono text-gray-900">{submittedSessionId || sessionId}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  const newId = Math.random().toString(36).substring(2, 10);
                  window.location.href = `/chat?session=${newId}`;
                }}
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

      {currentStep === "submitted_request" && (
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
                onClick={() => {
                  const newId = Math.random().toString(36).substring(2, 10);
                  window.location.href = `/chat?session=${newId}`;
                }}
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

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Lädt...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
