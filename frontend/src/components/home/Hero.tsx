import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-society.jpg";

const Hero = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Green Valley Residential Society"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding w-full">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6">
            Welcome to
            <br />
            <span className="text-white/90">Green Valley Society</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
            A peaceful residential community where modern living meets natural
            beauty. Experience quality life with world-class amenities and a
            caring neighborhood.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary bg-white text-primary hover:bg-white/90">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
