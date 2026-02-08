import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, X, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [navData, setNavData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 1. FETCH DYNAMIC DATA FROM DATABASE
  const fetchNavbarData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/navbar/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setNavData(data);
      }
    } catch (error) {
      console.error("Navbar sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavbarData();
    // Refresh data every 30 seconds for live notification counts
    const interval = setInterval(fetchNavbarData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. LOGOUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out safely');
    navigate('/login');
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <header className="glass-navbar h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search complaints, residents, staff..."
          className="cyber-input w-full pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {navData?.notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse-glow" />
            )}
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div
              ref={panelRef}
              className="absolute right-0 top-12 w-80 cyber-card border border-primary/30 shadow-lg z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <h3 className="text-sm font-semibold text-foreground">Pending Actions</h3>
                <button onClick={() => setShowNotifications(false)} className="p-1 rounded hover:bg-primary/10 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {navData?.recentActivity?.length > 0 ? (
                  navData.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="p-4 border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase">
                        {new Date(activity.time).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground">No pending notifications</div>
                )}
              </div>
              <div className="p-3 text-center border-t border-primary/20">
                <span className="text-xs text-primary cursor-pointer hover:underline" onClick={() => navigate('/admin/complaints')}>
                  View all complaints
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3 pl-4 border-l border-primary/20">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {loading ? '...' : (navData?.profile?.name || 'Admin')}
            </p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
              {navData?.profile?.role || 'Super Admin'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="w-5 h-5 text-primary" />
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </header>
  );
}