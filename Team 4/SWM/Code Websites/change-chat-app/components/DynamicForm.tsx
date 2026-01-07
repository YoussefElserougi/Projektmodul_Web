// components/DynamicForm.tsx
// Hauptformular mit 8 Sektionen, dynamisch basierend auf Projektklasse

"use client";

import React, { useState, useEffect } from "react";
import ChatAssistant from "./ChatAssistant";
import {
  ProjectClass,
  SectionConfig,
  FORM_SECTIONS,
  updateFieldStatuses,
  validateForm,
  ValidationIssue,
  getProjectClassLabel,
} from "@/lib/formRules";

interface DynamicFormProps {
  projectClass: ProjectClass;
  onSubmit: (values: Record<string, string>, issues: ValidationIssue[]) => void;
  sessionId?: string; // Optional: Session-ID vom Parent
  initialValues?: Record<string, string>; // Optional: Vorausgefüllte Werte (z.B. bei Session-Reload)
}

export default function DynamicForm({ 
  projectClass, 
  onSubmit, 
  sessionId: parentSessionId,
  initialValues = {} 
}: DynamicFormProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [showChatSuggestion, setShowChatSuggestion] = useState<string | null>(null);
  const [chatPrefillQuestion, setChatPrefillQuestion] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  // Session-ID initialisieren
  useEffect(() => {
    const id = parentSessionId || `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
    console.log(`[DynamicForm] Using session_id: ${id}`);
  }, [parentSessionId]);

  // Update form values when initialValues change (e.g., session reload)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      console.log(`[DynamicForm] Setting initial values:`, initialValues);
      setFormValues(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  // Aktualisiere Sektionen basierend auf Projektklasse
  const sections = updateFieldStatuses(FORM_SECTIONS, projectClass);

  // Nur sichtbare Sektionen (ohne ausgeblendete Felder)
  const visibleSections = sections.filter((section) =>
    section.fields.some((field) => field.status !== "hidden")
  );

  // Berechne Fortschritt
  const requiredFieldsCount = sections.reduce(
    (count, section) =>
      count + section.fields.filter((f) => f.status === "required").length,
    0
  );
  const filledRequiredFields = sections.reduce(
    (count, section) =>
      count +
      section.fields.filter(
        (f) => f.status === "required" && formValues[f.id]?.trim()
      ).length,
    0
  );
  const progress = requiredFieldsCount > 0
    ? Math.round((filledRequiredFields / requiredFieldsCount) * 100)
    : 0;

  // Handle Feld-Änderung mit Auto-Save
  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    setShowChatSuggestion(null); // Reset Chat-Vorschlag
  };

  // Auto-Save beim Feld-Verlassen (onBlur)
  const handleFieldBlur = async (fieldId: string, value: string) => {
    if (!value.trim() || !sessionId) return; // Nur speichern wenn Wert vorhanden
    
    try {
      console.log(`[DynamicForm] Auto-saving field: ${fieldId}`);
      
      await fetch("/api/n8n/update-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          field: fieldId,
          value: value,
          source: "form_autosave",
        }),
      });
      
      console.log(`[DynamicForm] Auto-saved: ${fieldId}`);
    } catch (error) {
      console.error(`[DynamicForm] Auto-save failed for ${fieldId}:`, error);
      // Fehler nicht blockieren - User kann weiterarbeiten
    }
  };

  // Handle Sektion wechseln
  const handleSectionChange = (index: number) => {
    setActiveSectionIndex(index);
  };

  // Handle Formular absenden
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const issues = validateForm(formValues, projectClass);
    setValidationIssues(issues);
    onSubmit(formValues, issues);
  };

  // Trigger Chat-Vorschläge nur für das erste leere Feld
  // (Optional: Entfernen falls zu aufdringlich)
  useEffect(() => {
    const activeSection = visibleSections[activeSectionIndex];
    if (!activeSection) return;

    // Prüfe, ob ein wichtiges Feld leer oder zu kurz ist
    for (const field of activeSection.fields) {
      if (field.status === "required" && !formValues[field.id]?.trim()) {
        // Zeige Vorschlag nach 5 Sekunden Inaktivität (erhöht von 3s)
        const timer = setTimeout(() => {
          setShowChatSuggestion(field.id);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSectionIndex, formValues, visibleSections]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mit Fortschritt */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🏗️ Auftragsklärung Changebegleitung
              </h1>
              <p className="text-sm text-gray-600">
                Projektklasse: <span className="font-semibold">{getProjectClassLabel(projectClass)}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Fortschritt</div>
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Sektionen-Navigation - breiter für lange Titel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 min-w-[280px]">
              <h3 className="font-semibold text-gray-900 mb-3">Sektionen</h3>
              <nav className="space-y-1">
                {visibleSections.map((section, index) => {
                  const sectionFields = section.fields.filter((f) => f.status !== "hidden");
                  const filledFields = sectionFields.filter(
                    (f) => formValues[f.id]?.trim()
                  ).length;
                  const isComplete = filledFields === sectionFields.length;
                  const isActive = index === activeSectionIndex;

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(index)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="flex-shrink-0">{section.icon}</span>
                        <span className="text-sm">{section.title}</span>
                      </span>
                      {isComplete && !isActive && (
                        <svg
                          className="w-4 h-4 text-green-600 flex-shrink-0 ml-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-8 xl:col-span-9">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aktive Sektion */}
              {visibleSections.map((section, index) => {
                if (index !== activeSectionIndex) return null;

                return (
                  <div key={section.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span>{section.icon}</span>
                        <span>{section.title}</span>
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {section.fields
                        .filter((field) => field.status !== "hidden")
                        .map((field) => {
                          const isRequired = field.status === "required";
                          const value = formValues[field.id] || "";
                          const showSuggestion = showChatSuggestion === field.id;

                          return (
                            <div key={field.id}>
                              <label className="block mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {field.label}
                                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                                </span>
                                {field.helpText && (
                                  <span className="block text-xs text-gray-500 mt-1">
                                    {field.helpText}
                                  </span>
                                )}
                              </label>

                              {field.type === "textarea" ? (
                                <textarea
                                  value={value}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  onBlur={(e) => handleFieldBlur(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  rows={4}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              ) : field.type === "select" ? (
                                <select
                                  value={value}
                                  onChange={(e) => {
                                    handleFieldChange(field.id, e.target.value);
                                    handleFieldBlur(field.id, e.target.value); // Auto-save bei Auswahl
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Bitte wählen...</option>
                                  {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              ) : field.type === "date" ? (
                                <input
                                  type="date"
                                  value={value}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  onBlur={(e) => handleFieldBlur(field.id, e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  onBlur={(e) => handleFieldBlur(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  {...(field.maxLength ? { maxLength: field.maxLength } : {})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              )}

                              {/* Live-Validierung: Zu kurz */}
                              {value && field.minLength != null && field.minLength > 0 && value.trim().length < field.minLength ? (
                                <p className="text-sm text-orange-600 mt-1">
                                  {value.trim().length} / {field.minLength} Zeichen (Empfehlung)
                                </p>
                              ) : null}

                              {/* Chat-Hilfe Button - IMMER sichtbar */}
                              <button
                                type="button"
                                onClick={() => {
                                  setChatPrefillQuestion(
                                    `AUTO_SEND:Ich brauche Hilfe beim Ausfüllen des Feldes "${field.label}". Kannst du mir Beispiele und Tipps geben?`
                                  );
                                }}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                💬 Chat-Hilfe für dieses Feld
                              </button>

                              {/* Optional: Auto-Vorschlag nur für erstes leeres Feld */}
                              {showSuggestion && (
                                <div className="mt-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                                  <p className="text-sm text-blue-800 mb-2">
                                    💡 Tipp: Das Feld "{field.label}" ist noch leer. Der Chat kann dir helfen!
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setShowChatSuggestion(null)}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    OK, verstanden
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveSectionIndex(Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Zurück
                      </button>
                      {index < visibleSections.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setActiveSectionIndex(index + 1)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                          Weiter →
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                        >
                          Absenden ✓
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatAssistant
        formContext={{
          projectClass,
          currentSection: visibleSections[activeSectionIndex]?.title,
          currentField: showChatSuggestion || undefined,
          formValues,
        }}
        prefillQuestion={chatPrefillQuestion || undefined}
        sessionId={sessionId}
        email={formValues.ansprechpartner_email}
      />
    </div>
  );
}
