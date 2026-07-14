import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { LoginPage } from "./components/LoginPage";
import { DashboardHome } from "./components/DashboardHome";
import { BookingsPage } from "./components/BookingsPage";
import { SlotsPage } from "./components/SlotsPage";
import { TurfsPage } from "./components/TurfsPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { SlotOverviewPage } from "./components/slotOverviewPageFolder/SlotOverviewPage";
import { Toaster } from "sonner";
import {
  getRefreshToken,
  clearSession,
  refreshSession,
} from "./authutils";

type ProtectedLayoutProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
};

function ProtectedLayout({
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}: ProtectedLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // null = still checking | true = logged in | false = logged out
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      if (getRefreshToken()) {
        // Always refresh on page load — don't trust the stored access token
        // It may have expired while the tab was closed
        const ok = await refreshSession();
        setIsAuthenticated(ok);
        return;
      }
      setIsAuthenticated(false);
    }
    checkAuth();
  }, []);

  // Proactive refresh — runs every 50 minutes while the app is open
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(
      async () => {
        const ok = await refreshSession();
        if (!ok) handleSessionExpired();
      },
      50 * 60 * 1000,
    ); // 50 minutes
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Explicit logout from Sidebar / TopBar
  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
  };

  // Called by any page when authFetch gets a 401 that can't be refreshed
  const handleSessionExpired = () => {
    clearSession();
    setIsAuthenticated(false);
  };

  // Prevent flash of login page while we check tokens
  if (isAuthenticated === null) return null;

  return (
    <Router>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* ── Public ─────────────────────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ── Protected ──────────────────────────────────────────────────── */}
        <Route
          element={
            isAuthenticated ? (
              <ProtectedLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route
            index
            element={
              <DashboardHome onSessionExpired={handleSessionExpired} />
            }
          />
          <Route
            path="bookings"
            element={
              <BookingsPage onSessionExpired={handleSessionExpired} />
            }
          />
          <Route
            path="slots"
            element={<SlotsPage onSessionExpired={handleSessionExpired} />}
          />
          <Route
            path="slot-overview"
            element={
              <SlotOverviewPage onSessionExpired={handleSessionExpired} />
            }
          />
          <Route
            path="turfs"
            element={<TurfsPage onSessionExpired={handleSessionExpired} />}
          />
          <Route
            path="settings"
            element={
              <SettingsPage onSessionExpired={handleSessionExpired} />
            }
          />
          <Route
            path="profile"
            element={
              <ProfilePage onSessionExpired={handleSessionExpired} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
