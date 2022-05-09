import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

const BASE_URL = 'https://fakestoreapi.com';

// Create a client
export const getClient = (() => {
  let client: QueryClient | null = null;
  return () => {
    if (!client) client = new QueryClient();
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
    const url = `${BASE_URL}${path}`;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': BASE_URL,
      },
    };

    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export const QueryKeys = {
  PRODUCTS: 'PRODUCTS',
};
