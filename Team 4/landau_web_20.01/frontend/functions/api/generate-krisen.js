/**
 * Cloudflare Pages Function - Secure Proxy for n8n Webhook (Krisenmanagement)
 * 
 * This function acts as a proxy to hide the real n8n URL and API credentials
 * from the browser. Secrets are only accessible server-side.
 * 
 * Required Cloudflare Environment Variables (set in Dashboard WITHOUT VITE_ prefix):
 * - N8N_BASE_URL: Your n8n server URL (e.g., https://your-server.com)
 * - N8N_KRISEN_WEBHOOK_PATH: The webhook path for Krisenmanagement (e.g., /webhook/krisen-xxx-xxx)
 * - N8N_API_KEY: (Optional) API key for webhook authentication
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Get secrets from Cloudflare environment (NOT visible in browser!)
    const n8nBaseUrl = env.N8N_BASE_URL;
    const n8nWebhookPath = env.N8N_KRISEN_WEBHOOK_PATH;
    const n8nApiKey = env.N8N_API_KEY; // Optional

    if (!n8nBaseUrl || !n8nWebhookPath) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error - Krisenmanagement webhook not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get request body
    const body = await request.json();

    // Build headers for n8n request
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add API key if configured (for n8n Header Auth)
    if (n8nApiKey) {
      headers['X-API-Key'] = n8nApiKey;
    }

    // Forward request to n8n
    const n8nUrl = `${n8nBaseUrl}${n8nWebhookPath}`;
    
    console.log('Proxying Krisenmanagement request to n8n...'); // Only visible in Cloudflare logs

    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Get response from n8n
    const responseText = await n8nResponse.text();
    
    // Try to parse as JSON, otherwise return as-is
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return new Response(
      JSON.stringify(responseData),
      {
        status: n8nResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Krisenmanagement proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process Krisenmanagement request' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
