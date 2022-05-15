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

const productResolver: Resolver = {
  Query: {
    products: (parent, args, context, info) => {
      return mock_products;
    },
    product: (parent, { id }, context, info) => {
      const found = mock_products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
};

export default productResolver;
