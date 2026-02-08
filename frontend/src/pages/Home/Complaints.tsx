import Layout from "@/components/layout/Home/Layout";
import BackButton from "@/components/layout/Home/BackButton";
import { Link } from "react-router-dom";
import {
  Droplets,
  ArrowUpDown,
  Car,
  Lightbulb,
  Trash2,
  Shield,
  Wrench,
  TreePine,
  LogIn,
} from "lucide-react";

const categories = [
  {
    icon: Droplets,
    label: "Water Supply",
    description:
      "Report issues related to water supply, plumbing leaks, low pressure, or contamination.",
  },
  {
    icon: ArrowUpDown,
    label: "Lift / Elevator",
    description:
      "Report elevator malfunctions, strange noises, or maintenance requirements.",
  },
  {
    icon: Car,
    label: "Parking",
    description:
      "Report unauthorized parking, parking slot disputes, or vehicle-related concerns.",
  },
  {
    icon: Lightbulb,
    label: "Electrical",
    description:
      "Report power outages, faulty wiring, or electrical hazards in common areas.",
  },
  {
    icon: Trash2,
    label: "Housekeeping",
    description:
      "Report cleaning issues, garbage disposal problems, or sanitation concerns.",
  },
  {
    icon: Shield,
    label: "Security",
    description:
      "Report security concerns, suspicious activities, or guard-related issues.",
  },
  {
    icon: Wrench,
    label: "General Maintenance",
    description:
      "Report broken fixtures, damaged infrastructure, or general repair needs.",
  },
  {
    icon: TreePine,
    label: "Garden & Parks",
    description:
      "Report landscaping issues, damaged plants, or maintenance of green areas.",
  },
];

const Complaints = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <BackButton />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            Complaints
          </h1>
          <div className="heading-divider" />
          <p className="text-muted-foreground max-w-2xl text-lg">
            View different complaint categories handled by our society
            management. Login to submit or track your complaints.
          </p>
        </div>
      </section>

      {/* Login Prompt */}
      <section className="py-8">
        <div className="section-padding">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Want to register a complaint?
              </h3>
              <p className="text-muted-foreground text-sm">
                Login to your resident account to submit and track complaints.
              </p>
            </div>
            <Link to="/login" className="btn-primary whitespace-nowrap">
              <LogIn className="w-4 h-4 mr-2" />
              Resident Login
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="section-padding">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold mb-2">
            Complaint Categories
          </h2>
          <div className="heading-divider" />
          <p className="text-muted-foreground mb-8">
            Our management handles various types of maintenance and service
            requests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 flex gap-5"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <category.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    {category.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Info */}
      <section className="section-alt py-12 md:py-16">
        <div className="section-padding">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold mb-2">
            How It Works
          </h2>
          <div className="heading-divider" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              {
                step: "1",
                title: "Submit Complaint",
                desc: "Login and submit your complaint with details and photos if needed.",
              },
              {
                step: "2",
                title: "Track Status",
                desc: "Monitor the progress of your complaint through your dashboard.",
              },
              {
                step: "3",
                title: "Resolution",
                desc: "Get notified when your complaint is resolved by our team.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Complaints;
