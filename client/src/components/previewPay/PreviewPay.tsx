import { SyntheticEvent } from 'react';
import { useRecoilValue } from 'recoil';
import { checkedCartState } from '../../atoms/cart';
import CartItemData from '../cart/CartItemData';

/**
 * 결제 상품 미리보기
 * @returns
 */
function PreviewPay({
  handleSubmit,
  handleTitle,
}: {
  handleSubmit: (e: SyntheticEvent) => void;
  handleTitle: string;
}) {
  const checkedItems = useRecoilValue(checkedCartState);
  const totalPrice = checkedItems.reduce(
    (acc, { amount, product: { price } }) => (acc += amount * price),
    0
  );

  return (
    <div className="cart-preview">
      <h2>{handleTitle}</h2>
      <ul>
        {checkedItems.map(({ id, product: { imageUrl, price, title }, amount }) => (
          <li key={id}>
            <CartItemData imageUrl={imageUrl} price={price} title={title} />
            <div>
              <p>수량: {amount}개</p>
              <p>금액: ${amount * price}</p>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <p className="cart-preview__total-price">총 예상 결제액: ${totalPrice}</p>
        <button onClick={handleSubmit}>결제하기</button>
      </div>
    </div>
  );
}

export default PreviewPay;
