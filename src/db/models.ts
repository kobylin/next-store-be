import { Schema, model } from "mongoose";
import * as mongoose from "mongoose";

interface IProductAttribute {
  id: String;
  key: String;
  categoryId: String;
  name: String;
  description: String;
  createdAt: Date;
}

const productAttributeSchema = new Schema<IProductAttribute>({
  key: { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

export const ProductAttribute = model(
  "ProductAttribute",
  productAttributeSchema
);

interface IProductAttributeCategory {
  id: mongoose.Types.ObjectId;
  key: String;
  name: String;
  order: Number;
  createdAt: Date;
}

const productAttributeCategorySchema = new Schema<IProductAttributeCategory>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  order: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

export const ProductAttributeCategory = model(
  "ProductAttributeCategory",
  productAttributeCategorySchema
);

interface IProductCategory {
  id: mongoose.Types.ObjectId;
  key: String;
  name: String;
  description: String;
  parentId: mongoose.Types.ObjectId;
}

const productCategorySchema = new Schema<IProductCategory>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  parentId: { type: mongoose.Types.ObjectId, required: false },
});

export const ProductCategory = model("ProductCategory", productCategorySchema);

interface IProduct {
  id: mongoose.Types.ObjectId;
  title: String;
  imageUrl: String;
  description: String;
  createdAt: String;
  rating: Number;
  price: Number;
  categories: mongoose.Types.ObjectId[];
  attributes: mongoose.Types.ObjectId[];
}

const productSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: false },
  rating: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  categories: [mongoose.Types.ObjectId],
  attributes: [mongoose.Types.ObjectId],
  createdAt: { type: Date, required: true, default: () => new Date() },
});

export const Product = model("Product", productSchema);
