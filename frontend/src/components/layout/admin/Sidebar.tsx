import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  UserCog,
  Bell,
  BarChart3,
  User,
  LogOut,
  Shield,
  Phone,
  Building,
} from 'lucide-react';

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/complaints', label: 'All Complaints', icon: FileText },
  { path: '/admin/complaint-control', label: 'Complaint Control', icon: Settings },
  { path: '/admin/residents', label: 'Residents', icon: Users },
  { path: '/admin/staff-management', label: 'Staff Management', icon: UserCog },
  { path: '/admin/notices', label: 'Notices', icon: Bell },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { path: '/admin/emergency-contacts', label: 'Emergency Contacts', icon: Phone },
  { path: '/admin/amenity-management', label: 'Amenity Management', icon: Building },
  { path: '/admin/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-gradient border-r border-primary/20 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center cyber-glow">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground cyber-text-glow">
              SOCIETY
            </h1>
            <p className="text-xs text-muted-foreground">Control Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-primary/20">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </div>

      {/* Decorative glow line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
    </aside>
  );
}
