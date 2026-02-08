import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Society Info */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">
              Green Valley Society
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              A premier residential community providing quality living with
              modern amenities and a peaceful environment for families.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { path: "/about", label: "About Society" },
                { path: "/facilities", label: "Facilities" },
                { path: "/notices", label: "Notice Board" },
                { path: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-base font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Green Valley Complex</li>
              <li>Sector 15, New Delhi - 110001</li>
              <li>Phone: +91 11-2345-6789</li>
              <li>Email: info@greenvalley.com</li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="font-heading text-base font-bold mb-4">Office Hours</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 2:00 PM</li>
              <li>Sunday: Closed</li>
              <li className="pt-2 text-primary-foreground/90">
                Emergency: 24/7 Available
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} Green Valley Residential Society. All
              rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-background/60 hover:text-background transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-use"
                className="text-background/60 hover:text-background transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
