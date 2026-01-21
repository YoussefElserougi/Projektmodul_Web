# Team 4 - SWM Change Management Portal

## 📋 Project Overview

An intelligent Change Management portal for Stadtwerke München (SWM) that combines a Next.js web application with n8n workflows to automate and streamline change request processes.

## 👥 Team Members

- Moritz
- Chiara
- Simon
- Lilly

## 🎯 Project Components

### 1. Change Chat Application (`SWM/Code Websites/change-chat-app/`)
A Next.js-based hybrid experience that combines form + chat for change requests and includes a comprehensive management dashboard.

**User-Facing Features:**
- **Email-free start**: Users can start a new request directly from the landing page and enter their email in the chat interface in addition to the old email workflow
- **Project classification**: Classification (Mini/Standard/Strategic) based on project scope
- **Dynamic form generation**: Form sections adapt based on project classification
- **Hybrid interface**: Combines structured form fields with AI chat assistance
- **Session persistence**: All data is stored in n8n Data Tables and can be resumed later

**Dashboard Features (for Change Managers):**
- **Session overview**: View all change request sessions with status, email, creation date, and project classification
- **Session details**: Inspect all answers and metadata for any session
- **UC3 Integration - Change Communication**:
  - Generate structured change story based on project data
  - Create comprehensive communication plans
  - Generate communication drafts (emails, announcements)
  - Edit generated content directly in the dashboard
  - Download as formatted PDF with proper Markdown rendering
- **UC4 Integration - Partner Selection**:
  - Generate requirements profile for external consultants
  - Create RFP (Request for Proposal) documents
  - Generate evaluation criteria for partner selection
  - Provide process guide for selection and onboarding
  - Customize budget range and preferred partner type
  - Download complete partner selection package as PDF
- **Real-time workflow execution**: Trigger UC3/UC4 workflows directly from the dashboard
- **PDF export**: Professional document export with SWM branding

### 2. n8n Workflows (`SWM/swm_workflows/`)
Automated workflows for processing change requests:

**Main Hybrid Workflow System** (`SWM Hybrid Form Filler/`):
- `SWM Hybrid Form Filler with Chat and subworkflow.json` - **Main workflow** orchestrates the entire change request process
- `SWM Hybrid - EMAIL TRIGGER PATH.json` - Sub-workflow for email-triggered change requests
- `SWM Hybrid - LLM Path.json` - Sub-workflow for AI chat helper bot interactions

**Additional Workflows**:
- `SWM-Change-Communication_3.json` - UC3: Communication generation workflow
- `SWM-Change-Partner-Selection_4_FIXED.json` - UC4: Partner selection workflow
- `SWM-Change-List-Sessions.json` - Dashboard session management
- `SWM-Change-Complete-Pipeline.json` - Combined UC3+UC4 pipeline (optional)

**Note:** The main hybrid workflow requires the two sub-workflows to be imported and activated. The hosted n8n instance on contaboserver is still running with all workflows active, but the web application needs to be deployed locally with the latest code.

## ✅ Use Cases

**UC1 – Standardised change support inside SWM**
The goal is to establish a standard way of scoping and planning change projects, instead of reinventing the wheel for every initiative. Sponsors are guided step by step through key questions, the system collects all relevant information and produces ready-to-use documents (change concept, result documentation). This reduces manual work, avoids missing critical components and creates a more consistent, professional appearance towards stakeholders.

**UC3 – Change communication planning**
For larger initiatives, communication is a major success factor but very time-consuming. Based on project context and a simple stakeholder map, the system should generate a structured change story and a draft communication plan (who, what, when, via which channel). The change team can then refine these drafts instead of starting from a blank page.

**UC4 – Selection of external change partners**
When external consultants or training providers are needed, each project currently starts almost from scratch with briefings and tender documents. The idea of this use case is to derive a structured briefing and RFP draft directly from the change request data, including key criteria for evaluating offers. This speeds up procurement, increases consistency and makes it easier to choose the right external partner.

## 🚀 How to Run

### 💻 Running Locally

#### Prerequisites
- Node.js (v18 or higher)
- n8n instance (local or hosted)
- OpenAI API key
- Optional: IMAP/SMTP email account (for email trigger workflow - not required for testing on our hosted server)

#### Setup Instructions

1. **Set up the Change Chat Application**

```bash
cd "Team 4/SWM/Code Websites/change-chat-app"
npm install
```

2. **Configure Environment Variables**

Copy and edit the `.env` file:
```bash
cp .env.example .env
```

Set:
- `N8N_WEBHOOK_URL`: Your n8n webhook URL (e.g., `http://localhost:5678/webhook/change-chat`)
- `NEXT_PUBLIC_N8N_BASE_URL`: Your n8n base URL for the dashboard (e.g., `http://localhost:5678`)

