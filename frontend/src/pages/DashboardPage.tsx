import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusDistribution } from '@/components/dashboard/StatusDistribution';
import { SourceDistribution } from '@/components/dashboard/SourceDistribution';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { leads, stats, isLoading, fetchLeads, fetchStats, resetFilters } = useLeadStore();

  useEffect(() => {
    resetFilters();
    fetchLeads();
    fetchStats();
  }, [fetchLeads, fetchStats, resetFilters]);

  const qualifiedCount = stats?.byStatus.find((s) => s._id === 'Qualified')?.count ?? 0;
  const lostCount = stats?.byStatus.find((s) => s._id === 'Lost')?.count ?? 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-9 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Leads"
              value={stats?.total ?? 0}
              icon={<Users className="h-6 w-6 text-indigo-600" />}
              iconBg="bg-indigo-50"
              subtitle="All time"
            />
            <StatCard
              title="New Leads"
              value={stats?.byStatus.find((s) => s._id === 'New')?.count ?? 0}
              icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
              iconBg="bg-blue-50"
              subtitle="Awaiting contact"
            />
            <StatCard
              title="Qualified"
              value={qualifiedCount}
              icon={<CheckCircle className="h-6 w-6 text-green-600" />}
              iconBg="bg-green-50"
              subtitle="Ready to close"
            />
            <StatCard
              title="Lost"
              value={lostCount}
              icon={<XCircle className="h-6 w-6 text-red-500" />}
              iconBg="bg-red-50"
              subtitle="Not converted"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <div className="card p-6"><Skeleton className="h-48 w-full" /></div>
            <div className="card p-6"><Skeleton className="h-48 w-full" /></div>
          </>
        ) : (
          <>
            <StatusDistribution stats={stats} />
            <SourceDistribution stats={stats} />
          </>
        )}
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">Recent Leads</h3>
          <Link to="/dashboard/leads">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No leads yet. Start by adding one!</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  {['Name', 'Email', 'Status', 'Source', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-900">{lead.name}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-500">{lead.email}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={lead.status} /></td>
                    <td className="px-6 py-3.5"><SourceBadge source={lead.source} /></td>
                    <td className="px-6 py-3.5 text-sm text-slate-400">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
