import {
  IProductCategory,
  ProductAttribute,
  ProductAttributeCategory,
  ProductCategory,
} from "./models";
import { AttributeWithCategory } from "../graphql/generated/graphql";
import { HydratedDocument } from "mongoose";
import * as mongoose from "mongoose";

export const fetchAllCategoryParents = async (
  category: HydratedDocument<IProductCategory> | null
): Promise<HydratedDocument<IProductCategory>[]> => {
  if (category?.parentId) {
    const parent = await ProductCategory.findOne({
      _id: category.parentId,
    }).exec();

    return [
      ...(parent ? [parent] : []),
      ...(await fetchAllCategoryParents(parent)),
    ];
  }

  return [];
};

export const fetchAllCategoryChildren = async (
  category: HydratedDocument<IProductCategory> | null
): Promise<HydratedDocument<IProductCategory>[]> => {
  if (category) {
    const children = await ProductCategory.find({
      parentId: category._id,
    }).exec();

    const subChildren = [];
    for (let child of children) {
      subChildren.push(...(await fetchAllCategoryChildren(child)));
    }

    return [...(children ? children : []), ...subChildren];
  }

  return [];
};

export const convertQueryAttributesToModelAttributes = async (
  attributes: AttributeWithCategory[]
) => {
  const categories = await ProductAttributeCategory.find({
    key: {
      $in: [...new Set(attributes.map((a) => a.category))],
    },
  }).exec();

  const productAttributes = await ProductAttribute.find({
    $or: attributes.map((a) => ({
      categoryId: categories.find((c) => c.key === a.category)?._id,
      key: a.attribute,
    })),
  }).exec();

  const query: any = {};

  categories.forEach((c) => {
    query[c.key] = productAttributes
      .filter((a) => a.categoryId.toString() === c._id.toString())
      .map((a) => a._id);
  });

  const finalQuery: any = [];
  for (const queryKey in query) {
    finalQuery.push(...query[queryKey]);
  }

  return { $elemMatch: { $in: finalQuery } };
};

export const convertQueryCategoryToModelCategories = async (
  categoryKey: string
) => {
  const category = await ProductCategory.findOne({ key: categoryKey }).exec();

  if (!category) {
    return null;
  }

  const categoryIds = [
    category,
    ...(await fetchAllCategoryChildren(category)),
  ].map((c) => c.id);

  return { $elemMatch: { $in: categoryIds } };
};

export const fetchCategoriesChildrenRecursively = async (categories: any[]) => {
  for (const category of categories) {
    category.children = (
      await ProductCategory.find({
        parentId: new mongoose.Types.ObjectId(category._id),
      }).exec()
    ).map((c) => c.toJSON());
    await fetchCategoriesChildrenRecursively(category.children);
  }
};
