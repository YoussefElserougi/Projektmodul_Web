// lib/formRules.ts
// Regel-Engine für dynamische Formular-Konfiguration basierend auf Projektklasse
// Basiert auf hybrid-form-chat-concept.md

export type ProjectClass = "mini" | "standard" | "strategic";

export type FieldStatus = "required" | "optional" | "hidden";

export interface ProjectClassification {
  duration: string; // "up_to_2_weeks" | "1_to_3_months" | "3_to_12_months" | "over_1_year"
  scope: string; // "single_team" | "2_to_3_teams" | "multiple_departments" | "company_wide"
  relevance: string; // "low" | "medium" | "high"
  risk: string; // "low" | "medium" | "high"
}

export interface FieldConfig {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "multiselect" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  minLength?: number; // Abhängig von Projektklasse
  maxLength?: number;
  status: FieldStatus; // Wird dynamisch gesetzt
  helpText?: string;
}

export interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  fields: FieldConfig[];
}

// === PROJEKTKLASSEN-REGELN ===

interface ProjectRules {
  required: string[];
  optional: string[];
  hidden: string[];
  minLengths: Record<string, number>;
}

export const PROJECT_RULES: Record<ProjectClass, ProjectRules> = {
  mini: {
    required: [
      "titel",
      "beschreibung",
      "ansprechpartner",
      "zielsetzung",
      "startdatum",
      "zeithorizont",
      "betroffene_bereiche",
      "erwartungen",
    ],
    optional: [
      "was_passiert_misserfolg",
      "anzahl_ma_fk",
      "changebedarf",
      "von_zu",
      "hindernisse",
      "erfolgsfaktoren",
      "vereinbarungen",
      "sonstiges",
    ],
    hidden: ["heisse_phasen", "strategische_ziele", "beitrag_konzernstrategie"],
    minLengths: { beschreibung: 50, zielsetzung: 50, erwartungen: 30 },
  },
  standard: {
    required: [
      "titel",
      "beschreibung",
      "ansprechpartner",
      "zielsetzung",
      "was_passiert_misserfolg",
      "startdatum",
      "zeithorizont",
      "betroffene_bereiche",
      "anzahl_ma_fk",
      "erwartungen",
      "changebedarf",
      "von_zu",
      "hindernisse",
      "erfolgsfaktoren",
      "vereinbarungen",
    ],
    optional: [
      "heisse_phasen",
      "strategische_ziele",
      "beitrag_konzernstrategie",
      "sonstiges",
    ],
    hidden: [],
    minLengths: { beschreibung: 100, zielsetzung: 150, erwartungen: 100 },
  },
  strategic: {
    required: [
      "titel",
      "beschreibung",
      "ansprechpartner",
      "zielsetzung",
      "was_passiert_misserfolg",
      "startdatum",
      "zeithorizont",
      "heisse_phasen",
      "strategische_ziele",
      "beitrag_konzernstrategie",
      "betroffene_bereiche",
      "anzahl_ma_fk",
      "erwartungen",
      "changebedarf",
      "von_zu",
      "hindernisse",
      "erfolgsfaktoren",
      "vereinbarungen",
    ],
    optional: ["sonstiges"],
    hidden: [],
    minLengths: {
      beschreibung: 200,
      zielsetzung: 200,
      was_passiert_misserfolg: 100,
      erwartungen: 150,
    },
  },
};

// === FORMULAR-SEKTIONEN ===

