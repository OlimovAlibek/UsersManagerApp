const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  });

  
const cors = require('cors');
const pool = require('./config/db'); // Import the connection pool



const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend access
app.use(express.json()); // Parse JSON requests

// Test DB Connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Database connected:', res.rows[0].now);
  }
});

// Routes
const testRoutes = require('./routes/test');
app.use('/api', testRoutes);

const userRoutes = require('./routes/user');
app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
