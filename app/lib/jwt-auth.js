import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';

// Simple in-memory user storage (replace with database in production)
let users = [];

export const authService = {
  // Register new user
  async register(email, password, name) {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = {
        id: Date.now().toString(),
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      users.push(user);

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      };
    } catch (error) {
      throw error;
    }
  },

  // Verify token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Get user by ID
  getUserById(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }
};

// Middleware to verify JWT token
export function authenticateToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new Error('Access token required');
  }

  try {
    return authService.verifyToken(token);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
