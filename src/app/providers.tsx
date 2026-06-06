import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: (failureCount, error) => {
        if (
          error &&
          typeof error === 'object' &&
          'response' in error &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
