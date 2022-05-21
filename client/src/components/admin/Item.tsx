import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  AdminItemType,
  DELETE_PRODUCT,
  Product,
  UpdateProductVariables,
  UPDATE_PRODUCT,
} from '../../graphql/products';
import { arrayToObj } from '../../libs/arrayToObj';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

function AdminItem({
  imageUrl,
  id,
  price,
  title,
  createdAt,
  isEditing,
  startEdit,
  description,
  exitEdit,
}: AdminItemType) {
  const queryClient = useQueryClient();
  const { mutate: updateProduct } = useMutation<Product, Error, UpdateProductVariables>(
    ({ title, imageUrl, price, description }) =>
      graphqlFetcher(UPDATE_PRODUCT, { id, title, imageUrl, price, description }),
    {
      onSuccess: (data) => {
        console.log('수정한 상품 정보: ', data);
        exitEdit();
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true, //? inactive 상태인 상품목록도 Refetch
        });
      },
    }
  );

  const { mutate: deleteProduct } = useMutation<Product, Error, { id: string }>(
    ({ id }) => graphqlFetcher(DELETE_PRODUCT, { id }),
    {
      onSuccess: (data) => {
        console.log('삭제한 상품 정보: ', data);
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
    const obj = arrayToObj([...formData]) as UpdateProductVariables;
    updateProduct(obj);
  };

  const deleteItem = () => {
    console.log('삭제');
    deleteProduct({ id });
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          <span>상품명: </span>
          <input type="text" name="title" required defaultValue={title} />
        </label>
        <label htmlFor="">
          <span>상품 이미지 URL: </span>
          <input type="text" name="imageUrl" required defaultValue={imageUrl} />
        </label>
        <label htmlFor="">
          <span>상품가격: </span>
          <input type="number" name="price" min={1000} required defaultValue={price} />
        </label>
        <label htmlFor="">
          <span>상세: </span>
          <textarea name="description" defaultValue={description} />
        </label>
        <button type="submit">수정</button>
      </form>
    );
  }

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <p className="product-item__title">{title}</p>
        <img className="product-item__image" src={imageUrl} alt="product_image" />
        <div className="product-item__footer">
          <p className="product-item__price">${price}</p>
          {!createdAt && <span>삭제된 상품....</span>}
        </div>
      </Link>
      <button className="product-item__add-cart" onClick={startEdit}>
        수정
      </button>
      <button className="product-item__add-cart" onClick={deleteItem}>
        삭제
      </button>
    </li>
  );
}

export default AdminItem;
