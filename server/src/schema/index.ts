import { gql } from 'apollo-server-express';
import cartSchema from './cart';
import productSchema from './product';

/**
 * 스키마들을 하나로 합쳐주는 역할
 * ? 의미 없어보여도 넣어줘야 실행이 된다.
 */
const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, productSchema, cartSchema];
