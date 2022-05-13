import { useQuery } from 'react-query';
import ProductsList from '../../components/product/List';
import { GET_PRODUCTS, Products } from '../../graphql/products';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

function ProductsListPage() {
  const { data } = useQuery<Products>(QueryKeys.PRODUCTS, () => graphqlFetcher(GET_PRODUCTS), {
    onSuccess: (data) => {
      console.log('전체 상품 목록: ', data);
    },
  });

  if (!data) return <div>Loading.....</div>;

  return (
    <>
      <ProductsList data={data} />
    </>
  );
}

export default ProductsListPage;
