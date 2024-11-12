// /database/db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Create or open the database file (use ':memory:' for in-memory database or specify a file for persistent storage)
const db = new sqlite3.Database(':memory:'); // In-memory database for testing

// Create the tables
db.serialize(async () => {
    // Create the users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            role TEXT
        )
    `, function(err) {
        if (err) {
            console.error("Error creating users table:", err);
        } else {
            console.log("Users table created.");
        }
    });

    // Create the orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            orderRef TEXT,
            orderDate DATE,
            currency TEXT,
            shipDate DATE,
            categoryCode TEXT
        )
    `, function(err) {
        if (err) {
            console.error("Error creating orders table:", err);
        } else {
            console.log("Orders table created.");
        }
    });

    // Create the order_lines table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_lines (
            id INTEGER PRIMARY KEY,
            orderId INTEGER,
            sku TEXT,
            qty INTEGER,
            desc TEXT,
            FOREIGN KEY(orderId) REFERENCES orders(id)
        )
    `, function(err) {
        if (err) {
            console.error("Error creating order_lines table:", err);
        } else {
            console.log("Order_lines table created.");
        }
    });

    // Insert sample users (hashed password for production use)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const guestPassword = await bcrypt.hash('guest123', 10);

    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, ['admin', adminPassword, 'admin'], function(err) {
        if (err) {
            console.error('Error inserting admin user:', err);
        } else {
            console.log("Admin user added.");
        }
    });

    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, ['guest', guestPassword, 'guest'], function(err) {
        if (err) {
            console.error('Error inserting guest user:', err);
        } else {
            console.log("Guest user added.");
        }
    });

    // Add a sample order
    db.run(`
        INSERT INTO orders (orderRef, orderDate, currency, shipDate, categoryCode)
        VALUES ('ORD123', '2024-11-12', 'USD', '2024-11-15', 'ELECTRONICS')
    `, function(err) {
        if (err) {
            console.error('Error inserting sample order:', err);
        } else {
            const orderId = this.lastID; // Get last inserted order ID

            // Insert lines for the above order
            db.run(`
                INSERT INTO order_lines (orderId, sku, qty, desc)
                VALUES (?, ?, ?, ?)
            `, [orderId, 'SKU123', 2, 'Product A'], function(err) {
                if (err) {
                    console.error('Error inserting order line:', err);
                } else {
                    console.log("Sample order with line added.");
                }
            });
        }
    });
});

// Export the database instance to be used in repositories and services
module.exports = db;
