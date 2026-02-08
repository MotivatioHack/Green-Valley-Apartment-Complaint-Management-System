import { useState, useRef } from "react";
import axios from "axios";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  Droplets,
  Lightbulb,
  Car,
  Shield,
  Trees,
  HelpCircle,
  Send,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "plumbing", label: "Plumbing", icon: Droplets },
  { id: "electrical", label: "Electrical", icon: Lightbulb },
  { id: "parking", label: "Parking", icon: Car },
  { id: "security", label: "Security", icon: Shield },
  { id: "garden", label: "Garden/Landscape", icon: Trees },
  { id: "other", label: "Other", icon: HelpCircle },
];

const priorities = [
  { id: "low", label: "Low", color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" },
  { id: "medium", label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" },
  { id: "high", label: "High", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
];

const RaiseComplaint = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // States for form data
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedCategory) {
      toast({ 
        variant: "destructive", 
        title: "Missing Category", 
        description: "Please select a category before submitting." 
      });
      return;
    }

    setLoading(true);
    try {
      // Retrieve the token stored during login
      const token = localStorage.getItem("token");
      
      /**
       * ✅ FIX: Unified endpoint path
       * Matches the app.use('/api/complaints', ...) in server.js
       * and router.post('/raise', ...) in complaintRoutes.js
       */
      await axios.post(
        "http://localhost:5000/api/complaints/raise",
        { 
          title, 
          category: selectedCategory, 
          description, 
          location, 
          priority: selectedPriority 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      toast({ 
        title: "Success!", 
        description: "Your complaint has been registered successfully." 
      });
      
      // Reset form fields after successful submission
      setTitle("");
      setDescription("");
      setLocation("");
      setSelectedCategory("");
      setSelectedPriority("medium");
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Submission failed", 
        description: error.response?.data?.message || "Could not connect to the server." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Raise a Complaint</h1>
        <p className="text-muted-foreground">Report an issue and our team will address it promptly.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Category Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">Select Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCategory === cat.label ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <cat.icon className={`w-6 h-6 mb-2 mx-auto ${selectedCategory === cat.label ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium block text-center">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-5">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title of your complaint"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary/20"
              />
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g., Near Lift Lobby)"
                className="w-full px-4 py-2.5 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Priority UI */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <label className="block text-sm font-medium mb-3">Priority Level</label>
              <div className="space-y-3">
                {priorities.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPriority(p.id)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      selectedPriority === p.id ? p.color : "border-border"
                    }`}
                  >
                    <span className="font-medium text-sm">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RaiseComplaint;