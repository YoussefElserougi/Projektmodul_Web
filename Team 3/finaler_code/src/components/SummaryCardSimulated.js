import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react'

// ============================================================
// 🚨 DEMO COMPONENT - STATIC DATA FOR PRESENTATION 🚨
// Replace with SummaryCard.js after demo to use real AI data
// ============================================================

export default function SummaryCardSimulated() {
  // Static demo data - tuned to match dashboard KPIs (54 total, 8 positive, 13 neutral, 33 negative)
  const summary = {
    weekly_conclusion: "Majority of feedback points to specific improvement areas.",
    description: "While many reviews highlight team strength and culture, most feedback centers on compensation expectations and organizational structure. There are opportunities to address key concerns that would significantly improve overall sentiment.",
    top_praises: [
      { text: "Strong team environment", count: 8 },
      { text: "Collaborative culture", count: 6 },
      { text: "Work-life flexibility", count: 5 },
    ],
    top_complaints: [
      { text: "Compensation structure", count: 33 },
      { text: "Career advancement clarity", count: 12 },
      { text: "Management transparency", count: 10 },
    ],
    new_issues: [
      { text: "Salary alignment concerns", since: "Jan 2026" },
      { text: "Role expectations clarity", since: "Dec 2025" },
    ],
  };

  return (
    <div className="bg-surface text-fg p-6 rounded-2xl shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6" style={{ color: '#FF804D' }} />
        <h2 className="text-xl font-bold">AI-Powered Summary</h2>
      </div>

      <div className="bg-bg p-5 rounded-xl mb-6 border border-border">
        <h3 className="font-bold text-lg mb-2 text-fg">What are the reviews saying this week?</h3>
        <p className="text-sm leading-relaxed text-muted">
          <strong className="text-fg">{summary.weekly_conclusion}</strong> {summary.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Praise */}
        <div className="bg-bg p-4 rounded-xl border border-border">
          <h4 className="flex items-center gap-2 mb-3 font-bold text-green-500">
            <CheckCircle className="w-5 h-5" />
            Top Praise
          </h4>
          <ul className="text-sm space-y-2 text-muted">
            {summary.top_praises.map((p, i) => (
              <li key={i}>• {p.text} ({p.count})</li>
            ))}
          </ul>
        </div>

        {/* Top Complaints */}
        <div className="bg-bg p-4 rounded-xl border border-border">
          <h4 className="flex items-center gap-2 mb-3 font-bold text-yellow-500">
            <AlertCircle className="w-5 h-5" />
            Top Complaints
          </h4>
          <ul className="text-sm space-y-2 text-muted">
            {summary.top_complaints.map((c, i) => (
              <li key={i}>• {c.text} ({c.count})</li>
            ))}
          </ul>
        </div>

        {/* New Issues */}
        <div className="bg-bg p-4 rounded-xl border border-border">
          <h4 className="flex items-center gap-2 mb-3 font-bold text-red-400">
            <AlertCircle className="w-5 h-5" />
            New Issues
          </h4>
          <ul className="text-sm space-y-2 text-muted">
            {summary.new_issues.map((n, i) => (
              <li key={i}>• {n.text} (since {n.since})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
