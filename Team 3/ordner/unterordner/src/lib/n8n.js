/**
 * Zentrale n8n API Utility
 * Alle Kommunikation mit n8n Webhooks läuft über diese Datei
 */

// ✅ Hochschule Toolbox n8n Production URL
const N8N_BASE_URL = 'https://mucdai-toolbox.cs.hm.edu/n8n';

/**
 * Fetch Wrapper mit Error Handling
 */
async function n8nFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${N8N_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`n8n API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('n8n fetch error:', error);
    console.error('Tried URL:', `${N8N_BASE_URL}${endpoint}`);
    throw error;
  }
}

/**
 * GET /webhook/get-reviews
 * Holt alle Reviews aus Google Sheets via n8n
 */
export async function getReviews() {
  return n8nFetch('/webhook/get-reviews', {
    method: 'GET',
  });
}

/**
 * POST /webhook/update-review
 * Aktualisiert die AI Response eines Reviews
 */
export async function updateReview(reviewData) {
  return n8nFetch('/webhook/update-review', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

/**
 * POST /webhook/publish-review
 * Markiert Review als "published"
 */
export async function publishReview(reviewId) {
  return n8nFetch('/webhook/publish-review', {
    method: 'POST',
    body: JSON.stringify({ reviewId }),
  });
}

/**
 * GET /webhook/get-analytics
 * Holt aggregierte Analytics-Daten
 */
export async function getAnalytics() {
  return n8nFetch('/webhook/get-analytics', {
    method: 'GET',
  });
}
