import mongoose from "mongoose";
import Cart from "./dao/models/cart.js";

class CartManager {
  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate("products.product");
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const existingProduct = cart.products.find((item) =>
        item.product.equals(productId)
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = cart.products.filter(
        (item) => !item.product.equals(productId)
      );
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        "Error al eliminar producto del carrito: " + error.message
      );
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      const product = cart.products.find((item) =>
        item.product.equals(productId)
      );
      if (!product) throw new Error("Producto no encontrado en el carrito");

      product.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        "Error al actualizar cantidad de producto: " + error.message
      );
    }
  }

  async updateAllProducts(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = products;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        "Error al actualizar productos del carrito: " + error.message
      );
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error("Carrito no encontrado");

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al vaciar el carrito: " + error.message);
    }
  }
}

export default CartManager;
