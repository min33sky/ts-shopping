import { useQuery } from 'react-query';
import ProductItem from '../../components/product/Item';
import { GET_PRODUCTS, Products } from '../../graphql/products';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

function ProductsList() {
  const { data, isLoading, isFetching } = useQuery<Products>(
    QueryKeys.PRODUCTS,
    () => graphqlFetcher(GET_PRODUCTS),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <div>
      <h2>상품 리스트</h2>
      <ul className="products">
        {data?.products.map((product) => (
          <ProductItem key={product.id} {...product} />
        ))}
      </ul>
    </div>
  );
}

export default ProductsList;
