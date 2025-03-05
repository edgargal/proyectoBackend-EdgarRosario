import express from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js"; // Para hacer el populate de productos

// Instanciamos el router de express para manejar las rutas
const cartRouter = express.Router();
// Instanciamos el manejador de carrito
const cartManager = new CartManager("./src/data/cart.json");
// Instanciamos el manejador de productos
const productManager = new ProductManager("./src/data/products.json");

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).send(newCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    // Obtener carrito y hacer "populate" de los productos
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) {
      // Aquí haríamos el populate de los productos, asumiendo que `getCartById` solo retorna IDs de productos.
      const populatedCart = await Promise.all(
        cart.products.map(async (cartProduct) => {
          const product = await productManager.getProductById(cartProduct.id);
          return { ...cartProduct, product }; // Añadir detalles del producto
        })
      );
      res.status(200).send({ ...cart, products: populatedCart });
    } else {
      res.status(404).send({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = { id: parseInt(req.params.pid), quantity };

    // Añadir producto al carrito
    const updatedCart = await cartManager.addProductInCartById(req.params.cid, product);
    res.status(201).send(updatedCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Nuevo endpoint para eliminar un producto específico del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Nuevo endpoint para actualizar la cantidad de un producto en el carrito
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Nuevo endpoint para actualizar todos los productos del carrito
cartRouter.put("/:cid", async (req, res) => {
  try {
    const products = req.body.products; // Un arreglo de productos con su cantidad
    const updatedCart = await cartManager.updateAllProductsInCart(req.params.cid, products);
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Nuevo endpoint para eliminar todos los productos del carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartManager.clearCart(req.params.cid);
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default cartRouter;
