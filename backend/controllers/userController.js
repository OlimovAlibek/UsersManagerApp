const User = require('../models/User');
const pool = require('../config/db');  // Ensure this is imported for database access

const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const blockUnblockUser = async (req, res) => {
    const { id } = req.params;
    const { is_blocked } = req.body;
    try {
        const user = await User.updateUserStatus(id, is_blocked);
        res.status(200).json({ message: 'User status updated', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.deleteUser(id);
        res.status(200).json({ message: 'User deleted', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = { getUsers, blockUnblockUser, deleteUser };
