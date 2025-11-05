import { useMemo } from 'react';
import {
  useStatusQuery,
  useCoursesQuery,
  useAcademicYearsQuery,
  usePeriodsQuery,
} from '@/hooks/useQueries';

/**
 * Interface para opções de filtro
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Interface de retorno do hook
 */
export interface UseFilterOptionsReturn {
  statusOptions: FilterOption[];
  courseOptions: FilterOption[];
  academicYearOptions: FilterOption[];
  periodoOptions: FilterOption[];
  loadingStatus: boolean;
  loadingCourses: boolean;
  loadingAcademicYears: boolean;
  loadingPeriods: boolean;
  isLoading: boolean;
}

/**
 * Hook otimizado para opções de filtros usando React Query
 * 
 * Benefícios:
 * - Cache automático - requisições só são feitas uma vez
 * - Compartilhamento de cache entre componentes
 * - Deduplicação automática de requisições
 * - Não usa useEffect, evitando requisições duplicadas
 * 
 * @param page - Página para paginação (padrão: 1)
 * @param limit - Limite de itens por página (padrão: 100)
 * @param search - Termo de busca (padrão: "")
 */
export const useFilterOptionsOptimized = (
  page: number = 1,
  limit: number = 100,
  search: string = ""
): UseFilterOptionsReturn => {

  // Usar React Query para carregar dados com cache
  // Todas essas queries compartilham cache e não duplicam requisições
  const statusQuery = useStatusQuery(page, limit, search);
  const coursesQuery = useCoursesQuery(page, limit, search, false);
  const academicYearsQuery = useAcademicYearsQuery(page, limit, search);
  const periodsQuery = usePeriodsQuery(page, limit, search);

  // Criar opções de status dinamicamente
  const statusOptions = useMemo(() => {
    const options: FilterOption[] = [{ value: "all", label: "Todos os Status" }];

    if (statusQuery.data?.data && statusQuery.data.data.length > 0) {
      statusQuery.data.data.forEach((s) => {
        options.push({
          value: s.codigo.toString(),
          label: s.designacao
        });
      });
    }

    return options;
  }, [statusQuery.data]);

  // Criar opções de cursos dinamicamente
  const courseOptions = useMemo(() => {
    const options: FilterOption[] = [{ value: "all", label: "Todos os Cursos" }];

    if (coursesQuery.data?.data && coursesQuery.data.data.length > 0) {
      coursesQuery.data.data.forEach((c) => {
        options.push({
          value: c.codigo.toString(),
          label: c.designacao
        });
      });
    }

    return options;
  }, [coursesQuery.data]);

  // Criar opções de anos letivos dinamicamente
  const academicYearOptions = useMemo(() => {
    const options: FilterOption[] = [{ value: "all", label: "Todos os Anos" }];

    if (academicYearsQuery.data?.data && academicYearsQuery.data.data.length > 0) {
      academicYearsQuery.data.data.forEach((ano) => {
        options.push({
          value: ano.codigo.toString(),
          label: ano.designacao
        });
      });
    }

    return options;
  }, [academicYearsQuery.data]);

  // Criar opções de períodos dinamicamente
  const periodoOptions = useMemo(() => {
    const options: FilterOption[] = [{ value: "all", label: "Todos os Períodos" }];

    if (periodsQuery.data?.data && periodsQuery.data.data.length > 0) {
      periodsQuery.data.data.forEach((p) => {
        options.push({
          value: p.codigo.toString(),
          label: p.designacao
        });
      });
    }

    return options;
  }, [periodsQuery.data]);

  return {
    statusOptions,
    courseOptions,
    academicYearOptions,
    periodoOptions,
    loadingStatus: statusQuery.isLoading,
    loadingCourses: coursesQuery.isLoading,
    loadingAcademicYears: academicYearsQuery.isLoading,
    loadingPeriods: periodsQuery.isLoading,
    isLoading: 
      statusQuery.isLoading || 
      coursesQuery.isLoading || 
      academicYearsQuery.isLoading || 
      periodsQuery.isLoading,
  };
};

export default useFilterOptionsOptimized;
