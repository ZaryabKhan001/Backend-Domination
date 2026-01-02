import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Product price must be a positive number'],
    },
    inStock: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model('Product', productSchema);

export default Product;
