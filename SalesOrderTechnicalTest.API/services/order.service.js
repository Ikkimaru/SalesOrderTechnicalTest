const OrderRepository = require('../repositories/order.repository');
const OrderLineRepository = require('../repositories/olderLine.respository');

class OrderService {
    // Method to create a new order
    static async createOrder(orderData) {
        try {
            // Create the order first
            const createdOrder = await OrderRepository.createOrder(
                orderData.orderRef,
                orderData.orderDate,
                orderData.currency,
                orderData.shipDate,
                orderData.categoryCode
            );

            // If there are lines, insert them into the order_lines table
            if (orderData.lines && orderData.lines.length > 0) {
                const createdOrderLines = await OrderLineRepository.createOrderLines(
                    createdOrder.id,
                    orderData.lines
                );
                createdOrder.lines = createdOrderLines;  // Attach the order lines
            }

            return createdOrder;  // Return the created order
        } catch (error) {
            throw new Error('Error creating order: ' + error.message);
        }
    }


    // Method to get all orders
    static async getAllOrders() {
        return await OrderRepository.getAllOrders();
    }

    // Method to get an order by reference
    static async getOrderByRef(id) {
        return await OrderRepository.getOrderByRef(id);
    }

    // Method to update an order by reference
    static async updateOrder(id, orderData) {
        return await OrderRepository.updateOrder(id, orderData);
    }
}

module.exports = OrderService;
