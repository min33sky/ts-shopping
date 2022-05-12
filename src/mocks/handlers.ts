import { graphql } from 'msw';
import { GET_PRODUCT, GET_PRODUCTS } from '../graphql/products';
import { v4 as uuid } from 'uuid';
import { ADD_CART, CartType, DELETE_CART, GET_CART, UPDATE_CART } from '../graphql/cart';
import { EXECUTE_PAY } from '../graphql/payment';

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
    const newCartData = { ...cartData };
    const id = req.variables.id;

    //* 해당 상품이 있는지 확인
    const targetProduct = mock_products.find((item) => item.id === id);
    if (!targetProduct) throw new Error('해당 상품이 없습니다.');

    //* 카트에 상품 추가
    const newItem = {
      ...targetProduct,
      amount: (newCartData[id]?.amount || 0) + 1,
    };

    newCartData[id] = newItem;
    cartData = newCartData;

    //? 새로 추가한 상품 데이터를 리턴해주자
    return res(ctx.data(newItem));
  }),

  graphql.mutation(UPDATE_CART, (req, res, ctx) => {
    const newCartData = { ...cartData };
    const { id, amount } = req.variables;

    //? 장바구니에 담긴 상품인지 확인
    if (!newCartData[id]) throw new Error('상품이 존재하지 않습니다.');

    const newItem = {
      ...newCartData[id],
      amount,
    };

    newCartData[id] = newItem;
    cartData = newCartData;

    return res(ctx.data(newItem));
  }),

  graphql.mutation(DELETE_CART, ({ variables: { id } }, res, ctx) => {
    const newData = { ...cartData };
    delete newData[id];
    cartData = newData;
    return res(ctx.data(id));
  }),

  graphql.mutation(EXECUTE_PAY, (req, res, ctx) => {
    console.log(req.variables);
    return res();
  }),
];
