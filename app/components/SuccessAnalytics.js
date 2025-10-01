'use client';

import { motion } from 'framer-motion';
import { DateUtils } from '../lib/storage';

export default function SuccessAnalytics({ habits }) {
  // Calculate success metrics for each habit
  const getHabitSuccessMetrics = (habit) => {
    const totalDays = Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24));
    const scheduledDays = habit.targetFrequency === 'daily' 
      ? totalDays 
      : habit.targetFrequency === 'custom' 
        ? totalDays * (habit.customDays?.length || 0) / 7
        : 0;
    
    const completedDays = habit.completions?.length || 0;
    const successRate = scheduledDays > 0 ? (completedDays / scheduledDays) * 100 : 0;
    const currentStreak = habit.currentStreak || 0;
    const bestStreak = habit.bestStreak || 0;
    
    // Calculate consistency score (how often streaks are maintained)
    const streakConsistency = bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 0;
    
    // Calculate improvement trend (last 7 days vs previous 7 days)
    const last7Days = getLastNDays(7);
    const previous7Days = getLastNDays(14).slice(0, 7);
    
    const recentCompletions = last7Days.filter(day => 
      habit.completions?.some(completion => 
        new Date(completion).toDateString() === day.toDateString()
      )
    ).length;
    
    const previousCompletions = previous7Days.filter(day => 
      habit.completions?.some(completion => 
        new Date(completion).toDateString() === day.toDateString()
      )
    ).length;
    
    const improvementTrend = previousCompletions > 0 
      ? ((recentCompletions - previousCompletions) / previousCompletions) * 100 
      : recentCompletions > 0 ? 100 : 0;

    return {
      ...habit,
      successRate,
      currentStreak,
      bestStreak,
      streakConsistency,
      improvementTrend,
      recentCompletions,
      previousCompletions,
      totalCompletions: completedDays,
      scheduledDays: Math.round(scheduledDays)
    };
  };

  const getLastNDays = (n) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const habitMetrics = habits.map(getHabitSuccessMetrics);
  
  // Sort habits by different criteria
  const mostSuccessful = [...habitMetrics].sort((a, b) => b.successRate - a.successRate);
  const mostConsistent = [...habitMetrics].sort((a, b) => b.streakConsistency - a.streakConsistency);
  const mostImproved = [...habitMetrics].sort((a, b) => b.improvementTrend - a.improvementTrend);
  const longestStreaks = [...habitMetrics].sort((a, b) => b.bestStreak - a.bestStreak);

  // Overall statistics
  const overallSuccessRate = habitMetrics.length > 0 
    ? habitMetrics.reduce((sum, h) => sum + h.successRate, 0) / habitMetrics.length 
    : 0;
  
  const totalCompletions = habitMetrics.reduce((sum, h) => sum + h.totalCompletions, 0);
  const averageStreak = habitMetrics.length > 0 
    ? habitMetrics.reduce((sum, h) => sum + h.currentStreak, 0) / habitMetrics.length 
    : 0;

  const getSuccessGrade = (rate) => {
    if (rate >= 90) return { grade: 'A+', color: 'text-emerald-400', bg: 'bg-emerald-900/20' };
    if (rate >= 80) return { grade: 'A', color: 'text-emerald-400', bg: 'bg-emerald-900/20' };
    if (rate >= 70) return { grade: 'B+', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    if (rate >= 60) return { grade: 'B', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    if (rate >= 50) return { grade: 'C', color: 'text-orange-400', bg: 'bg-orange-900/20' };
    return { grade: 'D', color: 'text-rose-400', bg: 'bg-rose-900/20' };
  };

  const getTrendIcon = (trend) => {
    if (trend > 20) return '📈';
    if (trend > 0) return '↗️';
    if (trend > -20) return '➡️';
    return '📉';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-6">Success Analytics & Insights</h3>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#FAEAB1' }}>
            {Math.round(overallSuccessRate)}%
          </div>
          <div className="text-sm text-gray-400">Overall Success Rate</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {totalCompletions}
          </div>
          <div className="text-sm text-gray-400">Total Completions</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {Math.round(averageStreak)}
          </div>
          <div className="text-sm text-gray-400">Avg Current Streak</div>
        </div>
      </div>

      {/* Most Successful Habits */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-white mb-4">🏆 Most Successful Habits</h4>
        <div className="space-y-3">
          {mostSuccessful.slice(0, 3).map((habit, index) => {
            const grade = getSuccessGrade(habit.successRate);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${grade.bg} border-gray-600`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-white">{habit.name}</h5>
                    <p className="text-sm text-gray-400">
                      {habit.totalCompletions}/{habit.scheduledDays} completions
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${grade.color}`}>
                      {habit.successRate.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${grade.color}`}>
                      Grade: {grade.grade}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${habit.successRate}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: '#FAEAB1' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Most Improved Habits */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-white mb-4">📈 Most Improved Habits</h4>
        <div className="space-y-3">
          {mostImproved.filter(h => h.improvementTrend > 0).slice(0, 3).map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-white">{habit.name}</h5>
                  <p className="text-sm text-gray-400">
                    Last 7 days: {habit.recentCompletions} vs Previous: {habit.previousCompletions}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">
                    +{habit.improvementTrend.toFixed(0)}%
                  </div>
                  <div className="text-xs text-emerald-400">
                    {getTrendIcon(habit.improvementTrend)} Improving
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Longest Streaks */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-4">🔥 Longest Streaks</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {longestStreaks.slice(0, 4).map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-white text-sm">{habit.name}</h5>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: '#FAEAB1' }}>
                    {habit.bestStreak}
                  </div>
                  <div className="text-xs text-gray-400">days</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h5 className="text-sm font-medium text-white mb-3">💡 Recommendations</h5>
        <div className="space-y-2 text-sm text-gray-300">
          {mostSuccessful.length > 0 && mostSuccessful[0].successRate > 80 && (
            <p>
              <span className="font-semibold text-emerald-400">{mostSuccessful[0].name}</span> is your star habit! 
              Consider applying similar strategies to other habits.
            </p>
          )}
          {mostImproved.length > 0 && mostImproved[0].improvementTrend > 50 && (
            <p>
              <span className="font-semibold text-emerald-400">{mostImproved[0].name}</span> is improving rapidly! 
              Keep up the momentum.
            </p>
          )}
          {mostSuccessful.length > 0 && mostSuccessful[mostSuccessful.length - 1].successRate < 50 && (
            <p>
              <span className="font-semibold text-rose-400">{mostSuccessful[mostSuccessful.length - 1].name}</span> 
              needs attention. Consider adjusting the schedule or breaking it into smaller steps.
            </p>
          )}
          <p>
            Focus on maintaining your current streaks and gradually improving lower-performing habits.
          </p>
        </div>
      </div>
    </div>
  );
}
