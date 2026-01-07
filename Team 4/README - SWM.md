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
A Next.js-based conversational interface (hybrid version) that guides users through the change request process with an AI-powered chatbot.

**Features:**
- Interactive chat interface for collecting change request information
- Dynamic form generation based on user responses
- Project classification system
- Session management with persistent data storage
- Integration with n8n workflows via webhooks

### 2. Dashboard (`SWM/dashboard.html`)
A master dashboard for monitoring and managing change management workflows and sessions.

### 3. n8n Workflows (`SWM/swm_workflows/`)
Automated workflows for processing change requests:
- `SWM-Hybrid Form Filler with Chat.json` - **Main hybrid workflow** (current production version)
- `SWM-Change-Communication_3.json` - Communication generation workflow
- `SWM-Change-Complete-Pipeline.json` - Complete end-to-end processing
- `SWM-Change-Partner-Selection_4_FIXED.json` - Partner selection logic
- `SWM-Change-List-Sessions.json` - Session management

**Note:** The test mode workflows are outdated and not compatible with the current server setup. They only work on localhost with an older version.

## 🚀 How to Run

### 🌐 Recommended: Using Our Shared Server (For Professors)

**We already have a fully configured server running all workflows and the application.** This is the easiest way to test the project:

1. **Access the application** - Contact us for the server URL and credentials
2. **n8n workflows are already active** on our server with all necessary credentials configured:
   - OpenAI API access
   - IMAP/SMTP email integration
   - n8n Data Tables for session storage
3. **Just open the URL** and start using the chat interface!

**Server Details:**
- Hosted on Moritz's server
- All workflows are imported and activated
- Uses the latest hybrid workflow version
- Full 20-question production workflow

**Professor testing via email (quick test)**

To test the app using our shared server email flow without configuring IMAP yourself:

1. Send an email to the project's inbox (configured in n8n as the SMTP/IMAP credential named "SMTP account (Liveley)" — address: `liveley.workflows@gmail.com`). 
2. Open the n8n instance and check the latest workflow execution for the email-triggered workflow. Inspect the output of the node named `Data Table: Insert Session` (or similar "Insert Session" node) and copy the `session_id` value from its output.
3. Open the chat interface and paste the `session_id` into the URL:

```
http://localhost:3000/chat?session=[insert-id-here]
```

If you are using the shared server, replace `http://localhost:3000` with the server URL we provide.

Note: You can also configure your own IMAP account in n8n and use that instead, but that requires adding credentials in n8n and updating the workflow — this is more advanced.

---

### 💻 Alternative: Running Locally (Advanced)

If you want to run the project locally, you'll need to configure several things:

#### Prerequisites
- Node.js (v18 or higher)
- Local n8n instance
- OpenAI API key
- IMAP/SMTP email account (for email trigger workflow)

#### Setup Instructions

1. **Set up the Change Chat Application**

```bash
cd "Team 4/SWM/Code Websites/change-chat-app"
npm install
```

2. **Configure Environment Variables**

a. Copy and edit the `.env` file:
   ```bash
   cp .env.example .env
   ```

   Set:
   - `N8N_WEBHOOK_URL`: Your local n8n URL (e.g., `http://localhost:5678/webhook/change-chat`)
   - `N8N_TEST_MODE`: Set to `false`

b. **⚠️ Important: Update webhook URLs in the JSON file** before importing:
      - Find and replace any production webhook hostnames/URLs with your local paths (e.g., replace production host with `http://localhost:5678`).

c. Configure credentials in n8n:
   - **OpenAI API**: Add your API key
   - **IMAP**: Configure an email account for receiving change requests (if you want to use email triggers)
   - **SMTP**: Configure an email account for sending notifications
   - **Data Table**: Create a new data table with the required schema
d. Activate the workflow.

4. **Run the Application**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

5. **Access the Dashboard**

a. Open `SWM/dashboard.html` in a browser and configure it to point to your local n8n instance.

b. **⚠️ Important: Update webhook URLs in the JSON file** before importing:
      - Find and replace any production webhook hostnames/URLs with your local paths (e.g., replace production host with `http://localhost:5678`).

c. Configure credentials in n8n:
   - **OpenAI API**: Add your API key
   - **IMAP**: Configure an email account for receiving change requests (if you want to use email triggers)
   - **SMTP**: Configure an email account for sending notifications
   - **Data Table**: Create a new data table with the required schema

d. Activate the workflow.

4. **Run the Application**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

5. **Access the Dashboard**

Open `SWM/dashboard.html` in a browser and configure it to point to your local n8n instance.


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
```
    │   ├── components/      # React components
    │   ├── lib/             # Utilities and n8n integration
    │   ├── types/           # TypeScript type definitions
    │   ├── .env.example     # Environment template
    │   └── package.json
    └── swm_workflows/
        ├── *.json           # n8n workflow exports
        ├── UC3_UC4_Documentation.md
        └── Workflow_Ecosystem_Overview.md
```

## 🔒 Security Notes

**This repository does NOT contain:**
- API keys or tokens
- Passwords or credentials
- Server URLs (replaced with placeholders)
- Sensitive production data

**Before deploying to production:**
1. Configure all placeholder values with your actual credentials
2. Never commit `.env` files with real credentials
3. Use environment variables or secret management services
4. Review the n8n workflows to ensure OpenAI credentials are properly configured

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

- **Current Version**: Hybrid workflow (combines form and chat interface)
- **Production Setup**: Running on our shared server with full 20-question workflow
- **Test Mode**: Not compatible with current server setup (only works locally with outdated version)
- **Session Storage**: All data stored in n8n Data Tables on the server
- **Email Integration**: Uses IMAP trigger for incoming change requests and SMTP for notifications
- **Security**: All credentials are managed through n8n's encrypted credential system
- **API Routes**: The Next.js app uses server-side API routes for secure webhook communication