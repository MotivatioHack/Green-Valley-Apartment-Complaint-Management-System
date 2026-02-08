export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  residentId: string;
  residentName: string;
  flatNo: string;
  assignedTo?: string;
  adminRemark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  flatNo: string;
  block: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  assignedComplaints: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'normal' | 'important' | 'urgent';
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalResidents: number;
  totalStaff: number;
  activeNotices: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  type: 'society-office' | 'security-desk' | 'fire' | 'ambulance' | 'police' | 'emergency-whatsapp';
  phone: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  timeSlots: string[];
  maxBookingsPerDay: number;
  rules: string;
  createdAt: string;
}

export interface AmenityBooking {
  id: string;
  amenityId: string;
  amenityName: string;
  residentId: string;
  residentName: string;
  flatNo: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
}
