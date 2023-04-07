import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as fs from "fs";
import path from "path";
import { Resolvers } from "./graphql/generated/graphql";

const typeDefs = fs
  .readFileSync(path.resolve(__dirname, "../src/graphql/schema.graphql"))
  .toString();

const resolvers: Resolvers = {
  Query: {
    migration: async () => {
      // run migration

      return "";
    },
  },
};

const server = new ApolloServer<any>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