3. **Import and Configure n8n Workflows**

a. Import workflow JSON files in this order:
   
   **Required workflows (import first):**
   1. `SWM Hybrid Form Filler/SWM Hybrid - EMAIL TRIGGER PATH.json` (sub-workflow for email triggers)
   2. `SWM Hybrid Form Filler/SWM Hybrid - LLM Path.json` (sub-workflow for AI chat helper)
   3. `SWM Hybrid Form Filler/SWM Hybrid Form Filler with Chat and subworkflow.json` (main workflow)
   4. `SWM-Change-List-Sessions.json` (required for dashboard)
   
   **Workflows (for UC3/UC4):**
   5. `SWM-Change-Communication_3.json` (UC3: communication generation)
   6. `SWM-Change-Partner-Selection_4_FIXED.json` (UC4: partner selection)
   7. `SWM-Change-Complete-Pipeline.json` (optional: combined UC3+UC4)

b. **⚠️ Important**: Update webhook URLs in ALL workflows after importing:
   - Find and replace production URLs (e.g., `https://vmd185817.contaboserver.net`) with your local n8n URL (e.g., `http://localhost:5678`)
   - Pay special attention to the main workflow and sub-workflow URLs - they must match your n8n instance

c. Configure credentials in n8n:
   
   **OpenAI API** (required):
   - Add your OpenAI API key in n8n credentials
   - Used for AI chat helper and UC3/UC4 generation
   
   **Data Table** (required):
   - Create a new data table named `agent_sessions`
   - Copy the DataTable ID - you'll need it for the dashboard configuration
   - Schema (create these columns in the data table):
     - `session_id` (String) - Unique session identifier
     - `requester_email` (String) - User's email address
     - `status` (String) - Session status (open, in_progress, submitted_request, etc.)
     - `answers` (JSON) - All form answers as JSON object
     - `metadata` (JSON) - Additional session metadata
     - `project_classification` (JSON) - Project class and complexity data
     - `missing_fields` (JSON) - Array of incomplete required fields
     - `round_counter` (Number) - Current round in the workflow
     - `max_rounds` (Number) - Maximum allowed rounds
     - `created_at` (Date & Time) - Session creation timestamp
     - `updated_at` (Date & Time) - Last update timestamp
   
   **SMTP/IMAP** (optional with our server):
   - Only needed if you want to experience the full workflow (you will get send emails regarding the change process)
   - Configure with a test email account

d. **Link the sub-workflows to the main workflow:**
   - In the main workflow (`SWM Hybrid Form Filler with Chat and subworkflow.json`), locate the "Execute Workflow" nodes
   - Ensure they point to the correct sub-workflow names in your n8n instance
   - The names must match exactly: "SWM Hybrid - EMAIL TRIGGER PATH" and "SWM Hybrid - LLM Path"

e. Activate all imported workflows in n8n (start with sub-workflows, then main workflow).

4. **Run the Application**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

5. **Testing the Application**

**Option A: Using Local n8n**

*User Flow (Creating a Change Request):*
1. Open `http://localhost:3000`
2. Click "Neue Anfrage starten" (or "Start" in navbar)
3. Enter your email address when prompted in the chat
4. Answer the AI-guided project classification questions
5. Fill out the dynamic form (sections adapt based on your project classification)
6. Submit your change request
7. Check your local n8n instance to verify the session was created in the DataTable

*Dashboard (Change Manager View):*
1. Open `http://localhost:3000/dashboard`
2. Configure n8n connection:
   - n8n Base URL: `http://localhost:5678` (or your n8n URL)
   - DataTable ID: Copy from your n8n DataTable settings (e.g., `cQJ0PWxEInNEL92O`)
3. Click "Sessions laden" to load all change requests
4. Select a session to view details
5. Use "UC3: Changekommunikation" button to generate communication materials
6. Use "UC4: Partner-Auswahl" button to generate partner selection documents
7. Edit generated content if needed, then download as PDFs

**Option B: Using Hosted n8n Server**

*If you have access to the team's n8n server (https://vmd185817.contaboserver.net):*
1. Update your `.env` file:
   - `N8N_WEBHOOK_URL=https://vmd185817.contaboserver.net/webhook/change-chat`
   - `NEXT_PUBLIC_N8N_BASE_URL=https://vmd185817.contaboserver.net`
2. In the dashboard, use:
   - n8n Base URL: `https://vmd185817.contaboserver.net`
   - DataTable ID: `cQJ0PWxEInNEL92O` (already configured on server)
3. All workflows are already active on the server
4. Note: The server does not have the latest web application code deployed

