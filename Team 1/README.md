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
        - [1.2.3 Product Overview (User Views)](#123-workflow)
- [2. Use Case 2: Siteco Internal Knowledge Chatbot](#2-use-case-2-siteco-internal-knowledge-chatbot)
    - [2.1 Problem Statement](#21-problem-statement)
    - [2.2 Solution](#22-solution)
        - [2.2.1 Links](#221-links)
        - [2.2.2 Tech Stack and Tools](#222-tech-stack)
        - [2.2.3 Workflow](#223-workflow)
    - [2.3 How to run the prototype](#22-solution)



## 1. Use Case 1: Celonis Compeptitor Brand Analyst

### 1.1 Problem Statement

**We need:**  
 An AI Agent that acts as a **Junior Brand Intelligence Analyst.**
A **live, conversational dashboard** that continuously **monitors, analyzes, and summarizes** competitor brand activity across digital channels.

### 1.2 Solution

#### 1.2.1 Links

- [Webflow Dashboard](https://celonis-test-dashboard.webflow.io/) 
- [Webflow Access](https://comments.webflow.com/comment/celonis-test-dashboard?utm_medium=project_link&utm_source=designer&utm_content=celonis-test-dashboard&)
- [Figma](https://www.figma.com/design/bRXdFpxVVUEnapiPfmkMaD/MUC.DAI-X-CELONIS---Competitor-Dashboard?node-id=0-1&t=t3i9R3FSSYi6OExH-1) 


#### 1.2.2 Tech Stack & Tools

We used several technologies for different purposes:
- **Figma:** Collaboration tool to share insights within the team and with the client
- **n8n:** Backend logic to scrape, process, and distribute data using AI agents in **real time**
- **Supabase (Database):** Central storage for **vector data** and **relational data**
- **OpenAI:** LLM for extraction, summarization, and reasoning
- **Webflow:** Frontend dashboard connected to n8n via CMS
- **Chart.js:** Charting library embedded via Webflow Custom Code

#### 1.2.3 Product Overview (User Views)

1. **Main Dashboard:**  Upon entering, the user sees a strategic overview. This view provides a comprehensive overview of the latest AI-driven industry news and a high-level comparison between Celonis and its competitors. Integrated charts visualize key metrics, such as current stock market positioning and performance trends. Additionally, a floating AI Chatbot is accessible in the bottom-right corner, allowing users to ask ad-hoc questions and retrieve deep insights from the knowledge base in real-time.

2. **News Intelligence:** Accessible via the sidebar. This section allows you to browse through all AI-generated news articles or use filters to focus on specific companies of interest.

3. **Competitor Detail Pages:** 
Deep-dive analytics for specific brands (e.g., SAP, Palantir) offering:

Finally, the Competitor Pages offer deep-dive analytics for individual brands including:

- **Social & Brand Channels:** Direct links to official brand channels.

- **Financial Metrics:** Real-time stock positioning and historical price trends.

- **Positioning & Messaging:** Insights into the company’s core values, mission, and strategic messaging.

- **Targeted Intelligence:** A curated feed of AI-generated news specifically relevant to that competitor.

On top each page features a direct comparison with Celonis based on some of this data.


## 2. Use Case 2: Siteco Internal Knowledge Chatbot

### 2.1 PROBLEM STATEMENT:

**We need:**  
An **internal knowledge base** in form of an AI Chatbot.
A Dashboard with an Chatbot based on their intranet including a **preview function** and the possibility to download the PDF, if needed”


### 2.2 SOLUTION:

#### 2.2.1 LINKS:
- Figma Board: https://www.figma.com/design/5MFaq1eNdoij6Lr4tt3e1F/SITECO--AI-Agent?node-id=0-1&t=9dou3EDlqXHEj8LB-1
  
#### 2.2.2 TECH STACK AND TOOLS:

We used several technologies for different purposes:
- **Figma:** Collaboration tool to share insights within the team and with the client
- **n8n:** Backend logic to host Supabase, the Chatbot and the preview-function
- **Supabase (Database):** Central storage for **vector data** and **relational data**
- **OpenAI:** LLM for extraction, summarization, and reasoning.

#### 2.2.3 WORKFLOW FOR USERS:

Right now, the user opens the Dashboard. On it the users can see a menubar on the left and a chatbot.
On the Menubar users can select between different links (weblinks of the SITECO-Website) and the **chatbot**.

If the user asks the chatbot a question - first a little (loading-)animation is displayed – so that 
the users know, that the LLM is working.

After a short time, the chatbot generates an answer, and provides a preview opportnity.
Users can see, which parts of the knowledge base is used for the answer.
Additionally, users can download the PDF used for the answer.



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
  

# Team 1 - Project Module Web

This project consists of a React frontend and an n8n workflow automation server.

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Getting Started

### 1. Start the n8n Server

The backend logic is handled by n8n. To start the server locally:

```bash
# Start n8n in the background
docker compose -f docker-compose-local.yml up -d
```

- The n8n interface will be available at: `http://localhost:5678`
- Default credentials may be required if configured in n8n.

### 2. Start the Frontend Application

The frontend is a React application located in the `form` directory.

Before starting, you must configure the environment variables. Create a `.env` file inside the `form` directory and add the following line:

```env
VITE_API_BASE_URL=http://localhost:5678/webhook
```

```bash
# Navigate to the frontend directory
cd form

# Install dependencies
npm install

# Start the development server
npm run dev
```

- The frontend will typically run at: `http://localhost:5173` (check terminal output)

## Project Structure

- **`form/`**: The React frontend application (Vite + TypeScript + Shadcn UI).
- **`workflows/`**: Contains exported n8n workflow JSON files (e.g., `Graf MVP (7).json`).
- **`docker-compose-local.yml`**: Docker configuration for running the local n8n instance.
