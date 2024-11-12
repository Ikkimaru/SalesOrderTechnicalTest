class Order{
    constructor(orderRef, orderDate, currency, shipDate, categoryCode, lines) {
        this.orderRef = orderRef;
        this.orderDate = orderDate;
        this.currency = currency;
        this.shipDate = shipDate;
        this.categoryCode = categoryCode;
        this.lines = lines; // Array of line items (sku, qty, desc)
    }
}

module.exports = Order;
