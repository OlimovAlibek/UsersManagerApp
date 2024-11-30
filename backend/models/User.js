const pool = require('../config/db');

class User {
    /**
     * Create a new user in the database
     * @param {string} username - User's name
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @param {boolean} is_admin - Is the user an admin?
     * @param {boolean} is_blocked - Is the user blocked?
     * @returns {object} The newly created user
     */
    static async createUser(username, email, password, is_admin, is_blocked) {
        try {
            const query = `
                INSERT INTO users (username, email, password, is_admin, is_blocked, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const values = [username, email, password, is_admin, is_blocked, new Date()];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    /**
     * Get all users from the database
     * @returns {Array} List of users
     */
    static async getAllUsers() {
        try {
            const query = `SELECT * FROM users`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error retrieving users: ${error.message}`);
        }
    }

    /**
     * Get a single user by ID
     * @param {number} id - User's ID
     * @returns {object} The user with the specified ID
     */
    static async getUserById(id) {
        try {
            const query = `SELECT * FROM users WHERE id = $1`;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error retrieving user by ID: ${error.message}`);
        }
    }

    /**
 * Update a user by ID with partial fields
 * @param {number} id - User's ID
 * @param {object} fields - Fields to update
 * @returns {object} The updated user
 */
    static async updateUser(id, fields) {
        try {
          const keys = Object.keys(fields);
          const values = Object.values(fields);
      
          if (keys.length === 0) {
            throw new Error('No fields provided for update');
          }
      
          const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
          const query = `
            UPDATE users
            SET ${setClause}
            WHERE id = $${keys.length + 1}
            RETURNING *;
          `;
      
          values.push(id);
          const result = await pool.query(query, values);
          return result.rows[0];
        } catch (error) {
          throw new Error(`Error updating user: ${error.message}`);
        }
      }
      


    /**
     * Delete a user by ID
     * @param {number} id - User's ID
     * @returns {object} The deleted user
     */
    static async deleteUser(id) {
        try {
            const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    /**
     * Block a user by ID
     * @param {number} id - User's ID
     * @returns {object} The updated user with is_blocked set to true
     */
    static async blockUser(id) {
        try {
            const query = `
                UPDATE users
                SET is_blocked = true
                WHERE id = $1
                RETURNING *;
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error blocking user: ${error.message}`);
        }
    }

    /**
     * Unblock a user by ID
     * @param {number} id - User's ID
     * @returns {object} The updated user with is_blocked set to false
     */
    static async unblockUser(id) {
        try {
            const query = `
                UPDATE users
                SET is_blocked = false
                WHERE id = $1
                RETURNING *;
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error unblocking user: ${error.message}`);
        }
    }
}

module.exports = User;
