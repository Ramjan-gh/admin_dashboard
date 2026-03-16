import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import { Toaster } from "sonner";
import {
  getAccessToken,
  getRefreshToken,
  clearSession,
  refreshSession,
} from "./authutils";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // null = still checking | true = logged in | false = logged out
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      if (getAccessToken()) {
        // Access token present — treat as authenticated.
        // authFetch() will silently refresh on the first 401.
        setIsAuthenticated(true);
        return;
      }
      if (getRefreshToken()) {
        // No access token but refresh token exists → try a silent refresh now.
        const ok = await refreshSession();
        setIsAuthenticated(ok);
        return;
      }
      // Nothing stored — send to login.
      setIsAuthenticated(false);
    }

    checkAuth();
  }, []);

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
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex h-screen bg-gray-50">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  onLogout={handleLogout}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                  <TopBar
                    setSidebarOpen={setSidebarOpen}
                    onLogout={handleLogout}
                  />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <DashboardHome
                            onSessionExpired={handleSessionExpired}
                          />
                        }
                      />
                      <Route
                        path="/bookings"
                        element={
                          <BookingsPage
                            onSessionExpired={handleSessionExpired}
                          />
                        }
                      />
                      <Route
                        path="/slots"
                        element={
                          <SlotsPage onSessionExpired={handleSessionExpired} />
                        }
                      />
                      <Route
                        path="/turfs"
                        element={
                          <TurfsPage onSessionExpired={handleSessionExpired} />
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <SettingsPage
                            onSessionExpired={handleSessionExpired}
                          />
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProfilePage
                            onSessionExpired={handleSessionExpired}
                          />
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </div>

                {sidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
