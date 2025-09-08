import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PropertyDetails from "@/components/PropertyDetails";
import BackgroundSection from "@/components/BackgroundSection";
import Aboutus from "@/assets/aboutus.png";
import Footer2 from "@/components/Footer2";
const UserProperty = () => {
  return (
    <div
      className="min-h-screen bg-background page-photo"
      style={{
        "--page-image": `url(${Aboutus})`,

        "--overlay-alpha": 0.78, // raise to darken, lower to brighten

        "--page-position": "50% 30%", // tweak focal point
      }}
    >
      <Header />

      <main>
    

        {/* Team */}
        <BackgroundSection
          image={Aboutus}
          overlayAlpha={0.78}
          position="50% 35%"
          parallax
        >
          <PropertyDetails />
        </BackgroundSection>


        {/* Contact */}
        <BackgroundSection
          image={Aboutus}
          overlayAlpha={0.8}
          // position="50% 50%"
          parallax
        >
          <Contact />
        </BackgroundSection>
      </main>

      <Footer2 />
     
    </div>
  );
};

export default UserProperty;
