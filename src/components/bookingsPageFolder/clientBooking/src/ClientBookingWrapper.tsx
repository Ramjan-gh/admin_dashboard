import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { MemoryRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

interface Props {
  onBookingComplete?: () => void;
}

export default function ClientBookingWrapper({ onBookingComplete }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
      <div className="client-booking-scope bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <HomePage
          currentUser={currentUser}
          onBookingComplete={onBookingComplete}
        />
        <Toaster />
      </div>
  );
}
