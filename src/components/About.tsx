import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Home, TrendingUp, Shield, Clock } from "lucide-react";

const About = () => {
  const services = [
    {
      icon: Home,
      title: "Land Development",
      description: "End-to-end transformation of raw land into planned residential layouts with roads, utilities, and approvals.",
    },
    {
      icon: TrendingUp,
      title: "Plotted Communities",
      description: "RERA-approved plotted developments with infrastructure like roads, drainage, lighting, and landscaped parks",
    },
    {
      icon: Shield,
      title: "Approvals & Compliance",
      description: "Complete support for RERA, BDA, BMRDA, and CUDA approvals with transparent documentation.",
    },
    {
      icon: Clock,
      title: "Customer  Support",
      description: "Guidance from site visits to registration and after-sales services, ensuring a smooth property journey",
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "Industry Awards",
      description: "On-time delivery across multiple phases in Chikkaballapur & Nandi Hills region",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Civil, planning & MEP specialists with global PMO practices",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="animate-fade-in">
            {/* <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              About Sitrus Projects
            </Badge> */}
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-6">
              Your Trusted Partner in
              <span className="text-primary block">Real Estate Excellence</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
             For over 15 years, Sitrus Projects has been shaping dream communities across Karnataka. We specialize in plotted developments, premium villas, and gated communities—offering buyers transparent titles, approved layouts, and on-time project delivery.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <achievement.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:bg-primary-dark transition-all duration-200"
              >
                Learn More About Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                Meet Our Team
              </Button>
            </div>
          </div>

          {/* Services Side */}
          <div className="animate-slide-up">
            <h3 className="text-2xl font-playfair font-bold text-foreground mb-8">
              Our Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="group border-0 shadow-card hover-lift bg-gradient-card transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                      {service.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;