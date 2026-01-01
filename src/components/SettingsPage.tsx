import { useState } from 'react';
import { Save, Building, Clock, Calendar, Tag, Bell, Mail, Users, Shield } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'hours', label: 'Operating Hours', icon: Clock },
    { id: 'holidays', label: 'Holidays', icon: Calendar },
    { id: 'discounts', label: 'Discounts', icon: Tag },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'staff', label: 'Staff & Roles', icon: Users },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500">Manage your business settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Business Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      defaultValue="TurfBook Sports Complex"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="info@turfbook.com"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+880 1XXX-XXXXXX"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Address</label>
                    <textarea
                      rows={3}
                      defaultValue="Dhaka, Bangladesh"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={4}
                      defaultValue="Premium sports facility offering multiple turfs for Football, Cricket, and Badminton."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}

          {/* Operating Hours */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Operating Hours</h3>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-32">
                        <span className="text-gray-900">{day}</span>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Opening</label>
                          <input
                            type="time"
                            defaultValue="06:00"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Closing</label>
                          <input
                            type="time"
                            defaultValue="23:00"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Open</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}

          {/* Holidays */}
          {activeTab === 'holidays' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Manage Holidays</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="date"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Holiday name"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { date: '2025-12-25', name: 'Christmas Day' },
                      { date: '2025-12-31', name: 'New Year\'s Eve' },
                      { date: '2026-01-01', name: 'New Year\'s Day' },
                    ].map((holiday, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-gray-900">{holiday.name}</p>
                          <p className="text-sm text-gray-500">{holiday.date}</p>
                        </div>
                        <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Discounts */}
          {activeTab === 'discounts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Discount Codes</h3>
                <button className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Create New Discount
                </button>
                <div className="space-y-3">
                  {[
                    { code: 'FIRST10', discount: '10%', type: 'First Booking', status: 'active' },
                    { code: 'WEEKEND20', discount: '20%', type: 'Weekend Special', status: 'active' },
                    { code: 'GROUP15', discount: '15%', type: 'Group Booking', status: 'active' },
                  ].map((discount, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-purple-600">{discount.code}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            discount.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {discount.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{discount.type} • {discount.discount} off</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                        <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-900">New Booking Notifications</p>
                        <p className="text-sm text-gray-500">Receive alerts for new bookings</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Send email notifications to customers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Send SMS reminders to customers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-900">Payment Alerts</p>
                        <p className="text-sm text-gray-500">Get notified about pending payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}

          {/* Staff & Roles */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Staff Management</h3>
                <button className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Add New Staff
                </button>
                <div className="space-y-3">
                  {[
                    { name: 'Super Admin', email: 'admin@turfbook.com', role: 'Super Admin', status: 'active' },
                    { name: 'Manager One', email: 'manager@turfbook.com', role: 'Manager', status: 'active' },
                    { name: 'Cashier One', email: 'cashier@turfbook.com', role: 'Cashier', status: 'active' },
                  ].map((staff, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                          <span className="text-white text-sm">{staff.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {staff.role}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          staff.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {staff.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
