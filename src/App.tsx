import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardHome } from './components/DashboardHome';
import { BookingsPage } from './components/BookingsPage';
import { SlotsPage } from './components/SlotsPage';
import { TurfsPage } from './components/TurfsPage';
import { PaymentsPage } from './components/PaymentsPage';
import { UsersPage } from './components/UsersPage';
import { MessagesPage } from './components/MessagesPage';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'bookings':
        return <BookingsPage />;
      case 'slots':
        return <SlotsPage />;
      case 'turfs':
        return <TurfsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'users':
        return <UsersPage />;
      case 'messages':
        return <MessagesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
