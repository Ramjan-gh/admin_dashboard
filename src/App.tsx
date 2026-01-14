import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LoginPage } from "./components/LoginPage";
import { DashboardHome } from './components/DashboardHome';
import { BookingsPage } from './components/BookingsPage';
import { SlotsPage } from './components/SlotsPage';
import { TurfsPage } from './components/TurfsPage';
// import { PaymentsPage } from './components/PaymentsPage';
// import { UsersPage } from './components/UsersPage';
// import { MessagesPage } from './components/MessagesPage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from "./components/ProfilePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for token on startup
    const token = localStorage.getItem("sb-access-token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sb-access-token");
    localStorage.removeItem("sb-user");
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome />;
      case "bookings":
        return <BookingsPage />;
      case "slots":
        return <SlotsPage />;
      case "turfs":
        return <TurfsPage />;

      // case "payments":
      //   return <PaymentsPage />;

      // case "users":
      //   return <UsersPage />;

      // case "messages":
      //   return <MessagesPage />;

      case "settings":
        return <SettingsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardHome />;
    }
  };

  // Loading state while checking token
  if (isAuthenticated === null) return null;

  // If not logged in, show LoginPage
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If logged in, show Main Dashboard

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout} // Pass logout to sidebar if needed
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* You might want to pass handleLogout to TopBar too */}
        <TopBar
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
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
