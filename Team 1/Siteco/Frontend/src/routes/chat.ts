import { Router, Request, Response } from 'express';
import { N8NService } from '../services/n8nService';

const router = Router();
const n8nService = new N8NService(process.env.N8N_WEBHOOK_URL || '');

interface ChatRequest {
  message: string;
  conversationId?: string;
}

router.post('/message', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    // Validierung
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Nachricht darf nicht leer sein'
      });
    }

    // n8n anfragen
    const response = await n8nService.sendMessage(message, conversationId);

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat-Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
    });
  }
});

export default router;