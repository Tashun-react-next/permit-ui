export class Order {

    static getFilledOrder(created, valid, price, quantity) {
        const tempOrder = new Order();
        tempOrder.created = created;
        tempOrder.valid = valid;
        tempOrder.price = price;
        tempOrder.quantity = quantity;
        return tempOrder;
    }

    created: Date;
    valid: Date;
    price: number;
    quantity: number;

}