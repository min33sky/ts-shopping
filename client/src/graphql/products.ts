import { gql } from 'graphql-tag';

export type Product = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  description: string;
  createdAt: number;
};

export type Products = {
  products: Product[];
};

/**
 * 상품 리스트를 가져오는 쿼리
 */
export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID) {
    products(cursor: $cursor) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;

/**
 * 특정 상품을 가져오는 쿼리
 */
export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;
