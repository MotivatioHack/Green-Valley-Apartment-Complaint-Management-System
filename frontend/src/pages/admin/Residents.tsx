import { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { Search, Trash2, Users, Loader2, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function Residents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Residents Logic (Dynamic)
  const fetchResidents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/residents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      // Ensure data is an array before setting state
      setResidents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load residents from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // 2. Filter Logic (Search functionality)
  const filteredResidents = residents.filter(
    (resident) =>
      (resident.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resident.flatNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resident.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Toggle Status Logic (Dynamic)
  const toggleStatus = async (resident: any) => {
    const newStatus = resident.status === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/residents/${resident.id}/status`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Resident ${resident.name} is now ${newStatus}`);
        fetchResidents(); // Refresh list to reflect DB changes
      } else {
        toast.error("Failed to update status on server");
      }
    } catch (error) {
      toast.error("Network error updating status");
    }
  };

  // 4. Delete Logic (Dynamic)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This will permanently remove the resident account.")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/residents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Resident account removed from database');
        fetchResidents(); // Refresh list
      } else {
        toast.error("Failed to delete resident");
      }
    } catch (error) {
      toast.error("Network error deleting resident");
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Resident',
      render: (resident: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-medium">
              {(resident.name || 'U').charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{resident.name}</p>
            <p className="text-xs text-muted-foreground">{resident.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'flatNo',
      header: 'Flat',
      render: (resident: any) => (
        <div>
          <p className="font-medium text-foreground">{resident.flatNo || 'N/A'}</p>
          <p className="text-xs text-muted-foreground">Block {resident.block || '-'}</p>
        </div>
      ),
    },
    {
      key: 'complaints',
      header: 'Complaints',
      render: (resident: any) => (
        <span className="text-foreground font-medium">{resident.complaintCount || 0}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (resident: any) => <StatusBadge status={resident.status} />,
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (resident: any) => (
        <span className="text-muted-foreground text-sm">
          {resident.joinedAt ? new Date(resident.joinedAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (resident: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleStatus(resident)}
            title={resident.status === 'active' ? 'Deactivate' : 'Activate'}
            className={`p-2 rounded-lg transition-colors ${
              resident.status === 'active' 
              ? 'hover:bg-warning/10 text-warning' 
              : 'hover:bg-success/10 text-success'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(resident.id)}
            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading && residents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Syncing Resident Database...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
            Residents
          </h1>
          <p className="text-muted-foreground">
            Manage society resident access and monitor activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="cyber-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{residents.length}</p>
            <p className="text-sm text-muted-foreground">Total Residents</p>
          </div>
        </div>
        <div className="cyber-card p-4 flex items-center gap-4 border-success/30">
          <div className="p-3 rounded-lg bg-success/20">
            <Users className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {residents.filter((r) => r.status === 'active').length}
            </p>
            <p className="text-sm text-muted-foreground">Active Access</p>
          </div>
        </div>
        <div className="cyber-card p-4 flex items-center gap-4 border-muted">
          <div className="p-3 rounded-lg bg-muted">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {residents.filter((r) => r.status === 'inactive').length}
            </p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, flat, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cyber-input w-full max-w-md pl-10"
        />
      </div>

      <DataTable data={filteredResidents} columns={columns} />
    </>
  );
}