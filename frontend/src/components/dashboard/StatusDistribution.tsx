import { LeadStats, LeadStatus } from '@/types';

const colors: Record<LeadStatus, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-yellow-500',
  Qualified: 'bg-green-500',
  Lost: 'bg-red-500',
};

const textColors: Record<LeadStatus, string> = {
  New: 'text-blue-600',
  Contacted: 'text-yellow-600',
  Qualified: 'text-green-600',
  Lost: 'text-red-600',
};

interface Props { stats: LeadStats | null; }

export const StatusDistribution = ({ stats }: Props) => {
  if (!stats) return null;

  const total = stats.total || 1;

  return (
    <div className="card p-6">
      <h3 className="mb-6 text-base font-semibold text-slate-900">Lead Status Breakdown</h3>
      <div className="space-y-4">
        {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((status) => {
          const found = stats.byStatus.find((s) => s._id === status);
          const count = found?.count ?? 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={status}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className={`text-sm font-medium ${textColors[status]}`}>{status}</span>
                <span className="text-sm text-slate-500">{count} ({pct}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${colors[status]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
