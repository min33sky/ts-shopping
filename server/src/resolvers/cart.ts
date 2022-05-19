import { writeDB, DBField } from './../DBController';
import { Cart, Resolver } from '../types/resolver';

/**
 * JSON 파일에 저장하기
 * @param data
 * @returns
 */
const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolver = {
  Query: {
    cart: (parent, args, context, info) => {
      /**
       *? CartItem[]을 리턴하는데 product는 DB에 존재하지 않으므로
       *? CartItem의 id에 해당하는 product를 찾아서 리턴해야한다.
       */
      return context.db.cart;
    },
  },
  Mutation: {
    addCart: (parent, { productId }, { db }, info) => {
      //* 해당 상품이 있는지 확인
      const targetProduct = db.products.find((item) => item.id === productId);
      if (!targetProduct) throw new Error('해당 상품이 없습니다.');

      //* 카트에 이미 상품이 존재하는지 확인
      const existCartIndex = db.cart.findIndex((item) => item.id === productId);

      if (existCartIndex > -1) {
        const newCartItem = {
          id: productId,
          amount: db.cart[existCartIndex].amount + 1,
        };

        db.cart.splice(existCartIndex, 1, newCartItem);
        setJSON(db.cart);
        return newCartItem;
      }

      //* 카트에 상품 추가
      const newItem = {
        id: productId,
        amount: 1,
      };

      db.cart.push(newItem);
      setJSON(db.cart);

      //? 새로 추가한 상품 데이터를 리턴해주자
      return newItem;
    },
    updateCart: (parent, { cartId, amount }, { db }, info) => {
      const existCartIndex = db.cart.findIndex((item) => item.id === cartId);

      if (existCartIndex === -1) throw new Error('상품이 존재하지 않습니다.');

      const newItem = {
        id: cartId,
        amount,
      };

      db.cart.splice(existCartIndex, 1, newItem);
      setJSON(db.cart);

      return newItem;
    },

    deleteCart: (parent, { cartId }, { db }, info) => {
      const existCartIndex = db.cart.findIndex((item) => item.id === cartId);

      if (existCartIndex === -1) throw new Error('해당 상품이 없습니다.');

      const filtered = db.cart.filter((item) => item.id !== cartId);
      db.cart = filtered;
      setJSON(db.cart);
      return cartId;
    },

    executePay: (parent, { ids }, { db }, info) => {
      const filtered = db.cart.filter((item) => !ids.includes(item.id));
      db.cart = filtered;
      setJSON(db.cart);
      return ids;
    },
  },
  //? Type Resolver
  //? CartItem을 return할 때 각 CartItem마다 product에서 찾아서 가져온다
  CartItem: {
    product: (cartItem, args, { db }) => db.products.find((product) => product.id === cartItem.id),
  },
};

export default cartResolver;
