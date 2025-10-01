'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function WeeklyView({ habits }) {
  const today = new Date();
  const startOfWeek = DateUtils.getWeekStart();
  
  // Get 7 days starting from Sunday
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push(date);
  }

  const getDayData = (date) => {
    const dayHabits = habits.filter(habit => {
      if (habit.targetFrequency === 'daily') return true;
      if (habit.targetFrequency === 'custom') {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return habit.customDays?.includes(dayName);
      }
      return false;
    });
    
    const completedHabits = dayHabits.filter(habit => 
      habit.completions?.some(completion => 
        new Date(completion).toDateString() === date.toDateString()
      )
    );
    
    const incompleteHabits = dayHabits.filter(habit => 
      !habit.completions?.some(completion => 
        new Date(completion).toDateString() === date.toDateString()
      )
    );
    
    return {
      date,
      totalHabits: dayHabits.length,
      completedHabits,
      incompleteHabits,
      completionRate: dayHabits.length > 0 ? (completedHabits.length / dayHabits.length) * 100 : 0
    };
  };

  const weekData = weekDays.map(getDayData);
  const weeklyCompletionRate = weekData.reduce((sum, day) => sum + day.completionRate, 0) / 7;

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold" style={{ color: '#344F1F' }}>Weekly Overview</h3>
        <div className="text-right">
          <div className="text-lg font-semibold" style={{ color: '#F4991A' }}>
            {Math.round(weeklyCompletionRate)}%
          </div>
          <div className="text-xs text-gray-600">Week Average</div>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mb-6">
        <div className="w-full rounded-full h-3" style={{ backgroundColor: '#FFF0DD' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weeklyCompletionRate}%` }}
            transition={{ duration: 1 }}
            className="h-3 rounded-full"
            style={{ backgroundColor: '#F4991A' }}
          ></motion.div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-3">
        {weekData.map((dayData, index) => {
          const isToday = dayData.date.toDateString() === today.toDateString();
          const isPast = dayData.date < today;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: isToday ? '#FFF0DD' : '#ffffff',
                borderColor: isToday ? '#F4991A' : '#e5e7eb',
                boxShadow: isToday ? '0 4px 6px -1px rgba(244, 153, 26, 0.1)' : ''
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold" style={{ color: isToday ? '#F4991A' : '#344F1F' }}>
                    {dayData.date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    {isToday && <span className="ml-2 text-xs text-white px-2 py-1 rounded" style={{ backgroundColor: '#F4991A' }}>TODAY</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dayData.totalHabits} habit{dayData.totalHabits !== 1 ? 's' : ''} scheduled
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold" style={{ 
                    color: dayData.completionRate === 100 ? '#344F1F' :
                           dayData.completionRate >= 50 ? '#F4991A' : '#9CA3AF'
                  }}>
                    {Math.round(dayData.completionRate)}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {dayData.completedHabits.length}/{dayData.totalHabits}
                  </div>
                </div>
              </div>

              {/* Progress bar for the day */}
              <div className="w-full rounded-full h-2 mb-3" style={{ backgroundColor: '#FFF0DD' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dayData.completionRate}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: dayData.completionRate === 100 ? '#344F1F' :
                                   dayData.completionRate >= 50 ? '#F4991A' : '#D1D5DB'
                  }}
                ></motion.div>
              </div>

              {/* Incomplete habits for this day */}
              {isPast && dayData.incompleteHabits.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs mb-2" style={{ color: '#9CA3AF' }}>
                    Missed ({dayData.incompleteHabits.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dayData.incompleteHabits.map(habit => (
                      <span
                        key={habit.id}
                        className="px-2 py-1 text-xs rounded"
                        style={{ 
                          backgroundColor: '#FFF0DD',
                          color: '#6B7280',
                          border: '1px solid #E5E7EB'
                        }}
                      >
                        {habit.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed habits */}
              {dayData.completedHabits.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs mb-2" style={{ color: '#344F1F' }}>
                    Completed ({dayData.completedHabits.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dayData.completedHabits.map(habit => (
                      <span
                        key={habit.id}
                        className="px-2 py-1 text-xs rounded"
                        style={{ 
                          backgroundColor: '#FFF0DD',
                          color: '#344F1F',
                          border: '1px solid #F4991A'
                        }}
                      >
                        {habit.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
