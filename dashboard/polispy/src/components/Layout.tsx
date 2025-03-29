import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, LineChart, PieChart, Newspaper, Settings, Calendar } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import { DateRange } from '../types';

const Layout: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date('2024-12-01'),
    end: new Date('2025-03-24'),
  });

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    setTimeFrame('custom');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Political Monitor</h1>
          </div>
        </div>
        <div className="px-4 py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LineChart className="h-5 w-5" />
            <span>Trends Overview</span>
          </NavLink>
          <NavLink
            to="/sentiment"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <PieChart className="h-5 w-5" />
            <span>Sentiment Analysis</span>
          </NavLink>
          <NavLink
            to="/media"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Newspaper className="h-5 w-5" />
            <span>Media Coverage</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-end space-x-4">
              <select
                className="rounded-md border border-gray-300 px-3 py-2"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Range</option>
              </select>
              {timeFrame === 'custom' && (
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  isOpen={isDatePickerOpen}
                  onToggle={() => setIsDatePickerOpen(!isDatePickerOpen)}
                />
              )}
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;