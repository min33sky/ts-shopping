import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import ProductsList from '../../components/product/List';
import { GET_PRODUCTS, Products } from '../../graphql/products';
import useIntersection from '../../hooks/useIntersection';
import { graphqlFetcher, QueryKeys } from '../../queryClient';

function ProductsListPage() {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  const { data, fetchNextPage, isSuccess, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, 'products'],
      ({ pageParam = '' }) =>
        graphqlFetcher(GET_PRODUCTS, { cursor: pageParam, showDeleted: false }),
      {
        getNextPageParam: (lastPage, allPages) => {
          if (!lastPage.products.at(-1)?.id) {
            console.log('마지막 데이터...');
          }
          return lastPage.products.at(-1)?.id;
        },
        onSuccess: (data) => {
          console.log('전체 상품 목록: ', data);
        },
      }
    );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [intersecting]);

  return (
    <>
      <h2>Products List</h2>
      <ProductsList data={data?.pages || []} />
      <div ref={fetchMoreRef} />
    </>
  );
}
export default ProductsListPage;
