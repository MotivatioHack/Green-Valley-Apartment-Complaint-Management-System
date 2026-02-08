import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Calendar, Info } from "lucide-react";

const typeConfig: Record<string, { icon: typeof AlertTriangle; bg: string; iconColor: string }> = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  event: {
    icon: Calendar,
    bg: "bg-primary/10 dark:bg-primary/20",
    iconColor: "text-primary",
  },
  info: {
    icon: Info,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

interface Notice {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
}

// ✅ Updated to accept notices as a prop from Index.tsx
interface UpcomingNoticesProps {
  notices: Notice[];
}

export function UpcomingNotices({ notices = [] }: UpcomingNoticesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Latest Notices
        </h2>
        <Link
          to="/user/notices"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => {
            // Default to 'info' if the backend type doesn't match config
            const config = typeConfig[notice.type?.toLowerCase()] || typeConfig.info;
            
            return (
              <div
                key={notice.id}
                className="p-4 rounded-xl border border-border dark:border-gray-700 hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <config.icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {notice.description}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {new Date(notice.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
             <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Info className="w-6 h-6 text-muted-foreground" />
             </div>
             <p className="text-muted-foreground text-sm italic">No recent notices available.</p>
          </div>
        )}
      </div>
    </div>
  );
}