'use client';

// Enhanced storage system for persistent habit tracking
export const StorageService = {
  // Keys for localStorage
  STORAGE_KEYS: {
    HABITS: 'habit_tracker_habits',
    USER_DATA: 'habit_tracker_user',
    AUTH_TOKEN: 'habit_tracker_token',
    LAST_SESSION: 'habit_tracker_last_session'
  },

  // Save habits with timestamp
  saveHabits(habits) {
    try {
      const data = {
        habits,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.STORAGE_KEYS.HABITS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save habits:', error);
      return false;
    }
  },

  // Load habits with validation
  loadHabits() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.HABITS);
      if (!stored) return [];

      const data = JSON.parse(stored);
      
      // Validate data structure
      if (!data.habits || !Array.isArray(data.habits)) {
        return [];
      }

      // Return habits with any necessary migrations
      return this.migrateHabits(data.habits);
    } catch (error) {
      console.error('Failed to load habits:', error);
      return [];
    }
  },

  // Migrate old habit data to new format if needed
  migrateHabits(habits) {
    return habits.map(habit => ({
      id: habit.id || Date.now().toString(),
      name: habit.name || 'Unnamed Habit',
      description: habit.description || '',
      targetFrequency: habit.targetFrequency || 'daily',
      customDays: habit.customDays || [],
      createdAt: habit.createdAt || new Date().toISOString(),
      completions: habit.completions || [],
      streak: habit.streak || 0,
      bestStreak: habit.bestStreak || 0,
      lastUpdated: habit.lastUpdated || new Date().toISOString()
    }));
  },

  // Save user session info
  saveSession(user, token) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      localStorage.setItem(this.STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(this.STORAGE_KEYS.LAST_SESSION, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Failed to save session:', error);
      return false;
    }
  },

  // Load user session
  loadSession() {
    try {
      const user = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      const token = localStorage.getItem(this.STORAGE_KEYS.AUTH_TOKEN);
      
      if (!user || !token) return null;

      return {
        user: JSON.parse(user),
        token,
        lastSession: localStorage.getItem(this.STORAGE_KEYS.LAST_SESSION)
      };
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  },

  // Clear all data
  clearAll() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }
};

// Date utilities for habit tracking
export const DateUtils = {
  // Get today's date as YYYY-MM-DD
  getTodayString() {
    return new Date().toISOString().split('T')[0];
  },

  // Get yesterday's date as YYYY-MM-DD
  getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  },

  // Check if a date is today
  isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // Check if a date is yesterday
  isYesterday(dateString) {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  },

  // Get days between two dates
  getDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  },

  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  },

  // Get start of week
  getWeekStart() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    return start;
  },

  // Get start of month
  getMonthStart() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }
};
