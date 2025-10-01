'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StunningDashboard({ user, habits, onAddHabit, onToggleHabit, onDeleteHabit, onSignOut, compact = false }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    targetFrequency: 'daily',
    customDays: [],
    timeOfDay: 'anytime',
    reminderTime: '09:00'
  });

  const timeframes = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ];

  const customDaysOptions = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabit.name.trim()) {
      onAddHabit({
        ...newHabit,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completions: [],
        streak: 0,
        bestStreak: 0
      });
      setNewHabit({
        name: '',
        description: '',
        targetFrequency: 'daily',
        customDays: [],
        timeOfDay: 'anytime',
        reminderTime: '09:00'
      });
      setShowAddForm(false);
    }
  };

  const getCompletionRate = (habit) => {
    const today = new Date();
    const daysBack = selectedTimeframe === 'day' ? 1 : 
                    selectedTimeframe === 'week' ? 7 :
                    selectedTimeframe === 'month' ? 30 : 365;
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysBack);
    
    const relevantCompletions = habit.completions?.filter(completion => 
      new Date(completion) >= startDate
    ) || [];
    
    return Math.min(100, (relevantCompletions.length / daysBack) * 100);
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-8 w-full border border-gray-100 shadow-sm md:shadow-xl hover:shadow-md md:hover:shadow-2xl transition-shadow duration-300 max-w-sm md:max-w-none mx-auto">
        <div className="flex items-center justify-between mb-3 md:mb-8 gap-2">
          <h2 className="text-xs md:text-sm font-bold leading-tight" style={{ color: '#344F1F' }}>Manage Habits</h2>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 md:px-6 md:py-2.5 text-xs md:text-base font-semibold rounded-md md:rounded-lg transition-all duration-200 whitespace-nowrap"
            style={{ backgroundColor: "#F4991A", color: "white" }}
          >
            + Add
          </motion.button>
        </div>

        {/* Compact habit list */}
        <div className="space-y-1.5 md:space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-6 md:py-12 px-3 md:px-6 rounded-md md:rounded-xl" style={{ backgroundColor: '#FFF0DD' }}>
              <div className="text-3xl md:text-6xl mb-2 md:mb-4">🎯</div>
              <p className="text-xs md:text-lg font-semibold mb-2 leading-tight" style={{ color: '#344F1F' }}>No habits created yet</p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddForm(true)}
                className="mt-3 md:mt-4 px-4 py-2 md:px-6 md:py-3 text-xs md:text-base font-semibold rounded-md md:rounded-lg transition-all duration-200"
                style={{ backgroundColor: "#F4991A", color: "white" }}
              >
                Create First Habit
              </motion.button>
            </div>
          ) : (
            habits.map((habit, index) => (
              <motion.div 
                key={habit.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-md md:rounded-xl p-2.5 md:p-5 border-2 transition-all duration-200 hover:shadow-lg group"
                style={{ 
                  backgroundColor: '#FFF0DD',
                  borderColor: '#FFF0DD'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2 min-w-0">
                    <h4 className="font-semibold text-sm md:text-lg mb-0.5 md:mb-1 leading-tight truncate" style={{ color: '#344F1F' }}>{habit.name}</h4>
                    <div className="flex items-center space-x-1.5 md:space-x-3 mt-0.5">
                      <span className="text-xs md:text-sm text-gray-600 font-medium">
                        {habit.targetFrequency}
                      </span>
                      <span className="text-xs md:text-sm font-bold" style={{ color: '#F4991A' }}>
                        🔥 {habit.streak || 0}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteHabit(habit.id)}
                    className="px-2 py-1 md:px-4 md:py-2 rounded text-xs md:text-sm font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-black flex-shrink-0"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add Habit Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-100 shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#344F1F' }}>
                  Create New Habit
                </h3>

                <form onSubmit={handleAddHabit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Habit Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newHabit.name}
                      onChange={(e) =>
                        setNewHabit({ ...newHabit, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Drink 8 glasses of water"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newHabit.description}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Why is this habit important to you?"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newHabit.targetFrequency}
                      onChange={(e) =>
                        setNewHabit({
                          ...newHabit,
                          targetFrequency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="daily" className="bg-white">
                        Daily
                      </option>
                      <option value="weekly" className="bg-white">
                        Weekly
                      </option>
                      <option value="custom" className="bg-white">
                        Custom Days
                      </option>
                    </select>
                  </div>

                  {newHabit.targetFrequency === "custom" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Days
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {customDaysOptions.map((day) => (
                          <motion.button
                            key={day.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              const updatedDays = newHabit.customDays.includes(
                                day.id
                              )
                                ? newHabit.customDays.filter(
                                    (d) => d !== day.id
                                  )
                                : [...newHabit.customDays, day.id];
                              setNewHabit({
                                ...newHabit,
                                customDays: updatedDays,
                              });
                            }}
                            className={`p-2 rounded text-sm font-medium transition-all duration-200 ${
                              newHabit.customDays.includes(day.id)
                                ? "text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                            }`}
                            style={
                              newHabit.customDays.includes(day.id)
                                ? { backgroundColor: "#F4991A" }
                                : {}
                            }
                          >
                            {day.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-3 px-6 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                      style={{ backgroundColor: "#F4991A" }}
                    >
                      Create Habit
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* This is the full dashboard view - keeping minimal for now */}
      <div className="text-center py-8">
        <p className="text-gray-400">Full dashboard view</p>
      </div>
    </div>
  );
}