import express from "express";
import Product from "../models/product.js";  

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construccion del filtro
    const filter = {};
    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: "i" } },  // Búsqueda flexible en categoría
        { status: query.toLowerCase() === "true" }       // Filtrar por disponibilidad
      ];
    }

    // Construcción de la consulta
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}  // Orden por precio
    };

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(options.sort).skip(options.skip).limit(options.limit);

    const totalPages = Math.ceil(totalProducts / options.limit);

    res.status(200).json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener producto por ID
productsRouter.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un nuevo producto
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto existente
productsRouter.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un producto por ID
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
