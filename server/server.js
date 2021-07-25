const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  // Modified server startup
  await new Promise((resolve) => app.listen({ PORT }, resolve));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on port ${PORT}!`);
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});
