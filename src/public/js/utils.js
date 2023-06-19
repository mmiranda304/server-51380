export function formatPrice(price) {
    if(price)
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return price;
}
