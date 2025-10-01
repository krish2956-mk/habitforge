import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../../lib/jwt-auth';

// Simple in-memory habits storage
let userHabits = {};

export async function POST(request, { params }) {
  try {
    const user = authenticateToken(request);
    const { id } = params;
    const body = await request.json();
    const { date } = body;
    
    const habits = userHabits[user.id] || [];
    const habitIndex = habits.findIndex(h => h.id === id);
    
    if (habitIndex === -1) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    const habit = habits[habitIndex];
    const completionDate = date || new Date().toISOString();
    const today = new Date(completionDate).toDateString();
    
    // Check if already completed today
    const existingCompletions = habit.completions || [];
    const isAlreadyCompleted = existingCompletions.some(
      completion => new Date(completion).toDateString() === today
    );
    
    let newCompletions;
    let action;
    
    if (isAlreadyCompleted) {
      // Remove today's completion
      newCompletions = existingCompletions.filter(
        completion => new Date(completion).toDateString() !== today
      );
      action = 'uncompleted';
    } else {
      // Add today's completion
      newCompletions = [...existingCompletions, completionDate];
      action = 'completed';
    }
    
    // Calculate new streak
    const currentStreak = calculateStreak(newCompletions);
    const bestStreak = Math.max(habit.bestStreak || 0, currentStreak);
    
    // Update the habit
    const updatedHabit = {
      ...habit,
      completions: newCompletions,
      streak: currentStreak,
      bestStreak: bestStreak,
      lastUpdated: new Date().toISOString()
    };
    
    userHabits[user.id][habitIndex] = updatedHabit;

    return NextResponse.json({ 
      habit: updatedHabit,
      action
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

// Helper function to calculate streak
function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  const sortedDates = completions
    .map(date => new Date(date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (sortedDates[i] === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}