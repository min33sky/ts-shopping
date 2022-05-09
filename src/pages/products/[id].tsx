import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/Product/Detail';
import { fetcher, QueryKeys } from '../../queryClient';
import { IProducts } from '../../typings/shop';

/**
 * 상품 상세 페이지
 * @returns
 */
function ProductDetailPage() {
  const { id } = useParams();
  const { data } = useQuery<IProducts>([QueryKeys.PRODUCTS, id], () =>
    fetcher({
      method: 'GET',
      path: `/products/${id}`,
    })
  );

  if (!data) return <div>Loading....</div>;

  return <ProductDetail item={data} />;
}

export default ProductDetailPage;
