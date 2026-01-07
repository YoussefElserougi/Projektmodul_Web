/**
 * Utility Funktionen
 */

export function getSentimentColor(sentiment) {
  const colors = {
    positive: 'bg-green-100 text-green-800 border-green-300',
    neutral: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    negative: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[sentiment?.toLowerCase()] || colors.neutral;
}

export function getSentimentEmoji(sentiment) {
  const emojis = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
  };
  return emojis[sentiment?.toLowerCase()] || '❓';
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculatePercentage(value, total) {
  if (!total) return 0;
  return ((value / total) * 100).toFixed(1);
}