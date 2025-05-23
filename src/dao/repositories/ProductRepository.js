import Product from "../models/product.js";

class ProductRepository {
  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async getProductById(productId) {
    return await Product.findById(productId).lean();
  }

  async getProducts(filter = {}, options = {}) {
    return await Product.paginate(filter, {
      limit: parseInt(options.limit) || 10,
      page: parseInt(options.page) || 1,
      sort: options.sort || {},
      lean: true,
    });
  }

  async updateProduct(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });
  }

  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  }
}

const productRepository = new ProductRepository();
export default productRepository;
