import Cart from "../models/cart.js";

class CartRepository {
  async createCart() {
    const cart = new Cart({ products: [] });
    return await cart.save();
  }

  async getCartById(cartId) {
    return await Cart.findById(cartId).populate("products.product").lean();
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex >= 0) {
      // Si el producto ya existe, sumamos la cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Si nó, lo agregamos
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await this.getCartById(cartId);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    return await this.getCartById(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (!product) throw new Error("Producto no encontrado en el carrito");

    product.quantity = quantity;
    await cart.save();
    return await this.getCartById(cartId);
  }

  async updateAllProducts(cartId, products) {
    // products: [{ product: id, quantity }, ...]
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = products.map(({ product, quantity }) => ({
      product,
      quantity,
    }));

    await cart.save();
    return await this.getCartById(cartId);
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return await this.getCartById(cartId);
  }
}

const cartRepository = new CartRepository();
export default cartRepository;
