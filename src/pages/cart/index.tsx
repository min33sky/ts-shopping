import { useQuery } from 'react-query';
import CartList from '../../components/cart/CartList';
import { CartType, GET_CART } from '../../graphql/cart';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

function CartPage() {
  const { data } = useQuery(QueryKeys.CART, () => graphqlFetcher(GET_CART));

  const cartItems = Object.values(data || []) as CartType[];

  if (cartItems.length === 0) return <p>장바구니가 비어있어요 :|</p>;

  return <CartList items={cartItems} />;
}

export default CartPage;
