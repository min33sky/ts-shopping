import { graphql } from 'msw';
import { GET_PRODUCT, GET_PRODUCTS } from '../graphql/products';
import { v4 as uuid } from 'uuid';

const mock_products = Array.from({ length: 20 }).map((_, i) => ({
  id: uuid(),
  imageUrl: `https://placeimg.com/640/480/${i + 1}`,
  price: 50000,
  title: `임시상품${i + 1}`,
  description: `임시상세내용${i + 1}`,
  createdAt: new Date(1652153739695 + i * 1000 * 60 * 60 * 24).toString(),
}));

export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mock_products,
      })
    );
  }),

  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    return res(ctx.data(mock_products[0]));
  }),
];
