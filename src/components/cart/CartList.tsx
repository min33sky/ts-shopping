import React, { createRef, useRef } from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './CartItem';

function CartList({ items }: { items: CartType[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());

  const handleCheckboxChanged = (e: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) return;

    const targetInput = e.target as HTMLInputElement; // 이벤트가 발생한 체크박스

    // const checkboxes = formRef.current.querySelectorAll<HTMLInputElement>('.cart-item__checkbox');

    //? FormData를 사용하면 name을 설정한 DOM을 가져올 수 있다.
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll('select-item').length;

    if (targetInput.name === 'select-all') {
      const allChecked = targetInput.checked;
      checkboxRefs.forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
    } else {
      const allChecked = selectedCount === items.length;
      formRef.current.querySelector<HTMLInputElement>('#select-all')!.checked = allChecked;
    }
  };

  return (
    <form ref={formRef} onChange={handleCheckboxChanged}>
      <p>장바구니의 상품 개수 {items.length}개</p>
      <label htmlFor="select-all">
        <input id="select-all" name="select-all" className="cart-list__checkbox" type="checkbox" />
        전체 선택
      </label>
      <ul className="cart-list">
        {items.map((item, i) => (
          <CartItem key={item.id} item={item} ref={checkboxRefs[i]} />
        ))}
      </ul>
    </form>
  );
}

export default CartList;
