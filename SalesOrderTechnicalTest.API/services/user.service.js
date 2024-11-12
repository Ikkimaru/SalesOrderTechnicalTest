const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/user.repository');

class UserService {
    // Method to create a new user with a hashed password
    static async createUser(username, password, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return UserRepository.createUser(username, hashedPassword, role);
    }

    // Method to authenticate user
    static async authenticateUser(username, password) {
        const user = await UserRepository.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    // Method to find user by ID
    static findById(id) {
        return UserRepository.findById(id);
    }
}

module.exports = UserService;
