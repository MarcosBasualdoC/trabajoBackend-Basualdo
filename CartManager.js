const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.cartIdCounter = 1;
        this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
            this.updateCartIdCounter();
        } catch (error) {
            this.carts = [];
            this.cartIdCounter = 1;
        }
    }

    updateCartIdCounter() {
        if (this.carts.length > 0) {
            const lastCart = this.carts[this.carts.length - 1];
            this.cartIdCounter = lastCart.id + 1;
        } else {
            this.cartIdCounter = 1;
        }
    }

    saveCarts() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
    }

    createCart() {
        const newCart = {
            id: this.cartIdCounter++,
            products: []
        };

        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        return cart;
    }

    addProductToCart(cartId, productId, quantity) {
        if (!quantity) {
            quantity = 1;
        }
    
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado");
        }
    
        const cart = this.carts[cartIndex];
        const existingProduct = cart.products.find(product => product.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
    
        this.saveCarts();
        return cart;
    }
    
    

    getAllCarts() {
        return this.carts;
    }

    validateCartId(cartId) {
        return this.carts.some(cart => cart.id === cartId);
    }
}

module.exports = CartManager;
