import express from 'express';
import { ApolloServer } from 'apollo-server-express';

(async () => {
  const server = new ApolloServer(null);

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
  });

  await app.listen({ port: 8000 });

  console.log(`server listening on 8000`);
})();
