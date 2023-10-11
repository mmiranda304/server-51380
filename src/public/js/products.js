const API_URL = "/api";
const cartIdElement = document.getElementsByClassName('cartID')[0];

const addToCart = (_id) => {
    const cartId = cartIdElement?.getAttribute('id');
    if (cartId === undefined) {
        window.location.href = '/login';
    }
    const url = API_URL + "/cart/" + cartId + "/product/" + _id;
    const data = {};
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
            alert(`Producto agregado al carro - ID: ${_id}.`);
        })
        .catch((err) => {
            alert(`El producto con el ID: ${_id} no puede ser agregado.`);
        });
};