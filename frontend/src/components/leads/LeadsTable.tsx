import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/formatters';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/formatters';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadsTable = ({ leads, isLoading, onView, onEdit, onDelete }: LeadsTableProps) => {
  const { user } = useAuthStore();

  if (isLoading) return <TableSkeleton rows={8} />;

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Try adjusting your filters or add a new lead to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            {['Lead', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {leads.map((lead) => {
            const isOwner =
              typeof lead.createdBy === 'object'
                ? lead.createdBy._id === user?._id
                : lead.createdBy === user?._id;
            const canEdit = user?.role === 'admin' || isOwner;

            return (
              <tr
                key={lead._id}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                {/* Lead info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-semibold text-white">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={lead.status} />
                </td>

                <td className="px-6 py-4">
                  <SourceBadge source={lead.source} />
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {formatDate(lead.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(lead)}
                      title="View"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(lead)}
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {user?.role === 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(lead)}
                        title="Delete"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
