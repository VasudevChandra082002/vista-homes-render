import React, { useState } from "react";
import { login } from "@/api/authApi";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { setAuth } from "@/utils/auth";
import { getToken } from "@/utils/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  // If already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      console.log("Logged in successfully", data);
      setAuth({ token: data.token, admin: data.admin });

      // If user was redirected here, go back to intended route; else to dashboard
      const target = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero animate-fade-in ">
      <div className="bg-card shadow-card rounded-2xl p-10 w-full max-w-md animate-slide-up border border-primary">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-destructive text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
