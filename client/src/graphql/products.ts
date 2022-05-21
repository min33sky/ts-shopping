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

export type AdminItemType = Product & {
  isEditing: boolean;
  startEdit: () => void;
  exitEdit: () => void;
};

export type UpdateProductVariables = Omit<Product, 'createdAt' | 'id'>;

export type AddProductVariables = Omit<Product, 'id' | 'createdAt'>;

/**
 * 상품 들록하기
 */
export const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT($title: String!, $imageUrl: String!, $price: Int!, $description: String!) {
    addProduct(title: $title, imageUrl: $imageUrl, price: $price, description: $description) {
      title
      price
      imageUrl
      description
    }
  }
`;

/**
 * 상품 업데이트
 */
export const UPDATE_PRODUCT = gql`
  mutation UPDATE_PRODUCT(
    $id: ID!
    $title: String!
    $imageUrl: String!
    $price: Int!
    $description: String!
  ) {
    updateProduct(
      id: $id
      title: $title
      imageUrl: $imageUrl
      price: $price
      description: $description
    ) {
      title
      price
      imageUrl
      description
    }
  }
`;

/**
 * 상품 삭제
 */
export const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id)
  }
`;

/**
 * 상품 리스트를 가져오는 쿼리
 */
export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID, $showDeleted: Boolean) {
    products(cursor: $cursor, showDeleted: $showDeleted) {
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
