import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  FileText,
  Check,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'amenities' | 'bookings' | 'maintenance';

export default function AmenityManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('amenities');
  const [amenities, setAmenities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<any | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // States for dynamic features
  const [adminRemark, setAdminRemark] = useState('');
  const [downtimeForm, setDowntimeForm] = useState({
    amenity_id: '',
    start_datetime: '',
    end_datetime: '',
    reason: 'Maintenance'
  });

  const [amenityForm, setAmenityForm] = useState({
    name: '',
    description: '',
    icon_name: 'Building',
    status: 'available',
  });

  // 1. FETCH LIVE DATA (Updated to handle nested data objects and case normalization)
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [amenityRes, bookingRes] = await Promise.all([
        fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/amenities', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/amenity-bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const amenityData = await amenityRes.json();
      const bookingData = await bookingRes.json();
      
      // FIX: Handle cases where API returns { success: true, data: [...] }
      const finalAmenities = Array.isArray(amenityData) ? amenityData : (amenityData.data || []);
      const finalBookings = Array.isArray(bookingData) ? bookingData : (bookingData.data || []);

      setAmenities(finalAmenities);
      setBookings(finalBookings);
      
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error('Failed to sync management records with database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddAmenity = () => {
    setEditingAmenity(null);
    setAmenityForm({
      name: '',
      description: '',
      icon_name: 'Building',
      status: 'available',
    });
    setShowAmenityModal(true);
  };

  const handleOpenEditAmenity = (amenity: any) => {
    setEditingAmenity(amenity);
    setAmenityForm({
      name: amenity.name,
      description: amenity.description,
      icon_name: amenity.icon_name || 'Building',
      status: amenity.status?.toLowerCase() || 'available', // Normalize casing
    });
    setShowAmenityModal(true);
  };

  const handleSaveAmenity = async () => {
    if (!amenityForm.name.trim() || !amenityForm.description.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editingAmenity ? 'PUT' : 'POST';
      const url = editingAmenity 
        ? `https://green-valley-apartment-complaint.onrender.com/api/admin/amenities/${editingAmenity.id}`
        : 'https://green-valley-apartment-complaint.onrender.com/api/admin/amenities';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(amenityForm)
      });

      if (response.ok) {
        toast.success(editingAmenity ? 'Amenity updated' : 'New amenity added');
        setShowAmenityModal(false);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to save amenity');
    }
  };

  const handleDeleteAmenity = async (id: number) => {
    if (!confirm('Permanently delete this amenity?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/amenities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Amenity deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Delete operation failed');
    }
  };

  const handleToggleAmenity = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/amenities/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Status updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Toggle status failed');
    }
  };

  const handleBookingAction = async (bookingId: number, action: 'Approved' | 'Rejected' | 'Cancelled') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/amenity-bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: action, remark: adminRemark })
      });

      if (response.ok) {
        toast.success(`Booking ${action} successfully`);
        setShowBookingModal(false);
        setAdminRemark('');
        fetchData();
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      toast.error('Connection error while updating booking');
    }
  };

  const handleScheduleDowntime = async () => {
    if(!downtimeForm.amenity_id || !downtimeForm.start_datetime || !downtimeForm.end_datetime) {
        toast.error('Please fill all maintenance details');
        return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/amenity-bookings/downtime', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(downtimeForm)
      });
      if (res.ok) {
        toast.success('Facility shutdown scheduled');
        setDowntimeForm({ amenity_id: '', start_datetime: '', end_datetime: '', reason: 'Maintenance' });
        setActiveTab('amenities');
      }
    } catch (error) {
      toast.error('Failed to schedule maintenance');
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending': return 'text-warning';
      case 'available':
      case 'approved': return 'text-success';
      case 'closed':
      case 'rejected': return 'text-destructive';
      case 'expired': return 'text-muted-foreground border border-muted-foreground/30 px-2 rounded-full text-[10px]';
      case 'under-maintenance':
      case 'cancelled': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  if (loading && (amenities.length === 0 && bookings.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Syncing Society Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">Amenity Management</h1>
            <p className="text-muted-foreground">Manage society amenities and bookings</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveTab('amenities')} className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'amenities' ? 'bg-primary/20 text-primary border border-primary' : 'text-muted-foreground hover:text-foreground border border-primary/20'}`}>
          <Building className="w-4 h-4 inline-block mr-2" /> Amenities
        </button>
        <button onClick={() => setActiveTab('bookings')} className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'bookings' ? 'bg-primary/20 text-primary border border-primary' : 'text-muted-foreground hover:text-foreground border border-primary/20'}`}>
          <Calendar className="w-4 h-4 inline-block mr-2" /> Bookings
          {bookings.filter(b => b.status === 'Pending').length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-warning text-warning-foreground rounded-full">
              {bookings.filter(b => b.status === 'Pending').length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab('maintenance')} className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'maintenance' ? 'bg-destructive/20 text-destructive border border-destructive' : 'text-muted-foreground border border-primary/10'}`}>
          <AlertTriangle className="w-4 h-4 inline-block mr-2" /> Schedule Maintenance
        </button>
      </div>

      {activeTab === 'amenities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.id} className={`cyber-card p-6 ${amenity.status?.toLowerCase() === 'closed' ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center"><Building className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold text-foreground">{amenity.name}</h3>
                    <p className={`text-sm capitalize ${getStatusColor(amenity.status)}`}>{amenity.status?.replace('-', ' ')}</p>
                  </div>
                </div>
                <button onClick={() => handleToggleAmenity(amenity.id)} className="text-primary">
                  {amenity.status?.toLowerCase() === 'available' ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{amenity.description}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                <button onClick={() => handleOpenEditAmenity(amenity)} className="cyber-btn flex-1 flex items-center justify-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
                <button onClick={() => handleDeleteAmenity(amenity.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          <button onClick={handleOpenAddAmenity} className="cyber-card border-dashed border-2 flex flex-col items-center justify-center p-6 text-muted-foreground hover:text-primary hover:border-primary transition-all">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Add New Amenity</span>
          </button>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="cyber-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">ID</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Amenity</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Resident</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Schedule</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="cyber-table-row">
                    <td className="px-4 py-3 text-sm text-primary font-mono">#{booking.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{booking.amenityName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-foreground">{booking.residentName}</div>
                      <div className="text-xs text-muted-foreground">Flat: {booking.flatNo}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-xs">{booking.timeSlot}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedBooking(booking); setAdminRemark(booking.remark || ''); setShowBookingModal(true); }} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                        {booking.status === 'Pending' && (
                          <>
                            <button onClick={() => handleBookingAction(booking.id, 'Approved')} className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"><Check className="w-4 h-4" /></button>
                            <button onClick={() => handleBookingAction(booking.id, 'Rejected')} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No resident bookings found.</div>
          )}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="cyber-card p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Schedule Facility Shutdown</h2>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-wider">Facility to Close</label>
              <select className="cyber-input w-full" value={downtimeForm.amenity_id} onChange={(e) => setDowntimeForm({...downtimeForm, amenity_id: e.target.value})}>
                <option value="">Select Amenity...</option>
                {amenities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-wider">Start Date/Time</label>
                <input type="datetime-local" className="cyber-input w-full" value={downtimeForm.start_datetime} onChange={(e) => setDowntimeForm({...downtimeForm, start_datetime: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-wider">End Date/Time</label>
                <input type="datetime-local" className="cyber-input w-full" value={downtimeForm.end_datetime} onChange={(e) => setDowntimeForm({...downtimeForm, end_datetime: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-wider">Reason for Closure</label>
              <textarea className="cyber-input w-full h-24" placeholder="e.g. Monthly maintenance, deep cleaning, or equipment repair..." value={downtimeForm.reason} onChange={(e) => setDowntimeForm({...downtimeForm, reason: e.target.value})} />
            </div>
            <button onClick={handleScheduleDowntime} className="cyber-btn-solid w-full bg-destructive border-destructive hover:shadow-destructive/40 py-4 font-bold">ACTIVATE SHUTDOWN</button>
          </div>
        </div>
      )}

      {showAmenityModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cyber-card w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-6">{editingAmenity ? 'Edit Amenity' : 'Add Amenity'}</h2>
            <div className="space-y-4">
              <input type="text" value={amenityForm.name} onChange={(e) => setAmenityForm({ ...amenityForm, name: e.target.value })} placeholder="Amenity Name" className="cyber-input w-full" />
              <textarea value={amenityForm.description} onChange={(e) => setAmenityForm({ ...amenityForm, description: e.target.value })} placeholder="Description" className="cyber-input w-full h-20 resize-none" />
              <select value={amenityForm.status} onChange={(e) => setAmenityForm({ ...amenityForm, status: e.target.value })} className="cyber-input w-full">
                <option value="available">Available</option>
                <option value="under-maintenance">Under Maintenance</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAmenityModal(false)} className="cyber-btn">Cancel</button>
              <button onClick={handleSaveAmenity} className="cyber-btn-solid flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cyber-card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Review Request</h2>
              <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><p className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">Booking ID</p><p className="font-mono text-primary text-sm">#{selectedBooking.id}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">Current Status</p><p className={`capitalize text-sm ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</p></div>
              <div className="col-span-2 border-t border-primary/10 pt-3"><p className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">Facility & Schedule</p><p className="text-sm">{selectedBooking.amenityName} | {new Date(selectedBooking.date).toLocaleDateString()} ({selectedBooking.timeSlot})</p></div>
              <div className="col-span-2"><p className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">Requested By</p><p className="text-sm font-semibold">{selectedBooking.residentName} (Flat {selectedBooking.flatNo})</p></div>
            </div>

            <div className="mb-6">
              <label className="text-[10px] uppercase text-muted-foreground mb-1 block font-bold">Admin Remark (Sent to Resident)</label>
              <textarea 
                className="cyber-input w-full h-24 text-sm" 
                placeholder="Write a note to the resident explaining the decision..." 
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
                {selectedBooking.status === 'Pending' && (
                  <>
                    <button onClick={() => handleBookingAction(selectedBooking.id, 'Rejected')} className="cyber-btn text-destructive hover:bg-destructive/10">Reject</button>
                    <button onClick={() => handleBookingAction(selectedBooking.id, 'Approved')} className="cyber-btn-solid">Approve</button>
                  </>
                )}
                <button onClick={() => setShowBookingModal(false)} className="cyber-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
