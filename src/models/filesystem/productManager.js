import fs from 'fs';

class ProductManager {
    idAssign = 1;
    constructor(path) {
        this.path = path;
    }
    async getProducts() {
        try {
            if(fs.existsSync(this.path)) {
                let data = await fs.promises.readFile(this.path, "utf-8");
                let products = JSON.parse(data);
                for (let i = 0; i < products.length; i++) {
                    if (products[i].id === this.idAssign) {
                        this.idAssign++;
                    }
                }
                return JSON.parse(data);
            }
            await fs.promises.writeFile(this.path, JSON.stringify([])); //Si no existe el archivo, lo creo
            return [];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProduct(product) {
        try {
            let products = await this.getProducts();
            let productOK = false;
    
            if(
            !product.title || 
            !product.description || 
            !product.price || product.price < 0 ||
            !product.thumbnail || 
            !product.code || 
            !product.stock || product.stock < 0 ||
            product.status === undefined
            ) {
                productOK = false;
                console.log(`The product was not entered correctly. Please try again completing all de fields correctly.`);
            }
            else {
                productOK = true;
            }
    
            if(productOK) {
                let codeOK = products.find((p) => p.code === product.code);             
    
                if(codeOK === undefined) {
                    let newProduct = {id: this.idAssign, ...product};     
                    products.push(newProduct);
                    const productsString = JSON.stringify(products);
                    await fs.promises.writeFile(this.path,productsString);
    
                    console.log("Product uploaded successfully.");
                    return true;
                }
                else {
                    console.log(`Product code "${product.code}" is already in use. Please try again with a new code.`);
                    return false;
                }
            }    
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductById(productId) {
        try {
            let products = await this.getProducts();
    
            let productFound = products.find(product => product.id === productId);
            if(productFound != undefined) {
                return productFound;
            }
            console.log("Product not found");
            return undefined;            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(productId, productFields) {
        try {
            let products = await this.getProducts();
    
            let i = products.findIndex(product => product.id === productId);
            if(i >= 0) {
                products[i] = { ...products[i], ...productFields, id: products[i].id}
                const productsString = JSON.stringify(products);
                await fs.promises.writeFile(this.path,productsString);
                console.log("Product updated succesfully");
                return true;
            }
            else {
                console.log("Product not found");
                return false;
            } 
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async deleteProduct(productId) {
        try {
            let products = await this.getProducts();
            
            let i = products.findIndex(product => product.id === productId);
            if(i >= 0) {
                products.splice(i,1);
                const productsString = JSON.stringify(products);
                await fs.promises.writeFile(this.path,productsString);
                console.log("Product deleted succesfully");
                return true;
            }
            else {
                console.log("Product not found");
                return false;
            }     
        } catch (error) {
            throw new Error(error.message);
        }
    } 
}
export default ProductManager;

const productsList = [
    {
        title: "Product 1",
        description: "Description product 1",
        price: 100,
        thumbnail: "No image",
        code: "p1",
        stock: 10
    },
    {
        title: "Product 2",
        description: "Description product 2",
        price: 200,
        thumbnail: "No image",
        code: "p2",
        stock: 20
    },
    {
        title: "Product 3",
        description: "Description product 3",
        price: 300,
        thumbnail: "No image",
        code: "p3",
        stock: 30
    },
    {
        title: "Product 4",
        description: "Description product 4",
        price: 400,
        thumbnail: "No image",
        code: "p4",
        stock: 40
    },
    {
        title: "Product 5",
        description: "Description product 5",
        price: 500,
        thumbnail: "No image",
        code: "p5",
        stock: 50
    },
    {
        title: "Product 6",
        description: "Description product 6",
        price: 600,
        thumbnail: "No image",
        code: "p6",
        stock: 60
    },
    {
        title: "Product 7",
        description: "Description product 7",
        price: 700,
        thumbnail: "No image",
        code: "p7",
        stock: 70
    },
    {
        title: "Product 8",
        description: "Description product 8",
        price: 800,
        thumbnail: "No image",
        code: "p8",
        stock: 80
    },
    {
        title: "Product 9",
        description: "Description product 9",
        price: 900,
        thumbnail: "No image",
        code: "p9",
        stock: 90
    },
    {
        title: "Product 10",
        description: "Description product 10",
        price: 1000,
        thumbnail: "No image",
        code: "p10",
        stock: 100
    }
];

//const productsBase = new ProductManager("products.json");
// const asyncFn = async () => {
//     try {
//         console.log("Pushing products...");
//         for (let i = 0; i < productsList.length; i++) {
//             await productsBase.addProduct(productsList[i]);
//         } 
//         console.log("Products:\n", await productsBase.getProducts());
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }; asyncFn(); 
