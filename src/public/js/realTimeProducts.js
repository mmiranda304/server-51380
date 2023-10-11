
const socket = io();

socket.on('newProduct', (products) => { 
    let formatMsg = "";
    products.forEach(product => {
        formatMsg += "<div class='item' id='item'>";
        formatMsg +=    "<div class='img-container'>";
        formatMsg +=        "<img src="+ product.thumbnail +" alt="+ product.title+ "/>";
        formatMsg +=    "</div>";
        formatMsg +=    "<div class='item-body'>";
        formatMsg +=        "<h5 class='item-title'>"+ product.title +"</h5>";
        formatMsg +=        "<p class='item-text'>$"+ product.price +"</p>";
        formatMsg +=        "<button class='button-item' onclick='deleteProduct(\""+ product._id +"\")' >Eliminar</button>";
        formatMsg +=    "</div>";
        formatMsg += "</div>";
    });
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = formatMsg;

});

function deleteProduct(_id) {
    socket.emit('deleteProduct', _id);
}