import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-muted text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-background" style={{ backgroundColor: "hsl(var(--background))" }}>
          <Header />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
