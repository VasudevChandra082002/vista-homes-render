import React from "react";
import { getAdmin, clearAuth } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const admin = getAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border shadow-card">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Admin Panel</div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            {admin?.name ? `Hello, ${admin.name}` : "Welcome"}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover-lift transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
