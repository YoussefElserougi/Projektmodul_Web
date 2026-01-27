'use client'

import { useState } from 'react'
import { Edit2, Save, X, Upload, Loader, CheckCircle2 } from 'lucide-react'
import { updateReview, publishReview } from '@/lib/n8n'
import { getSentimentColor, getSentimentColorStyle, formatDate } from '@/lib/utils'

export default function ReviewCard({ review, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedResponse, setEditedResponse] = useState(review.Response || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  async function handleSave() {
    if (!review?.review_id) {
      console.error('Missing review_id:', review)
      alert('Error: review_id is missing.')
      return
    }

    setIsSaving(true)
    try {
      await updateReview({
        reviewId: review.review_id,
        response: editedResponse,
      })

      setIsEditing(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to save review:', error)
      alert('Error while saving. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePublish() {
    if (!review?.review_id) {
      console.error('Missing review_id:', review)
      alert('Error: review_id is missing.')
      return
    }

    if (!confirm('Do you really want to publish this review?')) {
      return
    }

    setIsPublishing(true)
    try {
      await publishReview(review.review_id)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to publish review:', error)
      alert('Error while publishing. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const sentimentColor = getSentimentColor(review.Sentiment)
  const sentimentStyle = getSentimentColorStyle(review.Sentiment)
    const reviewName =
      typeof review.name === 'string' && review.name.trim().length > 0
      ? review.name
      : 'Unknown'

  return (
    <div className="bg-surface rounded-xl shadow-lg border border-border overflow-hidden hover:shadow-2xl transition-shadow animate-fade-in">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
              <h3 className="text-xl font-bold text-fg">{reviewName}</h3>
              <p className="text-sm text-muted">
              {review.timestamp ? formatDate(review.timestamp) : 'N/A'}
            </p>
          </div>
          <div className="px-3 py-1 rounded-full border-2 text-sm font-semibold" style={{ ...sentimentStyle, borderWidth: '2px' }}>
            {review.Sentiment}
          </div>
        </div>

        {/* Review Text */}
            <div className="mb-4 p-4 bg-surface2 rounded-lg border border-border">
              <p className="text-fg leading-relaxed">{review.Review}</p>
        </div>

        {/* AI Response */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cta-secondary rounded-full animate-pulse"></div>
              <label className="text-sm font-semibold text-muted">
                AI-generated response
              </label>
          </div>

          {isEditing ? (
            <textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              rows={5}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cta-secondary resize-none bg-bg text-fg border-border"
              placeholder="Edit the response..."
            />
          ) : (
            <div className="p-4 bg-surface2 rounded-lg border border-border">
              <p className="text-fg whitespace-pre-wrap">
                {editedResponse || 'No response generated yet'}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {review.status === 'published' ? (
            /* ZUSTAND 1: Review ist bereits veröffentlicht */
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Successfully published
            </div>
          ) : !isEditing ? (
            /* ZUSTAND 2: Review ist im Posteingang (Pending) */
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cta-secondary text-black rounded-lg transition-colors font-medium hover:bg-cta-secondary-hover"
              >
                <Edit2 className="w-5 h-5" />
                Edit
              </button>

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cta-primary text-black rounded-lg font-medium hover:bg-cta-primary-hover transition-colors disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                Publish
              </button>
            </>
          ) : (
            /* ZUSTAND 3: Edit-Modus aktiv */
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save
              </button>

              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedResponse(review.Response || '')
                }}
                className="flex-1 px-4 py-2 bg-surface2 text-fg rounded-lg hover:bg-surface transition-colors font-medium border border-border"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}