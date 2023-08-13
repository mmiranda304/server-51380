const API_URL = "http://localhost:8080/api";
const cartIdElement = document.getElementsByClassName('cartID')[0];

const clearCart = (cartId) => {
    const url = API_URL + "/cart/" + cartId;
    const data = {};
    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
            window.location.href = window.location.href;  // refresh
            alert(`Se vació el carrito, ID: ${cartId}`);
      })
      .catch((err) => console.log(err));
  };

const purchaseCart = (cartId) => {
    const url = API_URL + "/cart/" + cartId;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    fetch(`/api/cart/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((data) => {
          const products = data.payload.products;
          const formatedProducts = products.map((product) => {
            return {
              id: product.product._id,
              quantity: product.quantity,
            };
          });
          fetch(`/api/cart/${cartId}/purchase`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formatedProducts),
          })
              .then((res) => res.json())
              .then((data) => {
                const id = data.payload._id;
                window.location.href = `/api/cart/purchase/${id}`;
                alert(`Compra realizada! Sólo se compraron los productos con stock disponible.`);
            })
            .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
};