import axios from 'axios';

interface ChatMessage {
  message: string;
  conversationId?: string;
}

interface N8NResponse {
  response: string;
  conversationId?: string;
}

export class N8NService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    if (!webhookUrl || webhookUrl.trim() === '') {
      throw new Error('N8N_WEBHOOK_URL ist nicht konfiguriert! Bitte .env Datei prüfen.');
    }
    this.webhookUrl = webhookUrl;
    console.log('✅ n8nService initialisiert mit URL:', this.webhookUrl);
  }

  async sendMessage(message: string, conversationId?: string): Promise<N8NResponse> {
    try {
      console.log('📤 Sende Nachricht an n8n:', { message, conversationId });
      
      const payload: ChatMessage = {
        message,
        ...(conversationId && { conversationId })
      };

      const response = await axios.post<N8NResponse>(
        this.webhookUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      console.log('✅ Antwort von n8n erhalten:', response.data);
      return response.data;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Axios Fehler:', {
          message: error.message,
          code: error.code,
          url: this.webhookUrl,
          response: error.response?.data
        });
        
        if (error.code === 'ECONNREFUSED') {
          throw new Error('n8n ist nicht erreichbar. Läuft n8n auf Port 5678?');
        }
        
        throw new Error(`n8n Fehler: ${error.message}`);
      }
      
      console.error('❌ Unbekannter Fehler:', error);
      throw new Error('Chatbot ist momentan nicht erreichbar');
    }
  }
}