export const FORM_SECTIONS: SectionConfig[] = [
  {
    id: "basisdaten",
    title: "Projekt-Basisdaten",
    icon: "📋",
    fields: [
      {
        id: "titel",
        label: "Thema/Titel",
        type: "text",
        placeholder: "Kurzer prägnanter Titel des Vorhabens",
        maxLength: 100,
        status: "required",
        helpText: "Ein eindeutiger Titel für dein Projekt (max. 100 Zeichen)",
      },
      {
        id: "beschreibung",
        label: "Beschreibung (Stichpunkte)",
        type: "textarea",
        placeholder: "Was ist das Vorhaben? Beschreibe es in 2-5 Stichpunkten",
        status: "required",
        helpText: "Eine kurze Übersicht über dein Vorhaben",
      },
      {
        id: "ansprechpartner",
        label: "Ansprechpartner*in / PAG",
        type: "text",
        placeholder: "Name, Abteilung",
        status: "required",
        helpText: "Wer ist die Hauptverantwortliche Person (Projekt-Auftraggeber*in)?",
      },
    ],
  },
  {
    id: "ziele",
    title: "Ziele & Erfolgskriterien",
    icon: "🎯",
    fields: [
      {
        id: "zielsetzung",
        label: "Zielsetzung",
        type: "textarea",
        placeholder: "Wenn das Vorhaben erfolgreich gewesen ist, dann...",
        status: "required",
        helpText: "Was soll am Ende erreicht sein? Konkret und messbar formulieren.",
      },
      {
        id: "was_passiert_misserfolg",
        label: "Was passiert bei Misserfolg?",
        type: "textarea",
        placeholder: "Welche Risiken bestehen, wenn das Projekt scheitert?",
        status: "optional",
        helpText: "Risiko-Einschätzung: Was würde passieren, wenn das Vorhaben nicht erfolgreich wäre?",
      },
    ],
  },
  {
    id: "zeitrahmen",
    title: "Zeitrahmen & heiße Phasen",
    icon: "📅",
    fields: [
      {
        id: "startdatum",
        label: "Startdatum",
        type: "date",
        status: "required",
        helpText: "Geplanter Projektstart",
      },
      {
        id: "zeithorizont",
        label: "Zeithorizont/Dauer",
        type: "text",
        placeholder: "z.B. 3 Monate, 1 Jahr, etc.",
        status: "required",
        helpText: "Wie lange wird das Projekt voraussichtlich dauern?",
      },
      {
        id: "heisse_phasen",
        label: '"Heiße Phasen"',
        type: "textarea",
        placeholder: "Zeiträume mit besonders hoher Aktivität oder Druck (z.B. Go-Live, Schulungen)",
        status: "hidden",
        helpText: "Kritische Phasen, in denen besondere Aufmerksamkeit nötig ist",
      },
    ],
  },
  {
    id: "strategie",
    title: "Beitrag zur Konzernstrategie",
    icon: "🏢",
    fields: [
      {
        id: "strategische_ziele",
        label: "Strategische Ziele",
        type: "textarea",
        placeholder: "Welche Ziele der Konzernstrategie werden unterstützt?",
        status: "hidden",
        helpText: "Z.B. Digitalisierung, Nachhaltigkeit, Kundenzufriedenheit",
      },
      {
        id: "beitrag_konzernstrategie",
        label: "Beitrag zur Konzernstrategie",
        type: "textarea",
        placeholder: "Wie trägt das Vorhaben zur Unternehmensstrategie bei?",
        status: "hidden",
        helpText: "Erläutere den strategischen Wert dieses Projekts",
      },
    ],
  },
  {
    id: "betroffene",
    title: "Betroffene Bereiche / Personen",
    icon: "👥",
    fields: [
      {
        id: "betroffene_bereiche",
        label: "Betroffene Bereiche/Personen",
        type: "textarea",
        placeholder: "Welche Teams, Abteilungen, Stakeholder sind betroffen?",
        status: "required",
        helpText: "Liste alle relevanten Bereiche und Personengruppen auf",
      },
      {
        id: "anzahl_ma_fk",
        label: "Anzahl Mitarbeitende & Führungskräfte",
        type: "text",
        placeholder: "z.B. 120 MA, 15 FK",
        status: "optional",
        helpText: "Wie viele Personen sind insgesamt betroffen?",
      },
    ],
  },
  {
    id: "erwartungen",
    title: "Erwartungen an Changebegleitung",
    icon: "🤝",
    fields: [
      {
        id: "erwartungen",
        label: "Erwartungen",
        type: "textarea",
        placeholder: "Die Changebegleitung ermöglicht mir als Auftraggeber*in...",
        status: "required",
        helpText: "Was erhoffst du dir von der Change-Begleitung?",
      },
      {
        id: "changebedarf",
        label: "Changebedarf (PAG)",
        type: "select",
        options: [
          { value: "hoch", label: "Hoch" },
          { value: "mittel", label: "Mittel" },
          { value: "niedrig", label: "Niedrig" },
        ],
        status: "optional",
        helpText: "Wie hoch schätzt du den Changebedarf ein?",
      },
    ],
  },
  {
    id: "risiken",
    title: "Risiken, Hindernisse, Erfolgsfaktoren",
    icon: "⚠️",
    fields: [
      {
        id: "von_zu",
        label: "Von (Ist-Zustand) / Zu (Soll-Zustand)",
        type: "textarea",
        placeholder: "Ist: ... / Soll: ...",
        status: "optional",
        helpText: "Was soll sich konkret ändern?",
      },
      {
        id: "hindernisse",
        label: "Hindernisse",
        type: "textarea",
        placeholder: "Was könnte den Erfolg verhindern/verlangsamen?",
        status: "optional",
        helpText: "Liste potenzielle Risiken und Hindernisse auf",
      },
      {
        id: "erfolgsfaktoren",
        label: "Erfolgsfaktoren",
        type: "textarea",
        placeholder: "Was muss/kann zum Gelingen beitragen?",
        status: "optional",
        helpText: "Was sind die Erfolgsfaktoren für dieses Projekt?",
      },
    ],
  },
  {
    id: "vereinbarungen",
    title: "Vereinbarungen & Sonstiges",
    icon: "📝",
    fields: [
      {
        id: "vereinbarungen",
        label: "Vereinbarungen",
        type: "textarea",
        placeholder: "z.B. zugesagte Beratungs-Tage, Projektstart-Termin",
        status: "optional",
        helpText: "Konkrete Vereinbarungen und Zusagen",
      },
      {
        id: "sonstiges",
        label: "Sonstiges",
        type: "textarea",
        placeholder: "Was könnte sonst noch wichtig sein?",
        status: "optional",
        helpText: "Weitere wichtige Informationen",
      },
    ],
  },
];

