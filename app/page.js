'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import StunningAuth from './components/StunningAuth';
import StunningDashboard from './components/StunningDashboard';
import DailyStatus from './components/DailyStatus';
import DateTimeWidget from './components/DateTimeWidget';
import MonthlyView from './components/MonthlyView';
import WeeklyView from './components/WeeklyView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BeautifulNavbar from './components/BeautifulNavbar';
import { useRealTimeHabits } from './hooks/useRealTimeHabits';
import { StorageService } from './lib/storage';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const router = useRouter();
  
  // Use real-time habits hook
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    getPendingHabits,
    getCompletedHabits,
    refresh
  } = useRealTimeHabits();

  useEffect(() => {
    // Load user session
    const session = StorageService.loadSession();
    
    if (session) {
      setUser(session.user);
    }
    
    setLoading(false);
  }, []);

  const handleSignOut = () => {
    StorageService.clearAll();
    setUser(null);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your habits...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <StunningAuth mode="signin" />;
  }

  const pendingHabits = getPendingHabits();
  const completedHabits = getCompletedHabits();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Beautiful Navbar */}
      <BeautifulNavbar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onSignOut={handleSignOut}
        pendingHabits={pendingHabits}
        completedHabits={completedHabits}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Content based on active view */}
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column - Daily Status */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6 mx-3 md:mx-0">
              <DateTimeWidget />
              <DailyStatus
                pendingHabits={pendingHabits}
                completedHabits={completedHabits}
                onToggleHabit={toggleHabitCompletion}
              />
            </div>

            {/* Right Column - Habits Management */}
            <div className="lg:col-span-1 mx-3 md:mx-0">
              <StunningDashboard
                user={user}
                habits={habits}
                onAddHabit={addHabit}
                onToggleHabit={toggleHabitCompletion}
                onDeleteHabit={deleteHabit}
                onSignOut={handleSignOut}
                compact={true}
              />
            </div>
          </div>
        )}

        {activeView === 'weekly' && (
          <div className="grid grid-cols-1 gap-8">
            <WeeklyView habits={habits} />
          </div>
        )}

        {activeView === 'monthly' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <MonthlyView habits={habits} />
            <div className="space-y-6">
              <DateTimeWidget />
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="grid grid-cols-1 gap-8">
            <AnalyticsDashboard habits={habits} />
          </div>
        )}
      </div>
    </div>
  );
}
