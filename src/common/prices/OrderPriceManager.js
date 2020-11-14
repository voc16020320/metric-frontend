
export function updateOrderPrice(price) {
    orderPrice = price
    orderPriceListeners.forEach(item => item.onOrderPriceUpdate(price))
}

export function registerForOrderPriceUpdates(item) {
    orderPriceListeners.push(item)
}

let orderPrice = NaN
let orderPriceListeners = []
