import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { Settings, ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ComplaintControl() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [remark, setRemark] = useState('');

  // Loads live feed from the database
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logical Handler for "Sync Status to Database" button
  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/complaints/status/${selectedComplaint.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          admin_remark: remark
        })
      });

      if (response.ok) {
        toast.success(`Complaint #${selectedComplaint.id} state synced to Database`);
        setSelectedComplaint(null);
        setNewStatus('');
        setRemark('');
        fetchData(); // Refresh the list to reflect changes immediately
      } else {
        toast.error("Sync failed");
      }
    } catch (error) {
      toast.error("Connection error during sync");
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  if (loading && complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Connecting to Complaint Database...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          Complaint Control
        </h1>
        <p className="text-muted-foreground">
          Real-time database monitor and lifecycle management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints List (Left Side) */}
        <div className="lg:col-span-2 cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Live Database Feed
          </h3>
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  // Normalizes 'In Progress' to 'in-progress' for state matching
                  setNewStatus((complaint.status || '').toLowerCase().replace(/\s+/g, '-'));
                  setRemark(complaint.admin_remark || '');
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedComplaint?.id === complaint.id
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">
                        #{complaint.id}
                      </span>
                      <PriorityBadge priority={complaint.priority} />
                    </div>
                    <h4 className="font-medium text-foreground">{complaint.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {complaint.description}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-primary/10 pt-3">
                  <span>
                    {complaint.flatNo} • {complaint.residentName}
                  </span>
                  <span className="italic">
                    Assigned: {complaint.assignedStaffName || 'Not Assigned'}
                  </span>
                </div>
              </div>
            ))}
            {complaints.length === 0 && (
              <p className="text-center py-10 text-muted-foreground">No active complaints found in database.</p>
            )}
          </div>
        </div>

        {/* Control Panel (Right Side) */}
        <div className="cyber-card p-6 h-fit sticky top-24">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Control Panel
          </h3>

          {selectedComplaint ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Transition Logic</p>
                <div className="flex items-center gap-2 text-sm">
                  <StatusBadge status={selectedComplaint.status} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  {newStatus && newStatus !== (selectedComplaint.status || '').toLowerCase().replace(/\s+/g, '-') ? (
                    <StatusBadge status={newStatus} />
                  ) : (
                    <span className="text-muted-foreground italic">New selection</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update State To:</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewStatus(option.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        newStatus === option.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-primary/20 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Admin Remark (Visible to User)
                </p>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Notes for resident dashboard..."
                  className="cyber-input w-full h-24 resize-none"
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus}
                className="cyber-btn-solid w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sync Status to Database
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-primary/10 rounded-lg">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-30 animate-pulse" />
              <p>Select a complaint from the database feed to modify its lifecycle.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}