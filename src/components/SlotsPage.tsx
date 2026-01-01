import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

export function SlotsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 12)); // Dec 12, 2025
  const [selectedField, setSelectedField] = useState('Field A');

  const fields = ['Field A', 'Field B', 'Field C', 'Field D'];
  
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Mock slot data: status can be 'available', 'booked', or 'blocked'
  const slotData: Record<string, Record<string, { status: string; customer?: string; sport?: string }>> = {
    'Field A': {
      '08:00': { status: 'booked', customer: 'Ramjan Ali', sport: 'Football' },
      '09:00': { status: 'booked', customer: 'Ramjan Ali', sport: 'Football' },
      '10:00': { status: 'available' },
      '11:00': { status: 'available' },
      '12:00': { status: 'blocked' },
      '13:00': { status: 'blocked' },
      '14:00': { status: 'booked', customer: 'Rahim Uddin', sport: 'Football' },
      '15:00': { status: 'booked', customer: 'Rahim Uddin', sport: 'Football' },
      '16:00': { status: 'available' },
      '17:00': { status: 'available' },
      '18:00': { status: 'booked', customer: 'Sakib Khan', sport: 'Football' },
      '19:00': { status: 'booked', customer: 'Sakib Khan', sport: 'Football' },
      '20:00': { status: 'available' },
    },
    'Field B': {
      '10:00': { status: 'booked', customer: 'Karim Ahmed', sport: 'Cricket' },
      '11:00': { status: 'booked', customer: 'Karim Ahmed', sport: 'Cricket' },
      '14:00': { status: 'available' },
      '15:00': { status: 'available' },
      '16:00': { status: 'booked', customer: 'Arif Hassan', sport: 'Cricket' },
      '17:00': { status: 'booked', customer: 'Arif Hassan', sport: 'Cricket' },
      '18:00': { status: 'available' },
    },
  };

  const getSlotStatus = (field: string, time: string) => {
    return slotData[field]?.[time] || { status: 'available' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-purple-100 border-purple-300 text-purple-700';
      case 'blocked':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'available':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 cursor-pointer';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Slot & Schedule Management</h1>
          <p className="text-gray-500">Manage availability and bookings for all fields</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
          <Plus className="w-5 h-5" />
          <span>Add Slot</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Date Picker */}
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-2">Select Date</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDate(-1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{formatDate(selectedDate)}</span>
              </div>
              <button
                onClick={() => changeDate(1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Field Selector */}
          <div className="lg:w-64">
            <label className="block text-sm text-gray-700 mb-2">Select Field</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300" />
            <span className="text-sm text-gray-700">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
            <span className="text-sm text-gray-700">Blocked/Maintenance</span>
          </div>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-gray-400" />
          <h3 className="text-gray-900">Time Slots - {selectedField}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {timeSlots.map((time) => {
            const slot = getSlotStatus(selectedField, time);
            return (
              <div
                key={time}
                className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(slot.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{time}</span>
                  {slot.status === 'booked' && (
                    <span className="text-xs px-2 py-0.5 bg-purple-200 rounded-full">Booked</span>
                  )}
                  {slot.status === 'blocked' && (
                    <span className="text-xs px-2 py-0.5 bg-red-200 rounded-full">Blocked</span>
                  )}
                </div>
                {slot.status === 'booked' && slot.customer && (
                  <div className="text-xs mt-2 space-y-1">
                    <p className="truncate">{slot.customer}</p>
                    <p className="text-xs opacity-75">{slot.sport}</p>
                  </div>
                )}
                {slot.status === 'blocked' && (
                  <p className="text-xs mt-2">Maintenance</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Slots</p>
              <p className="text-gray-900">{timeSlots.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Booked Slots</p>
              <p className="text-gray-900">
                {Object.values(slotData[selectedField] || {}).filter(s => s.status === 'booked').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Available Slots</p>
              <p className="text-gray-900">
                {timeSlots.length - Object.values(slotData[selectedField] || {}).filter(s => s.status !== 'available').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
