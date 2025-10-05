'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function TimeOfDayAnalytics({ habits }) {
  // Analyze completion times for all habits
  const getCompletionTimes = () => {
    const hourCounts = Array(24).fill(0);
    const totalCompletions = habits.reduce((sum, habit) => {
      return sum + (habit.completions?.length || 0);
    }, 0);

    habits.forEach(habit => {
      habit.completions?.forEach(completion => {
        const hour = new Date(completion).getHours();
        hourCounts[hour]++;
      });
    });

    return { hourCounts, totalCompletions };
  };

  const getBestCompletionTimes = () => {
    const { hourCounts } = getCompletionTimes();
    const maxCount = Math.max(...hourCounts);
    
    return hourCounts
      .map((count, hour) => ({ 
        hour, 
        count, 
        percentage: (count / maxCount) * 100,
        timeLabel: new Date(2000, 0, 1, hour).toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true
        })
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const getHourlyDistribution = () => {
    const { hourCounts, totalCompletions } = getCompletionTimes();
    
    return hourCounts.map((count, hour) => ({
      hour,
      count,
      percentage: totalCompletions > 0 ? (count / totalCompletions) * 100 : 0,
      timeLabel: new Date(2000, 0, 1, hour).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      })
    }));
  };

  const getDayOfWeekPatterns = () => {
    const dayCounts = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    habits.forEach(habit => {
      habit.completions?.forEach(completion => {
        const dayOfWeek = new Date(completion).getDay();
        dayCounts[dayOfWeek]++;
      });
    });

    return dayCounts.map((count, day) => ({
      day,
      dayName: dayNames[day],
      count,
      shortName: dayNames[day].substring(0, 3)
    })).sort((a, b) => b.count - a.count);
  };

  const { hourCounts, totalCompletions } = getCompletionTimes();
  const bestTimes = getBestCompletionTimes();
  const hourlyData = getHourlyDistribution();
  const dayPatterns = getDayOfWeekPatterns();
  const maxHourlyCount = Math.max(...hourCounts);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-6">Time-of-Day Analytics</h3>
      
      {/* Best Completion Times */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-white mb-4">Peak Completion Times</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestTimes.map((time, index) => (
            <motion.div
              key={time.hour}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700 rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold" style={{ color: '#FAEAB1' }}>
                #{index + 1}
              </div>
              <div className="text-lg font-semibold text-white">
                {time.timeLabel}
              </div>
              <div className="text-sm text-gray-400">
                {time.count} completions
              </div>
              <div className="text-xs text-indigo-400">
                {Math.round(time.percentage)}% of peak
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 24-Hour Distribution Chart */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-white mb-4">24-Hour Completion Distribution</h4>
        <div className="space-y-2">
          {hourlyData.map((data, index) => (
            <motion.div
              key={data.hour}
              initial={{ width: 0 }}
              animate={{ width: `${data.percentage}%` }}
              transition={{ delay: index * 0.02, duration: 0.8 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 text-sm text-gray-400">
                {data.timeLabel}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-700 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage}%` }}
                      transition={{ delay: index * 0.02, duration: 0.8 }}
                      className="h-6 rounded-full"
                      style={{ backgroundColor: '#FAEAB1' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800">
                      {data.count > 0 && data.count}
                    </div>
                  </div>
                  <div className="w-8 text-sm text-gray-400 text-right">
                    {Math.round(data.percentage)}%
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Day of Week Patterns */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-4">Day-of-Week Patterns</h4>
        <div className="grid grid-cols-7 gap-2">
          {dayPatterns.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700 rounded-lg p-3 text-center"
            >
              <div className="text-sm font-medium text-white mb-1">
                {day.shortName}
              </div>
              <div className="text-lg font-bold" style={{ color: '#FAEAB1' }}>
                {day.count}
              </div>
              <div className="text-xs text-gray-400">
                completions
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h5 className="text-sm font-medium text-white mb-2">💡 Insights</h5>
        <div className="space-y-1 text-sm text-gray-300">
          {bestTimes.length > 0 && (
            <p>
              You&apos;re most productive at <span className="font-semibold text-emerald-400">
                {bestTimes[0].timeLabel}
              </span> with {bestTimes[0].count} completions.
            </p>
          )}
          {dayPatterns.length > 0 && (
            <p>
              Your best day is <span className="font-semibold text-emerald-400">
                {dayPatterns[0].dayName}
              </span> with {dayPatterns[0].count} total completions.
            </p>
          )}
          <p>
            Total completions analyzed: <span className="font-semibold" style={{ color: '#FAEAB1' }}>
              {totalCompletions}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
