import { useMemo, useEffect } from 'react';
import { useStatus } from '@/hooks/useStatusControl';
import { useCourses } from '@/hooks/useCourse';
import { useAnosLectivos } from '@/hooks/useAnoLectivo';

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
    status: ReturnType<typeof useStatus>['status'];
    courses: ReturnType<typeof useCourses>['courses'];
    anosLectivos: ReturnType<typeof useAnosLectivos>['anosLectivos'];
    loadingStatus: boolean;
    loadingCourses: boolean;
    loadingAcademicYears: boolean;
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

    // Carregar todos os anos letivos
    const { anosLectivos, isLoading: loadingAcademicYears, fetchAnosLectivos } = useAnosLectivos();

    // Buscar anos letivos ao montar o componente
    useEffect(() => {
        fetchAnosLectivos(page, limit, search);
    }, [fetchAnosLectivos, page, limit, search]);

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

    // Criar opções de anos letivos dinamicamente
    const academicYearOptions = useMemo(() => {
        const options: FilterOption[] = [{ value: "all", label: "Todos os Anos" }];

        if (anosLectivos && anosLectivos.length > 0) {
            anosLectivos.forEach((ano) => {
                options.push({
                    value: ano.codigo.toString(),
                    label: ano.designacao
                });
            });
        }

        return options;
    }, [anosLectivos]);

    return {
        statusOptions,
        courseOptions,
        academicYearOptions,
        status,
        courses,
        anosLectivos,
        loadingStatus,
        loadingCourses,
        loadingAcademicYears,
    };
};

export default useFilterOptions;
