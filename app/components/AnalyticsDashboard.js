'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HabitPerformanceChart from './HabitPerformanceChart';

export default function AnalyticsDashboard({ habits = [], customIcons = {} }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedHabit, setSelectedHabit] = useState(habits[0]?.id || "");
  const [failedIcons, setFailedIcons] = useState({});
  
  // Skip if no habits
  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h3>
        <p className="text-gray-600">Start tracking habits to see analytics</p>
      </div>
    );
  }

  const selectedHabitData = habits.find(h => h.id === selectedHabit);

  // Default icon paths - can be overridden by customIcons prop
  const defaultIcons = {
    overview: "/icon/file.png",
    performance: "/icon/performance.png",
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: customIcons.overview || defaultIcons.overview,
    },
    { 
      id: "performance", 
      label: "Performance", 
      icon: customIcons.performance || defaultIcons.performance
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Advanced Analytics</h3>
        <div className="text-sm text-gray-600">
          {habits.length} habits tracked
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon && (
              <div className="w-4 h-4 relative flex items-center justify-center">
                {failedIcons[tab.id] ? (
                  <span className="text-base">
                    {tab.id === "overview" ? "📊" : tab.id === "performance" ? "📈" : ""}
                  </span>
                ) : (
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    fill
                    style={{ objectFit: "contain" }}
                    onError={() => {
                      // Fallback to emoji if image fails to load
                      setFailedIcons(prev => ({ ...prev, [tab.id]: true }));
                    }}
                  />
                )}
              </div>
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Habit Selector */}
      {(activeTab === "performance") && (
        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-2">Select Habit</label>
          <select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-3">Habit Performance</h4>
                <HabitPerformanceChart 
                  habit={habits[0]} 
                  days={30} 
                  height={180} 
                />
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-3">Overall Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold" style={{ color: '#FAEAB1' }}>
                      {habits.reduce((sum, h) => sum + (h.completions?.length || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-400">Total Completions</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {Math.max(...habits.map(h => h.currentStreak || 0))}
                    </div>
                    <div className="text-xs text-gray-400">Best Current Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && selectedHabitData && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">{selectedHabitData.name} - Performance</h4>
            <div className="space-y-8">
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-2">Last 30 Days</h5>
                <HabitPerformanceChart habit={selectedHabitData} days={30} height={200} />
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-2">Last 90 Days</h5>
                <HabitPerformanceChart habit={selectedHabitData} days={90} height={200} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
