const express = require('express');
const User = require('../models/User');
const router = express.Router();



// Create a new user
router.post('/users', async (req, res) => {
    try {
        const { username, email, password, is_admin, is_blocked } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        const user = await User.createUser(username, email, password, is_admin || false, is_blocked || false);
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Update a user by ID
// Update a user by ID
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, is_admin, is_blocked } = req.body;

    // Validate at least one field
    if (!username && !email && !password && is_admin === undefined && is_blocked === undefined) {
        return res.status(400).json({ error: 'At least one field is required for update.' });
    }

    try {
        const updatedUser = await User.updateUser(id, {
            ...(username && { username }),
            ...(email && { email }),
            ...(password && { password }),
            ...(is_admin !== undefined && { is_admin }),
            ...(is_blocked !== undefined && { is_blocked }),
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

  




// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(deletedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting user' });
    }
});


// user.js (routes)

// Block a user by ID


// Unblock a user by ID





module.exports = router;
