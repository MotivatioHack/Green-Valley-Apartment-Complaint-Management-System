import { useState, useEffect } from "react";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Droplets,
  Lightbulb,
  Volume2,
  Car,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

// Helper to map category strings to icons
const getCategoryIcon = (category: string) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("plumb")) return Droplets;
  if (cat.includes("elect")) return Lightbulb;
  if (cat.includes("park")) return Car;
  if (cat.includes("noise") || cat.includes("sound")) return Volume2;
  return MessageCircle;
};

const statusStyles: Record<string, string> = {
  Pending: "status-pending",
  "In Progress": "status-in-progress",
  Resolved: "status-resolved",
  Rejected: "status-rejected",
};

const priorityStyles: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface Complaint {
  id: number;
  title: string;
  category: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  admin_remark: string | null;
}

const MyComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      // ✅ FIX: Updated URL to match unified backend route
      const response = await fetch("https://green-valley-apartment-complaint.onrender.com/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Ensure data is an array before setting state to avoid crashes
        setComplaints(Array.isArray(data) ? data : []);
      } else {
        console.error("Backend returned error:", data.message);
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch = 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton />
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          My Complaints
        </h1>
        <p className="text-muted-foreground">
          Track and manage all your submitted complaints.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted dark:bg-gray-700 border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-muted dark:bg-gray-700 border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComplaints.map((complaint) => {
          const Icon = getCategoryIcon(complaint.category);
          return (
            <div
              key={complaint.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-muted/30 dark:hover:bg-gray-700/30 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === complaint.id ? null : complaint.id)
                }
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        CMP-{complaint.id.toString().padStart(3, '0')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[complaint.status] || "status-pending"}`}
                      >
                        {complaint.status}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[complaint.priority] || priorityStyles.medium}`}
                      >
                        {(complaint.priority || "medium").charAt(0).toUpperCase() + (complaint.priority || "medium").slice(1)} Priority
                      </span>
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {complaint.category} • Submitted: {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {expandedId === complaint.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === complaint.id && (
                <div className="border-t border-border dark:border-gray-700 p-5 bg-muted/20 dark:bg-gray-700/20 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        Description
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Admin Remark
                      </h4>
                      <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-border dark:border-gray-700">
                        <p className="text-sm text-muted-foreground italic">
                          {complaint.admin_remark || "No remarks from admin yet."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No complaints found.</p>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;