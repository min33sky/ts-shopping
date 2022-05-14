import { atom } from 'recoil';
import { CartType } from '../graphql/cart';

/**
 * 장바구니에서 체크한 상품들의 상태값
 */
export const checkedCartState = atom<CartType[]>({
  key: 'checkedCartState',
  default: [],
});
