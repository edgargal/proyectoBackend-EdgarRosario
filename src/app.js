import express from "express";
import productsRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en: http://localhost:${PORT} `);

})