import { useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import AddForm from '../../components/admin/AddForm';
import AdminList from '../../components/admin/List';
import ProductsList from '../../components/product/List';
import { Products, GET_PRODUCTS } from '../../graphql/products';
import useIntersection from '../../hooks/useIntersection';
import { QueryKeys, graphqlFetcher } from '../../queryClient';

function AdminPage() {
  const [editingIndex, setEditingIndex] = useState<number | null>(null); //? 수정할 상품 위치

  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  const { data, fetchNextPage, isSuccess, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, 'admin'],
      ({ pageParam = '' }) =>
        graphqlFetcher(GET_PRODUCTS, { cursor: pageParam, showDeleted: true }),
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

  /**
   * 수정 모드로 바꾸기
   * @param id
   * @returns
   */
  const startEdit = (id: number) => () => {
    setEditingIndex(id);
  };

  /**
   * 수정 모드 종료
   */
  const exitEdit = () => {
    setEditingIndex(null);
  };

  return (
    <>
      <h2>Admin Page</h2>
      <AddForm />
      <AdminList
        data={data?.pages || []}
        editingIndex={editingIndex}
        startEdit={startEdit}
        exitEdit={exitEdit}
      />
      <div ref={fetchMoreRef} />
    </>
  );
}

export default AdminPage;
