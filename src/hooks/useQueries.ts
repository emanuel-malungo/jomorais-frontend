import { useQuery } from '@tanstack/react-query';
import StatusControlService from '@/services/status-control.service';
import CourseService from '@/services/course.service';
import AnoLectivoService from '@/services/anoLectivo.service';
import PeriodoService from '@/services/periodo.service';

/**
 * Query Keys centralizadas para evitar duplicações
 */
export const queryKeys = {
  // Status
  status: (page?: number, limit?: number, search?: string) => 
    ['status', { page, limit, search }] as const,
  
  // Cursos
  courses: (page?: number, limit?: number, search?: string, includeArchived?: boolean) => 
    ['courses', { page, limit, search, includeArchived }] as const,
  
  // Anos Letivos
  academicYears: (page?: number, limit?: number, search?: string) => 
    ['academicYears', { page, limit, search }] as const,
  
  // Períodos
  periods: (page?: number, limit?: number, search?: string) => 
    ['periods', { page, limit, search }] as const,
  
  // Alunos
  students: (page?: number, limit?: number, search?: string, statusFilter?: string | null, cursoFilter?: string | null) => 
    ['students', { page, limit, search, statusFilter, cursoFilter }] as const,
  
  // Estatísticas de Alunos
  studentStatistics: (statusFilter?: string | null, cursoFilter?: string | null) => 
    ['studentStatistics', { statusFilter, cursoFilter }] as const,
};

/**
 * Hook para buscar lista de status com cache
 * Configurado para fazer requisição uma única vez e manter cache
 */
export function useStatusQuery(page: number = 1, limit: number = 100, search: string = '') {
  return useQuery({
    queryKey: queryKeys.status(page, limit, search),
    queryFn: async () => {
      const response = await StatusControlService.getStatus(page, limit, search);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - dados mudam raramente
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

/**
 * Hook para buscar lista de cursos com cache
 * Configurado para fazer requisição uma única vez e manter cache
 */
export function useCoursesQuery(
  page: number = 1, 
  limit: number = 100, 
  search: string = '', 
  includeArchived: boolean = false
) {
  return useQuery({
    queryKey: queryKeys.courses(page, limit, search, includeArchived),
    queryFn: async () => {
      const response = await CourseService.getAllCourses(search, includeArchived);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - dados mudam raramente
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

/**
 * Hook para buscar anos letivos com cache
 */
export function useAcademicYearsQuery(page: number = 1, limit: number = 100, search: string = '') {
  return useQuery({
    queryKey: queryKeys.academicYears(page, limit, search),
    queryFn: async () => {
      const response = await AnoLectivoService.getAnosLectivos(page, limit, search);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

/**
 * Hook para buscar períodos com cache
 */
export function usePeriodsQuery(page: number = 1, limit: number = 100, search: string = '') {
  return useQuery({
    queryKey: queryKeys.periods(page, limit, search),
    queryFn: async () => {
      const response = await PeriodoService.getPeriodos(page, limit, search);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}

/**
 * Hook para buscar alunos com paginação e filtros
 * Mantém cache por página/filtro específico
 */
export function useStudentsQuery(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  statusFilter: string | null = null,
  cursoFilter: string | null = null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.students(page, limit, search, statusFilter, cursoFilter),
    queryFn: async () => {
      const { default: StudentService } = await import('@/services/student.service');
      const response = await StudentService.getAllStudents(
        page,
        limit,
        search,
        statusFilter,
        cursoFilter
      );
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos - dados mudam com mais frequência
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled, // Permite desabilitar a query se necessário
  });
}

/**
 * Hook para buscar estatísticas de alunos
 * Cache compartilhado por filtros
 */
export function useStudentStatisticsQuery(
  statusFilter: string | null = null,
  cursoFilter: string | null = null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.studentStatistics(statusFilter, cursoFilter),
    queryFn: async () => {
      const { default: StudentService } = await import('@/services/student.service');
      const response = await StudentService.getAlunosStatistics(statusFilter, cursoFilter);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled,
  });
}

/**
 * Helper para pré-carregar dados de filtros
 * Útil para carregar todos os filtros necessários de uma vez
 */
export function usePrefetchFilterData() {
  const statusQuery = useStatusQuery(1, 100, '');
  const coursesQuery = useCoursesQuery(1, 100, '', false);
  const academicYearsQuery = useAcademicYearsQuery(1, 100, '');
  const periodsQuery = usePeriodsQuery(1, 100, '');

  return {
    isLoading: 
      statusQuery.isLoading || 
      coursesQuery.isLoading || 
      academicYearsQuery.isLoading || 
      periodsQuery.isLoading,
    isError: 
      statusQuery.isError || 
      coursesQuery.isError || 
      academicYearsQuery.isError || 
      periodsQuery.isError,
  };
}
