import { useState } from "react";
import Layout from "@/components/layout/Home/Layout";
import BackButton from "@/components/layout/Home/BackButton";
import { Calendar, X, Search } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  type: "general" | "important" | "emergency";
  excerpt: string;
  fullMessage: string;
  date: string;
  issuedBy: string;
}

const allNotices: Notice[] = [
  {
    id: 1,
    title: "Annual General Meeting",
    type: "important",
    excerpt: "The AGM will be held on 15th February 2026 at the community hall.",
    fullMessage:
      "Dear Residents,\n\nThis is to inform you that the Annual General Meeting (AGM) of Green Valley Residential Society will be held on 15th February 2026 at 5:00 PM in the Community Hall.\n\nAgenda:\n1. Approval of previous minutes\n2. Annual financial report\n3. Maintenance budget for 2026-27\n4. Election of new committee members\n5. Open discussion\n\nAll residents are requested to attend. Please carry your ID cards.",
    date: "January 25, 2026",
    issuedBy: "Society Secretary",
  },
  {
    id: 2,
    title: "Water Tank Cleaning Schedule",
    type: "general",
    excerpt: "Water supply will be interrupted on 5th Feb for tank cleaning.",
    fullMessage:
      "Dear Residents,\n\nPlease be informed that the overhead water tanks of all towers will be cleaned on 5th February 2026.\n\nWater supply will be interrupted from 9:00 AM to 3:00 PM.\n\nResidents are advised to store adequate water for the day. We apologize for any inconvenience caused.\n\nThank you for your cooperation.",
    date: "January 28, 2026",
    issuedBy: "Maintenance Committee",
  },
  {
    id: 3,
    title: "Fire Safety Drill",
    type: "emergency",
    excerpt: "Mandatory fire safety drill scheduled for all residents.",
    fullMessage:
      "Dear Residents,\n\nIn compliance with fire safety regulations, a mandatory fire safety drill will be conducted on 10th February 2026 at 10:00 AM.\n\nAll residents are requested to:\n- Assemble at the designated assembly points\n- Follow instructions from fire marshals\n- Do not use elevators during the drill\n\nThe drill will last approximately 30 minutes. Your participation is mandatory for everyone's safety.",
    date: "January 30, 2026",
    issuedBy: "Safety Committee",
  },
  {
    id: 4,
    title: "Maintenance Charges Due Date",
    type: "general",
    excerpt: "Q1 2026 maintenance charges are due by 15th January.",
    fullMessage:
      "Dear Residents,\n\nThis is a reminder that the maintenance charges for Q1 2026 (January - March) are due by 15th January 2026.\n\nPayment can be made via:\n- Online transfer to society account\n- Cheque at the society office\n- Cash payment at the office (receipt will be provided)\n\nLate payment will attract a penalty of ₹500 per month.\n\nFor any queries, please contact the society office.",
    date: "January 5, 2026",
    issuedBy: "Treasurer",
  },
  {
    id: 5,
    title: "New Visitor Management System",
    type: "important",
    excerpt: "New digital visitor management goes live from Feb 1st.",
    fullMessage:
      "Dear Residents,\n\nWe are pleased to announce the launch of our new digital visitor management system, effective from 1st February 2026.\n\nKey Features:\n- Pre-authorize visitors via mobile app\n- Real-time notifications when visitors arrive\n- Contactless entry for delivery personnel\n- Enhanced security with photo verification\n\nPlease download the society app and register your household members.\n\nTraining sessions will be held at the community hall on Jan 28 and 29.",
    date: "January 20, 2026",
    issuedBy: "Security Committee",
  },
  {
    id: 6,
    title: "Republic Day Celebration",
    type: "general",
    excerpt: "Join us for Republic Day celebrations on 26th January.",
    fullMessage:
      "Dear Residents,\n\nWarm greetings for the upcoming Republic Day!\n\nWe invite all residents to join us for the Republic Day celebrations:\n\nDate: 26th January 2026\nTime: 8:00 AM\nVenue: Central Garden\n\nSchedule:\n- 8:00 AM: Flag hoisting ceremony\n- 8:30 AM: National anthem and patriotic songs\n- 9:00 AM: Cultural program by children\n- 10:00 AM: Refreshments\n\nAll residents are requested to participate with their families.",
    date: "January 18, 2026",
    issuedBy: "Cultural Committee",
  },
];

const Notices = () => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotices = allNotices.filter((notice) => {
    const matchesFilter = filter === "all" || notice.type === filter;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "important":
        return "notice-badge-important";
      case "emergency":
        return "notice-badge-emergency";
      default:
        return "notice-badge-general";
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <BackButton />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            Notice Board
          </h1>
          <div className="heading-divider" />
          <p className="text-muted-foreground max-w-2xl text-lg">
            Stay updated with the latest announcements, circulars, and important
            notifications from the society management.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="section-padding">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "All" },
                { value: "general", label: "General" },
                { value: "important", label: "Important" },
                { value: "emergency", label: "Emergency" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notices Grid */}
      <section className="py-8 md:py-12">
        <div className="section-padding">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No notices found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-card border border-border rounded-xl p-6 card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={getTypeBadgeClass(notice.type)}>
                      {notice.type}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {notice.date}
                    </div>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {notice.excerpt}
                  </p>
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="text-primary font-medium text-sm hover:underline"
                  >
                    View Notice →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notice Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-soft">
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div>
                <span className={getTypeBadgeClass(selectedNotice.type)}>
                  {selectedNotice.type}
                </span>
                <h3 className="font-heading text-xl font-bold text-foreground mt-2">
                  {selectedNotice.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <p className="text-foreground whitespace-pre-line leading-relaxed">
                {selectedNotice.fullMessage}
              </p>
            </div>
            <div className="p-6 border-t border-border bg-secondary/30">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Issued by: {selectedNotice.issuedBy}</span>
                <span>{selectedNotice.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Notices;
