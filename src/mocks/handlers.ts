import { graphql } from 'msw';
import { GET_PRODUCT, GET_PRODUCTS } from '../graphql/products';
import { v4 as uuid } from 'uuid';
import { ADD_CART, CartType, GET_CART } from '../graphql/cart';

//? 상품 데이터 생성
const mock_products = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + '', //? uuid는 url과 mock데이터의 id가 일치하지 않아서 사용안함
    imageUrl: `https://placeimg.com/640/480/${i + 1}`,
    price: 50000,
    title: `임시상품${i + 1}`,
    description: `임시상세내용${i + 1}`,
    createdAt: new Date(1652153739695 + i * 1000 * 60 * 60 * 24).toString(), //? 지정한 날짜 기준으로 하루씩 증가
  })))();

//? 장바구니 데이터 저장소
let cartData: { [key: string]: CartType } = {};

//? client로 데이터 전송하는 핸들러
export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mock_products,
      })
    );
  }),

  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    const found = mock_products.find((item) => item.id === req.body?.variables.id);
    if (found) return res(ctx.data(found));
    return res();
  }),

  graphql.query(GET_CART, (req, res, ctx) => {
    return res(ctx.data(cartData));
  }),

  graphql.mutation(ADD_CART, (req, res, ctx) => {
    const newData = { ...cartData };
    const id = req.variables.id;
    if (newData[id]) {
      newData[id] = {
        ...newData[id],
        amount: (newData[id].amount || 0) + 1,
      };
    } else {
      const found = mock_products.find((item) => item.id === req.variables.id);
      if (found) {
        newData[id] = {
          ...found,
          amount: 1,
        };
      }
    }

    cartData = newData;

    return res(ctx.data(newData));
  }),
];
