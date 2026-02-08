import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
  flatNo?: string;
  societyName?: string;
}

export function WelcomeBanner({ 
  userName = "Resident", 
  flatNo = "N/A", 
  societyName = "SocietyHub Community" 
}: WelcomeBannerProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good Morning" : currentHour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 md:p-8 text-white mb-6">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-white/80 text-sm">Resident Portal</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          {greeting}, {userName}!
        </h1>
        <p className="text-white/80 max-w-lg">
          Welcome to {societyName}. Track your complaints, view notices, and stay connected with your community.
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
            <p className="text-xs text-white/70">Your Flat</p>
            <p className="font-semibold">{flatNo}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
            <p className="text-xs text-white/70">Society</p>
            <p className="font-semibold">{societyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}