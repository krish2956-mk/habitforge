import { NextResponse } from 'next/server';
import { authenticateToken } from '../../../lib/jwt-auth';

// Simple in-memory habits storage
let userHabits = {};

export async function DELETE(request, { params }) {
  try {
    const user = authenticateToken(request);
    const { id } = params;
    
    const habits = userHabits[user.id] || [];
    const habitIndex = habits.findIndex(h => h.id === id);
    
    if (habitIndex === -1) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    const deletedHabit = habits.splice(habitIndex, 1)[0];
    userHabits[user.id] = habits;

    return NextResponse.json({ habit: deletedHabit });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}