import React, { createRef, useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { checkedCartState } from '../../atoms/cart';
import { CartType } from '../../graphql/cart';
import CartItem from './CartItem';
import PreviewPay from '../previewPay/PreviewPay';
import { useNavigate } from 'react-router-dom';

function CartList({ items }: { items: CartType[] }) {
  const navigate = useNavigate();
  const [checkedCartData, setCheckedCartData] = useRecoilState(checkedCartState);
  const [formData, setFormData] = useState<FormData>();

  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>()); //? 자식 컴퍼넌트들의 ref

  const setAllCheckedFromItems = () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll('select-item').length; //* 체크박스 개수
    const allChecked = selectedCount === items.length;
    formRef.current.querySelector<HTMLInputElement>('#select-all')!.checked = allChecked;
  };

  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    const allChecked = targetInput.checked;
    checkboxRefs.forEach((inputElem) => {
      inputElem.current!.checked = allChecked;
    });
  };

  /**
   * 폼 이벤트 핸들러
   * @param e
   * @returns
   */
  const handleCheckboxChanged = (e?: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) return;

    const targetInput = e?.target as HTMLInputElement; //? 이벤트가 발생한 체크박스

    //* 전체 선택 체크박스 관련
    if (targetInput && targetInput.name === 'select-all') {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }

    //? FormData로 input의 name을 설정한 DOM을 가져올 수 있다.
    const data = new FormData(formRef.current);
    //? 아래 useEffect를 재호출하기 위해 Formdata가 변할 때마다 상태를 저장한다.
    setFormData(data);
  };

  /**
   *? 체크한 상품들의 체크 정보를 기억하기
   *? - 뒤로가기 했을 때 기존의 체크해놓은 상품들을 복구
   */
  useEffect(() => {
    checkedCartData.forEach((item) => {
      const itemRef = checkboxRefs.find((ref) => ref.current?.dataset.id === item.id);
      if (itemRef) itemRef.current!.checked = true;
    });
    setAllCheckedFromItems();
  }, []);

  useEffect(() => {
    //? 체크한 상품들의 정보를 가져와서 Recoil에 저장
    const checkedItems = checkboxRefs.reduce<CartType[]>((res, ref, i) => {
      if (ref.current?.checked) res.push(items[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [formData, items]);

  const handleSubmit = () => {
    if (checkedCartData.length === 0) return alert('결제할 대상이 없어요.');
    navigate('/payment');
  };

  return (
    <div>
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <p>장바구니의 상품 개수 {items.length}개</p>
        <label htmlFor="select-all">
          <input
            id="select-all"
            name="select-all"
            className="cart-list__checkbox"
            type="checkbox"
          />
          전체 선택
        </label>
        <ul className="cart-list">
          {items.map((item, i) => (
            <CartItem key={item.id} item={item} ref={checkboxRefs[i]} />
          ))}
        </ul>
      </form>
      <PreviewPay handleTitle="결제 미리보기" handleSubmit={handleSubmit} />
    </div>
  );
}

export default CartList;
