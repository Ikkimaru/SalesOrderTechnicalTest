const express = require('express');
const { authenticateToken, ensureRole } = require('../middleware/auth');
const OrderService = require('../services/order.service');
const router = express.Router();

// View all orders - accessible to both roles
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: "Error fetching orders", error: err});
    }
});

// Route to get a single order by reference
router.get('/:id', async (req, res) => {
    try {
        const order = await OrderService.getOrderByRef(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Error fetching order", error: err });
    }
});

// Create order - accessible only to admin
router.post('/', authenticateToken, ensureRole('admin'), async (req, res) => {
    try {
        const orderData = req.body;

        // Delegate to the service
        const orderId = await OrderService.createOrder(orderData);

        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order - accessible only to admin
// Update order - accessible only to admin
router.put('/:id', authenticateToken, ensureRole('admin'), async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedOrderData = req.body;

        // Ensure the order exists
        const existingOrder = await OrderService.getOrderByRef(orderId);

        if (!existingOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Delegate to the service to update the order
        const updatedOrder = await OrderService.updateOrder(orderId, updatedOrderData);

        res.status(200).json({ message: 'Order updated successfully', updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});


// Delete order - accessible only to admin
router.delete('/:id', authenticateToken, ensureRole('admin'), (req, res) => {
    // Logic to delete an order
    res.send('Order deleted');
});

module.exports = router;
