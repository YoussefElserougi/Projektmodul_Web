# N8N Webhook Schnittstellen

## Webhook-Definitionen

**Datei:** `src/lib/n8n.js`

Zentrale Datei mit allen 4 Webhook-Funktionen:

```javascript
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
 * Markiert Review als "published" und sendet ggf. an User
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
```

---

## GET /webhook/get-reviews

**Aufgerufen von:** `src/app/inbox/page.js` in `fetchReviews()`

**Input:** Keine

**Output:** Array von Reviews
```javascript
const data = await getReviews()
setReviews(Array.isArray(data) ? data : data.reviews || [])
```

**Format:** Array mit Objekten: `[{ Name, Review, Sentiment, Response, ... }]`

**N8N:** Liest Google Sheet, gibt Array zurück

---

## POST /webhook/update-review

**Aufgerufen von:** `src/components/ReviewCard.js` in `handleSave()`

**Input:** `{ reviewId, response }`

**Output:** `{ success: true/false }`
```javascript
await updateReview({
  reviewId: review["Name "],
  response: editedResponse,
})
```

**N8N:** Sucht Review, aktualisiert Response-Feld in Google Sheet

---

## POST /webhook/publish-review

**Aufgerufen von:** `src/components/ReviewCard.js` in `handlePublish()`

**Input:** `{ reviewId }`

**Output:** `{ success: true/false }`
```javascript
await publishReview(review["Name "])
```

**N8N:** Markiert Review als veröffentlicht in Google Sheet

---

## GET /webhook/get-analytics

**Aufgerufen von:** `src/app/insights/page.js` in `fetchAnalytics()`

**Input:** Keine

**Output:** Aggregierte Statistiken
```javascript
const data = await getAnalytics()
setAnalytics(data)
```

**Format:**
```javascript
{
  totalReviews: 42,
  sentimentBreakdown: { positive: 20, neutral: 15, negative: 7 },
  topNegativeKeywords: [
    { keyword: "management", count: 5, change: 12 },
    { keyword: "communication", count: 4, change: 8 }
  ],
  sentimentTrend: [ { date: "2024-12-20", positive: 5, neutral: 3, negative: 1 } ]
}
```

**N8N:** Liest beide Google Sheets, aggregiert Daten

---

## Übersicht

| Webhook | Methode | Frontend-Datei | Frontend-Funktion | Zeile |
|---------|---------|---|---|---|
| `/webhook/get-reviews` | GET | `src/app/inbox/page.js` | `fetchReviews()` | 23 |
| `/webhook/update-review` | POST | `src/components/ReviewCard.js` | `handleSave()` | 18 |
| `/webhook/publish-review` | POST | `src/components/ReviewCard.js` | `handlePublish()` | 36 |
| `/webhook/get-analytics` | GET | `src/app/insights/page.js` | `fetchAnalytics()` | 26 |

---

## Basis-URL

**Datei:** `src/lib/n8n.js`

```javascript
const N8N_BASE_URL = 'https://mucdai-toolbox.cs.hm.edu/n8n'
```

---

## Zusammenfassung

| Webhook | Methode | Frontend | Funktion |
|---------|---------|----------|----------|
| `/webhook/get-reviews` | GET | `src/app/inbox/page.js` | `fetchReviews()` |
| `/webhook/update-review` | POST | `src/components/ReviewCard.js` | `handleSave()` |
| `/webhook/publish-review` | POST | `src/components/ReviewCard.js` | `handlePublish()` |
| `/webhook/get-analytics` | GET | `src/app/insights/page.js` | `fetchAnalytics()` |
