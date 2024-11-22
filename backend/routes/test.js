const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the pool from db.js

// Database connection test route
router.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ success: false, error: 'Database connection failed' });
    }
});

module.exports = router;
