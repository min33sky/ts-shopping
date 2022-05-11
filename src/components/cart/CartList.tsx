import { CartType } from '../../graphql/cart';
import CartItem from './CartItem';

function CartList({ items }: { items: CartType[] }) {
  return (
    <ul className="cart-list">
      <p>장바구니의 상품 개수 {items.length}개</p>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default CartList;
