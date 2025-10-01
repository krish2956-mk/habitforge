'use client';

import { useState, useEffect } from 'react';

export default function DateTimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg md:rounded-2xl p-3 md:p-8 border border-gray-100 shadow-sm md:shadow-xl mb-4 md:mb-6 hover:shadow-md md:hover:shadow-2xl transition-shadow duration-300 max-w-sm md:max-w-none mx-auto">
      <div className="text-center">
        <div className="text-xs md:text-sm font-medium text-gray-500 mb-2 md:mb-3 leading-relaxed">{getGreeting()}</div>
        <div className="text-lg md:text-5xl font-bold mb-2 md:mb-3 tracking-tight" style={{ color: '#F4991A' }}>
          {formatTime(currentTime)}
        </div>
        <div className="text-xs md:text-base font-medium mt-1 md:mt-2 leading-relaxed" style={{ color: '#344F1F' }}>
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
}
