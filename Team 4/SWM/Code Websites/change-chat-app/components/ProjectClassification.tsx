// components/ProjectClassification.tsx
// Initiale Klassifizierung des Projekts (4 Meta-Fragen)

"use client";

import React, { useState } from "react";
import {
  ProjectClassification as ClassificationData,
  determineProjectClass,
  getProjectClassLabel,
  getProjectClassDescription,
  ProjectClass,
} from "@/lib/formRules";

interface ProjectClassificationProps {
  onComplete: (classification: ClassificationData, projectClass: ProjectClass) => void;
}

export default function ProjectClassification({
  onComplete,
}: ProjectClassificationProps) {
  const [step, setStep] = useState(0);
  const [classification, setClassification] = useState<ClassificationData>({
    duration: "",
    scope: "",
    relevance: "",
    risk: "",
  });

  const questions = [
    {
      id: "duration",
      question: "1. Dauer des Vorhabens:",
      options: [
        { value: "up_to_2_weeks", label: "Bis 2 Wochen (z.B. Workshop, Sprint)" },
        { value: "1_to_3_months", label: "1-3 Monate" },
        { value: "3_to_12_months", label: "3-12 Monate" },
        { value: "over_1_year", label: "Über 1 Jahr" },
      ],
    },
    {
      id: "scope",
      question: "2. Anzahl betroffener Bereiche/Personen:",
      options: [
        { value: "single_team", label: "1 Team (bis 15 Personen)" },
        { value: "2_to_3_teams", label: "2-3 Teams/Bereiche (15-50 Personen)" },
        { value: "multiple_departments", label: "Mehrere Abteilungen (50-200 Personen)" },
        { value: "company_wide", label: "Konzernweit (>200 Personen)" },
      ],
    },
    {
      id: "relevance",
      question: "3. Strategische Relevanz:",
      options: [
        { value: "low", label: "Niedrig (operative Optimierung)" },
        { value: "medium", label: "Mittel (wichtig für Bereichsziele)" },
        { value: "high", label: "Hoch (unterstützt Konzernstrategie)" },
      ],
    },
    {
      id: "risk",
      question: "4. Unsicherheit/Risiko (Selbsteinschätzung):",
      options: [
        { value: "low", label: "Niedrig (klarer Ablauf, bekannte Prozesse)" },
        { value: "medium", label: "Mittel (einige Unbekannte)" },
        { value: "high", label: "Hoch (neuartiges Vorhaben, viele Unsicherheiten)" },
      ],
    },
  ];

  const currentQuestion = questions[step];
  const isComplete = step === questions.length;

  const handleSelect = (value: string) => {
    const newClassification = {
      ...classification,
      [currentQuestion.id]: value,
    };
    setClassification(newClassification);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Alle Fragen beantwortet
      setTimeout(() => {
        setStep(step + 1); // Zeige Result
      }, 300);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    const projectClass = determineProjectClass(classification);
    onComplete(classification, projectClass);
  };

  if (isComplete) {
    const projectClass = determineProjectClass(classification);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Einordnung abgeschlossen! ✅
              </h2>
              <p className="text-gray-600">
                Basierend auf deinen Angaben wurde dein Projekt klassifiziert:
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">
                  {getProjectClassLabel(projectClass)}
                </h3>
                <p className="text-blue-700">
                  {getProjectClassDescription(projectClass)}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Deine Angaben im Überblick:
              </h4>
              {questions.map((q, idx) => {
                const selectedOption = q.options.find(
                  (opt) => opt.value === classification[q.id as keyof ClassificationData]
                );
                return (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">{q.question.replace(/^\d+\.\s/, "")}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedOption?.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Hinweis:</strong> Das Formular passt sich automatisch deiner
                Projektklasse an. Manche Felder sind Pflicht, andere optional oder
                ausgeblendet.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ← Anpassen
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Weiter zum Formular →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Schnelle Einordnung deines Vorhabens
            </h1>
            <p className="text-gray-600">
              Beantworte 4 kurze Fragen, damit wir das Formular optimal für dich
              anpassen können.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Frage {step + 1} von {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((step + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                    classification[currentQuestion.id as keyof ClassificationData] === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        classification[currentQuestion.id as keyof ClassificationData] ===
                        option.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {classification[currentQuestion.id as keyof ClassificationData] ===
                        option.value && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10.28 2.28L4.5 8.06 1.72 5.28l.56-.56L4.5 6.94l5.22-5.22z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {step > 0 && (
            <button
              onClick={handleBack}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              ← Zurück
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
