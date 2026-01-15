import { User, Mail, Shield, Calendar, MapPin, BadgeCheck } from "lucide-react";

export function ProfilePage() {
  // Get user data from localStorage
  const userJson = localStorage.getItem("sb-user");
  const user = userJson ? JSON.parse(userJson) : null;

  const fullName = user?.user_metadata?.full_name || "Super Admin";
  const email = user?.email || "admin@turfbook.com";
  const role = "System Administrator"; // Static for UI or from user metadata
  const joinedDate =
    new Date(user?.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }) || "January 2024";

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        {/* Left Column: Brief Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Account Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-bold text-xs">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Quick Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Full Access Permissions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Full Name
                </label>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <User className="w-4 h-4 text-blue-500" />
                  {fullName}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2 ">
                  <Mail className="" />
                  <p className="text-sm  text-gray-900">{email}</p>
                </div>
              </div>
              
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Security Note</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You are currently logged in as a Super Admin. To change your
                  password or security settings, please contact authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
