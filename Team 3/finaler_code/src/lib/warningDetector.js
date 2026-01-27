export function detectWarnings(analytics) {
  if (!analytics) return []

  const warnings = []
  const { 
    sentimentBreakdown = {}, 
    topNegativeKeywords = [],
    sentimentTrend = [],
    totalReviews = 0 
  } = analytics

  const negativeCount = sentimentBreakdown.negative || 0
  const negativePercentage = totalReviews > 0 ? (negativeCount / totalReviews) * 100 : 0
  
  if (negativePercentage > 40) {
    warnings.push({
      type: 'high_negative',
      title: 'Hoher Anteil negativer Reviews',
      message: `Aktuell sind ${negativePercentage.toFixed(0)}% aller Reviews negativ. Dies liegt deutlich über dem Normalwert und erfordert sofortige Aufmerksamkeit.`,
      details: `${negativeCount} von ${totalReviews} Reviews sind negativ`
    })
  }

  if (sentimentTrend && sentimentTrend.length >= 3) {
    const recentTrend = sentimentTrend.slice(-3)
    const hasNegativeStreak = recentTrend.every(trend => 
      (trend.negative || 0) > (trend.positive || 0)
    )
    
    if (hasNegativeStreak) {
      warnings.push({
        type: 'negative_streak',
        title: 'Negativer Trend erkannt',
        message: 'In den letzten 3 Zeiträumen überwiegen negative Reviews. Es besteht ein anhaltender negativer Trend, der untersucht werden sollte.',
        details: 'Konsekutive negative Perioden erfordern proaktive Maßnahmen'
      })
    }
  }

  if (topNegativeKeywords && topNegativeKeywords.length > 0) {
    const topKeyword = topNegativeKeywords[0]
    
    if (topKeyword.count >= 10) {
      warnings.push({
        type: 'frequent_keyword',
        title: `Häufiges Problem: "${topKeyword.keyword}"`,
        message: `Das Keyword "${topKeyword.keyword}" wurde bereits ${topKeyword.count} Mal in negativen Reviews erwähnt. Dies deutet auf ein wiederkehrendes Problem hin.`,
        details: topKeyword.change > 0 
          ? `Trend steigend: +${topKeyword.change}% im Vergleich zu vorher`
          : 'Beobachten Sie dieses Thema weiterhin'
      })
    }
  }

  if (topNegativeKeywords && topNegativeKeywords.length > 0) {
    const risingKeywords = topNegativeKeywords.filter(kw => kw.change > 50)
    
    if (risingKeywords.length > 0) {
      const keyword = risingKeywords[0]
      warnings.push({
        type: 'rising_keyword',
        title: `Schnell steigendes Problem: "${keyword.keyword}"`,
        message: `Das Problem "${keyword.keyword}" zeigt einen starken Anstieg von ${keyword.change}% in der Erwähnung. Dies könnte auf ein neues oder sich verschlimmerndes Problem hinweisen.`,
        details: `Aktuell ${keyword.count} Erwähnungen`
      })
    }
  }

  const positiveCount = sentimentBreakdown.positive || 0
  const positivePercentage = totalReviews > 0 ? (positiveCount / totalReviews) * 100 : 0
  
  if (totalReviews > 10 && positivePercentage < 20) {
    warnings.push({
      type: 'low_positive',
      title: 'Sehr wenige positive Reviews',
      message: `Nur ${positivePercentage.toFixed(0)}% der Reviews sind positiv. Dies ist deutlich unter den üblichen Standards und signalisiert ernsthafte Probleme.`,
      details: `Nur ${positiveCount} positive Reviews von insgesamt ${totalReviews}`
    })
  }

  return warnings
}

export function shouldShowWarnings(warnings) {
  return warnings && warnings.length > 0
}
