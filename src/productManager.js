import Product from "./models/product.js";

class ProductManager {
  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar producto: " + error.message);
    }
  }

  async getProducts({ limit = 10, page = 1, sort = "", query = "" }) {
    try {
      const filter = query ? { title: new RegExp(query, "i") } : {};
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      };
      return await Product.paginate(filter, options);
    } catch (error) {
      throw new Error("Error al obtener productos: " + error.message);
    }
  }

  async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      throw new Error("Error al obtener producto: " + error.message);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      return await Product.findByIdAndUpdate(productId, updateData, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar producto: " + error.message);
    }
  }

  async deleteProduct(productId) {
    try {
      return await Product.findByIdAndDelete(productId);
    } catch (error) {
      throw new Error("Error al eliminar producto: " + error.message);
    }
  }
}

export default ProductManager;
