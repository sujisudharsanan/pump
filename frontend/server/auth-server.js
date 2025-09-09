const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with MongoDB in production)
const users = [];

// Helper function to find user
const findUser = identifier => {
  return users.find(
    user => user.username === identifier || user.email === identifier
  );
};

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      dateOfBirth,
      gender,
      countryCode,
    } = req.body;

    // Check if user already exists
    const existingUser = findUser(username) || findUser(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this username or email',
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      countryCode,
      address,
      city,
      state,
      zipCode,
      country,
      dateOfBirth,
      gender,
      createdAt: new Date().toISOString(),
    };

    // Add user to storage
    users.push(newUser);

    console.log('New user registered:', {
      username,
      email,
      firstName,
      lastName,
    });

    res.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
    });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = findUser(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    console.log('User logged in:', user.username);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed due to server error',
    });
  }
});

// Forgot password endpoint
app.post('/forgot-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    // Find user
    const user = findUser(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    user.updatedAt = new Date().toISOString();

    console.log('Password reset for user:', user.username);

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed due to server error',
    });
  }
});

// Get all users (for testing)
app.get('/users', (req, res) => {
  const safeUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  }));

  res.json({
    success: true,
    users: safeUsers,
    count: safeUsers.length,
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth server is running',
    timestamp: new Date().toISOString(),
    port: port,
  });
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 Authentication Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`👥 View users: http://localhost:${port}/users`);
  console.log('🔐 Endpoints available:');
  console.log('  POST /register - User registration');
  console.log('  POST /login - User login');
  console.log('  POST /forgot-password - Password reset');
  console.log('  GET /users - List all users (testing)');
  console.log('  GET /health - Server health check\n');
});
