import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/user/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";

// Public Pages
import Index from "./pages/Home/Index";
import About from "./pages/Home/About";
import Complaints from "./pages/Home/Complaints";
import Notices from "./pages/Home/Notices";
import Facilities from "./pages/Home/Facilities";
import Contact from "./pages/Home/Contact";
import Login from "./pages/Home/Login";
import Register from "./pages/Home/Register";
import PrivacyPolicy from "./pages/Home/PrivacyPolicy";
import TermsOfUse from "./pages/Home/TermsOfUse";
import NotFound from "./pages/Home/NotFound";

// User Dashboard Layout
import { DashboardLayout } from "./components/layout/user/DashboardLayout";

// User Dashboard Pages (NESTED)
import UserDashboardHome from "./pages/user/Index";
import RaiseComplaint from "./pages/user/RaiseComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import UserNotices from "./pages/user/Notices";
import Profile from "./pages/user/Profile";
import EmergencyContact from "./pages/user/EmergencyContact";
import BookAmenity from "./pages/user/BookAmenity";

// Admin Dashboard Layout + Pages
import { DashboardLayout as AdminDashboardLayout } from "@/components/layout/admin/DashboardLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminComplaints from "@/pages/admin/Complaints";
import NoticesAdmin from "@/pages/admin/Notices";
import Residents from "@/pages/admin/Residents";
import Reports from "@/pages/admin/Reports";
import ProfileAdmin from "@/pages/admin/Profile";
import StaffManagement from "@/pages/admin/StaffManagement";
import ComplaintControl from "@/pages/admin/ComplaintControl";
import AmenityManagement from "@/pages/admin/AmenityManagement";
import EmergencyContacts from "@/pages/admin/EmergencyContacts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          {/* 🔹 Global scroll reset on route change */}
          <ScrollToTop />

          <Routes>
            {/* ---------------- Public Routes ---------------- */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />

            {/* ---------------- User Dashboard Routes ---------------- */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRole="USER">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<UserDashboardHome />} />
              <Route path="raise-complaint" element={<RaiseComplaint />} />
              <Route path="my-complaints" element={<MyComplaints />} />
              <Route path="notices" element={<UserNotices />} />
              <Route path="profile" element={<Profile />} />
              <Route path="emergency-contact" element={<EmergencyContact />} />
              <Route path="book-amenity" element={<BookAmenity />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ---------------- Admin Dashboard Routes ---------------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="notices" element={<NoticesAdmin />} />
              <Route path="residents" element={<Residents />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<ProfileAdmin />} />
              <Route path="staff-management" element={<StaffManagement />} />
              <Route path="complaint-control" element={<ComplaintControl />} />
              <Route path="amenity-management" element={<AmenityManagement />} />
              <Route path="emergency-contacts" element={<EmergencyContacts />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* ---------------- Fallback ---------------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
