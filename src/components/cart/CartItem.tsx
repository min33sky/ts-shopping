import React from 'react';
import { CartType } from '../../graphql/cart';

function CartItem({ item: { amount, id, imageUrl, price, title } }: { item: CartType }) {
  return (
    <div>
      <p>{title}</p>
      <p>{price}</p>
      <p>{amount}</p>
    </div>
  );
}

export default CartItem;
