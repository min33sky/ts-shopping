import { CartType } from '../../graphql/cart';
import CartItem from './CartItem';

function CartList({ items }: { items: CartType[] }) {
  return (
    <>
      <p>장바구니의 상품 개수 {items.length}개</p>
      <label htmlFor="all-cart-items">
        <input id="all-cart-items" className="cart-list__checkbox" type="checkbox" />
        전체 선택
      </label>
      <ul className="cart-list">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}

export default CartList;
