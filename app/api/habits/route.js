import { NextResponse } from 'next/server';
import { authenticateToken } from '../../lib/jwt-auth';

// Simple in-memory habits storage (replace with database in production)
let userHabits = {};

// Get user habits
export async function GET(request) {
  try {
    const user = authenticateToken(request);
    const habits = userHabits[user.id] || [];
    
    return NextResponse.json({ habits });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

// Create new habit
export async function POST(request) {
  try {
    const user = authenticateToken(request);
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Habit name is required' },
        { status: 400 }
      );
    }

    const newHabit = {
      ...body,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      completions: [],
      streak: 0,
      bestStreak: 0
    };

    if (!userHabits[user.id]) {
      userHabits[user.id] = [];
    }
    
    userHabits[user.id].push(newHabit);

    return NextResponse.json({ habit: newHabit }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

