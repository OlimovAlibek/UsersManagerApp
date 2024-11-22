const pool = require('../config/db');






class User {
    // Add a user to the database
    static async createUser(username, email, password, is_admin, is_blocked) {
        const query = `INSERT INTO users (username, email, password, is_admin, is_blocked, created_at)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;`;
        const values = [username, email, password, is_admin, is_blocked, new Date()];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Get all users
    static async getAllUsers() {
        const query = `SELECT * FROM users`;
        const result = await pool.query(query);
        return result.rows;
    }

    // Get a single user by ID
    static async getUserById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Update a user by ID
    static async updateUser(id, username, email, password, is_admin, is_blocked) {
        const query = `UPDATE users 
                       SET username = $1, email = $2, password = $3, is_admin = $4, is_blocked = $5, created_at = $6
                       WHERE id = $7
                       RETURNING *`;
        const values = [username, email, password, is_admin, is_blocked, new Date(), id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Delete a user by ID
    static async deleteUser(id) {
        const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = User;
