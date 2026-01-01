import { useState } from 'react';
import { Search, Mail, MailOpen, CheckCircle, Clock } from 'lucide-react';

export function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const messages = [
    {
      id: 1,
      name: 'Ramjan Ali',
      email: 'ramzanhinday@gmail.com',
      phone: '01540140958',
      subject: 'Booking Cancellation Request',
      message: 'Hi, I need to cancel my booking for tomorrow. Could you please help me with this? The booking code is 1CE6443C.',
      date: 'Dec 12, 2025',
      time: '10:30 AM',
      status: 'unread',
      priority: 'high',
    },
    {
      id: 2,
      name: 'Karim Ahmed',
      email: 'karim@example.com',
      phone: '01623456789',
      subject: 'Field Availability Query',
      message: 'Hello, I wanted to know if Field B is available for cricket on December 15th evening slot. Please let me know.',
      date: 'Dec 12, 2025',
      time: '09:15 AM',
      status: 'unread',
      priority: 'medium',
    },
    {
      id: 3,
      name: 'Rahim Uddin',
      email: 'rahim@example.com',
      phone: '01734567890',
      subject: 'Payment Confirmation',
      message: 'I have made the payment via Bkash. Transaction ID: BKS123456789. Please confirm my booking.',
      date: 'Dec 11, 2025',
      time: '04:20 PM',
      status: 'solved',
      priority: 'high',
    },
    {
      id: 4,
      name: 'Jamal Hossain',
      email: 'jamal@example.com',
      phone: '01845678901',
      subject: 'Inquiry about Facilities',
      message: 'Do you have changing rooms and shower facilities? Also, is parking available?',
      date: 'Dec 11, 2025',
      time: '02:10 PM',
      status: 'solved',
      priority: 'low',
    },
    {
      id: 5,
      name: 'Sakib Khan',
      email: 'sakib@example.com',
      phone: '01956789012',
      subject: 'Group Booking Discount',
      message: 'We are a group of 20 people planning regular bookings. Do you offer any group discounts?',
      date: 'Dec 10, 2025',
      time: '11:45 AM',
      status: 'unread',
      priority: 'medium',
    },
  ];

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    solved: messages.filter(m => m.status === 'solved').length,
    high: messages.filter(m => m.priority === 'high' && m.status === 'unread').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-700';
      case 'solved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Messages & Support</h1>
        <p className="text-gray-500">Customer inquiries and contact form submissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Messages</p>
              <p className="text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unread</p>
              <p className="text-gray-900">{stats.unread}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <MailOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Solved</p>
              <p className="text-gray-900">{stats.solved}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">High Priority</p>
              <p className="text-gray-900">{stats.high}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                message.status === 'unread' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.status === 'unread'
                    ? 'bg-gradient-to-br from-blue-400 to-purple-400'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'
                }`}>
                  <span className="text-white">{message.name[0]}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900 truncate">{message.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </div>
                      <p className="text-sm text-purple-600 mb-1">{message.subject}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{message.message}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">{message.date}</p>
                      <p className="text-xs text-gray-400">{message.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{message.email}</span>
                    <span>•</span>
                    <span>{message.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Message Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">{selectedMessage.name[0]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{selectedMessage.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority} priority
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{selectedMessage.email}</p>
                    <p>{selectedMessage.phone}</p>
                    <p className="text-xs text-gray-400">{selectedMessage.date} at {selectedMessage.time}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="text-gray-900">{selectedMessage.subject}</p>
              </div>

              {/* Message Body */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Reply</label>
                <textarea
                  rows={4}
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Send Reply
                </button>
                <button className="px-4 py-2 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                  Mark as Solved
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
