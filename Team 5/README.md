# MUC-DAI-graf-syteco

## Production Deployment

### 1. Environment Setup

Set the necessary environment variables:

```shell
export OPENAI_API_KEY=...
export NGROK_AUTHTOKEN=...
export N8N_ENCRYPTION_KEY=...
```

### 2. Docker Compose

First execute the docker compose file:

```shell
    docker compose -f docker-compose.yml up -d
```

### 3. Access the Application

The application should now be accessible at:

- Frontend: `https://<NGROK_DOMAIN>/form`
- n8n: `https://<NGROK_DOMAIN>/`
- Express API: `https://<NGROK_DOMAIN>/api/`

### 4. N8N Configuration

If available, import the credentials from the backups folder.

Import credentials command

```shell
docker exec -u node -it muc-dai-graf-syteco-n8n-1 n8n import:credentials --input=/home/node/credentials/credentials.json
```

After access the interface, create the profile.

Create a empty workflow and copy the content of the backup file inside workflows folder.

Fix the credentials errors and publish the workflow.

## Local Development

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- OpenAI API Key

### 1. Environment Setup

Export your OpenAI API Key (required for the Express API):

```shell
export OPENAI_API_KEY=sk-...
export VITE_API_BASE_URL=http://localhost:5678/webhook
```

### 2. Start n8n (Workflow Engine)

Run n8n using the existing Docker Compose configuration:

```shell
docker compose -f docker-compose-local.yml up -d
```

- **URL**: `http://localhost:5678`

### 3. Start Express API (Backend)

Navigate to the API directory, install dependencies, and start the server:

```shell
cd express-api
npm install
npm start
```

- **URL**: `http://localhost:3000`
- **Note**: Ensure the `OPENAI_API_KEY` is set in your terminal or `.env` file.

### 4. Start Frontend (Form App)

Navigate to the frontend directory, install dependencies, and start the vite server:

```shell
cd form
npm install
npm run dev
```

- **URL**: `http://localhost:5173/form`

## Useful commands

Export credentials command

```shell
docker exec -u node -it muc-dai-graf-syteco-n8n-1 n8n export:credentials --backup --output=backups/latest/
```

Import worksflow command

```shell
docker exec -u node -it muc-dai-graf-syteco-n8n-1 n8n import:workflow --separate --all --input=/home/node/workflows/
```

Import credentials command

```shell
docker exec -u node -it muc-dai-graf-syteco-n8n-1 n8n import:credentials --input=/home/node/credentials/credentials.json
```

Export credentials command

```shell
    docker exec -u node -it muc-dai-graf-syteco-n8n-1 n8n export:credentials --all --decrypted --output=credentials/credentials.json
```

```shell
    docker cp  ./credentials n8n-n8n-1:/home/node/credentials
```
