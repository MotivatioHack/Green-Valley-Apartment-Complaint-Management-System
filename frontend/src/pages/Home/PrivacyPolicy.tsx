import Layout from "@/components/layout/Home/Layout";
import BackButton from "@/components/layout/Home/BackButton";

const PrivacyPolicy = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <BackButton />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            Privacy Policy
          </h1>
          <div className="heading-divider" />
          <p className="text-muted-foreground max-w-2xl text-lg">
            Your privacy matters to us. Learn how Green Valley Society handles your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Green Valley Residential Society collects personal information from residents to facilitate
                community management and services. This includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Name, contact details, and flat/apartment number</li>
                <li>Family member information for security purposes</li>
                <li>Vehicle registration details for parking management</li>
                <li>Complaint and maintenance request records</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                2. Resident Data Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All resident data is stored securely and is accessible only to authorized society management
                personnel. We do not share your personal information with third parties except when required
                by law or for essential services (e.g., maintenance contractors who need access to specific
                apartment information to perform their duties).
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                3. Complaint Confidentiality
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All complaints submitted through our portal are treated with strict confidentiality.
                The details of your complaint are only shared with the relevant committee members and
                personnel responsible for resolution. Your identity is protected in cases where anonymous
                reporting is permitted.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                4. Society Management Usage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The society management uses your information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Sending important notices and announcements</li>
                <li>Processing maintenance charges and dues</li>
                <li>Coordinating maintenance and repair work</li>
                <li>Managing facility bookings and amenities access</li>
                <li>Emergency communication and safety alerts</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. Our digital systems are
                regularly updated and secured.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                6. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or wish to access, update, or delete
                your personal information, please contact our society office:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Email:</strong> privacy@greenvalley.com
                <br />
                <strong className="text-foreground">Phone:</strong> +91 11-2345-6789
                <br />
                <strong className="text-foreground">Address:</strong> Block A, Ground Floor, Green Valley Complex
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
