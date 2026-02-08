import { useState, useEffect } from "react";
import axios from "axios";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  User,
  Mail,
  Home,
  Edit3,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    flat_number: "",
    tower_number: "",
  });

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          flat_number: response.data.flat_number || "",
          tower_number: response.data.tower_number || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/user/profile",
        {
          name: formData.name,
          flat_number: formData.flat_number,
          tower_number: formData.tower_number,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not update profile information.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-display font-bold text-white">
                {formData.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
              </span>
            </div>
            <h2 className="font-display font-semibold text-xl text-foreground mb-1">
              {formData.name}
            </h2>

            <div className="space-y-3 text-left mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-gray-700/50">
                <Home className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">
                    {formData.tower_number} - {formData.flat_number}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2">
          {/* Editable Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground">
                Contact Information
              </h3>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="form-label flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="form-input disabled:bg-muted dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="form-label flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="form-input bg-muted dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    Tower
                  </label>
                  <input
                    type="text"
                    value={formData.tower_number}
                    onChange={(e) =>
                      setFormData({ ...formData, tower_number: e.target.value })
                    }
                    disabled={!isEditing}
                    className="form-input disabled:bg-muted dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="form-label flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    Flat Number
                  </label>
                  <input
                    type="text"
                    value={formData.flat_number}
                    onChange={(e) =>
                      setFormData({ ...formData, flat_number: e.target.value })
                    }
                    disabled={!isEditing}
                    className="form-input disabled:bg-muted dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;