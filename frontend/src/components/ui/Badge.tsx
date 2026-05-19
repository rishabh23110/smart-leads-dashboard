import { cn } from '@/utils/cn';
import { LeadStatus, LeadSource } from '@/types';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Contacted: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  Qualified: 'bg-green-50 text-green-700 ring-green-600/20',
  Lost: 'bg-red-50 text-red-700 ring-red-600/20',
};

const sourceStyles: Record<LeadSource, string> = {
  Website: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  Instagram: 'bg-pink-50 text-pink-700 ring-pink-600/20',
  Referral: 'bg-teal-50 text-teal-700 ring-teal-600/20',
};

interface StatusBadgeProps { status: LeadStatus; }
interface SourceBadgeProps { source: LeadSource; }

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', statusStyles[status])}>
    {status}
  </span>
);

export const SourceBadge = ({ source }: SourceBadgeProps) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', sourceStyles[source])}>
    {source}
  </span>
);
