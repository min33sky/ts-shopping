import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/product/Detail';
import { GET_PRODUCT, Product } from '../../graphql/products';
import { fetcher, graphqlFetcher, QueryKeys } from '../../queryClient';

/**
 * 상품 상세 페이지
 * @returns
 */
function ProductDetailPage() {
  const { id } = useParams();
  const { data } = useQuery<{ product: Product }>([QueryKeys.PRODUCTS, id], () =>
    graphqlFetcher(GET_PRODUCT, { id })
  );

  if (!data) return <div>Loading....</div>;

  return <ProductDetail item={data.product} />;
}

export default ProductDetailPage;
