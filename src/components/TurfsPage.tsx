import { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, DollarSign, Users } from 'lucide-react';

export function TurfsPage() {
  const [selectedTurf, setSelectedTurf] = useState<any>(null);

  const turfs = [
    {
      id: 1,
      name: 'Field A',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
      sports: ['Football', 'Cricket'],
      capacity: 22,
      size: '100x60m',
      pricing: {
        morning: 2000,
        afternoon: 2500,
        evening: 3000,
      },
      status: 'active',
      bookingsToday: 8,
    },
    {
      id: 2,
      name: 'Field B',
      image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800',
      sports: ['Cricket'],
      capacity: 22,
      size: '100x60m',
      pricing: {
        morning: 2500,
        afternoon: 3000,
        evening: 3500,
      },
      status: 'active',
      bookingsToday: 6,
    },
    {
      id: 3,
      name: 'Field C',
      image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
      sports: ['Badminton', 'Volleyball'],
      capacity: 12,
      size: '50x30m',
      pricing: {
        morning: 1200,
        afternoon: 1500,
        evening: 1800,
      },
      status: 'active',
      bookingsToday: 4,
    },
    {
      id: 4,
      name: 'Field D',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
      sports: ['Football'],
      capacity: 16,
      size: '80x50m',
      pricing: {
        morning: 1800,
        afternoon: 2200,
        evening: 2800,
      },
      status: 'maintenance',
      bookingsToday: 0,
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Turfs & Sports Management</h1>
          <p className="text-gray-500">Manage your fields, sports, and pricing</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
          <Plus className="w-5 h-5" />
          <span>Add New Field</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Fields</p>
              <p className="text-gray-900">{turfs.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Today</p>
              <p className="text-gray-900">{turfs.filter(t => t.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Bookings Today</p>
              <p className="text-gray-900">{turfs.reduce((sum, t) => sum + t.bookingsToday, 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Price</p>
              <p className="text-gray-900">৳2,400</p>
            </div>
            <div className="p-3 rounded-lg bg-pink-100">
              <DollarSign className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Turfs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div
            key={turf.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={turf.image}
                alt={turf.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    turf.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {turf.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-gray-900 mb-1">{turf.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{turf.size}</span>
                  <span>•</span>
                  <Users className="w-4 h-4" />
                  <span>{turf.capacity} players</span>
                </div>
              </div>

              {/* Sports */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Available Sports</p>
                <div className="flex flex-wrap gap-2">
                  {turf.sports.map((sport, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Pricing per Slot</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600">Morning</p>
                    <p className="text-sm text-gray-900">৳{turf.pricing.morning}</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600">Afternoon</p>
                    <p className="text-sm text-gray-900">৳{turf.pricing.afternoon}</p>
                  </div>
                  <div className="text-center p-2 bg-pink-50 rounded-lg">
                    <p className="text-xs text-gray-600">Evening</p>
                    <p className="text-sm text-gray-900">৳{turf.pricing.evening}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Bookings Today</span>
                  <span className="text-gray-900">{turf.bookingsToday} slots</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedTurf(turf)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (simplified) */}
      {selectedTurf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900">Edit Field - {selectedTurf.name}</h2>
              <button
                onClick={() => setSelectedTurf(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Field Name</label>
                <input
                  type="text"
                  defaultValue={selectedTurf.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Size</label>
                  <input
                    type="text"
                    defaultValue={selectedTurf.size}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    defaultValue={selectedTurf.capacity}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selectedTurf.status}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-3">Pricing</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Morning</label>
                    <input
                      type="number"
                      defaultValue={selectedTurf.pricing.morning}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Afternoon</label>
                    <input
                      type="number"
                      defaultValue={selectedTurf.pricing.afternoon}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Evening</label>
                    <input
                      type="number"
                      defaultValue={selectedTurf.pricing.evening}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedTurf(null)}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
