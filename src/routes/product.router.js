import express from "express";
import productRepository from "../dao/repositories/ProductRepository.js";
import { authorize } from "../middleware/autorizacion.js";
import passport from "passport";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productRepository.getProducts({
      limit,
      page,
      sort,
      query,
    });

    res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),

  authorize(["admin"]),
  async (req, res) => {
    try {
      const newProduct = await productRepository.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

productsRouter.put("/:pid", authorize(["admin"]), async (req, res) => {
  try {
    const updatedProduct = await productRepository.updateProduct(
      req.params.pid,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productsRouter.delete("/:pid", authorize(["admin"]), async (req, res) => {
  try {
    const deleted = await productRepository.deleteProduct(req.params.pid);
    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
