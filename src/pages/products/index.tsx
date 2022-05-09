import { useQuery } from 'react-query';
import Item from '../../components/Product/Item';
import { fetcher, QueryKeys } from '../../queryClient';
import { IProducts } from '../../typings/shop';

function ProductsList() {
  const { data, isLoading, isFetching } = useQuery<IProducts[]>(
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

  if (!data) {
    <div>Loading....</div>;
  }

  return (
    <div>
      <h2>상품 리스트</h2>
      <ul className="products">
        {data?.map((product) => (
          <Item key={product.id} {...product} />
        ))}
      </ul>
    </div>
  );
}

export default ProductsList;
