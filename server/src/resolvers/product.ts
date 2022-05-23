import { Product, Resolver } from '../types/resolver';
import { v4 as uuid } from 'uuid';
import { DBField, writeDB } from '../DBController';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

const setJSON = (data: Product[]) => writeDB(DBField.PRODUCTS, data);

const PAGE_SIZE = 15;

const productResolver: Resolver = {
  Query: {
    products: async (parent, { cursor = '', showDeleted = false }) => {
      const products = collection(db, 'products');
      const queryOptions = [orderBy('createdAt', 'desc')];
      if (cursor) {
        const snapshot = await getDoc(doc(db, 'products', cursor));
        queryOptions.push(startAfter(snapshot));
      }
      if (!showDeleted) queryOptions.unshift(where('createdAt', '!=', null));
      const q = query(products, ...queryOptions, limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const data: DocumentData[] = [];
      snapshot.forEach((doc) =>
        data.push({
          id: doc.id,
          ...doc.data(),
        })
      );
      return data;

      //? 기존 DB 코드
      //? 최신순으로 정렬
      // const [hasCreatedAt, noCreatedAt] = [
      //   db.products.filter((item) => !!item.createdAt).sort((a, b) => b.createdAt! - a.createdAt!),
      //   db.products.filter((item) => !item.createdAt),
      // ];
      // const filteredDB = showDeleted ? [...hasCreatedAt, ...noCreatedAt] : hasCreatedAt;
      // //? ''값이면 -1을 리턴하므로 0부터 검색
      // const fromIndex = filteredDB.findIndex((product) => product.id === cursor) + 1;
      // return filteredDB.slice(fromIndex, fromIndex + 15) || [];
    },

    product: async (parent, { id }) => {
      const snapshot = await getDoc(doc(db, 'products', id));
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
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
