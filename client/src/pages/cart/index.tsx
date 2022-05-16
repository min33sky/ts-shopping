import { useQuery } from 'react-query';
import CartList from '../../components/cart/CartList';
import { CartType, GET_CART } from '../../graphql/cart';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

/**
 * 장바구니 페이지
 * @returns
 */
function CartPage() {
  const { data } = useQuery<{ cart: CartType[] }>(QueryKeys.CART, () => graphqlFetcher(GET_CART), {
    //? 장바구니는 바로바로 업데이트를 해야되기 때문에 캐시 ㄴㄴ
    cacheTime: 0,
    staleTime: 0,
  });

  const cartItems = data?.cart || [];

  if (cartItems.length === 0) return <p>장바구니가 비어있어요 :|</p>;

  return <CartList items={cartItems} />;
}

export default CartPage;
