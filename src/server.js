
const fs = require("fs");
const express = require("express");
const app = express();

class ProductManager {
    idAssign = 1;
    constructor(path) {
        this.path = path;
        this.products = [];
        if(!fs.existsSync(this.path)) {
            const productsString = JSON.stringify(this.products);
            fs.writeFileSync(this.path,productsString);
        } 
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: undefined
        }
        let productOK = false;

        if(
        !title || 
        !description || 
        !price || price < 0 ||
        !thumbnail || 
        !code || 
        !stock || stock < 0 
        )
        {
            productOK = false;
            console.log(`The product was not entered correctly. Please try again completing all de fields correctly.\n`);
        }
        else {
            productOK = true;
        }

        if(productOK) {
            let codeOK = this.products.find(product => product.code === code);
            if(codeOK === undefined) {
                product.id = this.idAssign;
                this.idAssign += 1;
                this.products.push(product);
                const productsString = JSON.stringify(this.products);
                fs.writeFileSync(this.path,productsString);

                console.log("Product uploaded successfully.\n");
            }
            else {
                console.log(`Product code "${code}" is already in use. Please try again with a new code.\n`);
            }
        }
    }

    getProducts() {
        let data = fs.readFileSync(this.path,"utf-8");
        let products = JSON.parse(data);

        return products;
    }

    getProductById(productId) {
        
        let products = this.getProducts();

        let productFound = products.find(product => product.id === productId);
        if(productFound != undefined) {
            return productFound;
        }
        else {
            console.log("Not found");
            return undefined;
        }
    }

    updateProduct(productId, productFields) {
        
        let products = this.getProducts();

        let i = products.findIndex(product => product.id === productId)
        if(i >= 0) {
            this.products[i] = { ...this.products[i], ...productFields, id: this.products[i].id}
            const productsString = JSON.stringify(this.products);
            fs.writeFileSync(this.path,productsString);
            console.log("Product updated succesfully");
        }
        else {
            console.log("Product not found");
        }
    }

    deleteProduct(productId) {
        
        let products = this.getProducts();

        let i = products.findIndex(product => product.id === productId)
        if(i >= 0) {
            this.products.splice(i,1);
            const productsString = JSON.stringify(this.products);
            fs.writeFileSync(this.path,productsString);
            console.log("Product deleted succesfully");
        }
        else {
            console.log("Product not found");
        }
    }
}

const product1Update = {
    title: "producto actualizado",
    price: 1000,
    stock: 5,
}

const productsBase = new ProductManager("database.json");

console.log("Products:\n", productsBase.getProducts());

console.log("Adding product 1...");
productsBase.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log("Products:\n", productsBase.getProducts());

console.log("Adding product 1 again...");
productsBase.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

console.log("Adding product 2...");
productsBase.addProduct("producto 2", "Este es un producto prueba2", 400, "Sin imagen2", "abc234", 50);

console.log("3-Finding product 1...");
console.log(productsBase.getProductById(1)); 
console.log("4-Finding product 2...");
console.log(productsBase.getProductById(2));

console.log("Updating product 1...\n");
productsBase.updateProduct(1,product1Update);
console.log("Products:\n", productsBase.getProducts());

console.log("Deleting Product 1...");
productsBase.deleteProduct(1);
console.log("Products:\n", productsBase.getProducts());
