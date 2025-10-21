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
