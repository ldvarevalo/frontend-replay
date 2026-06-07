import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

import { createSupabaseAdapter } from './core/auth/adapters/supabase';
import { AuthProvider } from './core/auth/auth-context';
import { createQueryClient } from './core/clients/react-query/query-client';
import { createSupabaseClient } from './core/clients/supabase/client';
import { getRouter } from './router';

const queryClient = createQueryClient();
const router = getRouter(queryClient);
const supabase = createSupabaseClient();
const adapter = createSupabaseAdapter(supabase);

const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider adapter={adapter}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
  );
}
