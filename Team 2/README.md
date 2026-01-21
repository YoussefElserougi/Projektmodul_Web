# Project Title
Wil-Bot – AI-Assisted Interaction Prototype

## Team Members
- Elif Öztemür  
- Amelie Pompe  
- Inha Povarova  
- Vasilisa Boronnikova  

## Project Description
Wil-Bot is a prototype exploring intelligent, adaptive interaction.  
The system analyzes user input and behavior to dynamically adjust response style and difficulty, combining an LLM-based logic layer with automation workflows.

## How to Run / Use
1. Open **n8n** (local or cloud).
2. Import the provided **n8n workflow (.json)** via  
   **Settings → Import workflow**.
3. Configure all required credentials (see Dependencies & Setup).
4. Trigger the workflow via the webhook or test execution.
5. Open and run `wilbot.html` in a browser to interact with the prototype.

## Build / Setup
No build step required.  
The project runs entirely inside **n8n** and the browser.

## Dependencies & Setup
- **n8n**
- **LLM API** (e.g. Gemini)
- **ElevenLabs** (for voice output)
- **Supabase** (used as the databank)
- Webhook access enabled in n8n

### Supabase Setup
1. Watch the YouTube tutorial starting from **minute 6**:  
   https://www.youtube.com/watch?v=GL5jYuQ8j3c
2. Create a **Supabase account** and set up a new project.
3. Connect Supabase to the n8n workflow.
4. Replace all placeholder values such as  
   `SUPABASE_API_KEY`  
   with your **real Supabase API key** inside n8n credentials.

## What Not to Upload
- API keys, tokens, or passwords
- Secret credentials or environment variables
- Private system prompts containing sensitive data


## Optional: PDF Upload (Knowledge Extension)

Wil-Bot can optionally ingest **PDF documents** to extend its knowledge base.  
This step is **not required** to run the prototype.

### Overview
- PDFs are read locally using the **Read Files from Disk** node in n8n.
- The content is split, embedded, and stored in **Supabase Vector Store**.
- No credentials are required for reading the files themselves.

### Usage
1. Place PDFs on the machine running n8n.
2. Set the file path in the **File(s) Selector** field, e.g.:
   ```
   /home/node/.n8n-files/pdfs/your-file.pdf
   ```
3. Execute the workflow manually.

### Docker Users
If running n8n via Docker, you must mount a local folder containing the PDFs:

```bash
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v ~/n8n-pdfs:/home/node/.n8n-files/pdfs \
  n8nio/n8n
```

Use the mounted path inside n8n:
```
/home/node/.n8n-files/pdfs/your-file.pdf
```

### Notes
- Optional feature
- No secrets or API keys involved
- Required only if document-based responses are needed
