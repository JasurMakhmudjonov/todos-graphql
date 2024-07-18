const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const config = require("../config/index");

const typeDefs = require("./modules/schema");
const resolvers = require("./modules/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const bootstrap = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: config.port },
  });

  console.log(`Server listening on port ${config.port}`);
};

bootstrap();
