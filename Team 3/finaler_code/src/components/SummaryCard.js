import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react'

export default function SummaryCard({ data }) {
  if (!data) return null;

  // Support both nested aiSummary or a flattened object
  const summary = data.aiSummary || data;

  return (
    <div className="bg-surface text-fg p-6 rounded-2xl shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-cta-secondary" />
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
            {summary.top_praises && summary.top_praises.length > 0 ? (
              summary.top_praises.map((p, i) => (
                <li key={i}>• {p.text} ({p.count})</li>
              ))
            ) : (
              <li className="text-sm text-muted">No praises found</li>
            )}
          </ul>
        </div>

        {/* Top Complaints */}
        <div className="bg-bg p-4 rounded-xl border border-border">
          <h4 className="flex items-center gap-2 mb-3 font-bold text-yellow-500">
            <AlertCircle className="w-5 h-5" />
            Top Complaints
          </h4>
          <ul className="text-sm space-y-2 text-muted">
            {summary.top_complaints && summary.top_complaints.length > 0 ? (
              summary.top_complaints.map((c, i) => (
                <li key={i}>• {c.text} ({c.count})</li>
              ))
            ) : (
              <li className="text-sm text-muted">No complaints found</li>
            )}
          </ul>
        </div>

        {/* Neue Probleme */}
        <div className="bg-bg p-4 rounded-xl border border-border">
          <h4 className="flex items-center gap-2 mb-3 font-bold text-red-400">
            <AlertCircle className="w-5 h-5" />
            New Issues
          </h4>
          <ul className="text-sm space-y-2 text-muted">
            {summary.new_issues && summary.new_issues.length > 0 ? (
              summary.new_issues.map((n, i) => (
                <li key={i}>• {n.text} (since {n.since || 'N/A'})</li>
              ))
            ) : (
              <li className="text-sm text-muted">No new issues</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}