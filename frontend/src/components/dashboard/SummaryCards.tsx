import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// The props interface must match what Index.tsx is sending
interface SummaryCardsProps {
  total: number;
  pending: number;
  resolved: number;
  in_progress?: number; // Optional to prevent crashes if not provided
}

export function SummaryCards({ total, pending, resolved, in_progress = 0 }: SummaryCardsProps) {
  // We use the props passed down from Index.tsx
  const summaryData = [
    {
      title: "Total Complaints",
      value: total,
      change: "Lifetime total",
      icon: ClipboardList,
      iconBg: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary",
    },
    {
      title: "Pending",
      value: pending,
      change: "Awaiting action",
      icon: Clock,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "In Progress",
      value: in_progress,
      change: "Being resolved",
      icon: AlertCircle,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Resolved",
      value: resolved,
      change: "Completed tasks",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card card-hover cursor-pointer"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center`}
            >
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
          <p className="font-display text-3xl font-bold text-foreground mb-1">
            {item.value}
          </p>
          <p className="text-xs text-muted-foreground">{item.change}</p>
        </div>
      ))}
    </div>
  );
}