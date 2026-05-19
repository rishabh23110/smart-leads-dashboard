import { Lead } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, isOpen, onClose }: Props) => {
  if (!lead) return null;

  const createdBy = typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-lg font-bold text-white">
            {lead.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
            <p className="text-sm text-slate-500">{lead.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Status</p>
            <StatusBadge status={lead.status} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Source</p>
            <SourceBadge source={lead.source} />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">Created By</p>
            <p className="text-sm text-slate-700">{createdBy}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">Created At</p>
            <p className="text-sm text-slate-700">{formatDate(lead.createdAt)}</p>
          </div>
          <div className="col-span-2">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">Last Updated</p>
            <p className="text-sm text-slate-700">{formatDate(lead.updatedAt)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
