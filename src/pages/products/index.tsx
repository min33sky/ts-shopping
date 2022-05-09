import React from 'react';
import { useQuery } from 'react-query';
import Item from '../../components/Product/Item';
import { fetcher, QueryKeys } from '../../queryClient';
import { IGetProducts } from '../../typings/shop';

function ProductsList() {
  const { data, isLoading, isFetching } = useQuery<IGetProducts[]>(
    QueryKeys.PRODUCTS,
    () =>
      fetcher({
        method: 'GET',
        path: '/products',
      }),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  if (isLoading || isFetching) {
    <div>Loading....</div>;
  }

  return (
    <div>
      <ul className="products">
        {data?.map((product) => (
          <Item key={product.id} {...product} />
        ))}
      </ul>
    </div>
  );
}

export default ProductsList;
