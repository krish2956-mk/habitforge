'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function BeautifulNavbar({ 
  user, 
  activeView, 
  setActiveView, 
  onSignOut, 
  pendingHabits, 
  completedHabits 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: '', description: 'Today\'s focus' },
    { id: 'weekly', label: 'Weekly', icon: '', description: '7-day overview' },
    { id: 'monthly', label: 'Monthly', icon: '', description: 'Calendar view' },
    { id: 'analytics', label: 'Analytics', icon: '', description: 'Advanced insights' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getStatusColor = () => {
    if (pendingHabits.length === 0) return 'text-emerald-400';
    if (pendingHabits.length <= 2) return 'text-yellow-400';
    return 'text-rose-400';
  };

  // const getStatusIcon = () => {
  //   if (pendingHabits.length === 0) return '🎉';
  //   if (pendingHabits.length <= 2) return '⚡';
  //   return '📝';
  // };

  return (
    <div className="bg-white border-b border-gray-200 relative overflow-hidden shadow-sm">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 opacity-50"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: "#FAEAB1" }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-8 -left-8 w-16 h-16 rounded-full opacity-5"
          style={{ backgroundColor: "#FAEAB1" }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-5 md:pl-4 md:pr-6 py-5 md:py-6">
        <div className="flex items-center justify-between gap-3 md:gap-0">
          {/* Left Section - User Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 md:space-x-4"
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* User Avatar */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </motion.div>

              {/* User Info */}
              <div>
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-sm md:text-lg text-gray-600 greeting-font">
                    {getGreeting()},
                  </span>
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200">
                    <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                      {user?.name || "User"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium hidden md:inline">Online</span>
                  </div>
                </motion.div>
                <motion.div
                  className="text-xs md:text-sm text-gray-600 mt-2 flex items-center space-x-2 navbar-font hidden sm:flex"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${pendingHabits.length > 0 ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                    <span>
                      {pendingHabits.length > 0
                        ? `${pendingHabits.length} habit${
                            pendingHabits.length === 1 ? "" : "s"
                          } pending today`
                        : "All habits completed for today!"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Navigation & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {views.map((view, index) => (
                <motion.button
                  key={view.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(view.id)}
                  className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 navbar-font ${
                    activeView === view.id
                      ? "text-gray-800 shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={
                    activeView === view.id
                      ? {
                          backgroundColor: "#FAEAB1",
                          boxShadow: "0 4px 14px 0 rgba(250, 234, 177, 0.3)",
                        }
                      : {}
                  }
                >
                  <div className="flex items-center space-x-2">
                    {/* <span className="text-lg">{view.icon}</span> */}
                    <span>{view.label}</span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {view.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>

            {/* Sign Out Button - Hidden on mobile */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onSignOut}
              className="hidden lg:block px-4 py-2 md:px-6 md:py-2.5 bg-red-600 text-white text-xs md:text-sm font-semibold hover:bg-red-700 transition-colors duration-200 navbar-font rounded-md shadow-md"
            >
              Sign Out
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-2 gap-2">
                {views.map((view, index) => (
                  <motion.button
                    key={view.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveView(view.id);
                      setIsMenuOpen(false);
                    }}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 navbar-font ${
                      activeView === view.id
                        ? "text-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    style={
                      activeView === view.id
                        ? { backgroundColor: "#FAEAB1" }
                        : {}
                    }
                  >
                    <div className="flex items-center space-x-2">
                      {/* <span className="text-lg">{view.icon}</span> */}
                      <span>{view.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Sign Out Button in Mobile Menu */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSignOut}
                className="mt-4 px-6 py-3 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors duration-200 navbar-font rounded-md shadow-md"
              >
                Sign Out
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

