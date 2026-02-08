import { Building2, Shield, Award } from "lucide-react";
import aboutImage from "@/assets/about-society.jpg";

const stats = [
  {
    icon: Award,
    value: "25+",
    label: "Years of Excellence",
  },
  {
    icon: Building2,
    value: "6",
    label: "Residential Towers",
  },
  {
    icon: Shield,
    value: "24/7",
    label: "Security Coverage",
  },
];

const AboutSection = () => {
  return (
    <section className="section-alt py-16 md:py-24">
      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">
              About Our Society
            </h2>
            <div className="heading-divider" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              Established in 1998, Green Valley Residential Society has been a
              landmark of quality living in the heart of the city. Our community
              is built on the values of trust, transparency, and togetherness.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With six thoughtfully designed residential towers, lush green
              landscapes, and state-of-the-art facilities, we provide an
              unparalleled living experience for over 500 families who call
              Green Valley their home.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card flex flex-col items-center text-center"
                >
                  <stat.icon className="w-8 h-8 text-primary mb-2" />
                  <span className="font-heading text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Our dedicated management committee works tirelessly to maintain
              the highest standards of community living, ensuring every resident
              enjoys a safe, clean, and harmonious environment.
            </p>
          </div>

          {/* Right Image */}
          <div className="order-first lg:order-last">
            <div className="relative">
              <img
                src={aboutImage}
                alt="Green Valley Society Building"
                className="w-full h-auto rounded-xl shadow-soft"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-lg hidden md:flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <span className="block font-heading text-2xl font-bold">25+</span>
                  <span className="text-xs">Years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
