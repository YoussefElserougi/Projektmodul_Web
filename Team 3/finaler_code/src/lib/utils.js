/**
 * Utility Funktionen
 */

export function getSentimentColor(sentiment) {
  const normalizedSentiment = sentiment?.toString().trim().toLowerCase();
  const colors = {
    positive: 'bg-green-500/20 text-green-500 border-green-500',
    neutral: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
    negative: 'bg-red-500/20 text-red-500 border-red-500',
  };
  return colors[normalizedSentiment] || colors.neutral;
}

export function getSentimentColorStyle(sentiment) {
  const normalizedSentiment = sentiment?.toString().trim().toLowerCase();
  const styles = {
    positive: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', borderColor: '#22c55e' },
    neutral: { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', borderColor: '#eab308' },
    negative: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderColor: '#ef4444' },
  };
  return styles[normalizedSentiment] || styles.neutral;
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