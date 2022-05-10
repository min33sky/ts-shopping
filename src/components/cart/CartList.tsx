import React from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './CartItem';

function CartList({ items }: { items: CartType[] }) {
  return (
    <>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </>
  );
}

export default CartList;
