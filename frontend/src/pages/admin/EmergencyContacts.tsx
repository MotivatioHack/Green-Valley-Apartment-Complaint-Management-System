import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Building,
  Shield,
  Flame,
  Ambulance,
  AlertTriangle,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

// Options mapping frontend display to database roles
const contactTypeOptions = [
  { value: 'Society Office', label: 'Society Office', icon: Building },
  { value: 'Security Desk', label: 'Security Desk', icon: Shield },
  { value: 'Fire', label: 'Fire', icon: Flame },
  { value: 'Ambulance', label: 'Ambulance', icon: Ambulance },
  { value: 'Police', label: 'Police', icon: AlertTriangle },
  { value: 'Emergency WhatsApp', label: 'Emergency WhatsApp', icon: MessageCircle },
];

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Society Office', // Matches DB 'role' column
    phone: '',
    email: '' // Matches DB 'email' column
  });

  // 1. FETCH ALL CONTACTS (Dynamic Logic)
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/emergency-contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load emergency directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormData({ name: '', role: 'Society Office', phone: '', email: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (contact: any) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || '',
      role: contact.role || 'Society Office',
      phone: contact.phone || '',
      email: contact.email || ''
    });
    setShowModal(true);
  };

  // 2. SAVE OR UPDATE (Database-Driven Logic)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and Phone are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editingContact ? 'PUT' : 'POST';
      const url = editingContact 
        ? `https://green-valley-apartment-complaint.onrender.com/api/admin/emergency-contacts/${editingContact.id}`
        : 'https://green-valley-apartment-complaint.onrender.com/api/admin/emergency-contacts';

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingContact ? 'Contact updated' : 'Contact added');
        setShowModal(false);
        fetchContacts(); // Refresh dynamic list
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  // 3. DELETE LOGIC (Dynamic)
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/emergency-contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Contact removed');
        fetchContacts();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // 4. TOGGLE AVAILABILITY (Visibility Control)
  const handleToggle = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://green-valley-apartment-complaint.onrender.com/api/admin/emergency-contacts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchContacts(); // Refresh status immediately
      }
    } catch (error) {
      toast.error('Status toggle failed');
    }
  };

  const getContactIcon = (role: string) => {
    const option = contactTypeOptions.find((o) => o.value === role);
    return option?.icon || Phone;
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Syncing Emergency Directory...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
              Emergency Contacts
            </h1>
            <p className="text-muted-foreground">
              Manage emergency contact information for residents
            </p>
          </div>
        </div>
        <button onClick={handleOpenAdd} className="cyber-btn-solid flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => {
          const Icon = getContactIcon(contact.role);
          const isAvailable = contact.availability === 'Available';
          return (
            <div
              key={contact.id}
              className={`cyber-card p-6 ${!isAvailable ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {contact.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(contact.id)}
                  className="text-primary"
                >
                  {isAvailable ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="text-lg font-mono text-primary">{contact.phone}</p>
                </div>
                {contact.email && (
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3"/> {contact.email}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="cyber-btn flex-1 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {contacts.length === 0 && (
        <div className="cyber-card p-12 text-center">
          <Phone className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No emergency contacts found</p>
          <button onClick={handleOpenAdd} className="cyber-btn mt-4">
            Add First Contact
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="cyber-card w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., City Hospital"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Contact Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="cyber-input w-full"
                >
                  {contactTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 00000 00000"
                  className="cyber-input w-full"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hospital@example.com"
                  className="cyber-input w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="cyber-btn">
                Cancel
              </button>
              <button onClick={handleSave} className="cyber-btn-solid flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingContact ? 'Update' : 'Add'} Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}