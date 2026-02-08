import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string; // Changed to string to handle various database formats safely
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'status-progress',
  },
  resolved: {
    label: 'Resolved',
    className: 'status-resolved',
  },
  rejected: {
    label: 'Rejected',
    className: 'status-rejected',
  },
  active: {
    label: 'Active',
    className: 'status-resolved',
  },
  inactive: {
    label: 'Inactive',
    className: 'status-rejected',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Defensive logic: Normalize status string to lowercase and handle spaces for mapping
  // This prevents the "Cannot read properties of undefined (reading 'className')" error
  const normalizedStatus = (status || '').toLowerCase().replace(/\s+/g, '-');
  
  // Use config if found, otherwise default to a generic style to prevent crash
  const config = statusConfig[normalizedStatus] || {
    label: status || 'Unknown',
    className: 'bg-muted text-muted-foreground border-muted-foreground/20',
  };

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}