import { useState } from "react";
import Layout from "@/components/layout/Home/Layout";
import BackButton from "@/components/layout/Home/BackButton";
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

const allFacilities: Facility[] = [
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
      "Separate changing rooms",
      "Water cooler facility",
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
      "Jogging track (800m)",
      "Meditation area",
      "Seating benches",
      "Well-lit pathways",
      "Flower gardens",
      "Bird watching spots",
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
      "Sandbox area",
      "Swings and slides",
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
      "Stage area",
      "Parking available",
    ],
  },
];

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <BackButton />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            Society Facilities
          </h1>
          <div className="heading-divider" />
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore the world-class amenities designed for comfortable and
            convenient living for you and your family.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-12 md:py-20">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allFacilities.map((facility) => (
              <div
                key={facility.id}
                onClick={() => setSelectedFacility(facility)}
                className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden card-hover"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {facility.shortDesc}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {facility.timings}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="section-alt py-12 md:py-16">
        <div className="section-padding">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold mb-4">
              Booking & Usage
            </h2>
            <div className="heading-divider mx-auto" />
            <p className="text-muted-foreground mb-6">
              Most facilities are available to all registered residents. For
              booking the community hall or organizing events, please contact the
              society office in advance.
            </p>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Society Office
              </h3>
              <p className="text-sm text-muted-foreground">
                Block A, Ground Floor | Phone: +91 11-2345-6789
                <br />
                Mon-Fri: 9AM - 6PM | Sat: 10AM - 2PM
              </p>
            </div>
          </div>
        </div>
      </section>

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
    </Layout>
  );
};

export default Facilities;
