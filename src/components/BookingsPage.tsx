import { useState } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, X } from 'lucide-react';

export function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const bookings = [
    {
      id: '1CE6443C',
      customer: 'Ramjan Ali',
      phone: '01540140958',
      email: 'ramzanhinday@gmail.com',
      date: 'Dec 9, 2025',
      time: '08:00 - 09:30',
      sport: 'Football',
      field: 'Field A',
      payment: 'Bkash',
      paymentType: 'Confirmation',
      amount: 2500,
      status: 'confirmed',
    },
    {
      id: '2BF7554D',
      customer: 'Karim Ahmed',
      phone: '01623456789',
      email: 'karim@example.com',
      date: 'Dec 9, 2025',
      time: '10:00 - 11:30',
      sport: 'Cricket',
      field: 'Field B',
      payment: 'Nagad',
      paymentType: 'Full Payment',
      amount: 3000,
      status: 'confirmed',
    },
    {
      id: '3AG8665E',
      customer: 'Rahim Uddin',
      phone: '01734567890',
      email: 'rahim@example.com',
      date: 'Dec 9, 2025',
      time: '14:00 - 15:30',
      sport: 'Football',
      field: 'Field A',
      payment: 'Cash',
      paymentType: 'Pending',
      amount: 2500,
      status: 'pending',
    },
    {
      id: '4BH9776F',
      customer: 'Jamal Hossain',
      phone: '01845678901',
      email: 'jamal@example.com',
      date: 'Dec 10, 2025',
      time: '16:00 - 17:30',
      sport: 'Badminton',
      field: 'Field C',
      payment: 'Bkash',
      paymentType: 'Full Payment',
      amount: 1500,
      status: 'confirmed',
    },
    {
      id: '5CI0887G',
      customer: 'Sakib Khan',
      phone: '01956789012',
      email: 'sakib@example.com',
      date: 'Dec 10, 2025',
      time: '18:00 - 19:30',
      sport: 'Football',
      field: 'Field A',
      payment: 'Cash',
      paymentType: 'Confirmation',
      amount: 2500,
      status: 'pending',
    },
    {
      id: '6DJ1998H',
      customer: 'Arif Hassan',
      phone: '01067890123',
      email: 'arif@example.com',
      date: 'Dec 11, 2025',
      time: '09:00 - 10:30',
      sport: 'Cricket',
      field: 'Field B',
      payment: 'Nagad',
      paymentType: 'Full Payment',
      amount: 3000,
      status: 'confirmed',
    },
    {
      id: '7EK2009I',
      customer: 'Farhan Ahmed',
      phone: '01178901234',
      email: 'farhan@example.com',
      date: 'Dec 11, 2025',
      time: '15:00 - 16:30',
      sport: 'Football',
      field: 'Field D',
      payment: 'Bkash',
      paymentType: 'Confirmation',
      amount: 2500,
      status: 'cancelled',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'Football':
        return 'bg-blue-500';
      case 'Cricket':
        return 'bg-purple-500';
      case 'Badminton':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Bookings Management</h1>
          <p className="text-gray-500">View and manage all turf bookings</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
          <Plus className="w-5 h-5" />
          <span>Add Booking</span>
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking code, customer name, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {filterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Date Range</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Field</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Fields</option>
                <option>Field A</option>
                <option>Field B</option>
                <option>Field C</option>
                <option>Field D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Sport</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Sports</option>
                <option>Football</option>
                <option>Cricket</option>
                <option>Badminton</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Booking ID</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Sport</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Field</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Payment</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm text-purple-600">{booking.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{booking.customer}</p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{booking.date}</p>
                      <p className="text-xs text-gray-500">{booking.time}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getSportColor(booking.sport)}`} />
                      <span className="text-sm text-gray-700">{booking.sport}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{booking.field}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{booking.payment}</p>
                      <p className="text-xs text-gray-500">{booking.paymentType}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">৳{booking.amount}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1 to 7 of 7 bookings</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm text-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 bg-purple-500 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm text-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Booking Code</p>
                <p className="text-purple-600">{selectedBooking.id}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-gray-900">{selectedBooking.customer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{selectedBooking.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                    <span className="text-white text-sm">✉️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedBooking.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900">{selectedBooking.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
                    <span className="text-white text-sm">⏰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Slot</p>
                    <p className="text-gray-900">{selectedBooking.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getSportColor(selectedBooking.sport)} flex items-center justify-center`}>
                    <span className="text-white text-sm">⚽</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sport</p>
                    <p className="text-gray-900">{selectedBooking.sport}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Payment Information</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Method</span>
                    <span className="text-sm text-gray-900">{selectedBooking.payment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Type</span>
                    <span className="text-sm text-gray-900">{selectedBooking.paymentType}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">৳{selectedBooking.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Edit Booking
                </button>
                <button className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