// === HILFSFUNKTIONEN ===

/**
 * Bestimmt die Projektklasse basierend auf den Klassifizierungsfragen
 */
export function determineProjectClass(
  classification: ProjectClassification
): ProjectClass {
  const { duration, scope, relevance, risk } = classification;

  // Strategisch: >6 Monate ODER >200 Personen ODER hohe Relevanz ODER hohes Risiko
  if (
    duration === "over_1_year" ||
    scope === "company_wide" ||
    relevance === "high" ||
    risk === "high"
  ) {
    return "strategic";
  }

  // Mini: ≤2 Wochen + ≤50 Personen + niedrige/mittlere Relevanz
  if (
    duration === "up_to_2_weeks" &&
    (scope === "single_team" || scope === "2_to_3_teams") &&
    relevance !== "high"
  ) {
    return "mini";
  }

  // Standard: alles dazwischen
  return "standard";
}

/**
 * Gibt die Feld-Konfiguration für eine bestimmte Projektklasse zurück
 */
export function getFieldConfig(
  fieldId: string,
  projectClass: ProjectClass
): FieldStatus {
  const rules = PROJECT_RULES[projectClass];

  if (rules.required.includes(fieldId)) return "required";
  if (rules.optional.includes(fieldId)) return "optional";
  if (rules.hidden.includes(fieldId)) return "hidden";

  return "optional"; // Fallback
}

/**
 * Gibt die Mindestlänge für ein Feld zurück
 */
export function getMinLength(
  fieldId: string,
  projectClass: ProjectClass
): number {
  const rules = PROJECT_RULES[projectClass];
  return rules.minLengths[fieldId] || 0;
}

/**
 * Aktualisiert alle Felder in den Sektionen basierend auf der Projektklasse
 */
export function updateFieldStatuses(
  sections: SectionConfig[],
  projectClass: ProjectClass
): SectionConfig[] {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({
      ...field,
      status: getFieldConfig(field.id, projectClass),
      minLength: getMinLength(field.id, projectClass),
    })),
  }));
}

/**
 * Validiert das Formular basierend auf der Projektklasse
 */