**Troubleshooting:**
- **"Session not found" error**: Check if the main workflow successfully created a DataTable entry
- **Dashboard shows no sessions**: Verify the DataTable ID is correct and workflows are activated
- **UC3/UC4 workflows fail**: Ensure OpenAI credentials are configured in n8n
- **Webhook errors**: Confirm all webhook URLs are updated correctly in the workflows
- **Sub-workflow not found**: Make sure sub-workflows are named exactly as expected and are activated


## 🔒 Security Notes

**This repository does NOT contain:**
- API keys or tokens (only credential IDs for n8n reference)
- Passwords or IMAP/SMTP credentials
- Sensitive production data

**What's in the workflow JSON files:**
The n8n workflow exports contain **credential references** (e.g., `"id": "Q7rmCb8nQSdip4NA"`) but NOT the actual credentials. These IDs point to credentials stored securely in n8n's encrypted database.

**Required credentials for full setup:**
- OpenAI API key (for AI chat functionality)
- IMAP account (for email-triggered workflows)
- SMTP account (for sending notifications)
- n8n Data Table access

**For local setup:**
1. Import workflows to your n8n instance
2. Re-configure all credential references in n8n
3. Update webhook URLs in the workflow JSON files
4. Create matching data table schema

## 📁 Project Structure

```
change-chat-app/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/
│   │   └── page.tsx          # Hybrid form + chat interface
│   ├── dashboard/
│   │   └── page.tsx          # Management dashboard with UC3/UC4
│   └── form/
│       └── page.tsx          # Legacy form view
├── components/
│   ├── ChatAssistant.tsx     # AI chat component
│   ├── DynamicForm.tsx       # Form with dynamic sections
│   ├── ProjectClassification.tsx
│   └── ...
├── lib/
│   ├── config.ts             # n8n endpoints configuration
│   ├── formRules.ts          # Project classification logic
│   └── n8n.ts                # n8n API integration
└── types/
    └── chat.ts               # TypeScript interfaces

swm_workflows/
├── SWM Hybrid Form Filler/
│   ├── SWM Hybrid Form Filler with Chat and subworkflow.json (main)
│   ├── SWM Hybrid - EMAIL TRIGGER PATH.json (sub-workflow)
│   └── SWM Hybrid - LLM Path.json (sub-workflow)
├── SWM-Change-Communication_3.json (UC3)
├── SWM-Change-Partner-Selection_4_FIXED.json (UC4)
├── SWM-Change-List-Sessions.json (dashboard)
└── SWM-Change-Complete-Pipeline.json (optional)
```

## 🔒 Security Notes

**This repository does NOT contain:**
- API keys or tokens
- Passwords or credentials
- Sensitive production data

**Before deploying:**
1. Configure all credentials in n8n securely
2. Never commit `.env` files with real credentials
3. Use environment variables or secret management
4. Review and test all workflows thoroughly

## 📚 Documentation

For detailed information about the workflows and use cases:
- See [`SWM/swm_workflows/UC3_UC4_Documentation.md`](SWM/swm_workflows/UC3_UC4_Documentation.md)
- See [`SWM/swm_workflows/Workflow_Ecosystem_Overview.md`](SWM/swm_workflows/Workflow_Ecosystem_Overview.md)

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Automation**: n8n (workflow automation)
- **AI**: OpenAI GPT-4o-mini
- **Data Storage**: n8n Data Tables

## 📝 Notes

- **Current Version**: Hybrid workflow (form + AI chat + integrated dashboard)
- **User Experience**: No email required to start - users can begin directly from the landing page
- **Dashboard**: Fully integrated into Next.js app with real-time UC3/UC4 workflow execution
- **Session Management**: All data stored in n8n Data Tables with full resume capability
- **PDF Export**: Professional document generation with Markdown parsing and SWM branding
- **AI Features**: 
  - Project classification (Mini/Standard/Strategic)
  - Dynamic form adaptation based on project complexity
  - Change story generation (UC3)
  - Communication plan creation (UC3)
  - Partner selection documents (UC4)
- **Workflows**: 
  - Main hybrid workflow orchestrates the entire change request process
  - Sub-workflow for email triggers (alternative entry point)
  - Sub-workflow for AI chat helper bot interactions
  - UC3 workflow generates change communication materials
  - UC4 workflow creates partner selection documentation
  - List Sessions workflow powers the dashboard
- **Deployment**:
  - Hosted n8n server (contaboserver) is active with all workflows
  - Web application must be run locally with latest code
  - Can connect local web app to hosted n8n or local n8n instance
- **Security**: All credentials managed through n8n's encrypted credential system
- **API Integration**: Next.js server-side API routes for secure webhook communication