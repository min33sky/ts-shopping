import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { AddProductVariables, ADD_PRODUCT, Product } from '../../graphql/products';
import { arrayToObj } from '../../libs/arrayToObj';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

/**
 * 상품 등록 컴포넌트
 * @returns
 */
function AddForm() {
  const queryClient = useQueryClient();
  const { mutate: addProduct } = useMutation<Product, Error, AddProductVariables>(
    ({ title, imageUrl, price, description }) =>
      graphqlFetcher(ADD_PRODUCT, { title, imageUrl, price, description }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true, //? inactive 상태인 상품목록도 Refetch
        });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const obj = arrayToObj([...formData]) as AddProductVariables;
    addProduct(obj);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="">
        <span>상품명: </span>
        <input type="text" name="title" required />
      </label>
      <label htmlFor="">
        <span>상품 이미지 URL: </span>
        <input type="text" name="imageUrl" required />
      </label>
      <label htmlFor="">
        <span>상품가격: </span>
        <input type="number" name="price" min={1000} required />
      </label>
      <label htmlFor="">
        <span>상세: </span>
        <textarea name="description" />
      </label>
      <button type="submit">등록</button>
    </form>
  );
}

export default AddForm;
