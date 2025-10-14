import { useState, useEffect, useCallback } from "react"
import CourseService from "@/services/course.service"
import { ICourse, ICourseInput, ICourseListResponse } from "@/types/course.types"

// Listar TODOS os cursos sem paginação
export function useAllCourses(search = "", includeArchived = false) {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllCourses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const { data } = await CourseService.getAllCourses(search, includeArchived)
            setCourses(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar cursos")
        } finally {
            setLoading(false)
        }
    }, [search, includeArchived])

    useEffect(() => {
        fetchAllCourses()
    }, [fetchAllCourses])

    return { courses, loading, error, refetch: fetchAllCourses }
}

// Listar cursos com paginação e busca
export function useCourses(page = 1, limit = 10, search = "", includeArchived = false) {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [pagination, setPagination] = useState<ICourseListResponse["pagination"] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const { data, pagination } = await CourseService.getCourses(page, limit, search, includeArchived)
            setCourses(data)
            setPagination(pagination)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar cursos")
        } finally {
            setLoading(false)
        }
    }, [page, limit, search, includeArchived])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, pagination, loading, error, refetch: fetchCourses }
}

// Buscar curso por ID
export function useCourse(id?: number) {
    const [course, setCourse] = useState<ICourse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCourse = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await CourseService.getCourseById(id)
            setCourse(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar curso")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchCourse()
    }, [fetchCourse])

    return { course, loading, error, refetch: fetchCourse }
}

// Criar curso
export function useCreateCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createCourse = useCallback(async (payload: ICourseInput) => {
        try {
            setLoading(true)
            setError(null)
            return await CourseService.createCourse(payload)
        } catch (err: any) {
            setError(err.message || "Erro ao criar curso")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { createCourse, loading, error }
}

// Atualizar curso
export function useUpdateCourse(id: number) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateCourse = useCallback(async (payload: ICourseInput) => {
        try {
            setLoading(true)
            setError(null)
            return await CourseService.updateCourse(id, payload)
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar curso")
            throw err
        } finally {
            setLoading(false)
        }
    }, [id])

    return { updateCourse, loading, error }
}

// Arquivar curso
export function useArchiveCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const archiveCourse = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await CourseService.archiveCourse(id)
        } catch (err: any) {
            setError(err.message || "Erro ao arquivar curso")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { archiveCourse, loading, error }
}

// Restaurar curso
export function useUnarchiveCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const unarchiveCourse = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await CourseService.unarchiveCourse(id)
        } catch (err: any) {
            setError(err.message || "Erro ao restaurar curso")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { unarchiveCourse, loading, error }
}

// Deletar curso (apenas para admin)
export function useDeleteCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteCourse = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await CourseService.deleteCourse(id)
        } catch (err: any) {
            setError(err.message || "Erro ao deletar curso")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { deleteCourse, loading, error }
}
