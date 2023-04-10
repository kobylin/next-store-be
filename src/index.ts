import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as fs from "fs";
import path from "path";
import { Resolvers } from "./graphql/generated/graphql";
import {
  Product,
  ProductAttribute,
  ProductAttributeCategory,
  ProductCategory,
} from "./db/models";
import { connect } from "./db";

const typeDefs = fs
  .readFileSync(path.resolve(__dirname, "../src/graphql/schema.graphql"))
  .toString();

const resolvers: Resolvers = {
  Query: {
    products: async (_, args) => {
      const products = await Product.find({}, null, {
        limit: args.count ?? 10,
      }).exec();

      return products.map((p) => ({
        id: p.id.toString(),
        title: p.title,
        imageUrl: p.imageUrl,
        description: p.description,
        rating: p.rating,
        price: p.price,
        createdAt: p.createdAt.getTime().toString(),
        attributes: p.attributes.map((a) => ({
          id: a.toString(),
        })),
        categories: p.categories.map((a) => ({
          id: a.toString(),
        })),
      }));
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
  },
  Product: {
    attributes: async (parent) => {
      if (!parent.attributes || parent.attributes.length === 0) {
        return [];
      }
      const attributes = await ProductAttribute.find({
        _id: { $in: parent.attributes.map((a) => a.id) },
      }).exec();

      return attributes.map((a) => ({
        id: a.id.toString(),
        key: a.key,
        name: a.name,
        description: a.description,
        category: { id: a.categoryId.toString() },
        createdAt: a.createdAt.getTime().toString(),
      }));
    },
    categories: async (parent) => {
      if (!parent.categories || parent.categories.length === 0) {
        return [];
      }
      const categories = await ProductCategory.find({
        _id: { $in: parent.categories.map((a) => a.id) },
      }).exec();

      return categories.map((a) => ({
        id: a.id.toString(),
        key: a.key,
        name: a.name,
        parentId: a.parentId?.toString() ?? null,
        createdAt: a.createdAt.getTime().toString(),
      }));
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

      return {
        id: category.id.toString(),
        key: category.key,
        name: category.name,
        order: category.order,
        createdAt: category.createdAt.getTime().toString(),
      };
    },
  },
};
(async () => {
  await connect();

  const server = new ApolloServer<any>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();
