import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as fs from "fs";
import path from "path";
import { Resolvers } from "./graphql/generated/graphql";
import {
  IProduct,
  IProductAttribute,
  IProductCategory,
  Product,
  ProductAttribute,
  ProductAttributeCategory,
  ProductCategory,
} from "./db/models";
import { connect } from "./db";
import {
  convertQueryAttributesToModelAttributes,
  convertQueryCategoryToModelCategories,
} from "./db/utils";

const typeDefs = fs
  .readFileSync(path.resolve(__dirname, "../src/graphql/schema.graphql"))
  .toString();

export enum SortOrder {
  RATING = "rating",
  CHEAP_TO_EXPENSIVE = "cheap_to_expensive",
  EXPENSIVE_TO_CHEAP = "expensive_to_cheap",
}

interface ApolloContext {}

const graphQLTransformers = {
  product: (product: IProduct) => ({
    id: product.id.toString(),
    title: product.title,
    imageUrl: product.imageUrl,
    description: product.description,
    rating: product.rating,
    price: product.price,
    createdAt: product.createdAt.getTime().toString(),
    attributes: product.attributes.map((a) => ({
      id: a.toString(),
    })),
    categories: product.categories.map((a) => ({
      id: a.toString(),
    })),
  }),
  category: (category: IProductCategory) => ({
    id: category.id.toString(),
    key: category.key,
    name: category.name,
    description: category.description,
    parentId: category.parentId?.toString() ?? null,
    createdAt: category.createdAt.getTime().toString(),
  }),
  attribute: (a: IProductAttribute) => ({
    id: a.id.toString(),
    key: a.key,
    name: a.name,
    description: a.description,
    category: { id: a.categoryId.toString() },
    createdAt: a.createdAt.getTime().toString(),
  }),
};

const resolvers: Resolvers<ApolloContext> = {
  Query: {
    products: async (_, args) => {
      console.log("args", args);

      const filter: any = {};
      const sort: any = {};

      if (args.orderBy) {
        if (args.orderBy === SortOrder.CHEAP_TO_EXPENSIVE) {
          sort.price = 1;
        }

        if (args.orderBy === SortOrder.EXPENSIVE_TO_CHEAP) {
          sort.price = -1;
        }

        if (args.orderBy === SortOrder.RATING) {
          sort.rating = -1;
        }
      }

      if (args.search) {
        filter.title = new RegExp(args.search, "i");
      }

      if (args.attributes && args.attributes.length > 0) {
        filter.attributes = await convertQueryAttributesToModelAttributes(
          args.attributes
        );
      }

      if (args.category) {
        filter.categories = await convertQueryCategoryToModelCategories(
          args.category
        );
      }

      const count = args.count ?? 10;
      const offset = args.offset ?? 0;

      const products = await Product.find(filter, null, {
        sort: sort,
      })
        .skip(offset)
        .limit(count)
        .exec();

      const total = await Product.count(filter).exec();

      const productsTransformed = products.map((p) =>
        graphQLTransformers.product(p)
      );

      return {
        products: productsTransformed,
        meta: {
          count,
          offset,
          total,
        },
      };
    },
    product: async (_, args) => {
      try {
        const product = await Product.findOne({ _id: args.id }).exec();
        if (!product) {
          return null;
        }

        return graphQLTransformers.product(product);
      } catch (e) {
        return null;
      }
    },
    productAttributesCategories: async (_, args) => {
      const category = args.category;

      const productAttributesCategories = await Product.getAttributesCategories(
        { category }
      );

      return productAttributesCategories.map((c: any) => ({
        ...c,
        id: c._id,
        attributes: c.attributes.map((a: any) => ({
          ...a,
          id: a._id,
        })),
      }));
    },
    categoryPath: async (_, args) => {
      const category = args.category;
      const path = await ProductCategory.getCategoryWithParents({ category });

      return path.map((c: any) => ({
        ...c,
        id: c._id,
      }));
    },
    allCategories: async () => {
      const categories = await ProductCategory.find({}).exec();

      return categories.map((c) => graphQLTransformers.category(c));
    },
  },
  Product: {
    attributes: async (parent) => {
      if (!parent.attributes || parent.attributes.length === 0) {
        return [];
      }
      const attributes = await ProductAttribute.find({
        _id: { $in: parent.attributes.map((a) => a.id) },
      }).exec();

      return attributes.map((a) => graphQLTransformers.attribute(a));
    },
    categories: async (parent) => {
      if (!parent.categories || parent.categories.length === 0) {
        return [];
      }
      const categories = await ProductCategory.find({
        _id: { $in: parent.categories.map((c) => c.id) },
      }).exec();

      return categories.map((c) => graphQLTransformers.category(c));
    },
  },
  ProductAttribute: {
    category: async (parent) => {
      if (!parent.category?.id) {
        return null;
      }
      const category = await ProductAttributeCategory.findOne({
        _id: parent.category.id,
      }).exec();

      if (!category) {
        return null;
      }

      return graphQLTransformers.category(
        category as unknown as IProductCategory
      );
    },
  },
};

(async () => {
  await connect();

  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000, host: "0.0.0.0" },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();
