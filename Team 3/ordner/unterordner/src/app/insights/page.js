'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Loader, AlertCircle, FileText, ThumbsUp, HelpCircle, ThumbsDown } from 'lucide-react'
import StatCard from '@/components/StatCard'
import SentimentChart from '@/components/SentimentChart'
import KeywordRadar from '@/components/KeywordRadar'
import AlertBanner from '@/components/AlertBanner'
import { getAnalytics } from '@/lib/n8n'
import { calculatePercentage } from '@/lib/utils'

export default function InsightsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    setLoading(true)
    setError(null)
    try {
      // WICHTIG: Ruft n8n Webhook auf (GET /webhook/get-analytics)
      const data = await getAnalytics()
      
      // Erwartetes Format:
      // {
      //   totalReviews: number,
      //   sentimentBreakdown: { positive, neutral, negative },
      //   avgSentimentScore: number,
      //   sentimentTrend: [ { date, positive, neutral, negative } ],
      //   topNegativeKeywords: [ { keyword, count, change } ],
      //   alerts: [ { type, message } ],
      //   aiSummary: { topPraise, topComplaints, recommendations }
      // }
      
      setAnalytics(data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Fehler beim Laden der Analytics. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 mb-4 animate-spin text-atolls-orange" />
        <p className="text-gray-600">Analysiere Daten...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </p>
        </div>
      </div>
    )
  }

  const { 
    totalReviews = 0, 
    sentimentBreakdown = {}, 
    avgSentimentScore = 0,
    sentimentTrend = [],
    topNegativeKeywords = [],
    alerts = [],
    aiSummary = {}
  } = analytics || {}

  const positiveCount = sentimentBreakdown.positive || 0
  const neutralCount = sentimentBreakdown.neutral || 0
  const negativeCount = sentimentBreakdown.negative || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-atolls-orange" />
          Insights Dashboard
        </h1>
        <p className="text-gray-600">Analyse & Früherkennung von Review-Trends</p>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <AlertBanner key={idx} alert={alert} />
          ))}
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gesamt Reviews"
          value={totalReviews}
          icon={FileText}
          color="bg-white border-gray-100"
        />
        <StatCard
          title="Positiv"
          value={positiveCount}
          subtitle={`${calculatePercentage(positiveCount, totalReviews)}%`}
          icon={ThumbsUp}
          color="bg-white border-gray-100"
        />
        <StatCard
          title="Neutral"
          value={neutralCount}
          subtitle={`${calculatePercentage(neutralCount, totalReviews)}%`}
          icon={HelpCircle}
          color="bg-white border-gray-100"
        />
        <StatCard
          title="Negativ"
          value={negativeCount}
          subtitle={`${calculatePercentage(negativeCount, totalReviews)}%`}
          icon={ThumbsDown}
          color="bg-white border-gray-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-atolls-orange" />
            Sentiment-Trend
          </h2>
          <SentimentChart data={sentimentTrend} />
        </div>

        {/* Problem Radar */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <AlertCircle className="w-5 h-5 text-atolls-orange" />
            Problem Radar
          </h2>
          <KeywordRadar keywords={topNegativeKeywords} />
        </div>
      </div>

      {/* AI Summary Section */}
      {aiSummary && (
        <div className="bg-atolls-yellow/10 p-6 rounded-2xl shadow-lg border-2 border-atolls-yellow/30">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            ✨ KI-Zusammenfassung
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Top Lob */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                Top Lob
              </h3>
              <p className="text-gray-700 text-sm">
                {aiSummary.topPraise || 'Keine Daten verfügbar'}
              </p>
            </div>

            {/* Top Beschwerden */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5" />
                Top Beschwerden
              </h3>
              <p className="text-gray-700 text-sm">
                {aiSummary.topComplaints || 'Keine Daten verfügbar'}
              </p>
            </div>

            {/* Handlungsempfehlungen */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                💡 Empfehlungen
              </h3>
              <p className="text-gray-700 text-sm">
                {aiSummary.recommendations || 'Keine Daten verfügbar'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}