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
