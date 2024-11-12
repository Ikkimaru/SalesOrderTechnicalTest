const db = require('../database/db');  // Assuming db.js handles your SQLite connection
const OrderEntity = require('../entities/orderEntity');

class OrderRepository {
    // Method to create a new order with lines
    static async createOrder(orderRef, orderDate, currency, shipDate, categoryCode, lines) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO orders (orderRef, orderDate, currency, shipDate, categoryCode)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderRef, orderDate, currency, shipDate, categoryCode],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Return the created order as an OrderEntity instance
                        resolve(new OrderEntity(this.lastID, orderRef, orderDate, currency, shipDate, categoryCode, []));
                    }
                }
            );
        });
    }

    // Method to get all orders with their lines
    static async getAllOrders() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM orders`, (err, rows) => {
                if (err) return reject(err);

                // Map the rows into OrderEntity instances
                const orders = rows.map(row => {
                    return new OrderEntity(
                        row.id,
                        row.orderRef,
                        row.orderDate,
                        row.currency,
                        row.shipDate,
                        row.categoryCode,
                        [] // Initialize with an empty array for lines
                    );
                });

                // Fetch the lines for each order using Promise.all to handle async operations
                Promise.all(orders.map(order => {
                    return new Promise((resolveLines, rejectLines) => {
                        db.all(`SELECT * FROM order_lines WHERE orderId = ?`, [order.id], (err, lines) => {
                            if (err) return rejectLines(err);
                            order.lines = lines; // Populate the order lines
                            resolveLines(); // Resolve after lines are populated
                        });
                    });
                }))
                    .then(() => {
                        resolve(orders); // All order lines have been populated, resolve orders
                    })
                    .catch(reject); // If any error occurs during fetching order lines, reject the promise
            });
        });
    }


    // Method to get an order by orderRef, including its lines
    static async getOrderByRef(orderRef) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM orders WHERE orderRef = ?`, [orderRef], (err, row) => {
                if (err) return reject(err);  // Handle any errors

                if (row) {
                    const order = new OrderEntity(
                        row.id,
                        row.orderRef,
                        row.orderDate,
                        row.currency,
                        row.shipDate,
                        row.categoryCode,
                        []
                    );

                    // Now fetch the order lines
                    db.all(`SELECT * FROM order_lines WHERE orderId = ?`, [order.id], (err, lines) => {
                        if (err) return reject(err);  // Handle any errors fetching lines

                        order.lines = lines; // Set the order lines on the order object

                        // Once lines are set, resolve the order
                        resolve(order);
                    });
                } else {
                    resolve(null); // If no order found, return null
                }
            });

        });
    }
}

module.exports = OrderRepository;
