import { useState, useEffect } from "react";
import axios from "axios";
import { BackButton } from "@/components/layout/user/BackButton";
import {
  Phone,
  Building2,
  Shield,
  Flame,
  Ambulance,
  MessageCircle,
  Loader2,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  role: string;
  phone: string;
  email?: string;
  availability: string;
}

// Icon mapping based on role keywords
const getIcon = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes("security") || r.includes("police")) return Shield;
  if (r.includes("fire")) return Flame;
  if (r.includes("medical") || r.includes("ambulance") || r.includes("hospital")) return Ambulance;
  if (r.includes("office") || r.includes("admin")) return Building2;
  return Phone;
};

const EmergencyContact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://green-valley-apartment-complaint.onrender.com/api/emergency-contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const handleWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\s/g, "").replace("+", "");
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Emergency Contacts
        </h1>
        <p className="text-muted-foreground">
          Quick access to important emergency numbers. Tap to call directly.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold text-red-800 dark:text-red-300">
              In case of emergency
            </h2>
            <p className="text-sm text-red-600 dark:text-red-400">
              Contact security desk immediately or dial 112 for national
              emergency
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            const ContactIcon = getIcon(contact.role);
            const isWhatsApp = contact.role.toLowerCase().includes("whatsapp");

            return (
              <div
                key={contact.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 transition-all hover:shadow-floating card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <ContactIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {contact.role} • {contact.availability}
                    </p>
                    <p className="text-lg font-semibold text-primary mb-3">
                      {contact.phone}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </button>
                      {isWhatsApp && (
                        <button
                          onClick={() => handleWhatsApp(contact.phone)}
                          className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-muted/20 rounded-2xl border-2 border-dashed">
            <p className="text-muted-foreground">No emergency contacts found.</p>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-muted/50 dark:bg-gray-800/50 rounded-2xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-2">
          Important Notes
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Security desk is available 24/7 for immediate assistance</li>
          <li>• For non-urgent matters, please use the complaint system</li>
          <li>• Keep these numbers saved in your phone for quick access</li>
          <li>• National Emergency Number: 112</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyContact;