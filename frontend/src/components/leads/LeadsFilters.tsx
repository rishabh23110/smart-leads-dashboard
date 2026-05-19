import { useEffect, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useLeadStore } from '@/store/leadStore';
import { useDebounce } from '@/hooks/useDebounce';
import { LeadStatus, LeadSource, SortOrder } from '@/types';
import { Button } from '@/components/ui/Button';

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadsFilters = () => {
  const { filters, setFilters, resetFilters } = useLeadStore();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  const hasActiveFilters = filters.search || filters.status || filters.source || filters.sort !== 'latest';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(''); setFilters({ search: '' }); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as LeadStatus | '' })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Source filter */}
        <select
          value={filters.source}
          onChange={(e) => setFilters({ source: e.target.value as LeadSource | '' })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ sort: e.target.value as SortOrder })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-slate-500">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters active</span>
          {filters.status && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 font-medium">
              {filters.status}
            </span>
          )}
          {filters.source && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 font-medium">
              {filters.source}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
