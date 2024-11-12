class OrderLineEntity {
    constructor(id, orderId, sku, qty, desc) {
        this.id = id;
        this.orderId = orderId;
        this.sku = sku;
        this.qty = qty;
        this.desc = desc;
    }
}

module.exports = OrderLineEntity;
