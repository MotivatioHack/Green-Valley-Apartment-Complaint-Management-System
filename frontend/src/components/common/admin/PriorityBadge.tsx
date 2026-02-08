import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical' | 'normal' | 'important' | 'urgent';
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'bg-muted/50 text-muted-foreground border border-muted-foreground/30',
  },
  medium: {
    label: 'Medium',
    className: 'bg-primary/20 text-primary border border-primary/30',
  },
  high: {
    label: 'High',
    className: 'bg-warning/20 text-warning border border-warning/30',
  },
  critical: {
    label: 'Critical',
    className: 'bg-destructive/20 text-destructive border border-destructive/30',
  },
  normal: {
    label: 'Normal',
    className: 'bg-muted/50 text-muted-foreground border border-muted-foreground/30',
  },
  important: {
    label: 'Important',
    className: 'bg-warning/20 text-warning border border-warning/30',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-destructive/20 text-destructive border border-destructive/30',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
