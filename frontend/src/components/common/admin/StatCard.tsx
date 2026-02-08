import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'success' | 'danger';
  className?: string;
}

const variantConfig = {
  default: 'border-primary/20',
  primary: 'border-primary/40',
  warning: 'border-warning/40',
  success: 'border-success/40',
  danger: 'border-destructive/40',
};

const iconVariantConfig = {
  default: 'bg-primary/20 text-primary',
  primary: 'bg-primary/20 text-primary',
  warning: 'bg-warning/20 text-warning',
  success: 'bg-success/20 text-success',
  danger: 'bg-destructive/20 text-destructive',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card', variantConfig[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-sm mt-2',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconVariantConfig[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
