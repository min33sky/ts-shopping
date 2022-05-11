import React from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { CartType, UPDATE_CART } from '../../graphql/cart';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

type CartContext = {
  [key: string]: CartType;
};

function CartItem({ item: { amount, id, imageUrl, price, title } }: { item: CartType }) {
  const queryClient = useQueryClient();

  const { mutate: updateCart } = useMutation<
    CartContext,
    Error,
    { id: string; amount: number },
    CartContext
  >(({ id, amount }) => graphqlFetcher(UPDATE_CART, { id, amount }), {
    // When mutate is called:
    onMutate: async ({ id, amount }) => {
      await queryClient.cancelQueries(QueryKeys.CART);

      // Snapshot the previous value
      const prevCart = queryClient.getQueryData<CartContext>(QueryKeys.CART);

      if (!prevCart?.[id]) return prevCart;

      const newCart = {
        ...(prevCart || {}),
        [id]: { ...prevCart[id], amount },
      };

      // Optimistically update to the new value
      queryClient.setQueryData(QueryKeys.CART, newCart);

      // Return a context with the previous and new todo
      return prevCart;
    },
    onSuccess: (newValue) => {
      const prevCart = queryClient.getQueryData<CartContext>(QueryKeys.CART);
      const newCart = {
        ...(prevCart || {}),
        [id]: newValue,
      };
      queryClient.setQueryData(QueryKeys.CART, newCart);
    },

    // If the mutation fails, use the context we returned above
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(QueryKeys.CART, context?.prevCart);
    },
    // Always refetch after error or success:
    onSettled: (newTodo) => {
      queryClient.invalidateQueries(QueryKeys.CART);
    },
  });

  const handleUpdateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    updateCart({ id, amount });
  };

  return (
    <li className="cart-item">
      <img src={imageUrl} className="cart-item__image" alt="productImage" />
      <p className="cart-item__title">{title}</p>
      <p className="cart-item__price">{price}</p>
      <input
        type="number"
        className="cart-item__amount"
        value={amount}
        onChange={handleUpdateAmount}
      />
    </li>
  );
}

export default CartItem;
