'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function HabitHeatmap({ habit, months = 12 }) {
  // Get last N months of data
  const getLastNMonths = (n) => {
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date);
    }
    return months;
  };

  const getMonthData = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ isEmpty: true });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isScheduled = habit.targetFrequency === 'daily' || 
        (habit.targetFrequency === 'custom' && 
         habit.customDays?.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()));
      
      const isCompleted = habit.completions?.some(completion => 
        new Date(completion).toDateString() === date.toDateString()
      );

      days.push({
        day,
        date,
        isScheduled,
        isCompleted,
        isEmpty: false
      });
    }
    
    return {
      monthDate,
      monthName: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      year: year,
      days
    };
  };

  const monthData = getLastNMonths(months).map(getMonthData);
  
  const getIntensity = (day) => {
    if (day.isEmpty || !day.isScheduled) return 0;
    return day.isCompleted ? 4 : 1; // 4 levels for completed, 1 for missed
  };

  const getColor = (intensity) => {
    switch (intensity) {
      case 0: return 'bg-gray-700'; // Not scheduled
      case 1: return 'bg-rose-900'; // Missed
      case 2: return 'bg-rose-600';
      case 3: return 'bg-emerald-400';
      case 4: return 'bg-emerald-600'; // Completed
      default: return 'bg-gray-700';
    }
  };

  const totalScheduledDays = monthData.reduce((sum, month) => 
    sum + month.days.filter(day => day.isScheduled).length, 0
  );
  const totalCompletedDays = monthData.reduce((sum, month) => 
    sum + month.days.filter(day => day.isScheduled && day.isCompleted).length, 0
  );
  const overallCompletionRate = totalScheduledDays > 0 ? (totalCompletedDays / totalScheduledDays) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{habit.name} Heatmap</h3>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: '#FAEAB1' }}>
            {Math.round(overallCompletionRate)}%
          </div>
          <div className="text-xs text-gray-600">Overall Rate</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {monthData.map((month, monthIndex) => (
          <motion.div
            key={monthIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">
                {month.monthName} {month.year}
              </h4>
              <div className="text-xs text-gray-600">
                {month.days.filter(d => d.isScheduled && d.isCompleted).length}/
                {month.days.filter(d => d.isScheduled).length}
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-xs text-gray-500 py-1">
                  {day}
                </div>
              ))}
              
              {month.days.map((day, dayIndex) => {
                const intensity = getIntensity(day);
                const isToday = day.date && DateUtils.isToday(day.date.toISOString());
                
                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (monthIndex * 0.1) + (dayIndex * 0.01) }}
                    className={`aspect-square rounded-sm transition-all duration-200 hover:scale-110 cursor-pointer ${
                      getColor(intensity)
                    } ${isToday ? 'ring-2 ring-yellow-400' : ''}`}
                    title={day.isEmpty ? '' : `${day.date.toLocaleDateString()}: ${
                      day.isScheduled 
                        ? (day.isCompleted ? 'Completed' : 'Missed')
                        : 'Not scheduled'
                    }`}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-700 rounded"></div>
          <span className="text-gray-600">Not scheduled</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-rose-900 rounded"></div>
          <span className="text-gray-600">Missed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-emerald-400 rounded"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-400 rounded ring-2 ring-yellow-400"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
}
