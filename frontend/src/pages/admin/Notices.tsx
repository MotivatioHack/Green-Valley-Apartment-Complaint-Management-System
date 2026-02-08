import { useState, useEffect } from 'react';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import { Plus, Edit, Trash2, X, Bell, Calendar, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Notices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);
  
  // Cleaned state initialization
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'info',
    priority: 'normal',
    expiresAt: '',
  });

  // 1. Fetch Logic (Dynamic)
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/notices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category: 'info',
      priority: 'normal',
      expiresAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice: any) => {
    setEditingNotice(notice);
    
    // Priority Mapping (Read): Convert DB 'pinned' and 'type' state back to UI Priority
    let inferredPriority = 'normal';
    if (notice.pinned === 1) {
      inferredPriority = notice.type === 'emergency' ? 'urgent' : 'important';
    }

    setFormData({
      title: notice.title,
      content: notice.description || '', 
      category: notice.type || 'info', 
      priority: inferredPriority,
      expiresAt: notice.date ? new Date(notice.date).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  // 2. Submit Logic (Handles Persistence)
  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editingNotice ? 'PUT' : 'POST';
      const url = editingNotice 
        ? `http://localhost:5000/api/admin/notices/${editingNotice.id}`
        : 'http://localhost:5000/api/admin/notices';

      // Priority Mapping (Write): Map UI dropdown to existing DB columns
      const pinnedValue = (formData.priority === 'important' || formData.priority === 'urgent') ? 1 : 0;
      const finalType = formData.priority === 'urgent' ? 'emergency' : formData.category;

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.content, 
          type: finalType,
          date: formData.expiresAt,
          pinned: pinnedValue 
        })
      });

      if (response.ok) {
        toast.success(editingNotice ? 'Notice updated' : 'Notice published');
        setIsModalOpen(false);
        fetchNotices(); 
      } else {
        const err = await response.json();
        toast.error(err.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  // 3. Delete Logic
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Notice deleted');
      fetchNotices();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // 4. Toggle Visibility Logic
  const toggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/notices/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Visibility updated');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const getNoticePriority = (type: string, pinned: number) => {
    if (pinned === 1) return type === 'emergency' ? 'urgent' : 'important';
    return 'normal';
  };

  const categories = ['Maintenance', 'Meeting', 'Amenities', 'Rules', 'Events', 'Emergency'];

  if (loading && notices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Syncing Notice Board...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">Notices</h1>
          <p className="text-muted-foreground">Publish and manage society notices</p>
        </div>
        <button onClick={openAddModal} className="cyber-btn-solid flex items-center gap-2">
          <Plus className="w-4 h-4" /> Publish Notice
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="cyber-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{notices.length}</p>
          <p className="text-sm text-muted-foreground">Total Notices</p>
        </div>
        <div className="cyber-card p-4 text-center border-success/30">
          <p className="text-2xl font-bold text-success">
            {notices.filter((n) => n.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="cyber-card p-4 text-center border-destructive/30">
          <p className="text-2xl font-bold text-destructive">
            {notices.filter((n) => n.pinned === 1 && n.type === 'emergency').length}
          </p>
          <p className="text-sm text-muted-foreground">Urgent</p>
        </div>
        <div className="cyber-card p-4 text-center border-warning/30">
          <p className="text-2xl font-bold text-warning">
            {notices.filter((n) => n.pinned === 1 && n.type !== 'emergency').length}
          </p>
          <p className="text-sm text-muted-foreground">Important</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((notice) => (
          <div key={notice.id} className={`cyber-card p-6 transition-all ${notice.status === 'inactive' ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${notice.pinned === 1 ? (notice.type === 'emergency' ? 'bg-destructive/20' : 'bg-warning/20') : 'bg-primary/20'}`}>
                  <Bell className={`w-5 h-5 ${notice.pinned === 1 ? (notice.type === 'emergency' ? 'text-destructive' : 'text-warning') : 'text-primary'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{notice.title}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{notice.type}</p>
                </div>
              </div>
              <PriorityBadge priority={getNoticePriority(notice.type, notice.pinned)} />
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{notice.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-primary/10 pt-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(notice.created_at).toLocaleDateString()}</span>
                {notice.date && <span className="text-warning">Date: {new Date(notice.date).toLocaleDateString()}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(notice.id)} className={`p-2 rounded-lg transition-colors ${notice.status === 'active' ? 'hover:bg-success/10 text-success' : 'hover:bg-muted text-muted-foreground'}`}>
                  {notice.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEditModal(notice)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(notice.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{editingNotice ? 'Edit Notice' : 'Publish Notice'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-primary/10 rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="cyber-input w-full" placeholder="Notice title" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))} className="cyber-input w-full h-32 resize-none" placeholder="Notice content..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} className="cyber-input w-full">
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat} value={cat.toLowerCase()}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))} className="cyber-input w-full">
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Notice/Event Date</label>
                <input type="date" value={formData.expiresAt} onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))} className="cyber-input w-full" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="cyber-btn">Cancel</button>
              <button onClick={handleSubmit} className="cyber-btn-solid">{editingNotice ? 'Update' : 'Publish'} Notice</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}