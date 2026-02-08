import {
  Droplets,
  ArrowUpDown,
  Car,
  Lightbulb,
  Trash2,
  Shield,
  Wrench,
  TreePine,
} from "lucide-react";

const categories = [
  { icon: Droplets, label: "Water Supply", description: "Plumbing & water issues" },
  { icon: ArrowUpDown, label: "Lift / Elevator", description: "Elevator maintenance" },
  { icon: Car, label: "Parking", description: "Parking & vehicle concerns" },
  { icon: Lightbulb, label: "Electrical", description: "Power & lighting issues" },
  { icon: Trash2, label: "Housekeeping", description: "Cleaning & sanitation" },
  { icon: Shield, label: "Security", description: "Safety & security matters" },
  { icon: Wrench, label: "Maintenance", description: "General repairs" },
  { icon: TreePine, label: "Garden & Parks", description: "Landscaping issues" },
];

const ComplaintCategories = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="section-padding">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">
            Complaint Categories
          </h2>
          <div className="heading-divider mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our society management handles various types of complaints and
            maintenance requests. Log in to submit a complaint in any of these
            categories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center card-hover"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <category.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-1">
                {category.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComplaintCategories;
