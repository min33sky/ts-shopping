import { QueryClientProvider } from 'react-query';
import { useRoutes } from 'react-router-dom';
import { getClient } from './queryClient';
import { ReactQueryDevtools } from 'react-query/devtools';
import { routes } from './routes';

function App() {
  const element = useRoutes(routes);
  const client = getClient();

  return (
    <QueryClientProvider client={client}>
      {element}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
