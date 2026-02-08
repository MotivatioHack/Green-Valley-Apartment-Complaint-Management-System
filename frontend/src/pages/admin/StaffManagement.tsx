import { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { Search, Plus, Edit, Trash2, X, UserCog, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: '', email: '', phone: '', role: '', department: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    const method = editingStaff ? 'PUT' : 'POST';
    const url = editingStaff 
      ? `https://green-valley-apartment-complaint.onrender.com/api/admin/staff/${editingStaff.id}` 
      : 'https://green-valley-apartment-complaint.onrender.com/api/admin/staff';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingStaff ? 'Staff updated' : 'Staff added');
        setIsModalOpen(false);
        fetchStaff();
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Staff removed');
      fetchStaff();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/staff/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchStaff();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (member: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
            <span className="text-secondary font-medium">
              {(member.name || '').charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (member: any) => (
        <div>
          <p className="font-medium text-foreground">{member.role}</p>
          <p className="text-xs text-muted-foreground">{member.department}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (member: any) => (
        <span className="text-muted-foreground">{member.phone}</span>
      ),
    },
    {
      key: 'assignedComplaints',
      header: 'Assigned',
      render: (member: any) => (
        <span className="text-primary font-medium">{member.assignedComplaints || 0}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (member: any) => (
        <button onClick={() => toggleStatus(member.id)}>
          <StatusBadge status={member.status} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (member: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(member);
            }}
            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(member.id);
            }}
            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const departments = ['Maintenance', 'Electrical', 'Plumbing', 'Sanitation', 'Security'];

  if (loading && staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Syncing staff records...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage society staff members
          </p>
        </div>
        <button onClick={openAddModal} className="cyber-btn-solid flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-secondary/20">
            <UserCog className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{staff.length}</p>
            <p className="text-sm text-muted-foreground">Total Staff</p>
          </div>
        </div>
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/20">
            <Briefcase className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {staff.filter((s) => s.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <UserCog className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {staff.reduce((acc, s) => acc + (s.assignedComplaints || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Assigned</p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, role, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cyber-input w-full max-w-md pl-10"
        />
      </div>

      <DataTable data={filteredStaff} columns={columns} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingStaff ? 'Edit Staff' : 'Add Staff'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="cyber-input w-full"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="cyber-input w-full"
                  placeholder="email@society.com"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="cyber-input w-full"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  className="cyber-input w-full"
                  placeholder="e.g., Technician, Supervisor"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  className="cyber-input w-full"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="cyber-btn">Cancel</button>
              <button onClick={handleSubmit} className="cyber-btn-solid">
                {editingStaff ? 'Update' : 'Add'} Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}