export interface ValidationIssue {
  fieldId: string;
  fieldLabel: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export function validateForm(
  values: Record<string, string>,
  projectClass: ProjectClass
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const rules = PROJECT_RULES[projectClass];

  // Prüfe Pflichtfelder
  rules.required.forEach((fieldId) => {
    const value = values[fieldId];
    if (!value || value.trim() === "") {
      const field = findFieldById(fieldId);
      issues.push({
        fieldId,
        fieldLabel: field?.label || fieldId,
        severity: "error",
        message: `Das Feld ist Pflicht für deine Projektklasse (${projectClass})`,
      });
    }
  });

  // Prüfe Mindestlängen
  Object.entries(rules.minLengths).forEach(([fieldId, minLength]) => {
    const value = values[fieldId];
    if (value && value.trim().length < minLength) {
      const field = findFieldById(fieldId);
      issues.push({
        fieldId,
        fieldLabel: field?.label || fieldId,
        severity: "warning",
        message: `Die Antwort ist recht knapp (${value.trim().length} Zeichen). Für Projekte dieser Größe sind mindestens ${minLength} Zeichen empfohlen.`,
      });
    }
  });

  // Prüfe Widersprüche (Beispiele aus dem Konzept)
  // Widerspruch: Kurze Dauer + hohe strategische Relevanz
  if (
    projectClass === "strategic" &&
    values["zeithorizont"] &&
    (values["zeithorizont"].includes("Tag") ||
      values["zeithorizont"].includes("Woche"))
  ) {
    issues.push({
      fieldId: "zeithorizont",
      fieldLabel: "Zeithorizont",
      severity: "warning",
      message:
        "Das Projekt dauert nur kurz, wurde aber als strategisch eingestuft. Ist das so gemeint?",
    });
  }

  // Widerspruch: Wenige Personen + strategisch
  if (
    projectClass === "strategic" &&
    values["anzahl_ma_fk"] &&
    parseInt(values["anzahl_ma_fk"].replace(/\D/g, "")) < 20
  ) {
    issues.push({
      fieldId: "anzahl_ma_fk",
      fieldLabel: "Anzahl Mitarbeitende",
      severity: "info",
      message:
        "Du hast wenige Personen angegeben, aber das Projekt als strategisch eingestuft. Sind vielleicht indirekt mehr betroffen?",
    });
  }

  return issues;
}

/**
 * Hilfsfunktion: Findet ein Feld anhand der ID
 */
function findFieldById(fieldId: string): FieldConfig | undefined {
  for (const section of FORM_SECTIONS) {
    const field = section.fields.find((f) => f.id === fieldId);
    if (field) return field;
  }
  return undefined;
}

/**
 * Gibt eine lesbare Projektklassen-Beschreibung zurück
 */
export function getProjectClassLabel(projectClass: ProjectClass): string {
  const labels = {
    mini: "Mini-Projekt",
    standard: "Standard-Projekt",
    strategic: "Strategisches Großprojekt",
  };
  return labels[projectClass];
}

/**
 * Mapping von Frontend-Feld-IDs zu n8n required_keys
 * WICHTIG: Diese Mapping ist authoritative und wird für missing_fields Berechnung verwendet
 */
export const FRONTEND_TO_N8N_MAPPING: Record<string, string> = {
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
  von_zu: "ziel_change_begleitung_von", // Kombiniertes Feld (von + zu)
  hindernisse: "erfolg_verhindern",
  erfolgsfaktoren: "erfolg_beitragen",
  vereinbarungen: "vereinbarungen",
  sonstiges: "sonstiges",
};

/**
 * Gibt die n8n required_keys für eine Projektklasse zurück
 * Diese Liste enthält NUR die Felder, die für diese Projektklasse relevant sind
 */
export function getRequiredKeysForProjectClass(projectClass: ProjectClass): string[] {
  const rules = PROJECT_RULES[projectClass];
  
  // Alle Felder, die NICHT hidden sind (required + optional)
  const visibleFields = [...rules.required, ...rules.optional];
  
  // Map frontend IDs to n8n keys
  return visibleFields
    .map(fieldId => FRONTEND_TO_N8N_MAPPING[fieldId] || fieldId)
    .filter(key => key); // Filter out any undefined
}

/**
 * Berechnet die missing_fields basierend auf Projektklasse und aktuellen Werten
 * @param projectClass Die Projektklasse (mini, standard, strategic)
 * @param values Die aktuellen Formular-Werte (Frontend-Feld-IDs)
 * @returns Array von n8n required_keys die noch fehlen
 */
export function calculateMissingFields(
  projectClass: ProjectClass,
  values: Record<string, string>
): string[] {
  const rules = PROJECT_RULES[projectClass];
  
  // Nur required Felder prüfen (nicht optional)
  const requiredFields = rules.required;
  
  const missingFields: string[] = [];
  
  for (const frontendId of requiredFields) {
    const value = values[frontendId];
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    
    if (isEmpty) {
      // Map to n8n key
      const n8nKey = FRONTEND_TO_N8N_MAPPING[frontendId] || frontendId;
      missingFields.push(n8nKey);
    }
  }
  
  return missingFields;
}

/**
 * Gibt eine Beschreibung der Projektklasse zurück
 */
export function getProjectClassDescription(projectClass: ProjectClass): string {
  const descriptions = {
    mini: "Kurze Dauer, lokaler Scope, operative Optimierung (z.B. Workshop, Team-Retro)",
    standard: "Mittlere Dauer, mehrere Teams, wichtig für Bereichsziele (z.B. Tool-Einführung)",
    strategic:
      "Lange Dauer oder hohe Reichweite, unterstützt Konzernstrategie (z.B. Transformation)",
  };
  return descriptions[projectClass];
}
