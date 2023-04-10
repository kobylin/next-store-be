import * as mongoose from "mongoose";
import { model, Schema } from "mongoose";

interface IProductAttribute {
  id: string;
  key: string;
  categoryId: string;
  name: string;
  description: string;
  createdAt: Date;
}

const productAttributeSchema = new Schema({
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
  key: string;
  name: string;
  order: Number;
  createdAt: Date;
}

const productAttributeCategorySchema = new Schema({
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
  key: string;
  name: string;
  description: string;
  parentId: mongoose.Types.ObjectId;
}

// FIXME: generic does not work here
const productCategorySchema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  parentId: { type: mongoose.Types.ObjectId, required: false },
  createdAt: { type: Date, required: true, default: () => new Date() },
});

const fetchAllCategoryParents = async (category: any): Promise<any> => {
  if (category.parentId) {
    const parent = await ProductCategory.findOne({ _id: category.parentId });

    return [parent, ...(await fetchAllCategoryParents(parent))];
  }

  return [];
};

productCategorySchema.statics.getCategoryWithParents = async ({
  category: categoryKey,
}) => {
  const category = await ProductCategory.findOne({
    key: categoryKey,
  });

  const parents = await fetchAllCategoryParents(category);

  return [...parents.reverse(), category].map((c) => c.toJSON());
};

export const ProductCategory = model("ProductCategory", productCategorySchema);

interface IProduct {
  id: mongoose.Types.ObjectId;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  rating: Number;
  price: Number;
  categories: mongoose.Types.ObjectId[];
  attributes: mongoose.Types.ObjectId[];
}

const productSchema = new Schema({
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
  const category = await ProductCategory.findOne({ key: categoryKey });

  if (!category) {
    return [];
  }

  const attributesIds = await Product.aggregate([
    {
      $match: { categories: { $in: [category._id] } },
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
  });

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
  );

  return categories.map((c) => ({
    ...c.toJSON(),
    attributes: attributes
      .filter((a) => a.categoryId.toString() === c.id)
      .map((a) => a.toJSON()),
  }));
};

export const Product = model("Product", productSchema);
