import { gql } from 'graphql-tag';

export const EXECUTE_PAY = gql`
  mutation Mutation($ids: [ID!]) {
    executePay(ids: $ids)
  }
`;
