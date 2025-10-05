'use client';

import { useState, useEffect, useCallback } from 'react';
import { StorageService, DateUtils } from '../lib/storage';

export function useRealTimeHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdateCheck, setLastUpdateCheck] = useState(null);

  // Load habits on mount and set up real-time updates
  useEffect(() => {
    loadHabits();
    
    // Check for day changes every minute
    const interval = setInterval(() => {
      checkForDayChange();
    }, 60000); // Check every minute

    // Check when window regains focus
    const handleFocus = () => {
      checkForDayChange();
      loadHabits();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkForDayChange, loadHabits]);

  const loadHabits = useCallback(() => {
    try {
      setLoading(true);
      const storedHabits = StorageService.loadHabits();
      
      // Update streaks in case of day change
      const updatedHabits = storedHabits.map(habit => ({
        ...habit,
        streak: calculateCurrentStreak(habit.completions || []),
        todayStatus: getTodayCompletionStatus(habit)
      }));

      setHabits(updatedHabits);
      setLastUpdateCheck(new Date().toISOString());
      
      // Save updated streaks
      StorageService.saveHabits(updatedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkForDayChange = useCallback(() => {
    const now = new Date();
    
    // If this is the first check or it's a new day
    if (!lastUpdateCheck || 
        new Date(lastUpdateCheck).toDateString() !== now.toDateString()) {
      
      console.log('Day changed, updating habits...');
      loadHabits();
    }
  }, [lastUpdateCheck, loadHabits]);

  const addHabit = useCallback(async (newHabitData) => {
    try {
      const session = StorageService.loadSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Create habit with proper structure
      const newHabit = {
        ...newHabitData,
        id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        createdAt: new Date().toISOString(),
        completions: [],
        streak: 0,
        bestStreak: 0,
        todayStatus: 'pending'
      };

      // Add to local state
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      
      // Persist to storage
      StorageService.saveHabits(updatedHabits);

      // Also sync with server
      try {
        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`,
          },
          body: JSON.stringify(newHabit),
        });

        if (!response.ok) {
          console.warn('Failed to sync with server, using local storage');
        }
      } catch (error) {
        console.warn('Server sync failed, continuing with local storage');
      }

      return newHabit;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  }, [habits]);

  const toggleHabitCompletion = useCallback(async (habitId, date = null) => {
    try {
      const completionDate = date || new Date().toISOString();
      const todayString = DateUtils.getTodayString();
      
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          const completions = habit.completions || [];
          
          // Check if already completed today
          const isCompletedToday = completions.some(completion => 
            DateUtils.isToday(completion)
          );
          
          let newCompletions;
          if (isCompletedToday) {
            // Remove today's completion
            newCompletions = completions.filter(completion => 
              !DateUtils.isToday(completion)
            );
          } else {
            // Add today's completion
            newCompletions = [...completions, completionDate];
          }
          
          // Calculate new streak
          const newStreak = calculateCurrentStreak(newCompletions);
          const newBestStreak = Math.max(habit.bestStreak || 0, newStreak);
          
          return {
            ...habit,
            completions: newCompletions,
            streak: newStreak,
            bestStreak: newBestStreak,
            todayStatus: isCompletedToday ? 'pending' : 'completed',
            lastUpdated: new Date().toISOString()
          };
        }
        return habit;
      });

      setHabits(updatedHabits);
      StorageService.saveHabits(updatedHabits);

      // Sync with server
      try {
        const session = StorageService.loadSession();
        if (session) {
          await fetch(`/api/habits/${habitId}/toggle`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ date: completionDate }),
          });
        }
      } catch (error) {
        console.warn('Server sync failed, continuing with local storage');
      }

      return updatedHabits.find(h => h.id === habitId);
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  }, [habits]);

  const deleteHabit = useCallback(async (habitId) => {
    try {
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
      StorageService.saveHabits(updatedHabits);

      // Sync with server
      try {
        const session = StorageService.loadSession();
        if (session) {
          await fetch(`/api/habits/${habitId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${session.token}`,
            },
          });
        }
      } catch (error) {
        console.warn('Server sync failed, continuing with local storage');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }, [habits]);

  // Get today's habits with their status
  const getTodaysHabits = useCallback(() => {
    const today = DateUtils.getTodayString();
    
    return habits.map(habit => {
      const isCompletedToday = habit.completions?.some(completion => 
        DateUtils.isToday(completion)
      );
      
      const shouldShowToday = habit.targetFrequency === 'daily' || 
        (habit.targetFrequency === 'custom' && habit.customDays?.includes(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()));

      return {
        ...habit,
        todayStatus: isCompletedToday ? 'completed' : 'pending',
        showToday: shouldShowToday,
        daysUntilNext: shouldShowToday ? 0 : getNextOccurrence(habit)
      };
    });
  }, [habits]);

  // Get pending habits for today
  const getPendingHabits = useCallback(() => {
    return getTodaysHabits().filter(habit => 
      habit.showToday && habit.todayStatus === 'pending'
    );
  }, [getTodaysHabits]);

  // Get completed habits for today
  const getCompletedHabits = useCallback(() => {
    return getTodaysHabits().filter(habit => 
      habit.showToday && habit.todayStatus === 'completed'
    );
  }, [getTodaysHabits]);

  return {
    habits,
    loading,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    getTodaysHabits,
    getPendingHabits,
    getCompletedHabits,
    refresh: loadHabits
  };
}

// Calculate current streak accurately
function calculateCurrentStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  // Sort completions by date (most recent first)
  const sortedDates = completions
    .map(date => new Date(date).toISOString().split('T')[0])
    .sort((a, b) => new Date(b) - new Date(a))
    .filter((date, index, arr) => arr.indexOf(date) === index); // Remove duplicates
  
  let streak = 0;
  const today = DateUtils.getTodayString();
  const yesterday = DateUtils.getYesterdayString();
  
  // Start counting from today or yesterday
  let checkDate = today;
  if (!sortedDates.includes(today) && sortedDates.includes(yesterday)) {
    checkDate = yesterday;
  }
  
  // Count consecutive days
  while (sortedDates.includes(checkDate)) {
    streak++;
    const prevDate = new Date(checkDate);
    prevDate.setDate(prevDate.getDate() - 1);
    checkDate = prevDate.toISOString().split('T')[0];
  }
  
  return streak;
}

// Get today's completion status
function getTodayCompletionStatus(habit) {
  const completions = habit.completions || [];
  const isCompletedToday = completions.some(completion => 
    DateUtils.isToday(completion)
  );
  
  return isCompletedToday ? 'completed' : 'pending';
}

// Calculate next occurrence for non-daily habits
function getNextOccurrence(habit) {
  if (habit.targetFrequency === 'daily') return 0;
  
  if (habit.targetFrequency === 'weekly') {
    const today = new Date();
    const daysUntilSunday = 7 - today.getDay();
    return daysUntilSunday === 7 ? 0 : daysUntilSunday;
  }
  
  if (habit.targetFrequency === 'custom' && habit.customDays) {
    const today = new Date();
    const todayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    if (habit.customDays.includes(todayName + 'day') || habit.customDays.includes(todayName)) return 0;
    
    // Find next occurrence
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const nextDayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (habit.customDays.includes(nextDayName + 'day') || habit.customDays.includes(nextDayName)) {
        return i;
      }
    }
  }
  
  return 7; // Default to next week
}
