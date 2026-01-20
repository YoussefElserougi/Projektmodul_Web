import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_N8N_BASE_URL;
const WEBHOOK_PATH = import.meta.env.VITE_N8N_WEBHOOK_PATH;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor für Logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor für Error Handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Content-Generierung - sends data to n8n workflow
// Workflow expects: { data: { Topic, Social, picture } }
export const generateContent = async (data) => {
  try {
    // Transform frontend data to n8n workflow format
    const payload = {
      data: {
        Topic: data.theme,
        Social: data.platforms.map(p => {
          // Capitalize first letter to match n8n workflow expectations
          if (p === 'linkedin') return 'Linkedin';
          if (p === 'instagram') return 'Instagram';
          if (p === 'facebook') return 'Facebook';
          return p;
        }),
        picture: data.generateImage ? ['generate'] : []
      }
    };

    console.log('Sending to n8n:', payload);

    const response = await api.post(WEBHOOK_PATH, payload);
    
    console.log('n8n raw response:', response.data);
    console.log('n8n response type:', typeof response.data);

    // Handle case where response might be a string (needs parsing)
    let responseData = response.data;
    
    if (typeof responseData === 'string') {
      try {
        // Try to fix common JSON issues: replace actual newlines with escaped newlines
        const fixedString = responseData
          .replace(/\r\n/g, '\\n')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\n')
          .replace(/\t/g, '\\t');
        
        responseData = JSON.parse(fixedString);
        console.log('Parsed fixed string response:', responseData);
      } catch (e) {
        console.error('Failed to parse response string:', e);
        
        // Try to extract captions using regex as fallback
        try {
          const instagramMatch = responseData.match(/"instagram":\s*\{\s*"caption":\s*"([^"]*(?:\\"[^"]*)*)"/i);
          const linkedinMatch = responseData.match(/"linkedin":\s*\{\s*"caption":\s*"([^"]*(?:\\"[^"]*)*)"/i);
          const facebookMatch = responseData.match(/"facebook":\s*\{\s*"caption":\s*"([^"]*(?:\\"[^"]*)*)"/i);
          
          responseData = {
            instagram: instagramMatch ? { caption: instagramMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'), imageUrl: '' } : null,
            linkedin: linkedinMatch ? { caption: linkedinMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'), imageUrl: '' } : null,
            facebook: facebookMatch ? { caption: facebookMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'), imageUrl: '' } : null
          };
          console.log('Extracted via regex:', responseData);
        } catch (regexError) {
          console.error('Regex extraction also failed:', regexError);
        }
      }
    }

    // n8n returns keys with varying capitalization, so we check both
    const result = {
      success: true,
      data: {
        instagram: responseData?.Instagram || responseData?.instagram || null,
        linkedin: responseData?.Linkedin || responseData?.linkedin || null,
        facebook: responseData?.Facebook || responseData?.facebook || null
      },
      // Extract imageUrl from response (can be at root level or in individual platforms)
      imageUrl: responseData?.imageUrl || 
                responseData?.image_url || 
                responseData?.Instagram?.imageUrl ||
                responseData?.instagram?.imageUrl ||
                null
    };

    console.log('Final parsed result:', result);

    return result;
  } catch (error) {
    console.error('generateContent error:', error);
    throw new Error(error.response?.data?.message || 'Fehler bei der Content-Generierung');
  }
};

export default api;
