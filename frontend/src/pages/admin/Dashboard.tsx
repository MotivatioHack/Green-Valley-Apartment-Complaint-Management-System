import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/common/admin/StatCard';
import { DataTable } from '@/components/common/admin/DataTable';
import { StatusBadge } from '@/components/common/admin/StatusBadge';
import { PriorityBadge } from '@/components/common/admin/PriorityBadge';
import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  UserCog,
  Bell,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Complaint } from '@/types/admin';

const recentComplaintsColumns = [
  {
    key: 'id',
    header: 'ID',
    render: (complaint: Complaint) => (
      <span className="text-primary font-mono">{complaint.id}</span>
    ),
  },
  {
    key: 'title',
    header: 'Title',
    render: (complaint: Complaint) => (
      <span className="font-medium">{complaint.title}</span>
    ),
  },
  {
    key: 'flatNo',
    header: 'Flat',
    render: (complaint: Complaint) => (
      <span className="text-muted-foreground">{complaint.flatNo}</span>
    ),
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (complaint: Complaint) => <PriorityBadge priority={complaint.priority} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (complaint: Complaint) => <StatusBadge status={complaint.status} />,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return <div className="flex h-screen items-center justify-center text-foreground">Loading Command Center...</div>;
  }

  const { stats, categories, priorities, recentComplaints } = data;

  const getPriorityCount = (level: string) => {
    return priorities.find((p: any) => p.priority.toLowerCase() === level.toLowerCase())?.count || 0;
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">
          Command Center
        </h1>
        <p className="text-muted-foreground">
          Society Complaint Management Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Pending"
          value={stats.pendingComplaints}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedComplaints}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Residents"
          value={stats.totalResidents}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Staff"
          value={stats.totalStaff}
          icon={UserCog}
          variant="default"
        />
        <StatCard
          title="Notices"
          value={stats.activeNotices}
          icon={Bell}
          variant="primary"
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Complaint Categories
          </h3>
          <div className="space-y-4">
            {categories.map((category: any) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{category.name}</span>
                  <span className="text-foreground font-medium">{category.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(category.count / (stats.totalComplaints || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {categories.length === 0 && <p className="text-muted-foreground text-sm italic">No category data available</p>}
          </div>
        </div>

        {/* Priority Overview */}
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Priority Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <span className="text-destructive font-medium">Critical</span>
              <span className="text-2xl font-bold text-destructive">{getPriorityCount('critical')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
              <span className="text-warning font-medium">High</span>
              <span className="text-2xl font-bold text-warning">{getPriorityCount('high')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-primary font-medium">Medium</span>
              <span className="text-2xl font-bold text-primary">{getPriorityCount('medium')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted-foreground/20">
              <span className="text-muted-foreground font-medium">Low</span>
              <span className="text-2xl font-bold text-muted-foreground">{getPriorityCount('low')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Complaints
          </h3>
          <button 
            onClick={() => navigate('/admin/complaints')} 
            className="cyber-btn text-sm"
          >
            View All
          </button>
        </div>
        <DataTable data={recentComplaints} columns={recentComplaintsColumns} />
      </div>
    </>
  );
}