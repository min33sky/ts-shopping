import { Product, Resolver } from '../types/resolver';
import { DBField, writeDB } from '../DBController';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

const setJSON = (data: Product[]) => writeDB(DBField.PRODUCTS, data);

const PAGE_SIZE = 15;

const productResolver: Resolver = {
  Query: {
    /**
     * 상품 리스트를 가져온다
     * @param cursor 마지막 상품의 ID
     * @param showDeleted 고객용인지 Admin용인지 구분하는 값
     * @returns
     */
    products: async (parent, { cursor = '', showDeleted = false }) => {
      //* 'products' Collection을 가져온다.
      const products = collection(db, 'products');

      //* 쿼리에 필요한 옵션들을 설정
      const queryOptions = [orderBy('createdAt', 'desc')];

      //? 해당 커서 이후의 데이터부터 가져오도록 설정
      if (cursor) {
        const snapshot = await getDoc(doc(db, 'products', cursor));
        queryOptions.push(startAfter(snapshot));
      }

      //? createdAt이 있는 상품만 고객용 상품 목록에서 볼 수 있다.
      if (!showDeleted) queryOptions.unshift(where('createdAt', '!=', null));

      const snapshot = await getDocs(query(products, ...queryOptions, limit(PAGE_SIZE)));

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

    /**
     * 상품 정보를 가져온다.
     * @param id 상품 ID
     * @returns
     */
    product: async (parent, { id }) => {
      const snapshot = await getDoc(doc(db, 'products', id));
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    },
  },

  Mutation: {
    /**
     * 상품 추가
     * @param parent
     * @param param1
     * @returns
     */
    addProduct: async (parent, { imageUrl, price, title, description }) => {
      const newProduct = {
        imageUrl,
        price,
        title,
        description,
        createdAt: serverTimestamp(),
      };

      const result = await addDoc(collection(db, 'products'), newProduct);
      const snapshot = await getDoc(result);

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    },

    /**
     * 상품 업데이트
     * @param id 수정할 상품의 아이디
     * @param param1
     * @returns
     */
    updateProduct: async (parent, { id, ...data }) => {
      const productRef = doc(db, 'products', id);
      if (!productRef) throw new Error('해당 상품이 존재하지 않습니다.');

      await updateDoc(productRef, {
        ...data,
        createdAt: serverTimestamp(),
      });

      const snapshot = await getDoc(productRef);
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    },

    /**
     * 상품 삭제
     * ? 물리적 삭제가 아닌 논리적 삭제로 구현
     * ? createdAt을 삭제하면 판매하지 않는 상품임.
     * @param id 삭제할 상품의 id
     * @returns
     */
    deleteProduct: async (parent, { id }) => {
      const productRef = doc(db, 'products', id);
      if (!productRef) throw new Error('해당 상품이 존재하지 않습니다.');

      await updateDoc(productRef, {
        createdAt: null,
      });

      return id;
    },
  },
};

export default productResolver;
