import express from "express";
import productsRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";
import connectDB from "./db/db.js";
import sessionRouter from "./routes/sessions.router.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.config.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("public"));

connectDB();

//midlewares
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/sessions", sessionRouter);

//endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

//websockets
const productManager = new ProductManager("./src/data/products.json");
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productAdded", newProduct);
    } catch (error) {
      console.log("Error añadiendo el nuevo producto");
    }
  });
});

//iniciamos el servidor y escuchamos en el puerto definido
server.listen(PORT, () =>
  console.log(`Servidor iniciado en: http://localhost:${PORT}`)
);
