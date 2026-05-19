import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState = ({
  title = 'No results found',
  description = 'There are no items to display.',
  action,
  icon,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      {icon ?? <Inbox className="h-8 w-8" />}
    </div>
    <h3 className="mb-1 text-base font-semibold text-slate-900">{title}</h3>
    <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
    {action}
  </div>
);
