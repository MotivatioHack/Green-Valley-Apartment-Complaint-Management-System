import { useState } from "react";
import { X } from "lucide-react";
import facilityGym from "@/assets/facility-gym.jpg";
import facilityGarden from "@/assets/facility-garden.jpg";
import facilityPlayground from "@/assets/facility-playground.jpg";
import facilityHall from "@/assets/facility-hall.jpg";

interface Facility {
  id: number;
  title: string;
  image: string;
  shortDesc: string;
  fullDescription: string;
  timings: string;
  features: string[];
}

const facilities: Facility[] = [
  {
    id: 1,
    title: "Modern Gymnasium",
    image: facilityGym,
    shortDesc: "State-of-the-art fitness center",
    fullDescription:
      "Our fully equipped gymnasium features the latest cardio and strength training equipment. With air conditioning, professional trainers available during peak hours, and separate sections for different workout types, residents can maintain their fitness goals without leaving the society.",
    timings: "5:00 AM - 10:00 PM (Daily)",
    features: [
      "Cardio equipment zone",
      "Free weights section",
      "Air conditioned",
      "Personal training available",
    ],
  },
  {
    id: 2,
    title: "Landscaped Gardens",
    image: facilityGarden,
    shortDesc: "Beautiful green spaces for relaxation",
    fullDescription:
      "Spread across 2 acres, our landscaped gardens offer a serene escape from the city hustle. Walking paths, seating areas, and flowering plants create a peaceful environment for morning walks, evening relaxation, or simply enjoying nature with family.",
    timings: "Open 24/7",
    features: [
      "Jogging track",
      "Meditation area",
      "Seating benches",
      "Well-lit pathways",
    ],
  },
  {
    id: 3,
    title: "Children's Playground",
    image: facilityPlayground,
    shortDesc: "Safe play area for kids",
    fullDescription:
      "A colorful and safe playground designed for children of all ages. With modern equipment, soft flooring, and dedicated supervisors during evening hours, parents can relax while children enjoy their playtime in a secure environment.",
    timings: "7:00 AM - 8:00 PM",
    features: [
      "Age-appropriate equipment",
      "Safety flooring",
      "Shaded areas",
      "Evening supervision",
    ],
  },
  {
    id: 4,
    title: "Community Hall",
    image: facilityHall,
    shortDesc: "Multipurpose event space",
    fullDescription:
      "Our spacious community hall can accommodate up to 200 guests and is perfect for family functions, society events, and celebrations. Complete with modern sound system, air conditioning, and attached kitchen facilities, it's the ideal venue for your special occasions.",
    timings: "Available for booking",
    features: [
      "200 person capacity",
      "Sound system",
      "Kitchen facilities",
      "Air conditioned",
    ],
  },
];

const FacilitiesSection = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="section-padding">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">
            Society Facilities
          </h2>
          <div className="heading-divider mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enjoy world-class amenities designed for comfortable and convenient
            living for you and your family.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              onClick={() => setSelectedFacility(facility)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {facility.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {facility.shortDesc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-soft">
            <div className="relative">
              <img
                src={selectedFacility.image}
                alt={selectedFacility.title}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[45vh]">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                {selectedFacility.title}
              </h3>
              <p className="text-sm text-primary font-medium mb-4">
                {selectedFacility.timings}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {selectedFacility.fullDescription}
              </p>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Features:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {selectedFacility.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FacilitiesSection;
