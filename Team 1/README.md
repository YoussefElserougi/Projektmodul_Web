# Projektmodul_Web: Team 1

#### Team 1
- Nadja Müller
- Shisir Rijal
- Eric Pereira Stadler
- Leon Brack

#### Partner:
- Celonis
- Siteco


### Content

- [1. Use Case 1: Celonis Competitor Brand Analyst](#1-use-case-1-celonis-competitor-brand-analyst)
    - [1.1 Problem Statement](#11-problem-statement)
    - [1.2 Solution](#12-solution)
        - [1.2.1 Links](#121-links)
        - [1.2.2 Tech Stack](#122-tech-stack)
        - [1.2.3 Workflow](#123-workflow)
- [2. Use Case 2: Siteco Internal Knowledge Chatbot](#2-use-case-2-siteco-internal-knowledge-chatbot)
    - [2.1 Problem Statement](#21-problem-statement)
    - [2.2 Solution](#22-solution)
        - [2.2.1 Links](#221-links)
        - [2.2.2 Tech Stack](#222-tech-stack)
        - [2.2.3 Workflow](#223-workflow)
    - [2.3 How to run the prototype](#22-solution)



## 1. Use Case 1: Celonis Compeptitor Brand Analyst

### 1.1 PROBLEM STATEMENT:

##### WE NEED:
 “... an internal knowledge base in form of an AI Chatbot

A Dashboard with an Chatbot based on their intranet including a preview function and the possibility to download the PDF, if needed”

### 1.2 SOLUTION:

#### 1.2.1 LINKS:

- Webflow Dashboar: https://celonis-test-dashboard.webflow.io/
- Figma Board: https://www.figma.com/design/bRXdFpxVVUEnapiPfmkMaD/MUC.DAI-X-CELONIS---Competitor-Dashboard?node-id=0-1&t=t3i9R3FSSYi6OExH-1

#### 1.2.2 TECH STACK:

We used 3 Technologys for different purposes:
- Figma: Collaborative Tool to share insights within the Team and the client
- n8n: AI tool to collect and format data
- Webflow: Frontend Dashboard which is connected to n8n through CMS
- ChartJS: Chartbuilder Tool within Webflow Custom Code

#### 1.2.3 WORKFLOW:

The application consists of two primary views—the Dashboard and the News Page—along with dedicated detail pages for each competitor.

Upon entering the platform, you land on the Main Dashboard. This view provides a comprehensive overview of the latest AI-driven industry news and a high-level comparison between Celonis and its competitors. Integrated charts visualize key metrics, such as current stock market positioning and performance trends.

Via the side navigation bar, you can access the News Page. This section allows you to browse through all AI-generated news articles or use filters to focus on specific companies of interest.

Finally, the Competitor Pages offer deep-dive analytics for individual brands including:

- Social Media Presence: Direct links to official brand channels.

- Financial Data: Real-time stock positioning and historical price trends.

- Brand Identity: Insights into the company’s core values, mission, and strategic messaging.

- Targeted News: A curated feed of AI-generated news specifically relevant to that competitor."

On top each page features a direct comparison with Celonis based on some of this data.


## 2. Use Case 2: Siteco Internal Knowledge Chatbot

### 2.1 PROBLEM STATEMENT:

##### WE NEED:
- "... an internal knowledge base in form of an AI Chatbot"
- "... a Dashboard with an Chatbot based on their intranet including a preview function and the possibility to download the PDF, if needed”


### 2.2 SOLUTION:

#### 2.2.1 LINKS:
- Figma Board: https://www.figma.com/design/5MFaq1eNdoij6Lr4tt3e1F/SITECO--AI-Agent?node-id=0-1&t=9dou3EDlqXHEj8LB-1
  
#### 2.2.2 TECH STACK:

#### 2.2.3 WORKFLOW:

### 2.3 How to run the prototype
**Diaclaimer:**
Due to the NDA, the prototype cannot be tested with Siteco internal data.
To test the chatbot, please follow the steps below.

- add a local folder in your docker (path: /data/pdfs); there you can add your test-data for the chatbot (also see the changed "docker-compose.yml" and the folder "docker_config")
- you need a supabase credential. in your supabase project you need the tables documented in the folder "Supabase Doku" (documents, pdf_tracking and n8n_chat_histories)
- the n8n workflow needs following credentials: supabase, openai api key, a mail client of your choice
- initialize the frontend with "npm install"
- to run the frontend start it with "npm run dev"
- Additionally, the webhooks "database update" and "FAQ summary mail" can be triggered using the file "control-panel-small.html", so the automations do not have to be executed directly in n8n
  
