import express from "express";
import Product from "../models/product.js";
import Cart from "../models/Cart.js"; 

const router = express.Router();


router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query
      ? {
          $or: [
            { category: { $regex: query, $options: "i" } },
            { status: query.toLowerCase() === "true" },
          ],
        }
      : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    res.render("index", {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: error.message });
  }
});

// ruta para visualizar un carrito específico con productos
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Buscar el carrito con los productos poblados
    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;