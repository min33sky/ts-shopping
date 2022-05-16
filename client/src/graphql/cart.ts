import { gql } from 'graphql-tag';
import { Product } from './products';

export type CartType = {
  id: string;
  amount: number;
  product: Product;
};

export const ADD_CART = gql`
  mutation ADD_CART($productId: ID!) {
    addCart(productId: $productId) {
      id
      product {
        id
        imageUrl
        price
        title
        description
      }
      amount
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UPDATE_CART($id: ID!, $amount: Int!) {
    updateCart(cartId: $id, amount: $amount) {
      id
      product {
        id
        imageUrl
        price
        title
        description
        createdAt
      }
      amount
    }
  }
`;

export const DELETE_CART = gql`
  mutation DeleteCart($id: ID!) {
    deleteCart(cartId: $id)
  }
`;

export const GET_CART = gql`
  query GET_CART {
    cart {
      id
      product {
        id
        imageUrl
        price
        title
        description
      }
      amount
    }
  }
`;
