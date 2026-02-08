import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Lock, Save, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // 1. FETCH PROFILE DATA
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setProfile({
          id: data.id || '',
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || '',
          department: data.department || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. UPDATE PROFILE DETAILS
  const handleProfileUpdate = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/profile/update', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          department: profile.department
        })
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        fetchProfile(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. CHANGE PASSWORD
  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/profile/password', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Password update failed');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="cyber-card p-6 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
              <User className="w-16 h-16 text-primary" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/80 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{profile.name}</h2>
          <p className="text-primary mb-1 uppercase text-xs font-bold tracking-widest">{profile.role}</p>
          <p className="text-muted-foreground text-xs mb-4 font-mono">ID: {profile.id}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {profile.phone || 'Not set'}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              {profile.department || 'Management'}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Edit Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                className="cyber-input w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email (Read-only)</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="cyber-input w-full opacity-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                className="cyber-input w-full"
                placeholder="+91..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile((prev) => ({ ...prev, department: e.target.value }))}
                className="cyber-input w-full"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              disabled={submitting}
              className="cyber-btn-solid w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={submitting}
              className="cyber-btn w-full flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {submitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log - Static Display as requested */}
      <div className="cyber-card p-6 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          System Actions
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Updated facility maintenance schedule', time: '2 hours ago', type: 'update' },
            { action: 'Approved amenity booking #B204', time: '4 hours ago', type: 'assign' },
            { action: 'Modified resident access rules', time: '1 day ago', type: 'create' },
            { action: 'Profile information updated', time: 'Just now', type: 'update' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-primary/10 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'update' ? 'bg-primary' : 'bg-success'
                  }`}
                />
                <span className="text-foreground">{activity.action}</span>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}