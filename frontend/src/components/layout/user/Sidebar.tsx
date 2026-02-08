import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquarePlus,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
  { icon: MessageSquarePlus, label: "Raise Complaint", path: "/user/raise-complaint" },
  { icon: ClipboardList, label: "My Complaints", path: "/user/my-complaints" },
  { icon: Bell, label: "Notices", path: "/user/notices" },
  { icon: Phone, label: "Emergency Contact", path: "/user/emergency-contact" },
  { icon: Wrench, label: "Book Amenity", path: "/user/book-amenity" },
  { icon: User, label: "Profile", path: "/user/profile" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen gradient-sidebar flex flex-col transition-all duration-300 z-50 shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-white text-lg leading-tight">
                SocietyHub
              </h1>
              <p className="text-white/60 text-xs">Resident Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item",
                isActive && "active",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="animate-fade-in truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={cn(
            "nav-item w-full text-white/60 hover:text-white",
            collapsed && "justify-center px-3"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-floating flex items-center justify-center text-primary hover:scale-110 transition-transform z-[60]"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}