import Layout from "@/components/layout/Home/Layout";
import BackButton from "@/components/layout/Home/BackButton";

const TermsOfUse = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="section-alt py-16 md:py-20">
        <div className="section-padding">
          <BackButton />
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            Terms of Use
          </h1>
          <div className="heading-divider" />
          <p className="text-muted-foreground max-w-2xl text-lg">
            Guidelines and regulations for using Green Valley Society portal and facilities.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                1. Respectful Communication
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All residents are expected to maintain respectful and courteous communication when:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Interacting with society management and staff</li>
                <li>Submitting complaints or feedback</li>
                <li>Communicating with fellow residents</li>
                <li>Using the society portal and digital platforms</li>
              </ul>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Abusive, threatening, or inappropriate language will not be tolerated and may result in
                suspension of portal access.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                2. Notice Board Usage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The society notice board (both physical and digital) is intended for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Official society announcements and circulars</li>
                <li>Emergency notifications and safety alerts</li>
                <li>Event announcements and community updates</li>
                <li>Maintenance schedules and service information</li>
              </ul>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Personal advertisements, commercial promotions, or non-society related content is not
                permitted without prior approval from the management committee.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                3. Complaint System Guidelines
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using the complaint registration system, residents must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Select the appropriate complaint category</li>
                <li>Include relevant details to help expedite resolution</li>
                <li>Avoid duplicate submissions for the same issue</li>
                <li>Allow reasonable time for complaint resolution</li>
              </ul>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                False or malicious complaints may result in disciplinary action as per society bylaws.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                4. Society Regulations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All residents must adhere to the following society regulations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Maintain noise levels within acceptable limits, especially during night hours (10 PM - 7 AM)</li>
                <li>Use common facilities responsibly and as per designated timings</li>
                <li>Follow parking guidelines and use only allocated parking spaces</li>
                <li>Dispose of garbage properly using designated bins and collection times</li>
                <li>Inform security about visitors and delivery personnel</li>
                <li>Obtain permission for any structural modifications to your apartment</li>
                <li>Keep balconies and common areas clean and obstruction-free</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                5. Facility Booking Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When booking society facilities (community hall, club house, etc.):
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Bookings must be made at least 7 days in advance</li>
                <li>A refundable security deposit may be required</li>
                <li>The facility must be left clean and in good condition</li>
                <li>Any damages will be charged to the booking resident</li>
                <li>Cancellations must be made at least 48 hours in advance</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                6. Account Responsibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Residents are responsible for maintaining the security of their portal login credentials.
                Do not share your password with others. Report any unauthorized access to the society
                office immediately.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl text-foreground font-bold mb-4">
                7. Amendments
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The society management reserves the right to modify these terms of use as necessary.
                Residents will be notified of any changes through the official notice board and portal
                announcements.
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

export default TermsOfUse;
