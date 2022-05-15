import { DBField, readDB } from './DBController';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    //* resolver의 context에서 사용할 DB를 지정한다.
    context: {
      db: {
        products: readDB(DBField.PRODUCTS),
        cart: readDB(DBField.CART),
      },
    },
  });

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  await app.listen({ port: 8000 });

  console.log(`server listening on 8000`);
})();
