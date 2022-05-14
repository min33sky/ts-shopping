import React, { ForwardedRef, forwardRef } from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { CartType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { graphqlFetcher, QueryKeys } from '../../queryClient';
import CartItemData from './CartItemData';

type CartContext = {
  [key: string]: CartType;
};

type CartUpdateVariables = {
  id: string;
  amount: number;
};

function CartItem(
  {
    item: { amount, id, imageUrl, price, title },
  }: {
    item: CartType;
  },
  ref: ForwardedRef<HTMLInputElement>
) {
  const queryClient = useQueryClient();

  const { mutate: updateCart } = useMutation<CartContext, Error, CartUpdateVariables, CartContext>(
    ({ id, amount }) => graphqlFetcher(UPDATE_CART, { id, amount }),
    {
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
      // onSettled: (newTodo) => {
      //   queryClient.invalidateQueries(QueryKeys.CART);
      // },
    }
  );

  const { mutate: deleteCart } = useMutation<string, Error, { id: string }, CartContext>(
    ({ id }) => graphqlFetcher(DELETE_CART, { id }),
    {
      // When mutate is called:
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries(QueryKeys.CART);

        // Snapshot the previous value
        const prevCart = queryClient.getQueryData<CartContext>(QueryKeys.CART);

        if (!prevCart?.[id]) return prevCart;

        const newCart = { ...prevCart };
        delete newCart[id];

        // Optimistically update to the new value
        queryClient.setQueryData(QueryKeys.CART, newCart);

        // Return a context with the previous and new todo
        return prevCart;
      },
      onSuccess: (deleteId) => {
        const prevCart = queryClient.getQueryData<CartContext>(QueryKeys.CART);
        const newCart = { ...prevCart };
        delete newCart[deleteId];

        queryClient.setQueryData(QueryKeys.CART, newCart);
      },

      // If the mutation fails, use the context we returned above
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(QueryKeys.CART, context?.prevCart);
      },
    }
  );

  const handleUpdateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value);
    if (amount < 1) return;
    updateCart({ id, amount });
  };

  const handleDeleteCart = () => {
    deleteCart({ id });
  };

  return (
    <li className="cart-item">
      <input
        className="cart-item__checkbox"
        type="checkbox"
        name="select-item"
        ref={ref}
        data-id={id}
      />
      <CartItemData price={price} imageUrl={imageUrl} title={title} />
      <input
        type="number"
        className="cart-item__amount"
        value={amount}
        min={1}
        onChange={handleUpdateAmount}
      />
      <button className="cart-item__remove" onClick={handleDeleteCart}>
        삭제
      </button>
    </li>
  );
}

export default forwardRef(CartItem);
