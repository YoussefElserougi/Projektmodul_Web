# 🧠 Atolls Review Automation & Dashboard

Dieses Projekt automatisiert das Beantworten von Atolls-Reviews und stellt gleichzeitig ein intelligentes Dashboard zur Analyse und Auswertung bereit.

---

## 🚀 Überblick

Wir haben:
- eine **automatisierte n8n-Lösung**, die eingehende Reviews verarbeitet und automatisch passende Antworten generiert
- eine **Dashboard-Web-App**, die Einblicke in Stimmung, Inhalte und Schwerpunkte der Bewertungen liefert

Ziel: Feedback schneller verstehen, strukturieren und effizient darauf reagieren.

---

## 🔧 Features

### 🤖 Automatisierte Review-Antworten (n8n)
- Automatische Erkennung neuer Reviews
- Generiert dynamische & kontextbasierte Antworten
- Reduziert manuellen Aufwand signifikant

---

### 📊 Dashboard Website

Unsere Website dient als zentrales Analyse-Tool für alle eingehenden Reviews.

#### ✔️ Sentiment Analyse
- Einstufung der Bewertungen in:
  - **Positiv**
  - **Neutral**
  - **Negativ**
- Übersichtliche Visualisierung der Stimmungslage

#### ✔️ Themen-Clustering (Topic Detection)
Die Reviews werden automatisch in Themenbereiche einsortiert, z. B.:

- 💰 **Gehalt & Benefits**
- 🙂 **Allgemeine Zufriedenheit**
- 🧑‍💼 **Bestimmte Positionen / Teams / Rollen**
- 🏢 **Unternehmenskultur & Arbeitsumfeld**
- ⏰ **Work-Life-Balance**
- 📈 **Entwicklungsmöglichkeiten**
- ⚠️ **Kritische Problemthemen**

So lassen sich Muster erkennen, Trends analysieren und Handlungsfelder schnell identifizieren.

#### ✔️ Review Management
- Anzeige aller Reviews
- Status (offen / verarbeitet / beantwortet)
- Filter- und Sortiermöglichkeiten (falls umgesetzt)

---

## 🏗️ Tech Stack

- **Automation:** n8n
- **Dashboard:** Website (React / Next / oder anpassen)
- **Sentiment & Themenanalyse:** NLP / passende Libraries oder APIs

---

## 🚀 Installation & Nutzung

### 1️⃣ n8n Workflow
- n8n installieren & starten
- Workflow importieren
- Verbindungen konfigurieren
- Workflow aktivieren

---

### 2️⃣ Dashboard starten
```bash
git clone https://github.com/<dein-user>/<dein-repo>.git
cd <dein-repo>

npm install
npm run dev
