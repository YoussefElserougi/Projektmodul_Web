'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Loader, AlertCircle, FileText, ThumbsUp, HelpCircle, ThumbsDown, PieChart } from 'lucide-react'
import StatCard from '@/components/StatCard'
import SentimentChart from '@/components/SentimentChart'
import KeywordRadar from '@/components/KeywordRadar'
import AlertBanner from '@/components/AlertBanner'
import TopicDistributionChart from '@/components/TopicDistributionChart'
import SentimentDistributionChart from '@/components/SentimentDistributionChart'
import TimeFilter from '@/components/TimeFilter'
import WarningPopup from '@/components/WarningPopup'
// 🚨 DEMO: Using simulated data - switch back to SummaryCard after presentation
import SummaryCardSimulated from '@/components/SummaryCardSimulated'
// import SummaryCard from '@/components/SummaryCard'
import { getAnalytics } from '@/lib/n8n'
import { calculatePercentage } from '@/lib/utils'
import { detectWarnings, shouldShowWarnings } from '@/lib/warningDetector'

export default function InsightsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTimeFilter, setActiveTimeFilter] = useState('month')
  const [warnings, setWarnings] = useState([])
  const [showWarningPopup, setShowWarningPopup] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAnalytics()
      
      const analyticsData = Array.isArray(data) ? data[0] : data
      setAnalytics(analyticsData)
      
      const detectedWarnings = detectWarnings(analyticsData)
      setWarnings(detectedWarnings)
      
      if (shouldShowWarnings(detectedWarnings)) {
        setShowWarningPopup(true)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Error while loading analytics. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 mb-4 animate-spin text-cta-secondary" />
        <p className="text-muted">Analyzing data...</p>
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

  if (!analytics) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            No analytics data available
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
  } = analytics

  const positiveCount = sentimentBreakdown.positive || 0
  const neutralCount = sentimentBreakdown.neutral || 0
  const negativeCount = sentimentBreakdown.negative || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Warning Popup */}
      {showWarningPopup && (
        <WarningPopup 
          warnings={warnings}
          onClose={() => setShowWarningPopup(false)}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-fg mb-2 flex items-center gap-3">
          <BarChart3 className="w-10 h-10" style={{ color: '#FF804D' }} />
          Insights Dashboard
        </h1>
        <p className="text-muted">Analysis & early detection of review trends</p>
      </div>

      {/* Time Filter */}
      <TimeFilter 
        activeFilter={activeTimeFilter}
        setActiveFilter={setActiveTimeFilter}
      />

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
          title="Total Reviews"
          value={totalReviews}
          icon={FileText}
          color="bg-surface border-border"
        />
        <StatCard
          title="Positive"
          value={positiveCount}
          subtitle={`${calculatePercentage(positiveCount, totalReviews)}%`}
          icon={ThumbsUp}
          color="bg-surface border-border"
        />
        <StatCard
          title="Neutral"
          value={neutralCount}
          subtitle={`${calculatePercentage(neutralCount, totalReviews)}%`}
          icon={HelpCircle}
          color="bg-surface border-border"
        />
        <StatCard
          title="Negative"
          value={negativeCount}
          subtitle={`${calculatePercentage(negativeCount, totalReviews)}%`}
          icon={ThumbsDown}
          color="bg-surface border-border"
        />
      </div>

      {/* AI Summary Card */}
      {/* 🚨 DEMO: Using simulated data - switch to <SummaryCard data={analytics} /> after presentation */}
      <SummaryCardSimulated />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend Chart */}
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fg">
            <TrendingUp className="w-5 h-5 text-cta-secondary" />
            Sentiment Trend
          </h2>
          <SentimentChart data={sentimentTrend} />
        </div>

        {/* Problem Radar */}
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fg">
            <AlertCircle className="w-5 h-5 text-cta-secondary" />
            Issue Radar
          </h2>
          <KeywordRadar keywords={topNegativeKeywords} />
        </div>
      </div>

      {/* Circle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Themen-Verteilung */}
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fg">
            <PieChart className="w-5 h-5 text-cta-secondary" />
            Topic Distribution
          </h2>
          <TopicDistributionChart keywords={topNegativeKeywords} />
        </div>

        {/* Sentiment-Verteilung */}
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fg">
            <PieChart className="w-5 h-5 text-cta-secondary" />
            Sentiment Distribution
          </h2>
          <SentimentDistributionChart sentimentBreakdown={sentimentBreakdown} />
        </div>
      </div>

      {/* AI Summary Section */}
      {aiSummary && (aiSummary.topPraise || aiSummary.topComplaints || aiSummary.recommendations) && (
        <div className="bg-surface p-6 rounded-2xl shadow-lg border border-border">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-fg">
            ✨ AI Summary
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Top Lob */}
            <div className="bg-bg p-4 rounded-xl border border-border">
              <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                Top Praise
              </h3>
              <p className="text-muted text-sm">
                {aiSummary.topPraise || 'No data available'}
              </p>
            </div>

            {/* Top Beschwerden */}
            <div className="bg-bg p-4 rounded-xl border border-border">
              <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5" />
                Top Complaints
              </h3>
              <p className="text-muted text-sm">
                {aiSummary.topComplaints || 'No data available'}
              </p>
            </div>

            {/* Handlungsempfehlungen */}
            <div className="bg-bg p-4 rounded-xl border border-border">
              <h3 className="font-bold text-cta-secondary mb-2 flex items-center gap-2">
                💡 Recommendations
              </h3>
              <p className="text-muted text-sm">
                {aiSummary.recommendations || 'No data available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}