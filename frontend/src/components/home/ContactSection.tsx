import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    flatNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.flatNumber.trim()) {
      newErrors.flatNumber = "Flat number is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      setFormData({ name: "", flatNumber: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <section className="section-alt py-16 md:py-24">
      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">
              Contact Us
            </h2>
            <div className="heading-divider" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              Have a question or need assistance? Reach out to our society
              office. We're here to help you with any queries related to
              maintenance, facilities, or general information.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Society Office
                </h3>
                <p className="text-muted-foreground text-sm">
                  Block A, Ground Floor
                  <br />
                  Green Valley Complex
                  <br />
                  Sector 15, New Delhi - 110001
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Contact Details
                </h3>
                <p className="text-muted-foreground text-sm">
                  Phone: +91 11-2345-6789
                  <br />
                  Email: info@greenvalley.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Office Hours
                </h3>
                <p className="text-muted-foreground text-sm">
                  Mon - Fri: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  Your message has been sent to the society office.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`form-input ${
                      errors.name ? "border-destructive" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="flatNumber"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Flat Number
                  </label>
                  <input
                    type="text"
                    id="flatNumber"
                    name="flatNumber"
                    value={formData.flatNumber}
                    onChange={handleChange}
                    placeholder="e.g., A-101"
                    className={`form-input ${
                      errors.flatNumber ? "border-destructive" : ""
                    }`}
                  />
                  {errors.flatNumber && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.flatNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className={`form-input resize-none ${
                      errors.message ? "border-destructive" : ""
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
