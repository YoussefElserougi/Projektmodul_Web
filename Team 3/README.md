# Projektmodul_Web: 

# Automated Glassdoor Review Response System

![atolls Banner](./assets/atolls-banner.png)

Ein **automatisiertes System zur intelligenten Beantwortung von Glassdoor-Bewertungen**, entwickelt für **atolls**, basierend auf **n8n**, **React** und **Next.js**.

---

## Projektübersicht

Dieses Projekt automatisiert den gesamten Prozess der **Analyse und Beantwortung von Glassdoor-Reviews**.  
Ziel ist es, Unternehmen dabei zu helfen:

- schnell auf neue Bewertungen zu reagieren  
- konsistente, professionelle Antworten zu generieren  
- HR- und Employer-Branding-Prozesse zu entlasten  

Das System kombiniert **Workflow-Automatisierung (n8n)** mit einer **modernen Web-Oberfläche (Next.js / React)**.

---

## Über atolls

![atolls Logo](./assets/atolls-logo.png)

**atolls** ist ein digitales Beratungs- und Technologieunternehmen, das sich auf **skalierbare Automatisierungslösungen**, **moderne Web-Plattformen** und **AI-gestützte Workflows** spezialisiert hat.

---

## Systemidee

Das System arbeitet vollständig automatisiert:

1. **Neue Glassdoor-Bewertung wird erkannt**
2. Bewertung wird analysiert (Sentiment, Ton, Inhalt)
3. Eine passende Antwort wird generiert
4. Antwort kann automatisch oder manuell freigegeben werden
5. Veröffentlichung oder Übergabe an HR-Team

---

##  Architektur

```text
Glassdoor Review
       ↓
     n8n
 (Trigger & Workflow)
       ↓
Analyse & Antwort-Generierung
       ↓
 Next.js / React Frontend
       ↓
 HR / Admin Dashboard

