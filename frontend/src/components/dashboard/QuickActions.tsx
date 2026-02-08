import { Link } from "react-router-dom";
import {
  MessageSquarePlus,
  FileText,
  Phone,
  Wrench,
} from "lucide-react";

const actions = [
  {
    title: "Raise Complaint",
    description: "Report an issue in your society",
    icon: MessageSquarePlus,
    path: "/user/raise-complaint", // ✅ Path updated to match your router
    accent: true,
  },
  {
    title: "View Notices",
    description: "Check latest announcements",
    icon: FileText,
    path: "/user/notices", // ✅ Path updated
  },
  {
    title: "Emergency Contact",
    description: "24/7 helpline numbers",
    icon: Phone,
    path: "/user/emergency-contact", // ✅ Path updated
  },
  {
    title: "Book Amenity",
    description: "Reserve club house, gym etc.",
    icon: Wrench,
    path: "/user/book-amenity", // ✅ Path updated
  },
];

export function QuickActions() {
  return (
    <div className="mb-6">
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className={`group relative rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 ${
              action.accent
                ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg hover:shadow-xl"
                : "bg-white dark:bg-gray-800 text-foreground shadow-card hover:shadow-floating"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                action.accent ? "bg-white/20" : "bg-primary/10 dark:bg-primary/20"
              }`}
            >
              <action.icon
                className={`w-5 h-5 ${action.accent ? "text-white" : "text-primary"}`}
              />
            </div>
            <h3
              className={`font-medium text-sm mb-1 ${
                action.accent ? "text-white" : "text-foreground"
              }`}
            >
              {action.title}
            </h3>
            <p
              className={`text-xs ${
                action.accent ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}