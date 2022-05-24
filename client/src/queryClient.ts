import request, { RequestDocument } from 'graphql-request';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

//************************* Rest API용 ********************************/
const BASE_URL = 'https://fakestoreapi.com';

//? React-Query Client 생성 함수 (싱글톤 방식으로 생성)
export const getClient = (() => {
  let client: QueryClient | null = null;
  return () => {
    if (!client)
      client = new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24, //* 하루동안 캐시
            staleTime: 1000 * 60, //* 1분동안 최신 상태 유지
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      });
    return client;
  };
})();

type FetcherBodyParams = {
  [key: string]: any;
};

export const fetcher = async ({
  method,
  path,
  body,
  params,
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: FetcherBodyParams;
  params?: FetcherBodyParams;
}) => {
  try {
    let url = `${BASE_URL}${path}`;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': BASE_URL,
      },
    };

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += '?' + searchParams.toString();
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

//************************* Graphql API용 ********************************/
const BASE_URL_GRAPHQL = import.meta.env.VITE_SERVER_URL as string;

export const graphqlFetcher = (query: RequestDocument, variables = {}) =>
  request(`${BASE_URL_GRAPHQL}/graphql`, query, variables, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': BASE_URL_GRAPHQL,
  });

//************************* React-Query에서 사용할 QUERY kEYS**************/
export const QueryKeys = {
  PRODUCTS: 'PRODUCTS',
  CART: 'CART',
};
