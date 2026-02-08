import { useState, useEffect } from "react";
import axios from "axios";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  AlertTriangle,
  Calendar,
  Info,
  Megaphone,
  Pin,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Notice {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  pinned: boolean | number; // Handling boolean or 0/1 from MySQL
}

const typeConfig: Record<string, { icon: typeof AlertTriangle; label: string; bg: string; border: string; iconColor: string }> = {
  emergency: {
    icon: AlertTriangle,
    label: "Emergency",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
  },
  event: {
    icon: Calendar,
    label: "Event",
    bg: "bg-primary-light dark:bg-primary/10",
    border: "border-primary/20",
    iconColor: "text-primary",
  },
  info: {
    icon: Info,
    label: "Information",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/notices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotices(response.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(
    (n) => filter === "all" || n.type === filter
  );

  const pinnedNotices = filteredNotices.filter((n) => n.pinned === true || n.pinned === 1);
  const otherNotices = filteredNotices.filter((n) => n.pinned === false || n.pinned === 0);

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Society Notices
        </h1>
        <p className="text-muted-foreground">
          Stay updated with important announcements and events.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "all", label: "All" },
          { id: "emergency", label: "Emergency" },
          { id: "event", label: "Events" },
          { id: "announcement", label: "Announcements" },
          { id: "info", label: "Information" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-white dark:bg-gray-800 text-muted-foreground hover:bg-muted dark:hover:bg-gray-700 shadow-sm"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {pinnedNotices.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Pinned Notices
            </span>
          </div>
          <div className="space-y-4">
            {pinnedNotices.map((notice) => {
              const config = typeConfig[notice.type] || typeConfig.info;
              return (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice)}
                  className={`${config.bg} border-2 ${config.border} rounded-2xl p-6 transition-all hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <config.icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.iconColor} border ${config.border}`}>
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(notice.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {otherNotices.length > 0 && (
        <div>
          <span className="text-sm font-medium text-foreground mb-4 block">
            Recent Notices
          </span>
          <div className="space-y-4">
            {otherNotices.map((notice) => {
              const config = typeConfig[notice.type] || typeConfig.info;
              return (
                <div
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6 transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <config.icon className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.iconColor}`}>
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notice.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-medium text-foreground mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredNotices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-border">
          <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No notices found in this category.</p>
        </div>
      )}

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {selectedNotice?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const config = typeConfig[selectedNotice.type] || typeConfig.info;
                  return (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.iconColor} border ${config.border}`}>
                        {config.label}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(selectedNotice.date).toLocaleDateString()}
                      </span>
                    </>
                  );
                })()}
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedNotice.description}
              </p>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Issued officially by Society Management
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notices;