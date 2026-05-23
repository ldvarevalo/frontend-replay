import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

import { getRouter } from './router';
import { createQueryClient } from './core/clients/react-query/query-client';

const queryClient = createQueryClient();
const router = getRouter(queryClient);

const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
