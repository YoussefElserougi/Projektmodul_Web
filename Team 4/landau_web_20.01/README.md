# Social Media Generator - City of Landau in der Pfalz

A React-based web application for AI-powered generation of social media content for the City of Landau in der Pfalz. The application communicates with an n8n workflow for content creation.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?logo=tailwind-css)

## ✨ Features

- **🎯 Topic-based Content Generation**: AI generates matching captions based on your topic
- **🖼️ AI Image Generation**: Optionally generate matching images via AI
- **📱 Multi-Platform Support**: Instagram, LinkedIn, Facebook
- **👁️ Live Preview**: Shows all 3 platform previews simultaneously
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SimonKlick/landau_web.git
cd landau_web/frontend
```

### 2. Configure Environment Variables

Copy the example configuration and adjust the values:

```bash
cp .env.example .env
```

Edit `frontend/.env` with your n8n webhook data:

```env
VITE_N8N_BASE_URL=https://your-n8n-server.com
VITE_N8N_WEBHOOK_PATH=/webhook/your-webhook-id
```

### 3. Install Dependencies & Start

```bash
npm install
npm run dev
```

The app runs at: **http://localhost:5173**

### 4. Activate n8n Workflow

Make sure the following workflows are active on your n8n server:
- **Landau_main_web_communication** (Webhook receives requests)
- **Landau_sub_content_creation** (Generates captions with Google Gemini)
- **Landau_sub_picture_generation** (Optional: Generates images)

### 5. Enable CORS (Important!)

CORS must be enabled on your n8n server:

```bash
# Set environment variable
N8N_CORS_ORIGIN=http://localhost:5173
```

## 📁 Project Structure

```
landau_web/
├── frontend/
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── hooks/          # Custom Hooks (useN8nWorkflow)
│   │   ├── services/       # API Service (api.js)
│   │   └── App.jsx         # Main Component
│   ├── .env                # n8n URL Configuration (gitignored)
│   ├── .env.example        # Example Configuration (Template)
│   └── package.json
└── docs/
    ├── concept.md
    ├── development-plan.md
    └── *.json              # n8n Workflow Exports
```

## 🔄 Data Flow

```
Frontend                              n8n Backend
   │                                      │
   │  POST /webhook/...                   │
   │  {                                   │
   │    data: {                           │
   │      Topic: "Christmas Market",      │
   │      Social: ["Instagram", ...],     │
   │      picture: ["generate"] / []      │
   │    }                                 │
   │  }                                   │
   │ ─────────────────────────────────────►
   │                                      │
   │  {                                   │
   │    instagramCaption: "...",          │
   │    linkedinCaption: "...",           │
   │    facebookCaption: "...",           │
   │    imageUrl: "..." (optional)        │
   │  }                                   │
   ◄────────────────────────────────────── 
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_N8N_BASE_URL` | URL of the n8n server | `https://your-n8n-server.com` |
| `VITE_N8N_WEBHOOK_PATH` | Webhook path | `/webhook/your-webhook-id` |

## 🐛 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Enable CORS on the n8n server with `N8N_CORS_ORIGIN=http://localhost:5173`

### Network Error
**Solution:** 
1. Check if n8n is reachable: `curl https://your-n8n-server.com`
2. Make sure the workflow is active

### Empty Previews
**Solution:**
1. Check the n8n workflow logs
2. Make sure Google Gemini API credentials are configured

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

**Important:** Update the CORS settings on n8n for your production domain!

---

**Version:** 2.1.0  
**Last Updated:** December 23, 2025
