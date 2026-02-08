import { useState, useEffect } from "react";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentComplaints } from '@/components/dashboard/RecentComplaints';
import { UpcomingNotices } from "@/components/dashboard/UpcomingNotices";
import axios from "axios";

const Index = () => {
  const [data, setData] = useState({
    user: { name: "", flat_no: "", society_name: "" },
    summary: { totalComplaints: 0, resolvedComplaints: 0, pendingComplaints: 0, in_progress: 0 },
    recentComplaints: [],
    upcomingNotices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 1. Fetch unified overview data from backend
        const response = await axios.get("http://localhost:5000/api/user/dashboard/overview", {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        
        // 2. Map backend response to state with strict fallback values to prevent crashes
        if (response.data) {
          setData({
            user: {
              name: response.data.user?.name || "Resident",
              flat_no: response.data.user?.flat_no || "N/A",
              society_name: response.data.user?.society_name || "Society Management"
            },
            summary: {
              totalComplaints: Number(response.data.summary?.totalComplaints) || 0,
              resolvedComplaints: Number(response.data.summary?.resolvedComplaints) || 0,
              pendingComplaints: Number(response.data.summary?.pendingComplaints) || 0,
              in_progress: Number(response.data.summary?.in_progress) || 0
            },
            recentComplaints: Array.isArray(response.data.recentComplaints) ? response.data.recentComplaints : [],
            upcomingNotices: Array.isArray(response.data.upcomingNotices) ? response.data.upcomingNotices : []
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch dashboard overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Dynamic Welcome Banner - Uses Profile Data */}
      <WelcomeBanner 
        userName={data.user.name} 
        flatNo={data.user.flat_no} 
        societyName={data.user.society_name} 
      />
      
      {/* 2. Dynamic Summary Cards - Uses Aggregate Counts */}
      <SummaryCards 
        total={data.summary.totalComplaints}
        resolved={data.summary.resolvedComplaints}
        pending={data.summary.pendingComplaints}
        in_progress={data.summary.in_progress}
      />
      
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Dynamic Complaints Preview - Uses User-specific list */}
        <RecentComplaints complaints={data.recentComplaints} />
        
        {/* 4. Dynamic Notices Preview - Uses Global Notices list */}
        <UpcomingNotices notices={data.upcomingNotices} />
      </div>
    </>
  );
};

export default Index;