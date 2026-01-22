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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("sb-access-token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sb-access-token");
    localStorage.removeItem("sb-user");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) return null;

  return (
    <Router>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public Route */}
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

        {/* Protected Dashboard Routes */}
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
                      <Route path="/" element={<DashboardHome />} />
                      {/* <Route path="/bookings" element={<BookingsPage />} /> */}
                      {/* <Route path="/slots" element={<SlotsPage />} /> */}
                      <Route path="/turfs" element={<TurfsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      {/* <Route path="/profile" element={<ProfilePage />} /> */}
                      {/* Catch-all inside dashboard */}
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
