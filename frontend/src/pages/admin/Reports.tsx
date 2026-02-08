import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://green-valley-apartment-complaint.onrender.com/api/admin/reports/system', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Server Error');
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error('Failed to load dynamic reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!data?.exportData?.length) return toast.error('No data available to export');

    const headers = ['Complaint ID', 'Category', 'Status', 'Date', 'Resident', 'Staff', 'Admin Remark'];
    const rows = data.exportData.map((c: any) => [
      c.id, 
      c.category, 
      c.status, 
      new Date(c.created_at).toLocaleDateString(),
      c.resident || 'N/A',
      c.staff || 'Unassigned',
      c.admin_remark || 'No remark'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Society_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV report generated successfully');
  };

  // NEW DYNAMIC PDF EXPORT LOGIC
  const handleExportPDF = () => {
    if (!data?.exportData?.length) return toast.error('No data available to generate PDF');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return toast.error('Pop-up blocked! Please allow pop-ups for PDF export');

    // Generate table rows dynamically from database data
    const tableRows = data.exportData.map((c: any) => `
      <tr>
        <td>C${String(c.id).padStart(3, '0')}</td>
        <td style="text-transform: capitalize;">${c.category}</td>
        <td>${c.status}</td>
        <td>${new Date(c.created_at).toLocaleDateString()}</td>
        <td>${c.staff || 'Not Assigned'}</td>
        <td>${c.admin_remark || 'N/A'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <title>Society Complaints Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            h1 { color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px; margin-bottom: 5px; }
            .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8fafc; color: #475569; font-weight: 600; text-align: left; border-bottom: 2px solid #e2e8f0; }
            th, td { padding: 12px; border: 1px solid #e2e8f0; font-size: 13px; }
            tr:nth-child(even) { background-color: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>Society Complaints Report</h1>
          <div class="meta">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total Complaints Found: ${data.exportData.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Assigned Staff</th>
                <th>Resolution/Remark</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then open print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);

    toast.success('Generating dynamic PDF report...');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Syncing live database metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-destructive">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p>Could not load report data. Please check backend connection.</p>
      </div>
    );
  }

  const resolutionRate = data.stats.total > 0 
    ? Math.round((data.stats.resolved / data.stats.total) * 100) 
    : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground cyber-text-glow mb-2">Reports</h1>
          <p className="text-muted-foreground">Live analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="cyber-btn flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="cyber-btn-solid flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <span className="text-success text-sm flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Live</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{data.stats.total || 0}</p>
          <p className="text-sm text-muted-foreground">Total Complaints</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">{resolutionRate}%</p>
          <p className="text-sm text-muted-foreground">Resolution Rate</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-warning" />
          </div>
          <p className="text-3xl font-bold text-foreground">Active</p>
          <p className="text-sm text-muted-foreground">System Health</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-foreground">{data.stats.pending || 0}</p>
          <p className="text-sm text-muted-foreground">Pending Issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Complaints by Category
          </h3>
          <div className="space-y-4">
            {data.categoryData.map((category: any) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground font-medium capitalize">{category.name}</span>
                  <span className="text-muted-foreground">{category.count} ({category.percentage}%)</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${category.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Monthly Trend
          </h3>
          <div className="space-y-4">
            {data.monthlyTrend.map((m: any) => (
              <div key={m.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground">{m.month}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary/60" style={{ width: `${(m.complaints / (data.stats.total || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm text-primary w-8">{m.complaints}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                    <div className="h-full bg-success/60" style={{ width: `${(m.resolved / (m.complaints || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm text-success w-8">{m.resolved}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cyber-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Resolutions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">ID</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Category</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Reported Date</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.exportData.filter((c: any) => c.status === 'Resolved').slice(0, 5).map((c: any) => (
                <tr key={c.id} className="cyber-table-row">
                  <td className="px-4 py-3 text-sm text-primary font-mono">#{c.id}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{c.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{c.category}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className="status-badge status-resolved">Resolved</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}