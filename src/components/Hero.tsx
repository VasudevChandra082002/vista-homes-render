import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury real estate property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white leading-tight mb-6">
              Find Your
              <span className="text-accent block">Dream Home</span>
              Today
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Discover exceptional properties in prime locations. Your perfect home awaits with PrimeEstate.
            </p>
          </div>

          {/* Search Form */}
          <div className="animate-slide-up bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter city, neighborhood..."
                    className="pl-10 h-12 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Property Type</label>
                <select className="w-full h-12 px-3 rounded-md border border-border/50 bg-background focus:border-primary focus:outline-none">
                  <option>All Types</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Villa</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Price Range</label>
                <select className="w-full h-12 px-3 rounded-md border border-border/50 bg-background focus:border-primary focus:outline-none">
                  <option>Any Price</option>
                  <option>$100K - $300K</option>
                  <option>$300K - $600K</option>
                  <option>$600K - $1M</option>
                  <option>$1M+</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 h-12 border-border/50 hover:bg-muted"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 h-12 bg-gradient-primary hover:bg-primary-dark transition-all duration-200"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-scale-in">
            {[
              { number: "10K+", label: "Properties Listed" },
              { number: "5K+", label: "Happy Clients" },
              { number: "50+", label: "Cities Covered" },
              { number: "15+", label: "Years Experience" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;