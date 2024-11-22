const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,       // from .env file
  host: process.env.DB_HOST,       // e.g., localhost
  database: process.env.DB_NAME,   // from .env file
  password: process.env.DB_PASS,   // from .env file
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Error connecting to PostgreSQL:', err.message);
});



console.log({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });
  

module.exports = pool;


