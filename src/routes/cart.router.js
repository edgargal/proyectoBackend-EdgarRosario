import express from "express"
import CartManager from "../cartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager();

//POST "/"
cartRouter.post("/", (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
  });

//GET "/:cid"
cartRouter.get("/:cid", (req, res) => {
    const cart = cartManager.getCartById(parseInt(req.params.cid));
    if(!cart)res.json(cart).res.status(404).json({ error: "Carrito no encontrado" });
  });

//POST "/:cid/product/:pid"
cartRouter.post("/:cid/product/:pid", (req, res) => {
    const updatedCart = cartManager.addProductInCartById(parseInt(req.params.cid), parseInt(req.params.pid));
    if(!updatedCart)res.json(updatedCart).res.status(404).json({ error: "Carrito no encontrado" });
  });
  

export default cartRouter;