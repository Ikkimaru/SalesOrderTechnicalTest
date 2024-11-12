const db = require('../database/db');
const UserEntity = require('../entities/userEntity');

class UserRepository {
    // Method to create a new user
    static async createUser(username, hashedPassword, role) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
                [username, hashedPassword, role],
                function (err) {
                    if (err) reject(err);
                    else resolve(new UserEntity(this.lastID, username, hashedPassword, role));
                }
            );
        });
    }

    // Method to find a user by username
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
                if (err) reject(err);
                else if (row) resolve(new UserEntity(row.id, row.username, row.password, row.role));
                else resolve(null);
            });
        });
    }

    // Method to find a user by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else if (row) resolve(new UserEntity(row.id, row.username, row.password, row.role));
                else resolve(null);
            });
        });
    }
}

module.exports = UserRepository;
