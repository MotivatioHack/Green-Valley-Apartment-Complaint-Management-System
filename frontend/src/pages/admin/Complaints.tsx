import { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { Search, Filter, Eye, X, Save, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  
  const [editStatus, setEditStatus] = useState<string>('');
  const [editRemark, setEditRemark] = useState<string>('');
  const [editAssignedTo, setEditAssignedTo] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredStaff = async (category: string) => {
    try {
      const token = localStorage.getItem('token');
      // Dynamic fetch based on the category of the currently opened complaint
      const response = await fetch(`http://localhost:5000/api/admin/complaints/staff?category=${encodeURIComponent(category)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Staff Fetch Error:", error);
      setStaffList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredComplaints = Array.isArray(complaints) ? complaints.filter((complaint) => {
    const title = complaint.title || '';
    const id = (complaint.id || '').toString();
    const flat = complaint.flatNo || '';
    const status = complaint.status || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase()) ||
      flat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const handleOpenComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
    setEditStatus((complaint.status || '').toLowerCase().replace(/\s+/g, '-'));
    setEditRemark(complaint.admin_remark || '');
    // Ensure assigned staff is pre-selected if it exists in DB
    setEditAssignedTo(complaint.staff_id ? complaint.staff_id.toString() : '');
    // Trigger staff fetch filtered by category
    fetchFilteredStaff(complaint.category);
  };

  const handleSaveChanges = async () => {
    if (!selectedComplaint) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/complaints/${selectedComplaint.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: editStatus,
          admin_remark: editRemark,
          staff_id: editAssignedTo || null // Correctly passes null if 'Not Assigned'
        })
      });

      if (response.ok) {
        toast.success(`Complaint #${selectedComplaint.id} updated successfully`);
        setSelectedComplaint(null);
        fetchData(); // Sync list with DB
      } else {
        toast.error("Failed to update on server");
      }
    } catch (error) {
      toast.error("Network error updating complaint");
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (complaint: any) => (
        <span className="text-primary font-mono">{complaint.id}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (complaint: any) => (
        <div>
          <span className="font-medium block">{complaint.title}</span>
          <span className="text-xs text-muted-foreground capitalize">{complaint.category}</span>
        </div>
      ),
    },
    {
      key: 'residentName',
      header: 'Resident',
      render: (complaint: any) => (
        <div>
          <span className="block">{complaint.residentName}</span>
          <span className="text-xs text-muted-foreground">{complaint.flatNo}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (complaint: any) => <PriorityBadge priority={complaint.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (complaint: any) => <StatusBadge status={complaint.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (complaint: any) => (
        <span className="text-muted-foreground text-sm">
          {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (complaint: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenComplaint(complaint);
          }}
          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (loading && complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Fetching complaints...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          All Complaints
        </h1>
        <p className="text-muted-foreground">
          View and manage all society complaints
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID, title, or flat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cyber-input w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cyber-input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="cyber-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{complaints.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="cyber-card p-4 text-center border-warning/30">
          <p className="text-2xl font-bold text-warning">
            {complaints.filter((c: any) => (c.status || '').toLowerCase() === 'pending').length}
          </p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="cyber-card p-4 text-center border-primary/30">
          <p className="text-2xl font-bold text-primary">
            {complaints.filter((c: any) => (c.status || '').toLowerCase() === 'in progress').length}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="cyber-card p-4 text-center border-success/30">
          <p className="text-2xl font-bold text-success">
            {complaints.filter((c: any) => (c.status || '').toLowerCase() === 'resolved').length}
          </p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      <DataTable data={filteredComplaints} columns={columns} />

      {selectedComplaint && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-3xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedComplaint.title}
                </h2>
                <p className="text-sm text-primary font-mono">#{selectedComplaint.id}</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Resident</p>
                <p className="text-foreground">{selectedComplaint.residentName}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Flat</p>
                <p className="text-foreground">{selectedComplaint.flatNo}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Category</p>
                <p className="text-foreground capitalize">{selectedComplaint.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Priority</p>
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-foreground bg-muted/30 p-4 rounded-lg">
                {selectedComplaint.description}
              </p>
            </div>

            <div className="border-t border-primary/20 pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Manage Complaint
              </h3>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  Change Status
                  <ArrowRight className="w-4 h-4" />
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setEditStatus(option.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        editStatus === option.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-primary/20 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Assign Staff (Specialists for {selectedComplaint.category})
                </p>
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="cyber-input w-full"
                >
                  <option value="">Not Assigned</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id.toString()}>
                      {staff.name} - {staff.department}
                    </option>
                  ))}
                </select>
                {staffList.length === 0 && (
                  <p className="text-xs text-warning mt-1 italic">No staff available for this category.</p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Admin Response / Remark (Visible to Resident)
                </p>
                <textarea
                  value={editRemark}
                  onChange={(e) => setEditRemark(e.target.value)}
                  placeholder="Add your response or remark here..."
                  className="cyber-input w-full h-24 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedComplaint(null)} className="cyber-btn">
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="cyber-btn-solid flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}