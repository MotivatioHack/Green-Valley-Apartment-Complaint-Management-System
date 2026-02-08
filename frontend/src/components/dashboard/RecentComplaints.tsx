import { Link } from "react-router-dom";
import { ArrowRight, Droplets, Lightbulb, Volume2, Car, MessageCircle, Shield, Trees, HelpCircle } from "lucide-react";

// Helper to map category strings from database to icons
const getCategoryIcon = (category: string) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("plumb")) return Droplets;
  if (cat.includes("elect")) return Lightbulb;
  if (cat.includes("park")) return Car;
  if (cat.includes("noise") || cat.includes("sound")) return Volume2;
  if (cat.includes("secu")) return Shield;
  if (cat.includes("gard")) return Trees;
  return HelpCircle;
};

const statusStyles: Record<string, string> = {
  Pending: "status-pending",
  "In Progress": "status-in-progress",
  Resolved: "status-resolved",
  Rejected: "status-rejected",
};

// Interface defining the data shape from Index.tsx
interface Complaint {
  id: number;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

interface RecentComplaintsProps {
  complaints: Complaint[];
}

export function RecentComplaints({ complaints }: RecentComplaintsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Recent Complaints
        </h2>
        <Link
          to="/user/my-complaints"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {complaints.length > 0 ? (
          complaints.map((complaint) => {
            const Icon = getCategoryIcon(complaint.category);
            return (
              <div
                key={complaint.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 dark:bg-gray-700/50 hover:bg-muted dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      CMP-{complaint.id.toString().padStart(3, '0')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[complaint.status] || "status-pending"}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground text-sm truncate">
                    {complaint.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {complaint.category} • {new Date(complaint.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No recent complaints found.
          </div>
        )}
      </div>
    </div>
  );
}