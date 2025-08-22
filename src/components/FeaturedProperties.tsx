import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      image: property1,
      title: "Modern Luxury Villa",
      price: "$1,250,000",
      location: "Beverly Hills, CA",
      beds: 4,
      baths: 3,
      sqft: "3,200",
      type: "Villa",
      featured: true,
    },
    {
      id: 2,
      image: property2,
      title: "Contemporary Pool House",
      price: "$890,000",
      location: "Miami Beach, FL",
      beds: 3,
      baths: 2,
      sqft: "2,800",
      type: "House",
      featured: false,
    },
    {
      id: 3,
      image: property3,
      title: "Downtown Penthouse",
      price: "$2,100,000",
      location: "Manhattan, NY",
      beds: 3,
      baths: 3,
      sqft: "2,500",
      type: "Penthouse",
      featured: true,
    },
  ];

  return (
    <section id="properties" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties in the most desirable locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <Card
              key={property.id}
              className="group overflow-hidden border-0 shadow-card hover-lift hover-scale bg-card/50 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  {property.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {property.type}
                  </Badge>
                </div>
                
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-accent" />
                </button>
                
                {/* Price Overlay */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-2xl font-bold text-white">
                    {property.price}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-playfair font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-4">
                    {property.price}
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.beds} beds</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths} baths</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Square className="w-4 h-4" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    View Details
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-primary hover:bg-primary-dark transition-all duration-200"
                  >
                    Schedule Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;