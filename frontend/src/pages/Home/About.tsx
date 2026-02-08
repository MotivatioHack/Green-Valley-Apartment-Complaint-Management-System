import Layout from "@/components/layout/Home/Layout";
import BackButton from "@/components/layout/Home/BackButton";
import { Building2, Users, Award, Shield, TreePine, Heart } from "lucide-react";
import aboutImage from "@/assets/about-society.jpg";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "24/7 security with CCTV surveillance and trained personnel.",
  },
  {
    icon: TreePine,
    title: "Green Living",
    description: "Lush gardens and eco-friendly practices for sustainable living.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Regular events and activities that bring residents together.",
  },
  {
    icon: Heart,
    title: "Care & Support",
    description: "Responsive management that prioritizes resident well-being.",
  },
];

const committee = [
  { name: "Mr. Rajesh Kumar", role: "President", since: "2020" },
  { name: "Mrs. Priya Sharma", role: "Secretary", since: "2021" },
  { name: "Mr. Anil Verma", role: "Treasurer", since: "2019" },
  { name: "Dr. Sunita Patel", role: "Joint Secretary", since: "2022" },
];

const About = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <BackButton />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            About Our Society
          </h1>
          <div className="heading-divider" />
          <p className="text-muted-foreground max-w-2xl text-lg">
            Learn about our history, values, and the dedicated team that makes
            Green Valley a wonderful place to live.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-20">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold mb-4">
                Our History
              </h2>
              <div className="heading-divider" />
              <p className="text-muted-foreground leading-relaxed mb-4">
                Green Valley Residential Society was established in 1998 with a
                vision to create a harmonious community that offers modern
                amenities while maintaining the warmth of traditional
                neighborhood living.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Starting with just two towers and 100 families, we have grown
                into a thriving community of six towers housing over 500
                families. Our growth has been guided by the principle of putting
                residents first.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the years, we have continuously upgraded our facilities,
                improved our green spaces, and strengthened our community bonds.
                Today, Green Valley stands as one of the most sought-after
                residential societies in the region.
              </p>
            </div>
            <div>
              <img
                src={aboutImage}
                alt="Green Valley Society"
                className="w-full h-auto rounded-xl shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-alt py-16">
        <div className="section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Families" },
              { value: "6", label: "Towers" },
              { value: "25+", label: "Years" },
              { value: "15+", label: "Amenities" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <span className="block font-heading text-4xl md:text-5xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold">
              Our Core Values
            </h2>
            <div className="heading-divider mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center card-hover"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold">
              Management Committee
            </h2>
            <div className="heading-divider mx-auto" />
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our elected committee members work tirelessly to ensure smooth
              functioning of the society.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committee.map((member, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Since {member.since}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
