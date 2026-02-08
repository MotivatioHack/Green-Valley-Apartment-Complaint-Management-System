import Layout from "@/components/layout/Home/Layout";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ComplaintCategories from "@/components/home/ComplaintCategories";
import NoticeBoard from "@/components/home/NoticeBoard";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <AboutSection />
      <ComplaintCategories />
      <NoticeBoard />
      <FacilitiesSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
