import * as mongoose from "mongoose";
import { Model, model, Schema } from "mongoose";
import type { HydratedDocument } from "mongoose";
import {
  fetchAllCategoryChildren,
  fetchAllCategoryParents,
  fetchCategoriesChildrenRecursively,
} from "./utils";

type ID = typeof Schema.Types.ObjectId | string;

export interface IProductAttribute {
  id: ID;
  key: string;
  categoryId: ID;
  name: string;
  description: string;
  createdAt: Date;
}

interface IProductAttributeModel extends Model<IProductAttribute> {}

const productAttributeSchema = new Schema<
  IProductAttribute,
  IProductAttributeModel
>({
  key: { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

export const ProductAttribute = model<
  IProductAttribute,
  IProductAttributeModel
>("ProductAttribute", productAttributeSchema);

export interface IProductAttributeCategory {
  id: ID;
  key: string;
  name: string;
  order: number;
  createdAt: Date;
}

interface IProductAttributeCategoryModel
  extends Model<IProductAttributeCategory> {}

const productAttributeCategorySchema = new Schema<
  IProductAttributeCategory,
  IProductAttributeCategoryModel
>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  order: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

export const ProductAttributeCategory = model<
  IProductAttributeCategory,
  IProductAttributeCategoryModel
>("ProductAttributeCategory", productAttributeCategorySchema);

export interface IProductCategory {
  id: ID;
  key: string;
  name: string;
  description: string;
  parentId: ID;
  createdAt: Date;
}

interface IProductCategoryModel extends Model<IProductCategory> {
  getCategoryWithParents(opts: { category: string }): Promise<any[]>;
  getCategoriesHierarchy(): Promise<any[]>;
}

const productCategorySchema = new Schema<
  IProductCategory,
  IProductCategoryModel
>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  parentId: { type: mongoose.Types.ObjectId, required: false },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

productCategorySchema.statics.getCategoryWithParents = async ({
  category: categoryKey,
}) => {
  const category = await ProductCategory.findOne({
    key: categoryKey,
  }).exec();

  if (!category) {
    return [];
  }

  const parents = await fetchAllCategoryParents(category);

  return [...parents.reverse(), category].map((c) => c.toJSON());
};

productCategorySchema.statics.getCategoriesHierarchy = async () => {
  const rootCategories = await ProductCategory.find({
    parentId: null,
  }).exec();

  const result = rootCategories.map((c) => c.toJSON());
  await fetchCategoriesChildrenRecursively(result);

  return result;
};

export const ProductCategory = model<IProductCategory, IProductCategoryModel>(
  "ProductCategory",
  productCategorySchema
);

export interface IProduct {
  id: ID;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  price: number;
  categories: (ID | IProductCategory)[];
  attributes: (ID | IProductAttribute)[];
  createdAt: Date;
}

interface IProductModel extends Model<IProduct> {
  getAttributesCategories(opts: any): Promise<any[]>;
}

const productSchema = new Schema<IProduct, IProductModel>({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: false },
  rating: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  categories: [mongoose.Types.ObjectId],
  attributes: [mongoose.Types.ObjectId],
  createdAt: { type: Date, required: true, default: () => new Date() },
});

productSchema.statics.getAttributesCategories = async ({
  category: categoryKey,
}) => {
  let categoryIds = [];
  if (categoryKey) {
    const category = await ProductCategory.findOne({ key: categoryKey }).exec();
    if (!category) {
      return [];
    }
    console.log("---- category", category);

    const childrenCategories = await fetchAllCategoryChildren(category);
    categoryIds = [category._id, ...childrenCategories.map((c) => c._id)];
    console.log("categoryIds", categoryIds);
  } else {
    const categories = await ProductCategory.find({}).exec();
    categoryIds = categories.map((c) => c._id);
  }

  const attributesIds = await Product.aggregate([
    { $unwind: "$categories" },
    {
      $match: {
        categories: {
          $in: categoryIds,
        },
      },
    },
    {
      $project: {
        attributes: 1,
      },
    },
    {
      $unwind: "$attributes",
    },
    {
      $group: {
        _id: null,
        attributes: { $addToSet: "$attributes" },
      },
    },
  ]);

  const attributes = await ProductAttribute.find({
    _id: { $in: attributesIds[0].attributes },
  }).exec();

  const categoriesIds = new Set<string>();

  attributes.forEach((a) => {
    categoriesIds.add(a.categoryId.toString());
  });

  const categories = await ProductAttributeCategory.find(
    {
      _id: {
        $in: [...categoriesIds].map((id) => new mongoose.Types.ObjectId(id)),
      },
    },
    null,
    { sort: { order: 1 } }
  ).exec();

  return categories.map((c) => ({
    ...c.toJSON(),
    attributes: attributes
      .filter((a) => a.categoryId.toString() === c.id)
      .map((a) => a.toJSON()),
  }));
};

export const Product = model<IProduct, IProductModel>("Product", productSchema);
