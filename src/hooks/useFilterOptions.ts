import { useMemo } from 'react';
import { useStatus } from '@/hooks/useStatusControl';
import { useCourses } from '@/hooks/useCourse';

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
    status: ReturnType<typeof useStatus>['status'];
    courses: ReturnType<typeof useCourses>['courses'];
    loadingStatus: boolean;
    loadingCourses: boolean;
}

/**
 * Hook personalizado para criar opções de filtros de status e cursos
 * 
 * @param page - Página para carregar (padrão: 1)
 * @param limit - Limite de itens por página (padrão: 100)
 * @param search - Termo de busca (padrão: "")
 * @returns Objeto contendo opções de status, cursos e estados de loading
 * 
 * @example
 * ```tsx
 * const { statusOptions, courseOptions, loadingStatus, loadingCourses } = useFilterOptions();
 * 
 * // Usar nos filtros
 * <FilterSearchCard
 *   filters={[
 *     {
 *       label: "Status",
 *       value: statusFilter,
 *       onChange: setStatusFilter,
 *       options: statusOptions,
 *       width: "w-48"
 *     },
 *     {
 *       label: "Curso",
 *       value: courseFilter,
 *       onChange: setCourseFilter,
 *       options: courseOptions,
 *       width: "w-48"
 *     }
 *   ]}
 * />
 * ```
 */
export const useFilterOptions = (
    page: number = 1,
    limit: number = 100,
    search: string = ""
): UseFilterOptionsReturn => {

    // Carregar todos os status
    const { status, loading: loadingStatus } = useStatus(page, limit, search);

    // Carregar todos os cursos
    const { courses, loading: loadingCourses } = useCourses(page, limit, search);

    // Criar opções de status dinamicamente
    const statusOptions = useMemo(() => {
        const options: FilterOption[] = [{ value: "all", label: "Todos os Status" }];

        if (status && status.length > 0) {
            status.forEach((s) => {
                options.push({
                    value: s.codigo.toString(),
                    label: s.designacao
                });
            });
        }

        return options;
    }, [status]);

    // Criar opções de cursos dinamicamente
    const courseOptions = useMemo(() => {
        const options: FilterOption[] = [{ value: "all", label: "Todos os Cursos" }];

        if (courses && courses.length > 0) {
            courses.forEach((c) => {
                options.push({
                    value: c.codigo.toString(),
                    label: c.designacao
                });
            });
        }

        return options;
    }, [courses]);

    return {
        statusOptions,
        courseOptions,
        status,
        courses,
        loadingStatus,
        loadingCourses,
    };
};

export default useFilterOptions;
