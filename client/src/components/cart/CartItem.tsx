import React, { ForwardedRef, forwardRef } from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { CartType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { graphqlFetcher, QueryKeys } from '../../queryClient';
import CartItemData from './CartItemData';

type CartContext = {
  cart: CartType[];
};

type UpdateResponse = {
  updateCart: CartType;
};

type DeleteResponse = {
  deleteCart: string;
};

type CartUpdateVariables = {
  id: string;
  amount: number;
};

type CartDeleteVariables = {
  id: string;
};

function CartItem(
  {
    item: { amount, id, product },
  }: {
    item: CartType;
  },
  ref: ForwardedRef<HTMLInputElement>
) {
  const queryClient = useQueryClient();

  /**
   ** 상품 수량 업데이트
   */
  const { mutate: updateCart } = useMutation<UpdateResponse, Error, CartUpdateVariables>(
    ({ id, amount }) => graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART);
        const { cart: prevCart } = queryClient.getQueryData<{ cart: CartType[] }>(
          QueryKeys.CART
        ) || { cart: [] };
        if (!prevCart) return null;

        const targetIndex = prevCart.findIndex((cartItem) => cartItem.id === id);
        if (targetIndex === undefined || targetIndex < 0) return prevCart;

        const newCart = [...prevCart];
        newCart.splice(targetIndex, 1, { ...newCart[targetIndex], amount });
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
        return prevCart;
      },
      onSuccess: ({ updateCart }) => {
        const { cart: prevCart } = queryClient.getQueryData<{ cart: CartType[] }>(
          QueryKeys.CART
        ) || { cart: [] };
        const targetIndex = prevCart?.findIndex((cartItem) => cartItem.id === updateCart.id);
        if (!prevCart || targetIndex === undefined || targetIndex < 0) return;

        const newCart = [...prevCart];
        newCart.splice(targetIndex, 1, updateCart);
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newTodo, context: any) => {
        queryClient.setQueryData(QueryKeys.CART, context?.prevCart);
      },
      // Always refetch after error or success:
      // onSettled: (newTodo) => {
      //   queryClient.invalidateQueries(QueryKeys.CART);
      // },
    }
  );

  /**
   ** 장바구니에서 해당 상품 삭제
   */
  const { mutate: deleteCart } = useMutation<DeleteResponse, Error, CartDeleteVariables>(
    ({ id }) => graphqlFetcher(DELETE_CART, { id }),
    {
      // When mutate is called:
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries(QueryKeys.CART);

        // Snapshot the previous value
        const { cart: prevCart } = queryClient.getQueryData<CartContext>(QueryKeys.CART) || {
          cart: [],
        };

        if (!prevCart) return null;

        const targetIndex = prevCart.findIndex((cartItem) => cartItem.id === id);
        if (targetIndex === -1) return prevCart;

        const newCart = prevCart.filter((cart) => cart.id !== id);

        // Optimistically update to the new value
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });

        // Return a context with the previous and new todo
        return prevCart;
      },
      onSuccess: ({ deleteCart: deleteCartId }) => {
        const { cart: prevCart } = queryClient.getQueryData<CartContext>(QueryKeys.CART) || {
          cart: [],
        };

        const newCart = prevCart.filter((cart) => cart.id !== deleteCartId);

        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
      },

      // If the mutation fails, use the context we returned above
      onError: (err, newTodo, context: any) => {
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
        disabled={!product.createdAt}
      />
      <CartItemData product={product} />
      {product.createdAt && (
        <input
          type="number"
          className="cart-item__amount"
          value={amount}
          min={1}
          onChange={handleUpdateAmount}
        />
      )}
      <button className="cart-item__remove" onClick={handleDeleteCart}>
        삭제
      </button>
    </li>
  );
}

export default forwardRef(CartItem);
