// ⚠️ WICHTIG: dotenv MUSS als ERSTES geladen werden!
import dotenv from 'dotenv';
import path from 'path';

// .env laden BEVOR andere Module importiert werden
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 🔍 DEBUG: Umgebungsvariablen prüfen
console.log('=== ENVIRONMENT CHECK ===');
console.log('Working Directory:', process.cwd());
console.log('.env Pfad:', path.resolve(__dirname, '../.env'));
console.log('PORT:', process.env.PORT);
console.log('N8N_WEBHOOK_URL:', process.env.N8N_WEBHOOK_URL);
console.log('========================\n');

// Prüfen ob Webhook-URL vorhanden ist
if (!process.env.N8N_WEBHOOK_URL) {
  console.error('❌ FEHLER: N8N_WEBHOOK_URL ist nicht definiert!');
  console.error('Bitte erstelle eine .env Datei im Root-Verzeichnis mit:');
  console.error('N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat');
  process.exit(1);
}

// JETZT ERST andere Module importieren
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import chatRoutes from './routes/chat';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/chat', chatRoutes);

// PDF Download Proxy
app.get('/api/download', async (req: Request, res: Response) => {
  const filename = req.query.file as string;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename required' });
  }
  
  // Sicherheitscheck
  if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  try {
    // n8n Download-Webhook URL bauen
    const baseUrl = process.env.N8N_WEBHOOK_URL?.replace('/webhook/chat', '/webhook/download');
    const n8nDownloadUrl = `${baseUrl}?file=${encodeURIComponent(filename)}`;
    
    console.log('📥 Downloading from n8n:', n8nDownloadUrl);
    
    const response = await axios.get(n8nDownloadUrl, {
      responseType: 'stream',
      timeout: 30000
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    response.data.pipe(res);
    
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server läuft',
    n8nConfigured: !!process.env.N8N_WEBHOOK_URL
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`📡 n8n Webhook: ${process.env.N8N_WEBHOOK_URL}`);
});
