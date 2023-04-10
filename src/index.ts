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
      });

      return products.map((p: any) => ({
        id: p.id,
        title: p.title,
        imageUrl: p.imageUrl,
        description: p.description,
        rating: p.rating,
        price: p.price,
        createdAt: p.createdAt.getTime().toString(),
        attributes: p.attributes.map((a: any) => ({ id: a.toString() })),
        categories: p.categories.map((a: any) => ({ id: a.toString() })),
      }));
    },
    productAttributesCategories: async (_, args) => {
      const category = args.category;

      // @ts-ignore
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

      // @ts-ignore
      const path = await ProductCategory.getCategoryWithParents({ category });

      return path.map((c: any) => ({
        ...c,
        id: c._id,
      }));
    },
  },
  Product: {
    attributes: async (parent, args, context) => {
      const attributes = await ProductAttribute.find({
        _id: { $in: parent.attributes?.map((a) => a.id) },
      });

      return attributes.map((a: any) => ({
        id: a.id,
        key: a.key,
        name: a.name,
        description: a.description,
        category: { id: a.categoryId.toString() },
        createdAt: a.createdAt.getTime().toString(),
      }));
    },
    categories: async (parent, args, context) => {
      const categories = await ProductCategory.find({
        _id: { $in: parent.categories?.map((a) => a.id) },
      });

      return categories.map((a: any) => ({
        id: a.id,
        key: a.key,
        name: a.name,
        description: a.description,
        parentId: a.parentId?.toString() ?? null,
        createdAt: a.createdAt.getTime().toString(),
      }));
    },
  },
  ProductAttribute: {
    category: async (parent) => {
      const category = await ProductAttributeCategory.findOne({
        _id: parent.category?.id,
      });
      if (!category) {
        return { id: parent.category?.id };
      }

      return {
        id: category.id,
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

  startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  });
})();
