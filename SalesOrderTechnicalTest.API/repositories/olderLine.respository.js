const db = require('../database/db');
const OrderLineEntity = require('../entities/orderLineEntity');

class OrderLineRepository {
    // Insert order lines into the database
    static async createOrderLines(orderId, lines) {
        return new Promise((resolve, reject) => {
            const orderLines = [];
            const query = `
                INSERT INTO order_lines (orderId, sku, qty, desc)
                VALUES (?, ?, ?, ?)`;

            // Use a transaction to insert multiple order lines
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                lines.forEach(line => {
                    db.run(query, [orderId, line.sku, line.qty, line.desc], function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            reject(err);
                        } else {
                            orderLines.push(new OrderLineEntity(this.lastID, orderId, line.sku, line.qty, line.desc));
                        }
                    });
                });

                db.run("COMMIT", (err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        reject(err);
                    } else {
                        resolve(orderLines); // Return the created order lines
                    }
                });
            });
        });
    }
}

module.exports = OrderLineRepository;
