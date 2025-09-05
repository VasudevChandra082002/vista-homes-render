import React from "react";
import Logoone from "@/assets/logonone.png";

const Header2: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Taller header like the main one */}
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo + brand */}
          <a href="#home" className="flex items-center gap-3">
            <img
              src={Logoone}
              alt="Sitrus Projects logo"
              className="h-14 w-auto md:h-20 object-contain"
            />
            <span className="text-2xl md:text-3xl font-raleway text-foreground tracking-wide">
              Sitrus Projects
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header2;
