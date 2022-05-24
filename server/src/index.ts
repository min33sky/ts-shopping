import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import envLoader from './envLoader';

(async () => {
  const clientUrl = envLoader.CLIENT_URL as string;
  const port = envLoader.PORT || 8000;

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    //* resolver의 context에서 사용할 DB를 지정한다.
    // context: {
    //   db: {
    //     products: readDB(DBField.PRODUCTS),
    //     cart: readDB(DBField.CART),
    //   },
    // },
  });

  const app = express();
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: [clientUrl, 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  await app.listen({ port });

  console.log(`server listening on ${port}`);
})();
