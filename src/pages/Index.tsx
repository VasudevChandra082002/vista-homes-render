// import Header from "@/components/Header";
// import Hero from "@/components/Hero";
// import FeaturedProperties from "@/components/FeaturedProperties";
// import About from "@/components/About";
// import FAQ from "@/components/FAQ";
// import Contact from "@/components/Contact";
// import Footer from "@/components/Footer";
// import MeetOurTeam from "@/components/MeetOurTeam";

// const Index = () => {
//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//       <main>
//         <Hero />
//         <FeaturedProperties />
//         <About />
//         <MeetOurTeam />
//         <FAQ />
//         <Contact />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Index;

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MeetOurTeam from "@/components/MeetOurTeam";
import BackgroundSection from "@/components/BackgroundSection";
import Aboutus from "@/assets/aboutus.png";
const Index = () => {
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
        <Hero />

        <BackgroundSection
          image={Aboutus}
          overlayAlpha={0.8}
          position="50% 30%"
          parallax
        >
          <FeaturedProperties />
        </BackgroundSection>

        {/* About */}
        <BackgroundSection
          image={Aboutus}
          overlayAlpha={0.8}
          position="50% 30%"
          parallax
        >
          <About />
        </BackgroundSection>

        {/* Team */}
        <BackgroundSection
          image={Aboutus}
          overlayAlpha={0.78}
          position="50% 35%"
          parallax
        >
          <MeetOurTeam />
        </BackgroundSection>

        {/* FAQ */}
        <BackgroundSection
          image={Aboutus}
          overlayAlpha={0.82}
          // position="50% 25%"
          parallax={false}
        >
          <FAQ />
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

      <Footer />
     
    </div>
  );
};

export default Index;
