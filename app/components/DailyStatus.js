'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function DailyStatus({ pendingHabits, completedHabits, onToggleHabit }) {
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const completionPercentage = pendingHabits.length + completedHabits.length > 0 
    ? (completedHabits.length / (pendingHabits.length + completedHabits.length)) * 100 
    : 0;

  return (
    <div className="bg-white rounded-lg md:rounded-2xl p-5 md:p-8 w-full shadow-sm md:shadow-xl border border-gray-100 mb-4 md:mb-6 hover:shadow-md md:hover:shadow-2xl transition-shadow duration-300 max-w-sm md:max-w-none mx-auto">
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
        <div className="flex-1">
          <h2 className="text-xs md:text-sm font-bold leading-tight" style={{ color: '#344F1F' }}>Today's Progress</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5 md:mt-1 leading-tight">{todayFormatted}</p>
        </div>
        <div className="text-right">
          <div className="text-base md:text-4xl font-bold" style={{ color: '#F4991A' }}>
            {Math.round(completionPercentage)}%
          </div>
          <div className="text-xs text-gray-500 mt-0.5 md:mt-1 font-medium">Complete</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-3 md:mb-8">
        <div className="w-full rounded-full h-2 md:h-4 relative overflow-hidden" style={{ backgroundColor: '#FFF0DD' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-2 md:h-4 rounded-full relative"
            style={{ backgroundColor: '#F4991A' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </motion.div>
        </div>
      </div>

      {/* Pending habits */}
      {pendingHabits.length > 0 && (
        <div className="mb-4 md:mb-8">
          <h3 className="text-xs md:text-lg font-semibold mb-2 md:mb-4" style={{ color: '#344F1F' }}>
            Pending ({pendingHabits.length})
          </h3>
          <div className="space-y-2 md:space-y-3">
            {pendingHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 md:p-5 rounded-md md:rounded-xl border-2 transition-all duration-200 hover:shadow-lg group"
                style={{ 
                  backgroundColor: '#FFF0DD',
                  borderColor: '#FFF0DD'
                }}
              >
                <div className="flex-1 mr-2 min-w-0">
                  <h4 className="font-semibold text-xs md:text-lg leading-tight truncate" style={{ color: '#344F1F' }}>{habit.name}</h4>
                  {habit.description && (
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 leading-tight">{habit.description}</p>
                  )}
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleHabit(habit.id)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                  style={{ 
                    border: '2px solid #F4991A',
                    color: '#F4991A'
                  }}
                >
                  
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Completed habits */}
      {completedHabits.length > 0 && (
        <div>
          <h3 className="text-xs md:text-lg font-semibold mb-2 md:mb-4" style={{ color: '#344F1F' }}>
            Completed ({completedHabits.length})
          </h3>
          <div className="space-y-2 md:space-y-3">
            {completedHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 md:p-5 rounded-md md:rounded-xl border-2 transition-all duration-200 hover:shadow-md group"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#344F1F'
                }}
              >
                <div className="flex-1 mr-2 min-w-0">
                  <h4 className="font-semibold text-xs md:text-lg text-gray-500 line-through leading-tight truncate">{habit.name}</h4>
                  {habit.description && (
                    <p className="text-xs md:text-sm text-gray-400 mt-0.5 md:mt-1 line-through leading-tight">{habit.description}</p>
                  )}
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleHabit(habit.id)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg text-white flex items-center justify-center font-bold text-base md:text-xl transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                  style={{ backgroundColor: '#344F1F' }}
                >
                  ✓
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pendingHabits.length === 0 && completedHabits.length === 0 && (
        <div className="text-center py-12 px-6 rounded-xl" style={{ backgroundColor: '#FFF0DD' }}>
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-semibold mb-2" style={{ color: '#344F1F' }}>No habits scheduled for today</p>
          <p className="text-sm text-gray-600">Create a habit to get started on your journey</p>
        </div>
      )}
    </div>
  );
}
