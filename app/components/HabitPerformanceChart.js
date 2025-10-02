'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function HabitPerformanceChart({ habit, days = 30 }) {
  // Get last N days of data
  const getLastNDays = (n) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const getDayData = (date) => {
    const isScheduled = habit.targetFrequency === 'daily' || 
      (habit.targetFrequency === 'custom' && 
       habit.customDays?.includes(date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()));
    
    const isCompleted = habit.completions?.some(completion => 
      new Date(completion).toDateString() === date.toDateString()
    );

    return {
      date,
      isScheduled,
      isCompleted,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate()
    };
  };

  const chartData = getLastNDays(days).map(getDayData);
  const completionRate = chartData.filter(d => d.isScheduled).length > 0 
    ? (chartData.filter(d => d.isScheduled && d.isCompleted).length / chartData.filter(d => d.isScheduled).length) * 100 
    : 0;

  const getBarHeight = (data) => {
    if (!data.isScheduled) return 0;
    return data.isCompleted ? 100 : 20; // 100% for completed, 20% for missed
  };

  const getBarColor = (data) => {
    if (!data.isScheduled) return 'bg-gray-600';
    return data.isCompleted ? 'bg-emerald-500' : 'bg-rose-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: '#FAEAB1' }}>
            {Math.round(completionRate)}%
          </div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        <div className="flex items-end justify-between h-32 space-x-1">
          {chartData.map((data, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${getBarHeight(data)}%` }}
              transition={{ delay: index * 0.02, duration: 0.5 }}
              className={`w-full rounded-t transition-all duration-200 hover:opacity-80 ${
                getBarColor(data)
              } ${data.isScheduled ? 'cursor-pointer' : ''}`}
              title={`${data.date.toLocaleDateString()}: ${
                data.isScheduled 
                  ? (data.isCompleted ? 'Completed' : 'Missed')
                  : 'Not scheduled'
              }`}
            />
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {chartData.filter((_, i) => i % Math.ceil(days / 7) === 0).map((data, index) => (
            <span key={index}>{data.dayNumber}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-emerald-400">
            {chartData.filter(d => d.isScheduled && d.isCompleted).length}
          </div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div>
          <div className="text-lg font-bold text-rose-400">
            {chartData.filter(d => d.isScheduled && !d.isCompleted).length}
          </div>
          <div className="text-xs text-gray-600">Missed</div>
        </div>
        <div>
          <div className="text-lg font-bold text-indigo-400">
            {habit.currentStreak || 0}
          </div>
          <div className="text-xs text-gray-600">Current Streak</div>
        </div>
      </div>
    </div>
  );
}
