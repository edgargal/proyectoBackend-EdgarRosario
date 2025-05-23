import { Router } from "express";
import passport from "passport";
import Ticket from "../dao/models/Ticket.js";
import cartRepository from "../dao/repositories/CartRepository.js";
import productRepository from "../dao/repositories/ProductRepository.js";

const cartRouter = Router();

// Crear un carrito nuevo
cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartRepository.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener carrito por ID con productos "populados"
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await cartRepository.getCartById(req.params.cid);
    if (!cart)
      return res.status(404).json({ message: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartRepository.getCartById(cartId);

      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });

      const productsInCart = cart.products;
      const productsNoPurchased = [];
      let totalAmount = 0;

      for (const item of productsInCart) {
        const product = await productRepository.getProductById(
          item.product._id
        );
        if (!product) {
          productsNoPurchased.push(item.product._id);
          continue;
        }

        if (product.stock >= item.quantity) {
          // si hay stock suficiente, descontar stock
          product.stock -= item.quantity;
          await productRepository.updateProduct(product._id, {
            stock: product.stock,
          });
          totalAmount += product.price * item.quantity;
        } else {
          // No hay stock suficiente
          productsNoPurchased.push(item.product._id);
        }
      }

      // Generar ticket solo si hay productos comprados
      if (totalAmount > 0) {
        const ticket = new Ticket({
          amount: totalAmount,
          purchaser: req.user.email,
        });

        await ticket.save();
      }

      // Actualizar carrito para que quede solo con los productos no comprados
      const filteredProducts = productsInCart.filter((item) =>
        productsNoPurchased.includes(item.product._id.toString())
      );

      await cartRepository.updateAllProducts(cartId, filteredProducts);

      if (productsNoPurchased.length > 0) {
        return res.status(200).json({
          message:
            "Compra finalizada parcialmente. Algunos productos no pudieron ser comprados por falta de stock.",
          productsNoPurchased,
        });
      } else {
        return res.status(200).json({ message: "Compra finalizada con éxito" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Agregar producto al carrito (con autenticación)
cartRouter.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { quantity = 1 } = req.body;
      const updatedCart = await cartRepository.addProductToCart(
        req.params.cid,
        req.params.pid,
        quantity
      );
      res.status(201).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Eliminar producto del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await cartRepository.removeProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedCart = await cartRepository.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar todos los productos del carrito
cartRouter.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    const updatedCart = await cartRepository.updateAllProducts(
      req.params.cid,
      products
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vaciar carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartRepository.clearCart(req.params.cid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartRouter;
