import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { checkedCartState } from '../../atoms/cart';
import CartItemData from './CartItemData';

/**
 * 결제 상품 미리보기
 * @returns
 */
function PreviewPay() {
  const navigate = useNavigate();
  const checkedItems = useRecoilValue(checkedCartState);
  const totalPrice = checkedItems.reduce((acc, { amount, price }) => (acc += amount * price), 0);

  const handleSubmit = () => {
    if (checkedItems.length === 0) return alert('결제할 대상이 없어요.');
    navigate('/payment');
  };

  return (
    <div className="cart-preview">
      <ul>
        {checkedItems.map(({ id, imageUrl, price, title, amount }) => (
          <li key={id}>
            <CartItemData imageUrl={imageUrl} price={price} title={title} />
            <p>수량: {amount}개</p>
            <p>금액: ${amount * price}</p>
          </li>
        ))}
      </ul>
      <p className="cart-preview__total-price">총 예상 결제액: ${totalPrice}</p>
      <button onClick={handleSubmit}>결제하기</button>
    </div>
  );
}

export default PreviewPay;
