const OrderRepository = require('../repositories/order.repository');
const OrderLineRepository = require('../repositories/olderLine.respository');

class OrderService {
    // Method to create a new order
    static async createOrder(orderData) {
        try {
            const createdOrders = [];

            // Iterate over the array of orders
            for (const order of orderData) {
                // Create the order first
                const createdOrder = await OrderRepository.createOrder(
                    order.orderRef,
                    order.orderDate,
                    order.currency,
                    order.shipDate,
                    order.categoryCode
                );

                // If there are lines, insert them into the order_lines table
                if (order.lines && order.lines.length > 0) {
                    const createdOrderLines = await OrderLineRepository.createOrderLines(
                        createdOrder.id,
                        order.lines
                    );
                    createdOrder.lines = createdOrderLines;  // Attach the order lines
                }

                createdOrders.push(createdOrder);  // Add the created order to the result array
            }

            return createdOrders;  // Return all the created orders
        } catch (error) {
            throw new Error('Error creating orders: ' + error.message);
        }
    }

    // Method to get all orders
    static async getAllOrders() {
        return await OrderRepository.getAllOrders();
    }

    // Method to get an order by reference
    static async getOrderByRef(orderRef) {
        return await OrderRepository.getOrderByRef(orderRef);
    }
}

module.exports = OrderService;
