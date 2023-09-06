const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    getProducts() {
        return this.products;
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            this.updateProductIdCounter();
        } catch (error) {
            this.products = [];
            this.productIdCounter = 1;
        }
    }

    updateProductIdCounter() {
        if (this.products.length > 0) {
            const lastProduct = this.products[this.products.length - 1];
            this.productIdCounter = lastProduct.id + 1;
        } else {
            this.productIdCounter = 1;
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    addProduct(productData) {
        if (!this.validateProductData(productData)) {
            throw new Error("Datos de producto no válidos");
        }

        const existingProduct = this.products.find(product => product.code === productData.code);
        if (existingProduct) {
            throw new Error("Ya existe un producto con el mismo código");
        }

        const newProduct = {
            id: this.productIdCounter++,
            ...productData
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields
        };

        this.saveProducts();
        return this.products[productIndex];
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];
        this.saveProducts();
        return deletedProduct;
    }

    validateProductData(productData) {
        const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
        return requiredFields.every(field => productData.hasOwnProperty(field));
    }
}

module.exports = ProductManager;
