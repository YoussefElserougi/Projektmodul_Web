'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, RefreshCw, Inbox, Loader } from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'
import { getReviews } from '@/lib/n8n'

export default function InboxPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, positive, neutral, negative
  const [error, setError] = useState(null)

  // Fetch reviews from n8n on mount
  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    setError(null)
    try {
      // WICHTIG: Ruft n8n Webhook auf (GET /webhook/get-reviews)
      const data = await getReviews()
      
      // Format von n8n ist direkt ein Array: [ { Name, Review, Sentiment, Response, ... } ]
      // Nicht: { reviews: [...] }
      setReviews(Array.isArray(data) ? data : data.reviews || [])
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      setError('Fehler beim Laden der Reviews. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  // Filter logic - WICHTIG: Verwendet "Sentiment" nicht "sentiment_label"!
  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    return review.Sentiment?.toLowerCase() === filter
  })

  // Count by sentiment - WICHTIG: Verwendet "Sentiment" nicht "sentiment_label"!
  const counts = {
    all: reviews.length,
    positive: reviews.filter(r => r.Sentiment?.toLowerCase() === 'positive').length,
    neutral: reviews.filter(r => r.Sentiment?.toLowerCase() === 'neutral').length,
    negative: reviews.filter(r => r.Sentiment?.toLowerCase() === 'negative').length,
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Inbox className="w-10 h-10 text-atolls-orange" />
            Review Inbox
          </h1>
          <p className="text-gray-600">Verwalte eingehende Mitarbeiter-Reviews</p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-atolls-orange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 bg-gray-50 p-2 rounded-lg shadow-sm">
        {[
          { key: 'all', label: 'Alle', color: 'gray', icon: HelpCircle },
          { key: 'positive', label: 'Positiv', color: 'green', icon: CheckCircle2 },
          { key: 'neutral', label: 'Neutral', color: 'yellow', icon: AlertCircle },
          { key: 'negative', label: 'Negativ', color: 'red', icon: XCircle },
        ].map(({ key, label, color, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
              filter === key
                ? `bg-${color}-600 text-white border-2 border-${color}-700`
                : 'bg-white text-gray-600 hover:text-atolls-orange border-2 border-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            <span className="ml-auto">({counts[key]})</span>
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-12 h-12 mb-4 animate-spin text-atolls-orange" />
          <p className="text-gray-600">Lade Reviews...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReviews.length === 0 && (
        <div className="text-center py-20">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Keine Reviews gefunden</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Es sind noch keine Reviews vorhanden.'
              : `Keine ${filter} Reviews vorhanden.`}
          </p>
        </div>
      )}

      {/* Review Cards */}
      {!loading && filteredReviews.length > 0 && (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <ReviewCard 
              key={index} 
              review={review} 
              onUpdate={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  )
}