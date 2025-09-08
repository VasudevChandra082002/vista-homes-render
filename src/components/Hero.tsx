import rowvillas from "@/assets/rowvilla.png";
import logo3 from "@/assets/logo3.jpeg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden scroll-mt-[92px] md:scroll-mt-[104px]"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={logo3}
          alt="Luxury real estate property"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-black/10 to-transparent pointer-events-none" />
      </div>

      <div
        className="relative z-10 min-h-screen
                      pt-[92px] md:pt-[104px] 
                      container mx-auto px-4 sm:px-6 lg:px-8
                      flex items-start  justify-center sm:justify-end"
      >
        <div className="max-w-[min(90vw,48rem)] text-center sm:text-right mr-0 sm:mr-4 md:mr-10 ">
          <h1
            className="text-3xl md:text-6xl lg:text-6xl font-playfair font-bold italic
                       leading-[1.15] tracking-tight mb-6
                       filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
          >
            <span
              // className="inline-block
              //            bg-gradient-to-r from-[#C68B3C] via-[#D8A960] to-[#EFD19A]
              //            bg-clip-text text-transparent
              //            px-[0.06em] pb-[0.06em]"
              className="inline-block text-white px-[0.06em] pb-[0.06em]"
            >
              Find your perfect space
              <br className="hidden sm:block" />
              with Sitrus.
            </span>
          </h1>
          {/* Optional CTAs
          <div className="flex justify-center sm:justify-end gap-3">
            <button className="bg-gradient-primary text-white px-5 py-2 rounded-lg">Explore Projects</button>
            <button className="border border-white/60 text-white px-5 py-2 rounded-lg">Contact Us</button>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
