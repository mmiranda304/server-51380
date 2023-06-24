const API_URL = "http://localhost:8080/api";
let cartId = localStorage.getItem("cart-id");

if (!cartId) {
    // alert("no id");
    const url = API_URL + "/cart";
    const data = {};
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
        console.log("Response:", data);
        console.log(data);
        const cartId = localStorage.setItem("cart-id", data.data._id);
    })
    .catch((error) => {
        console.error("Error:", error);
        alert(JSON.stringify(error));
    });
}

function addToCart(_id) {
    cartId = localStorage.getItem("cart-id");
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
        .then((response) => response.json())
        .then((res) => {
            console.log(res);
            alert("added");
        })
        .catch((error) => {
            console.error("Error:", error);
            alert(JSON.stringify(error));
        });
}