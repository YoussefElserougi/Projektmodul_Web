'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  RefreshCw,
  Inbox,
  Loader,
} from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'
import { getReviews } from '@/lib/n8n'

export default function InboxPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    setError(null)
    try {
      const data = await getReviews()
      const reviewsData = Array.isArray(data) ? data : data.reviews || []
      setReviews(reviewsData)
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      setError('Error while loading reviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getNormalizedStatus = (review) => {
    const rawStatus = review.status || review.Status || 'pending'
    return rawStatus.toString().trim().toLowerCase()
  }

  const statusFilteredReviews = reviews.filter(
    review => getNormalizedStatus(review) === statusFilter
  )

  const filteredReviews = statusFilteredReviews.filter(review => {
    if (filter === 'all') return true
    return review.Sentiment?.toLowerCase() === filter
  })

  const counts = {
    all: statusFilteredReviews.length,
    positive: statusFilteredReviews.filter(r => r.Sentiment?.toLowerCase() === 'positive').length,
    neutral: statusFilteredReviews.filter(r => r.Sentiment?.toLowerCase() === 'neutral').length,
    negative: statusFilteredReviews.filter(r => r.Sentiment?.toLowerCase() === 'negative').length,
  }

  const statusCounts = {
    pending: reviews.filter(r => getNormalizedStatus(r) === 'pending' || getNormalizedStatus(r) === '').length,
    published: reviews.filter(r => getNormalizedStatus(r) === 'published').length,
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-fg mb-2 flex items-center gap-3">
            <Inbox className="w-10 h-10" style={{ color: '#FF804D' }} />
            Review Inbox
          </h1>
          <p className="text-muted">Manage incoming employee reviews</p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-cta-secondary text-black rounded-lg hover:bg-cta-secondary-hover transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Tabs (Pending / Published) */}
      <div className="mb-8">
        <div className="flex gap-8 border-b border-border">
          {[
            { key: 'pending', label: 'Pending' },
            { key: 'published', label: 'Published' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key)
                setFilter('all') // Reset Sentiment-Filter beim Tab-Wechsel
              }}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
                statusFilter === key
                  ? 'text-cta-secondary'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <span>{label}</span>
              <span className="bg-surface2 text-fg px-2.5 py-1 rounded-full text-sm font-semibold border border-border">
                {statusCounts[key]}
              </span>
              {statusFilter === key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cta-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sentiment Filter */}
      <div className="mb-6 flex gap-2 bg-surface p-2 rounded-lg shadow-sm border border-border">
        {[
          { key: 'all', label: 'All', bgActive: 'bg-gray-600', textColor: 'text-gray-400' },
          { key: 'positive', label: 'Positive', bgActive: 'bg-green-500', textColor: 'text-green-400' },
          { key: 'neutral', label: 'Neutral', bgActive: 'bg-yellow-500', textColor: 'text-yellow-400' },
          { key: 'negative', label: 'Negative', bgActive: 'bg-red-500', textColor: 'text-red-400' },
        ].map(({ key, label, bgActive, textColor }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
              filter === key
                ? `${bgActive} text-white shadow-md`
                : `bg-bg text-muted hover:${textColor} border border-border`
            }`}
          >
            {key === 'all' && <HelpCircle className="w-5 h-5" />}
            {key === 'positive' && <CheckCircle2 className="w-5 h-5" />}
            {key === 'neutral' && <AlertCircle className="w-5 h-5" />}
            {key === 'negative' && <XCircle className="w-5 h-5" />}
            <span className="hidden sm:inline">{label}</span>
            <span className="text-xs opacity-70 ml-1">({counts[key]})</span>
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3 text-red-800">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-12 h-12 mb-4 animate-spin text-cta-secondary" />
          <p className="text-muted font-medium">Loading reviews from Google Sheets...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReviews.length === 0 && (
        <div className="text-center py-20 bg-surface rounded-xl border-2 border-dashed border-border">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-muted" />
          <h3 className="text-xl font-bold text-fg">No reviews found</h3>
          <p className="text-muted">There are currently no entries in this category.</p>
        </div>
      )}

      {/* Review Cards List */}
      {!loading && filteredReviews.length > 0 && (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <ReviewCard
              key={review.review_id || `review-${index}`}
              review={review}
              onUpdate={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  )
}