import fs from "fs";
import path from "./data/cart.json";

class CartManager {
    constructor(){
        this.path = path;
        this.carts = this.loadcarts();

    }

    loadcarts() {
        if (fs.existsSync(this.path)) {
          const data = fs.readFileSync(this.path, "utf-8");
          return JSON.parse(data);
        }
        return [];
      }

      saveCarts() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
      }

      //add cart
      addCart() {
        const id = this.carts.length.this.carts[this.carts.length - 1].id;
        const newCart = { id, products: [] };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
      }


      //getCartById
      getCartById(id) {
        return this.carts.find((cart) => cart.id === id);
      }


     //addProductInCartById
      addProductInCartById(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;
    
        const productIndex = cart.products.findIndex((p) => p.product === productId);
        if (productIndex >= 0) {
          cart.products[productIndex].quantity += 1;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }
    
        this.saveCarts();
        return cart;
      }

}

export default CartManager;