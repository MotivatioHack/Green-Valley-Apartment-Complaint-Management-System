import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BackButton } from "@/components/layout/user/BackButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isSameDay, parseISO } from "date-fns";
import {
  CalendarIcon,
  Building2,
  Dumbbell,
  Home,
  PartyPopper,
  Check,
  Loader2,
  Info,
  Clock, // ✅ Added missing Clock import here
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mapping icon names from DB to Lucide components
const iconMap: Record<string, any> = {
  Building2: Building2,
  PartyPopper: PartyPopper,
  Dumbbell: Dumbbell,
  Home: Home,
};

const timeSlots = [
  { id: "morning", label: "Morning", time: "6:00 AM - 12:00 PM" },
  { id: "evening", label: "Evening", time: "4:00 PM - 10:00 PM" },
  { id: "full-day", label: "Full Day", time: "6:00 AM - 10:00 PM" },
];

interface Amenity {
  id: number;
  name: string;
  description: string;
  icon_name: string;
}

interface Booking {
  id: number;
  amenity_id: number;
  amenity_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
  admin_remark?: string; 
}

const BookAmenity = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [amenitiesRes, myBookingsRes] = await Promise.all([
        axios.get("https://green-valley-apartment-complaint.onrender.com/api/amenities", { headers }),
        axios.get("https://green-valley-apartment-complaint.onrender.com/api/amenities/my-bookings", { headers }),
      ]);

      setAmenities(amenitiesRes.data);
      setMyBookings(myBookingsRes.data);
      setAllBookings(myBookingsRes.data); 
    } catch (error) {
      console.error("Error fetching amenity data:", error);
      toast({
        title: "Error",
        description: "Failed to load amenity information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isSlotBooked = (date: Date | undefined, slotId: string) => {
    if (!date || !selectedAmenity) return false;
    
    return allBookings.some((b) => {
      const bDate = parseISO(b.booking_date);
      if (!isSameDay(bDate, date) || b.amenity_id !== selectedAmenity) {
        return false;
      }

      const isUnavailable = b.status === "Approved" || b.status === "Pending";

      if (isUnavailable) {
        return (
          b.time_slot === "full-day" || 
          slotId === "full-day" || 
          b.time_slot === slotId
        );
      }
      return false;
    });
  };

  const isDateFullyBooked = (date: Date) => {
    if (!selectedAmenity) return false;
    const bookingsForDate = allBookings.filter((b) => {
      const bDate = parseISO(b.booking_date);
      return isSameDay(bDate, date) && b.amenity_id === selectedAmenity && b.status === "Approved";
    });
    
    return (
      bookingsForDate.some((b) => b.time_slot === "full-day") ||
      (bookingsForDate.some((b) => b.time_slot === "morning") &&
        bookingsForDate.some((b) => b.time_slot === "evening"))
    );
  };

  const handleBooking = async () => {
    if (!selectedAmenity || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        "https://green-valley-apartment-complaint.onrender.com/api/amenities/book",
        {
          amenity_id: selectedAmenity,
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          time_slot: selectedSlot,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Request Submitted",
        description: "Your booking is pending approval from management.",
      });

      setSelectedSlot("");
      setSelectedDate(undefined);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "Could not process booking.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading amenities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <BackButton />
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Book Amenity
        </h1>
        <p className="text-muted-foreground">
          Reserve society amenities for your personal use.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-border/50">
            <label className="form-label mb-4 block">Select Amenity</label>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map((amenity) => {
                const Icon = iconMap[amenity.icon_name] || Building2;
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => {
                      setSelectedAmenity(amenity.id);
                      setSelectedDate(undefined);
                      setSelectedSlot("");
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAmenity === amenity.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-border dark:border-gray-700 hover:border-primary/30"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        selectedAmenity === amenity.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className={`text-sm font-semibold block ${
                      selectedAmenity === amenity.id ? "text-primary" : "text-foreground"
                    }`}>
                      {amenity.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-border/50">
            <label className="form-label mb-4 block">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 rounded-xl",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={!selectedAmenity}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot("");
                  }}
                  disabled={(date) => date < new Date() || isDateFullyBooked(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-border/50">
            <label className="form-label mb-4 block">Select Time Slot</label>
            <div className="space-y-3">
              {timeSlots.map((slot) => {
                const booked = isSlotBooked(selectedDate, slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!selectedDate || booked}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      booked
                        ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 cursor-not-allowed opacity-60"
                        : selectedSlot === slot.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-border dark:border-gray-700 hover:border-primary/30 disabled:opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-foreground">{slot.label}</span>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </div>
                      {booked ? (
                        <span className="text-[10px] uppercase bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold">
                          Unavailable
                        </span>
                      ) : selectedSlot === slot.id ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-border/50 sticky top-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border dark:border-gray-700">
                <span className="text-muted-foreground">Amenity</span>
                <span className="font-medium text-foreground">
                  {amenities.find((a) => a.id === selectedAmenity)?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border dark:border-gray-700">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {selectedDate ? format(selectedDate, "PPP") : "-"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-medium text-foreground">
                  {timeSlots.find((s) => s.id === selectedSlot)?.label || "-"}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedAmenity || !selectedDate || !selectedSlot || submitting}
              className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2 disabled:opacity-50 h-12 rounded-xl"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Booking
            </button>
          </div>

          {myBookings.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-border/50">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                My Recent Bookings
              </h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-xl bg-muted/30 dark:bg-gray-700/30 border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-foreground text-sm truncate max-w-[120px]">
                        {booking.amenity_name}
                      </span>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                        booking.status === 'Approved' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                        booking.status === 'Rejected' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : 
                        booking.status === 'Expired' ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" /> {format(parseISO(booking.booking_date), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 capitalize">
                            <Clock className="w-3 h-3" /> {booking.time_slot.replace('-', ' ')}
                        </p>
                    </div>

                    {booking.admin_remark && (
                      <div className="mt-3 p-2 bg-primary/5 dark:bg-primary/10 rounded-lg border-l-2 border-primary">
                        <div className="flex items-center gap-1 mb-1">
                            <Info className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase">Management Note</span>
                        </div>
                        <p className="text-[11px] text-foreground leading-relaxed italic">
                          "{booking.admin_remark}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAmenity;