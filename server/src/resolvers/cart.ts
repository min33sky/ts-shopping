import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { writeDB, DBField } from './../DBController';
import { Cart, Product, Resolver } from '../types/resolver';
import { db } from '../firebase';

/**
 * JSON 파일에 저장하기
 * @param data
 * @returns
 */
const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolver = {
  Query: {
    cart: async (parent, args, context, info) => {
      const cart = collection(db, 'cart');
      const cartSnap = await getDocs(cart);
      const data: DocumentData[] = [];
      cartSnap.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return data;

      /**
       *? CartItem[]을 리턴하는데 product는 DB에 존재하지 않으므로
       *? CartItem의 id에 해당하는 product를 찾아서 리턴해야한다.
       */
      // return context.db.cart;
    },
  },

  Mutation: {
    /**
     * 카트에 상품 추가
     * @param parent
     * @param productId 구매할 상품의 ID
     * @returns
     */
    addCart: async (parent, { productId }) => {
      if (!productId) throw new Error('상품 ID가 필요합니다.');
      const productRef = doc(db, 'products', productId);
      const cartCollection = collection(db, 'cart');

      /**
       *? 상품 하나를 추가하는데 getDocs()를 사용한 이유??
       ** getDoc()은 쿼리를 못날림 😠
       */
      const exist = await (
        await getDocs(query(cartCollection, where('product', '==', productRef)))
      ).docs[0];

      let cartRef;

      if (exist) {
        // 기존 카트에 수량을 1씩 증가시킴
        cartRef = doc(db, 'cart', exist.id);
        await updateDoc(cartRef, {
          amount: increment(1),
        });
      } else {
        // 카트에 상품을 추가함
        cartRef = await addDoc(cartCollection, {
          amount: 1,
          product: productRef,
        });
      }

      const cartSnapshot = await getDoc(cartRef);
      return {
        id: cartSnapshot.id,
        product: productRef,
        ...cartSnapshot.data(),
      };
    },

    /**
     * 장바구니의 상품 업데이트
     * @param parent
     * @param cartId 장바구니 ID
     * @param amount 변경할 상품의 수량
     * @returns
     */
    updateCart: async (parent, { cartId, amount }) => {
      if (amount < 1) throw new Error('상품 수량은 1 이하로 바꿀 수 없습니다.');
      const cartRef = doc(db, 'cart', cartId);
      if (!cartRef) throw new Error('장바구니에 해당 상품이 존재하지 않습니다.');
      await updateDoc(cartRef, {
        amount,
      });

      const cartSnapshot = await getDoc(cartRef);
      return {
        ...cartSnapshot.data(),
        id: cartSnapshot.id,
      };
    },

    /**
     * 장바구니에서 상품 제거
     * @param parent
     * @param cartId 삭제할 장바구니 ID
     * @returns
     */
    deleteCart: async (parent, { cartId }) => {
      const cartRef = doc(db, 'cart', cartId);
      if (!cartRef) throw new Error('삭제할 상품이 없습니다.');

      await deleteDoc(cartRef);

      return cartId;
    },

    /**
     * 결제하기
     * @param parent
     * @param ids 구매할 상품이 담긴 장바구니 아이디 배열
     * @returns
     */
    executePay: async (parent, { ids }) => {
      // createdAt이 비어있지 않은 ids들에 대해서 결제처리가 완료되었다고 가정하고
      // cart에서 ids들을 지워준다.
      const deleted: string[] = [];

      for await (const id of ids) {
        const cartRef = doc(db, 'cart', id);
        const cartSnapshot = await getDoc(cartRef);
        const cartData = cartSnapshot.data();

        //? 장바구니에 담긴 상품이 존재하는 지 확인
        const productRef = cartData?.product;
        if (!productRef) throw new Error('상품 정보가 없다.');

        //? 품절인 상품인지 확인
        const product = (await getDoc(productRef)).data() as Product;
        if (!product.createdAt) throw new Error('풀절인 상품이 포함되어 있습니다.');

        //? 장바구니에서 제거하고 구매한 상품을 배열에 담아 리턴
        await deleteDoc(cartRef);
        deleted.push(id);
      }

      return deleted;
    },
  },

  //? Type Resolver
  //? CartItem을 return할 때 각 CartItem마다 product에서 찾아서 가져온다
  CartItem: {
    product: async (cartItem, args) => {
      const product = await getDoc(cartItem.product);
      const data = product.data() as any;
      return {
        ...data,
        id: product.id,
      };
    },
  },
};

export default cartResolver;
