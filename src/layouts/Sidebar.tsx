import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Mail,
  Building,
  HelpCircle,
  FileText,
  Menu,
  ChevronLeft,
} from "lucide-react";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 
   hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--primary))] 
   ${
     isActive
       ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--primary))] font-semibold"
       : "text-[hsl(var(--sidebar-foreground))]"
   }`;

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState(false);

  const expanded = open || hovered;

  return (
    <aside
      className={`h-screen sticky top-0 bg-[hsl(var(--sidebar-background))] 
      border-r border-[hsl(var(--sidebar-border))] shadow-card 
      transition-all duration-300 z-50
      ${expanded ? "w-64" : "w-20"}`}
      onMouseEnter={() => !open && setHovered(true)}
      onMouseLeave={() => !open && setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 text-[hsl(var(--primary))]" />
          {expanded && (
            <span className="text-xl font-bold text-[hsl(var(--primary))]">
              Admin
            </span>
          )}
        </div>
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-[hsl(var(--sidebar-accent))]"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5 text-[hsl(var(--sidebar-foreground))]" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 space-y-2">
        <NavLink to="/admin/dashboard" className={navItemClass}>
          <Home className="w-5 h-5" />
          {expanded && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/contactus" className={navItemClass}>
          <Mail className="w-5 h-5" />
          {expanded && <span>Enquiries</span>}
        </NavLink>

        <NavLink to="/admin/properties" className={navItemClass}>
          <Building className="w-5 h-5" />
          {expanded && <span>Properties</span>}
        </NavLink>

        <NavLink to="/admin/faq" className={navItemClass}>
          <HelpCircle className="w-5 h-5" />
          {expanded && <span>FAQ</span>}
        </NavLink>

        <NavLink to="/admin/team" className={navItemClass}>
          <HelpCircle className="w-5 h-5" />
          {expanded && <span>Team</span>}
        </NavLink>

        <NavLink to="/admin/static" className={navItemClass}>
          <FileText className="w-5 h-5" />
          {expanded && <span>Static Pages</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
