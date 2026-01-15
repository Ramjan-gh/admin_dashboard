import { Menu, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  // setCurrentPage is no longer needed
}

export function TopBar({ setSidebarOpen, onLogout }: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  const userJson = localStorage.getItem("sb-user");
  const user = userJson ? JSON.parse(userJson) : null;
  const fullName = user?.user_metadata?.full_name || "Admin User";

  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 relative z-20">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-700 hover:text-gray-900 p-1"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Welcome Text */}
        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-gray-500 italic">
            Welcome back,{" "}
            <span className="text-gray-900 font-bold not-italic">
              {fullName}
            </span>
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />

                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold truncate text-gray-900">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-1">
                    {/* Updated Profile Link to use Navigate */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile"); // Use navigate instead of setCurrentPage
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      My Profile
                    </button>

                    <div className="h-px bg-gray-100 my-1" />

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
