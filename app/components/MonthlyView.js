'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function MonthlyView({ habits }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getDayCompletions = (day) => {
    if (!day) return { completed: 0, total: 0, habits: [] };
    
    const targetDate = new Date(currentYear, currentMonth, day);
    const dateString = targetDate.toISOString().split('T')[0];
    
    const dayHabits = habits.filter(habit => {
      if (habit.targetFrequency === 'daily') return true;
      if (habit.targetFrequency === 'custom') {
        const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return habit.customDays?.includes(dayName);
      }
      return false;
    });
    
    const completed = dayHabits.filter(habit => 
      habit.completions?.some(completion => 
        new Date(completion).toDateString() === targetDate.toDateString()
      )
    );
    
    return {
      completed: completed.length,
      total: dayHabits.length,
      habits: dayHabits,
      completedHabits: completed,
      date: targetDate
    };
  };

  const getCompletionColor = (completions) => {
    if (completions.total === 0) return 'bg-gray-100';
    const percentage = (completions.completed / completions.total) * 100;
    if (percentage === 100) return 'bg-emerald-600';
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly View - {monthName}</h3>
      
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const completions = getDayCompletions(day);
          const isToday = day === today.getDate();
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`aspect-square flex flex-col items-center justify-center text-sm relative group cursor-pointer ${
                day ? getCompletionColor(completions) : ''
              } ${
                isToday ? 'ring-2 ring-yellow-400' : ''
              } rounded transition-all duration-200 hover:scale-105`}
            >
              {day && (
                <>
                  <div className={`font-semibold ${
                    completions.completed === completions.total && completions.total > 0
                      ? 'text-gray-900'
                      : 'text-gray-300'
                  }`}>
                    {day}
                  </div>
                  
                  {completions.total > 0 && (
                    <div className="text-xs text-gray-900/80">
                      {completions.completed}/{completions.total}
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    {completions.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    <br />
                    {completions.total === 0 ? 'No habits' : `${completions.completed}/${completions.total} completed`}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span className="text-gray-600">No habits</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-rose-500 rounded"></div>
          <span className="text-gray-600">0-25%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-gray-600">25-50%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">50-75%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-gray-600">75-99%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-emerald-600 rounded"></div>
          <span className="text-gray-600">100%</span>
        </div>
      </div>
    </div>
  );
}
