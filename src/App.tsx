import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminMerchants from "./pages/AdminMerchants";
import AdminTransactions from "./pages/AdminTransactions";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import AdminFraud from "./pages/AdminFraud";
import Checkout from "./pages/Checkout";
import { validateSession, getSessionCookie } from "./lib/session";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSession] = useState(() => Boolean(getSessionCookie()));

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!hasSession) {
        if (isMounted && location.pathname !== "/admin/login") {
          navigate("/admin/login", { replace: true });
        }
        return;
      }

      // Validate session in background
      try {
        const session = await validateSession();
        if (!session && isMounted && location.pathname !== "/admin/login") {
          navigate("/admin/login", { replace: true });
        }
      } catch (error) {
        if (isMounted && location.pathname !== "/admin/login") {
          navigate("/admin/login", { replace: true });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [hasSession, navigate, location.pathname]);

  if (!hasSession) {
    return null;
  }

  return children;
};

const RedirectIfAuthed = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const hasSession = Boolean(getSessionCookie());

      if (!hasSession) {
        return;
      }

      // Validate session and redirect if valid
      try {
        const session = await validateSession();
        if (session && isMounted && location.pathname === "/admin/login") {
          navigate("/admin/dashboard", { replace: true });
        }
      } catch (error) {
        // Session invalid, stay on login page
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, location.pathname]);

  // Show login page immediately, validation happens in background
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/admin/login"
            element={
              <RedirectIfAuthed>
                <AdminLogin />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/merchants"
            element={
              <ProtectedRoute>
                <AdminMerchants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute>
                <AdminTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fraud"
            element={
              <ProtectedRoute>
                <AdminFraud />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
