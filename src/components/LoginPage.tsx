import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

import { LoginPageProps } from "./types";

const SUPABASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      const hashString = window.location.hash;
      if (!hashString || !hashString.includes("access_token=")) return;

      if (isMounted) setLoading(true);

      try {
  const urlParams = new URLSearchParams(hashString.substring(1));
  const accessToken = urlParams.get("access_token");
  const refreshToken = urlParams.get("refresh_token");

  if (accessToken) {
    // 1. Make the API request directly using the extraction variable 
    // DO NOT write to localStorage yet!
    const userRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
      method: "POST", 
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
    });

    if (userRes.ok) {
      const isAdmin = await userRes.json(); 

      // 2. STRICT VALIDATION PASSED
      if (isAdmin === true) {
  // Fetch the actual user record so Sidebar/Profile don't fall back to defaults
  const userInfoRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
  });

  const userData = userInfoRes.ok ? await userInfoRes.json() : { isAdmin: true };

  localStorage.setItem("sb-access-token", accessToken);
  if (refreshToken) {
    localStorage.setItem("sb-refresh-token", refreshToken);
  }
  localStorage.setItem("sb-user", JSON.stringify(userData));

  window.history.replaceState(null, "", window.location.pathname);
  if (isMounted) onLoginSuccess();
} else {
        // ❌ Explicit False: Clean up URL bar and reject
        window.history.replaceState(null, "", window.location.pathname);
        toast.error("Access Denied: You do not have admin permissions.");
      }
    } else {
      window.history.replaceState(null, "", window.location.pathname);
      toast.error("Failed to verify admin status.");
    }
  }
} catch (error) {
  console.error("Auth routing extraction exception error:", error);
  window.history.replaceState(null, "", window.location.pathname);
  toast.error("An error occurred while parsing auth credentials.");
} finally {
  if (isMounted) setLoading(false);
}
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [onLoginSuccess]);

  const handleGoogleLogin = () => {
    setLoading(true);
    const currentOrigin = window.location.origin; 
    const redirectUrl = `${currentOrigin}/login`; 
    
    const providerUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}&prompt=select_account`;
    window.location.href = providerUrl;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 mt-2">
            Access your turf management dashboard
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition transform active:scale-[0.98] disabled:opacity-50 disabled:transform-none shadow-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Authenticating...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.3 1.56-1.17 2.88-2.48 3.75v3.13h4.01c2.34-2.16 3.61-5.34 3.61-8.73z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.13c-1.12.75-2.55 1.19-3.92 1.19-3.04 0-5.63-2.06-6.55-4.83H1.31v3.23C3.29 21.57 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.45 14.32a7.14 7.14 0 0 1 0-4.64V6.45H1.31a12 12 0 0 0 0 11.1l4.14-3.23z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.43 1.31 6.45l4.14 3.23c.92-2.77 3.51-4.83 6.55-4.83z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}