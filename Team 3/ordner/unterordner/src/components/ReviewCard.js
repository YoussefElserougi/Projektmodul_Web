'use client'

import { useState } from 'react'
import { Edit2, Save, X, Upload, Loader, CheckCircle2 } from 'lucide-react'
import { updateReview, publishReview } from '@/lib/n8n'
import { getSentimentColor, getSentimentEmoji, formatDate } from '@/lib/utils'

export default function ReviewCard({ review, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  // N8N Feldnamen: "Response" nicht "ai_response"
  const [editedResponse, setEditedResponse] = useState(review.Response || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    try {
      // WICHTIG: Sendet update an n8n (POST /webhook/update-review)
      await updateReview({
        reviewId: review["Name "] || review.name, // Nutze "Name " mit Leerzeichen!
        response: editedResponse,
      })
      setIsEditing(false)
      if (onUpdate) onUpdate() // Refresh parent
    } catch (error) {
      console.error('Failed to save review:', error)
      alert('Fehler beim Speichern. Bitte versuche es erneut.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePublish() {
    setIsPublishing(true)
    try {
      // WICHTIG: Sendet publish an n8n (POST /webhook/publish-review)
      await publishReview(review["Name "] || review.name)
      if (onUpdate) onUpdate() // Refresh parent
    } catch (error) {
      console.error('Failed to publish review:', error)
      alert('Fehler beim Veröffentlichen. Bitte versuche es erneut.')
    } finally {
      setIsPublishing(false)
    }
  }

  // Feldnamen korrekt nutzen
  const sentimentColor = getSentimentColor(review.Sentiment)
  const sentimentEmoji = getSentimentEmoji(review.Sentiment)
  const isPublished = review.published === true

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow animate-fade-in">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{review["Name "]}</h3>
            <p className="text-sm text-gray-500">{review.row_number ? `Row ${review.row_number}` : 'N/A'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border-2 text-sm font-semibold ${sentimentColor}`}>
            {sentimentEmoji} {review.Sentiment}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 leading-relaxed">{review.Review}</p>
        </div>

        {/* AI Response Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-atolls-orange rounded-full animate-pulse"></div>
            <label className="text-sm font-semibold text-gray-700">KI-generierte Antwort</label>
          </div>
          
          {isEditing ? (
            <textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              rows={5}
              className="w-full p-3 border-2 border-atolls-orange rounded-lg focus:outline-none focus:ring-2 focus:ring-atolls-orange resize-none bg-white text-gray-900"
              placeholder="Bearbeite die Antwort..."
            />
          ) : (
            <div className="p-4 bg-atolls-yellow/10 rounded-lg border-2 border-atolls-yellow/30">
              <p className="text-gray-800 whitespace-pre-wrap">{editedResponse || 'Noch keine Antwort generiert'}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-atolls-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <Edit2 className="w-5 h-5" />
                Bearbeiten
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isPublishing || review.status === 'published'}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  review.status === 'published'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                    : 'bg-atolls-orange text-white hover:bg-orange-600'
                }`}
              >
                {isPublishing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : review.status === 'published' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                {review.status === 'published' ? 'Veröffentlicht' : 'Veröffentlichen'}
              </button>
            </>
          ) : (
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
                Speichern
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedResponse(review.Response || '')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <X className="w-5 h-5 inline mr-2" />
                Abbrechen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}