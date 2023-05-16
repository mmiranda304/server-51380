
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
        formatMsg +=        "<button class='button-item' onclick='deleteProduct("+ product.id +")' >Eliminar</button>";
        formatMsg +=    "</div>";
        formatMsg += "</div>";
    });
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = formatMsg;

});

const form = document.querySelector('form'); 
form.addEventListener('submit', e => {
    e.preventDefault();

    const title         = document.getElementById('title').value;
    const description   = document.getElementById('description').value;
    const price         = document.getElementById('price').value;
    const thumbnail     = document.getElementById('thumbnail').value;
    const code          = document.getElementById('code').value;
    const stock         = document.getElementById('stock').value;
    const status        = document.getElementById('status').checked;

    if(!title || !description || !price || !thumbnail || !code || !stock) {
        alert('Todos los campos son obligatorios');
        return;
      }
    if(!/^https?:\/\//i.test(thumbnail)) {
    alert('La URL de la imagen no es válida');
    return;
    }
    if(isNaN(stock) || stock < 0) {
        alert('El stock debe ser un número mayor o igual a cero');
        return;
    }
    const product = {
        title,
        description,
        price: parseFloat(price),
        thumbnail,
        code,
        stock: parseInt(stock),
        status
      };
    
      socket.emit('newProduct', product);
      form.reset();
      alert('El producto ha sido agregado correctamente'); 
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}