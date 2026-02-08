import { useState, useEffect } from "react";
import { Bell, ChevronDown, Sun, Moon, Loader2 } from "lucide-react";
import { useTheme } from "@/context/user/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<{
    name: string;
    flat_number: string;
    tower_number: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavbarProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://green-valley-apartment-complaint.onrender.com/api/user/profile/navbar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Navbar Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbarProfile();
  }, []);

  // Generate initials from name (e.g., "Rajesh Sharma" -> "RS")
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 flex items-center justify-end">
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-card flex items-center justify-center hover:shadow-floating transition-all"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-accent" />
          )}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => navigate("/user/notices")}
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-card flex items-center justify-center hover:shadow-floating transition-all"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Profile */}
        <button 
          onClick={() => navigate("/user/profile")}
          className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-card hover:shadow-floating transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.flat_number ? `${user.flat_number}, ${user.tower_number}` : "No unit assigned"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user ? getInitials(user.name) : "?"}
                </span>
              </div>
            </>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}