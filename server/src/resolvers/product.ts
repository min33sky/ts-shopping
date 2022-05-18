import { Product, Resolver } from '../types/resolver';
import { v4 as uuid } from 'uuid';
import { DBField, writeDB } from '../DBController';

const setJSON = (data: Product[]) => writeDB(DBField.PRODUCTS, data);

const productResolver: Resolver = {
  Query: {
    products: (parent, { cursor = '' }, { db }, info) => {
      //? ''값이면 -1을 리턴하므로 0부터 검색
      const fromIndex = db.products.findIndex((product) => product.id === cursor) + 1;

      return db.products.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }, info) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
  Mutation: {
    addProduct: (parent, { imageUrl, price, title, description }, { db }) => {
      const newProduct = {
        id: uuid(),
        imageUrl,
        price,
        title,
        description,
        createdAt: Date.now(),
      };

      // DB에 넣고
      db.products.push(newProduct);

      // JSON 저장
      setJSON(db.products);
      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex === -1) throw new Error('없는 상품입니다.');

      const updatedItem = {
        ...db.products[existProductIndex],
        ...data,
      };

      db.products.splice(existProductIndex, 1, updatedItem);

      setJSON(db.products);
      return updatedItem;
    },
    deleteProduct: (parent, { id }, { db }) => {
      //? 물리적 삭제가 아닌 논리적 삭제로 구현
      //? createdAt을 삭제하면 판매하지 않는 상품임.

      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex === -1) throw new Error('없는 상품입니다.');

      //* 삭제할 상품을 가져와서 createdAt 제거하기
      const deletedItem = {
        ...db.products[existProductIndex],
      };

      delete deletedItem.createdAt;

      db.products.splice(existProductIndex, 1, deletedItem);
      setJSON(db.products);

      return id;
    },
  },
};

export default productResolver;
