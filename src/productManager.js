import fs from "fs";
const pathFile = "./data/products.json";

class ProductManager {

    constructor() {
        this.pathFile = pathFile;
        this.products = this.cargarProductos();
    }

    cargarProductos() {
        if (fs.existsSync(this.pathFile)) {
            const data = fs.readFileSync(this.pathFile, "utf-8");
            return JSON.parse(data);
        }
        return [];
    }

    guardarProductos() {
        fs.writeFileSync(this.pathFile, JSON.stringify(this.products, null, 2));
    }


    //getProducts
    getProducts() {
        return this.products;
    }


    //getProductsById
    getProductById(id) {
        return this.products.find((p) => p.id === id);
    }


    //addProducts
    addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        const id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
        const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
        this.products.push(newProduct);
        this.guardarProductos();
        return newProduct;
    }


    //setProductById
      setProductById(id, setFields) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...setFields, id };
    this.guardarProductos();
    return this.products[index];
  }

    //deleteProductById

    deleteProduct(id) {
        this.products = this.products.filter((p) => p.id !== id);
        this.guardarProductos();
      }
    

}

export default ProductManager;