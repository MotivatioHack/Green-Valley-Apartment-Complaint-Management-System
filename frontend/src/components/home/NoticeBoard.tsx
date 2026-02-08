import { useState } from "react";
import { Calendar, X } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  type: "general" | "important" | "emergency";
  excerpt: string;
  fullMessage: string;
  date: string;
  issuedBy: string;
}

const notices: Notice[] = [
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
];

const NoticeBoard = () => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

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
    <section className="section-alt py-16 md:py-24">
      <div className="section-padding">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">
            Notice Board
          </h2>
          <div className="heading-divider mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest announcements and important
            notifications from the society management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
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
      </div>

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
    </section>
  );
};

export default NoticeBoard;
