import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowUp
} from "lucide-react";

const Footer2 = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    // { name: "Properties", href: "#properties" },
    // { name: "About Us", href: "#about" },

    { name: "Contact", href: "#contact" },
  ];

  

 

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/sitrusgroup/", color: "hover:text-blue-600" },
    // { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/sitrus_projects/", color: "hover:text-pink-600" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/sitrus-projects/", color: "hover:text-blue-700" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-playfair font-bold">
                Sitrus Projects
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
            For over 15 years, Sitrus Projects has been shaping dream communities across Karnataka. We specialize in plotted developments, premium villas, and gated communities—offering buyers transparent titles, approved layouts, and on-time project delivery.
               </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-sm">+919686102055</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-sm">info@sitrusgroup.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm">Vasavi Complex, 147, Seshadripuram Main Rd, Sripuram, Kumara Park West, Seshadripuram, Bengaluru, Karnataka 560020, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
         
          </div>

          {/* Resources & Newsletter */}
          <div>
         
            {/* Newsletter Signup */}
            {/* <div>
              <h4 className="font-medium mb-3">Stay Updated</h4>
              <p className="text-sm text-primary-foreground/80 mb-3">
                Get the latest market insights and property listings.
              </p>
              <div className="flex space-x-2">
                <input 
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-primary-foreground/10 border border-primary-foreground/20 rounded-md text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:border-accent"
                />
                <button className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent-light transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <Separator className="border-primary-foreground/20" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-primary-foreground/80">
            © {currentYear} Sitrus Projects. All rights reserved. 
            {/* <a href="#" className="hover:text-accent transition-colors duration-200 ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-accent transition-colors duration-200 ml-1">Terms of Service</a> */}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-primary-foreground/80">Follow us:</span>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-200 ${social.color}`}
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-accent hover:bg-accent-light text-accent-foreground transition-colors duration-200"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

  
    </footer>
  );
};

export default Footer2;