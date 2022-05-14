import { QueryClientProvider } from 'react-query';
import { useRoutes } from 'react-router-dom';
import { getClient } from './queryClient';
import { ReactQueryDevtools } from 'react-query/devtools';
import { routes } from './routes';
import Gnb from './components/Gnb';

function App() {
  const element = useRoutes(routes);
  const client = getClient();

  return (
    <QueryClientProvider client={client}>
      <Gnb />
      {element}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
