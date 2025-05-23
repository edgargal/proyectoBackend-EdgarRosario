import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  thumbnail: String,
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: String,
  status: { type: Boolean, default: true },
});

productSchema.plugin(mongoosePaginate);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
