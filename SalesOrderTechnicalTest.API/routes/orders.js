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
router.get('/:orderRef', async (req, res) => {
    try {
        const order = await OrderService.getOrderByRef(req.params.orderRef);
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
router.put('/:id', authenticateToken, ensureRole('admin'), (req, res) => {
    // Logic to update an order
    res.send('Order updated');
});

// Delete order - accessible only to admin
router.delete('/:id', authenticateToken, ensureRole('admin'), (req, res) => {
    // Logic to delete an order
    res.send('Order deleted');
});

module.exports = router;
