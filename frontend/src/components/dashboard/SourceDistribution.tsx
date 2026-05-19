import { LeadStats, LeadSource } from '@/types';

const colors: Record<LeadSource, string> = {
  Website: 'bg-purple-500',
  Instagram: 'bg-pink-500',
  Referral: 'bg-teal-500',
};

interface Props { stats: LeadStats | null; }

export const SourceDistribution = ({ stats }: Props) => {
  if (!stats) return null;

  const total = stats.total || 1;

  return (
    <div className="card p-6">
      <h3 className="mb-6 text-base font-semibold text-slate-900">Lead Sources</h3>
      <div className="space-y-3">
        {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((source) => {
          const found = stats.bySource.find((s) => s._id === source);
          const count = found?.count ?? 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={source} className="flex items-center gap-4">
              <div className={`h-3 w-3 shrink-0 rounded-full ${colors[source]}`} />
              <span className="flex-1 text-sm text-slate-700">{source}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${colors[source]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium text-slate-600">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
