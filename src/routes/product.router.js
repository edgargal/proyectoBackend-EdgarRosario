import express from "express";
import ProductManager from "../productManager.js"

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

//GET "/api/products"

router.get("/", (req, res) => {
    res.json(productManager.getProducts());
  });


//GET "/:pid"
router.get("/:pid", (req, res) => {
    const product = productManager.getProductById(parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
  });

//POST "/api/products"
router.post("/", (req, res) => {
    const newProduct = productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  });

//PUT "/:pid"
router.put("/:pid", (req, res) => {
    const updatedProduct = productManager.updateProduct(parseInt(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
  });

//DELETE "/:pid"
router.delete("/:pid", (req, res) => {
    productManager.deleteProduct(parseInt(req.params.pid));
    res.json({ message: "Producto eliminado" });
  });
  

export default productsRouter