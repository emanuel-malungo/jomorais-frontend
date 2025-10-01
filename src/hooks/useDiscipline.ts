import { useState, useEffect, useCallback } from "react"
import DisciplineService from "@/services/discipline.service"
import { IDiscipline, IDisciplineInput, IDisciplineListResponse } from "@/types/discipline.types"

// Listar disciplinas
export function useDisciplines(page = 1, limit = 10, search = "") {
    const [disciplines, setDisciplines] = useState<IDiscipline[]>([])
    const [pagination, setPagination] = useState<IDisciplineListResponse["pagination"] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDisciplines = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const { data, pagination } = await DisciplineService.getDisciplines(page, limit, search)
            setDisciplines(data)
            setPagination(pagination)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar disciplinas")
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    useEffect(() => {
        fetchDisciplines()
    }, [fetchDisciplines])

    return { disciplines, pagination, loading, error, refetch: fetchDisciplines }
}

// Buscar disciplina por ID
export function useDiscipline(id?: number) {
    const [discipline, setDiscipline] = useState<IDiscipline | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDiscipline = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await DisciplineService.getDisciplineById(id)
            setDiscipline(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar disciplina")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchDiscipline()
    }, [fetchDiscipline])

    return { discipline, loading, error, refetch: fetchDiscipline }
}

// Criar disciplina
export function useCreateDiscipline() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createDiscipline = useCallback(async (payload: IDisciplineInput) => {
        try {
            setLoading(true)
            setError(null)
            return await DisciplineService.createDiscipline(payload)
        } catch (err: any) {
            setError(err.message || "Erro ao criar disciplina")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { createDiscipline, loading, error }
}

// Atualizar disciplina
export function useUpdateDiscipline(id: number) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateDiscipline = useCallback(async (payload: IDisciplineInput) => {
        try {
            setLoading(true)
            setError(null)
            return await DisciplineService.updateDiscipline(id, payload)
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar disciplina")
            throw err
        } finally {
            setLoading(false)
        }
    }, [id])

    return { updateDiscipline, loading, error }
}

// Deletar disciplina
export function useDeleteDiscipline() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteDiscipline = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await DisciplineService.deleteDiscipline(id)
        } catch (err: any) {
            setError(err.message || "Erro ao deletar disciplina")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { deleteDiscipline, loading, error }
}
