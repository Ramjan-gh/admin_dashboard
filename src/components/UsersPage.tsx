// import { useState } from 'react';
// import { Search, Filter, UserPlus, Eye, Mail, Phone, Calendar, Ban } from 'lucide-react';

// export function UsersPage() {
//   const [selectedUser, setSelectedUser] = useState<any>(null);

//   const users = [
//     {
//       id: 1,
//       name: 'Ramjan Ali',
//       email: 'ramzanhinday@gmail.com',
//       phone: '01540140958',
//       joinDate: 'Nov 15, 2025',
//       totalBookings: 12,
//       totalSpent: 30000,
//       status: 'active',
//       lastBooking: 'Dec 9, 2025',
//       favoriteSport: 'Football',
//     },
//     {
//       id: 2,
//       name: 'Karim Ahmed',
//       email: 'karim@example.com',
//       phone: '01623456789',
//       joinDate: 'Oct 22, 2025',
//       totalBookings: 8,
//       totalSpent: 24000,
//       status: 'active',
//       lastBooking: 'Dec 9, 2025',
//       favoriteSport: 'Cricket',
//     },
//     {
//       id: 3,
//       name: 'Rahim Uddin',
//       email: 'rahim@example.com',
//       phone: '01734567890',
//       joinDate: 'Nov 5, 2025',
//       totalBookings: 15,
//       totalSpent: 37500,
//       status: 'active',
//       lastBooking: 'Dec 9, 2025',
//       favoriteSport: 'Football',
//     },
//     {
//       id: 4,
//       name: 'Jamal Hossain',
//       email: 'jamal@example.com',
//       phone: '01845678901',
//       joinDate: 'Sep 12, 2025',
//       totalBookings: 6,
//       totalSpent: 9000,
//       status: 'active',
//       lastBooking: 'Dec 10, 2025',
//       favoriteSport: 'Badminton',
//     },
//     {
//       id: 5,
//       name: 'Sakib Khan',
//       email: 'sakib@example.com',
//       phone: '01956789012',
//       joinDate: 'Nov 28, 2025',
//       totalBookings: 4,
//       totalSpent: 10000,
//       status: 'active',
//       lastBooking: 'Dec 10, 2025',
//       favoriteSport: 'Football',
//     },
//     {
//       id: 6,
//       name: 'Arif Hassan',
//       email: 'arif@example.com',
//       phone: '01067890123',
//       joinDate: 'Oct 10, 2025',
//       totalBookings: 10,
//       totalSpent: 30000,
//       status: 'active',
//       lastBooking: 'Dec 11, 2025',
//       favoriteSport: 'Cricket',
//     },
//   ];

//   const stats = {
//     totalUsers: users.length,
//     activeUsers: users.filter(u => u.status === 'active').length,
//     newThisMonth: users.filter(u => u.joinDate.includes('Nov') || u.joinDate.includes('Dec')).length,
//     totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
//   };

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-gray-900 mb-1">Customer Management</h1>
//           <p className="text-gray-500">View and manage customer profiles</p>
//         </div>
//         <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
//           <UserPlus className="w-5 h-5" />
//           <span>Add Customer</span>
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Total Customers</p>
//               <p className="text-gray-900">{stats.totalUsers}</p>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
//               <UserPlus className="w-6 h-6 text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Active Users</p>
//               <p className="text-gray-900">{stats.activeUsers}</p>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
//               <UserPlus className="w-6 h-6 text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">New This Month</p>
//               <p className="text-gray-900">{stats.newThisMonth}</p>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
//               <Calendar className="w-6 h-6 text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
//               <p className="text-gray-900">৳{stats.totalRevenue.toLocaleString()}</p>
//             </div>
//             <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
//               <Calendar className="w-6 h-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search & Filter */}
//       <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
//         <div className="flex flex-col lg:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or phone..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <Filter className="w-5 h-5 text-gray-600" />
//               <span className="text-gray-700">Filters</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Users Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {users.map((user) => (
//           <div
//             key={user.id}
//             className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
//           >
//             {/* User Header */}
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
//                   <span className="text-white">{user.name[0]}</span>
//                 </div>
//                 <div>
//                   <h3 className="text-gray-900">{user.name}</h3>
//                   <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
//                     {user.status}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Contact Info */}
//             <div className="space-y-2 mb-4">
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Mail className="w-4 h-4" />
//                 <span className="truncate">{user.email}</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Phone className="w-4 h-4" />
//                 <span>{user.phone}</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Calendar className="w-4 h-4" />
//                 <span>Joined {user.joinDate}</span>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="text-xs text-gray-500">Total Bookings</p>
//                 <p className="text-gray-900">{user.totalBookings}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Total Spent</p>
//                 <p className="text-gray-900">৳{user.totalSpent.toLocaleString()}</p>
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="space-y-2 mb-4 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Last Booking</span>
//                 <span className="text-gray-900">{user.lastBooking}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Favorite Sport</span>
//                 <span className="text-purple-600">{user.favoriteSport}</span>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setSelectedUser(user)}
//                 className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow text-sm"
//               >
//                 <Eye className="w-4 h-4" />
//                 <span>View</span>
//               </button>
//               <button className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
//                 <Ban className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* User Details Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h2 className="text-gray-900">Customer Details</h2>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <span className="text-gray-500">✕</span>
//               </button>
//             </div>
//             <div className="p-6 space-y-6">
//               {/* Profile */}
//               <div className="flex items-center gap-4">
//                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
//                   <span className="text-white text-2xl">{selectedUser.name[0]}</span>
//                 </div>
//                 <div>
//                   <h2 className="text-gray-900 mb-1">{selectedUser.name}</h2>
//                   <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
//                     {selectedUser.status}
//                   </span>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div>
//                 <h3 className="text-gray-900 mb-3">Contact Information</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Mail className="w-5 h-5 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Email</p>
//                       <p className="text-sm text-gray-900">{selectedUser.email}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Phone className="w-5 h-5 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Phone</p>
//                       <p className="text-sm text-gray-900">{selectedUser.phone}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Calendar className="w-5 h-5 text-gray-400" />
//                     <div>
//                       <p className="text-xs text-gray-500">Join Date</p>
//                       <p className="text-sm text-gray-900">{selectedUser.joinDate}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Statistics */}
//               <div>
//                 <h3 className="text-gray-900 mb-3">Statistics</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-blue-50 rounded-lg">
//                     <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
//                     <p className="text-2xl text-gray-900">{selectedUser.totalBookings}</p>
//                   </div>
//                   <div className="p-4 bg-purple-50 rounded-lg">
//                     <p className="text-sm text-gray-600 mb-1">Total Spent</p>
//                     <p className="text-2xl text-gray-900">৳{selectedUser.totalSpent.toLocaleString()}</p>
//                   </div>
//                   <div className="p-4 bg-pink-50 rounded-lg">
//                     <p className="text-sm text-gray-600 mb-1">Last Booking</p>
//                     <p className="text-sm text-gray-900">{selectedUser.lastBooking}</p>
//                   </div>
//                   <div className="p-4 bg-green-50 rounded-lg">
//                     <p className="text-sm text-gray-600 mb-1">Favorite Sport</p>
//                     <p className="text-sm text-gray-900">{selectedUser.favoriteSport}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3 pt-4">
//                 <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
//                   View All Bookings
//                 </button>
//                 <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//                   Send Message
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
