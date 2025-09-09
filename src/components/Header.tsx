import { useState } from "react";
import { Menu, X, Search, User, Phone, Home } from "lucide-react";
import Logoone from "@/assets/logonone.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Properties", href: "#properties", icon: Search },
    { name: "About us", href: "#about", icon: User },
    { name: "Contact", href: "#contact", icon: Phone },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo - adjusted for all screen sizes */}
          <a href="#home" className="flex items-center gap-2 md:gap-3 flex-shrink-0 max-w-[60%] md:max-w-[40%] lg:max-w-none">
            <img
              src={Logoone}
              alt="Sitrus Projects logo"
              className="h-10 w-auto md:h-16 lg:h-20 object-contain flex-shrink-0"
            />
            <span className="text-xl md:text-2xl lg:text-3xl font-raleway text-foreground tracking-wide truncate">
              Sitrus Projects
            </span>
          </a>

          {/* Desktop Navigation - hidden below 1150px */}
          <nav className="hidden xl:flex items-center absolute left-3/4 -translate-x-1/2 gap-4 lg:gap-8 xl:gap-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium text-sm md:text-base lg:text-lg"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Menu Button - shown below 1150px */}
          <button
            className="xl:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - shown below 1150px when menu is open */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-white backdrop-blur-md animate-fade-in">
            <nav className="flex flex-col items-center space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200 w-full justify-center text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon ? <item.icon className="w-5 h-5" /> : null}
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;