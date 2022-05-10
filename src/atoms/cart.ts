import { atom, selectorFamily } from 'recoil';

const cartState = atom<Map<string, number>>({
  key: 'cartState',
  default: new Map(),
});

export const cartItemSelector = selectorFamily<number | undefined, string>({
  key: 'cartItem',
  // 장바구니에 담은 해당 상품의 개수 가져오기
  get:
    (id) =>
    ({ get }) => {
      const carts = get(cartState);
      return carts.get(id);
    },
  // id값이 일치하는 상품의 수량 변경
  set:
    (id) =>
    ({ get, set }, newValue) => {
      if (typeof newValue === 'number') {
        //? 상태를 변경하기 위해 새로운 맵을 생성하자 (불변성)
        // const newCart = new Map([...get(cartState)]);
        const newCart = get(cartState).set(id, newValue);
        set(cartState, new Map(newCart));
      }
    },
});
