'use client';

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Provider do React Query para gerenciar cache e requisições
 * Configurações otimizadas para evitar requisições duplicadas
 */
export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache padrão de 5 minutos
            staleTime: 5 * 60 * 1000,
            // Manter cache por 10 minutos
            gcTime: 10 * 60 * 1000,
            // Não refazer requisições ao focar na janela
            refetchOnWindowFocus: false,
            // Não refazer requisições ao reconectar
            refetchOnReconnect: false,
            // Tentar apenas 1 vez em caso de erro
            retry: 1,
            // Não refazer requisições ao montar componente se já tem cache
            refetchOnMount: false,
          },
        },
      })
  );

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
