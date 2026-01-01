import { useState } from 'react';
import { Search, Filter, Download, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

export function PaymentsPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  const payments = [
    {
      id: 'TXN001',
      bookingId: '1CE6443C',
      customer: 'Ramjan Ali',
      date: 'Dec 9, 2025',
      method: 'Bkash',
      type: 'Confirmation',
      amount: 2500,
      status: 'completed',
      transactionId: 'BKS789456123',
    },
    {
      id: 'TXN002',
      bookingId: '2BF7554D',
      customer: 'Karim Ahmed',
      date: 'Dec 9, 2025',
      method: 'Nagad',
      type: 'Full Payment',
      amount: 3000,
      status: 'completed',
      transactionId: 'NGD456789321',
    },
    {
      id: 'TXN003',
      bookingId: '3AG8665E',
      customer: 'Rahim Uddin',
      date: 'Dec 9, 2025',
      method: 'Cash',
      type: 'Pending',
      amount: 2500,
      status: 'pending',
      transactionId: '-',
    },
    {
      id: 'TXN004',
      bookingId: '4BH9776F',
      customer: 'Jamal Hossain',
      date: 'Dec 10, 2025',
      method: 'Bkash',
      type: 'Full Payment',
      amount: 1500,
      status: 'completed',
      transactionId: 'BKS123789456',
    },
    {
      id: 'TXN005',
      bookingId: '5CI0887G',
      customer: 'Sakib Khan',
      date: 'Dec 10, 2025',
      method: 'Cash',
      type: 'Confirmation',
      amount: 2500,
      status: 'pending',
      transactionId: '-',
    },
    {
      id: 'TXN006',
      bookingId: '6DJ1998H',
      customer: 'Arif Hassan',
      date: 'Dec 11, 2025',
      method: 'Nagad',
      type: 'Full Payment',
      amount: 3000,
      status: 'completed',
      transactionId: 'NGD987654321',
    },
    {
      id: 'TXN007',
      bookingId: '7EK2009I',
      customer: 'Farhan Ahmed',
      date: 'Dec 11, 2025',
      method: 'Bkash',
      type: 'Confirmation',
      amount: 2500,
      status: 'failed',
      transactionId: 'BKS456123789',
    },
  ];

  const stats = {
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    completedToday: payments.filter(p => p.status === 'completed' && p.date === 'Dec 9, 2025').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Bkash':
        return 'text-pink-600';
      case 'Nagad':
        return 'text-orange-600';
      case 'Cash':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Payments Management</h1>
        <p className="text-gray-500">Track and manage all payment transactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-gray-900">৳{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed Today</p>
              <p className="text-gray-900">{stats.completedToday}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Payments</p>
              <p className="text-gray-900">{stats.pendingPayments}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Failed Payments</p>
              <p className="text-gray-900">{stats.failedPayments}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID, booking code, or customer..."
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
              <label className="block text-sm text-gray-700 mb-2">Payment Method</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Methods</option>
                <option>Bkash</option>
                <option>Nagad</option>
                <option>Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Payment Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Types</option>
                <option>Full Payment</option>
                <option>Confirmation</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Booking ID</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Method</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{payment.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-purple-600">{payment.bookingId}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{payment.customer}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{payment.date}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm ${getMethodColor(payment.method)}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{payment.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">৳{payment.amount}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1 to 7 of 7 transactions</p>
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

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-pink-100">
              <CreditCard className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-gray-900">Bkash</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transactions</span>
              <span className="text-gray-900">
                {payments.filter(p => p.method === 'Bkash').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-900">
                ৳{payments.filter(p => p.method === 'Bkash' && p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-gray-900">Nagad</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transactions</span>
              <span className="text-gray-900">
                {payments.filter(p => p.method === 'Nagad').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-900">
                ৳{payments.filter(p => p.method === 'Nagad' && p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900">Cash</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transactions</span>
              <span className="text-gray-900">
                {payments.filter(p => p.method === 'Cash').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-900">
                ৳{payments.filter(p => p.method === 'Cash' && p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
