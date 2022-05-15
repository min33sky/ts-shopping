import { Resolver } from '../types/resolver';

const mock_products = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + '', //! uuid는 url과 mock데이터의 id가 일치하지 않아서 사용안함
    imageUrl: `https://picsum.photos/id/${i * 4}/200/200`,
    price: 50000,
    title: `임시상품${i + 1}`,
    description: `임시상세내용${i + 1}`,
    createdAt: new Date(1652153739695 + i * 1000 * 60 * 60 * 24).toString(), //? 지정한 날짜 기준으로 하루씩 증가
  })))();

let cartData = [
  { id: '1', amount: 1 },
  { id: '2', amount: 3 },
];

const cartResolver: Resolver = {
  Query: {
    cart: (parent, args, context, info) => {
      return cartData;
    },
  },
  Mutation: {
    addCart: (parent, { id }, context, info) => {
      const newCartData = { ...cartData };

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
      return newItem;
    },
    updateCart: (parent, { id, amount }, context, info) => {
      const newCartData = { ...cartData };

      //? 장바구니에 담긴 상품인지 확인
      if (!newCartData[id]) throw new Error('상품이 존재하지 않습니다.');

      const newItem = {
        ...newCartData[id],
        amount,
      };

      newCartData[id] = newItem;
      cartData = newCartData;

      return newItem;
    },
    deleteCart: (parent, { id }, context, info) => {
      cartData = cartData.filter((cart) => cart.id !== id);
      return id;
    },
    executePay: (parent, { ids }, context, info) => {
      const newData = cartData.filter((cartItem) => !ids.includes(cartItem.id));
      cartData = newData;
      return ids;
    },
  },
};

export default cartResolver;
