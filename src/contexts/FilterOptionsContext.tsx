'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStatusQuery, useCoursesQuery } from '@/hooks/useQueries';

/**
 * Interface para opções de filtro
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Interface do contexto de filtros
 */
interface FilterOptionsContextData {
  statusOptions: FilterOption[];
  courseOptions: FilterOption[];
  isLoading: boolean;
}

const FilterOptionsContext = createContext<FilterOptionsContextData>({
  statusOptions: [{ value: 'all', label: 'Todos os Status' }],
  courseOptions: [{ value: 'all', label: 'Todos os Cursos' }],
  isLoading: true,
});

/**
 * Provider que carrega os filtros UMA ÚNICA VEZ para toda a aplicação
 * Isso evita requisições duplicadas em diferentes páginas
 */
export function FilterOptionsProvider({ children }: { children: ReactNode }) {
  // Carregar status e cursos APENAS UMA VEZ com cache permanente
  const statusQuery = useStatusQuery(1, 100, '');
  const coursesQuery = useCoursesQuery(1, 100, '', false);

  // Criar opções de status
  const statusOptions: FilterOption[] = React.useMemo(() => {
    const options: FilterOption[] = [{ value: 'all', label: 'Todos os Status' }];
    
    if (statusQuery.data?.data) {
      statusQuery.data.data.forEach((s) => {
        options.push({
          value: s.codigo.toString(),
          label: s.designacao,
        });
      });
    }
    
    return options;
  }, [statusQuery.data]);

  // Criar opções de cursos
  const courseOptions: FilterOption[] = React.useMemo(() => {
    const options: FilterOption[] = [{ value: 'all', label: 'Todos os Cursos' }];
    
    if (coursesQuery.data?.data) {
      coursesQuery.data.data.forEach((c) => {
        options.push({
          value: c.codigo.toString(),
          label: c.designacao,
        });
      });
    }
    
    return options;
  }, [coursesQuery.data]);

  const isLoading = statusQuery.isLoading || coursesQuery.isLoading;

  return (
    <FilterOptionsContext.Provider
      value={{
        statusOptions,
        courseOptions,
        isLoading,
      }}
    >
      {children}
    </FilterOptionsContext.Provider>
  );
}

/**
 * Hook para acessar os filtros globais
 * Não faz requisições, apenas usa o cache do Context
 */
export function useFilterOptions() {
  const context = useContext(FilterOptionsContext);
  
  if (!context) {
    throw new Error('useFilterOptions deve ser usado dentro de FilterOptionsProvider');
  }
  
  return context;
}
