import { useState, useEffect, useCallback } from "react"
import MatriculaService from "@/services/matricula.service"
import { 
  IMatricula, 
  IMatriculaInput, 
  IMatriculaListResponse, 
  IMatriculaDetailed,
  IMatriculasByAnoLectivo,
  IMatriculasWithoutConfirmation,
  IBatchResponse
} from "@/types/matricula.types"

// Listagem com paginação
export function useMatriculas(page = 1, limit = 10, search = "") {
  const [matriculas, setMatriculas] = useState<IMatricula[]>([])
  const [pagination, setPagination] = useState<IMatriculaListResponse["pagination"] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatriculas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, pagination } = await MatriculaService.getMatriculas(page, limit, search)
      setMatriculas(data)
      setPagination(pagination)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matrículas")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchMatriculas()
  }, [fetchMatriculas])

  return { matriculas, pagination, loading, error, refetch: fetchMatriculas }
}

// Uma matrícula por ID com detalhes completos
export function useMatricula(id?: number) {
  const [matricula, setMatricula] = useState<IMatriculaDetailed | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatricula = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculaById(id)
      setMatricula(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matrícula")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchMatricula()
  }, [fetchMatricula])

  return { matricula, loading, error, refetch: fetchMatricula }
}

// Criar
export function useCreateMatricula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMatricula = useCallback(async (payload: IMatriculaInput) => {
    try {
      setLoading(true)
      setError(null)
      return await MatriculaService.createMatricula(payload)
    } catch (err: any) {
      const errorMessage = err.response?.status === 409 
        ? "Já existe uma matrícula para este aluno"
        : err.response?.status === 404
        ? "Aluno, curso ou utilizador não encontrado"
        : err.message || "Erro ao criar matrícula"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { createMatricula, loading, error }
}

// Atualizar
export function useUpdateMatricula(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMatricula = useCallback(async (payload: Partial<IMatriculaInput>) => {
    try {
      setLoading(true)
      setError(null)
      return await MatriculaService.updateMatricula(id, payload)
    } catch (err: any) {
      const errorMessage = err.response?.status === 404
        ? "Matrícula, aluno, curso ou utilizador não encontrado"
        : err.response?.status === 409
        ? "Já existe uma matrícula para este aluno"
        : err.message || "Erro ao atualizar matrícula"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [id])

  return { updateMatricula, loading, error }
}

// Deletar
export function useDeleteMatricula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteMatricula = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await MatriculaService.deleteMatricula(id)
    } catch (err: any) {
      const errorMessage = err.response?.status === 404
        ? "Matrícula não encontrada"
        : err.response?.status === 400
        ? "Não é possível excluir matrícula com confirmações associadas"
        : err.message || "Erro ao deletar matrícula"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteMatricula, loading, error }
}

// Batch
export function useBatchMatricula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const batchMatricula = useCallback(async (payload: IMatriculaInput[]) => {
    try {
      setLoading(true)
      setError(null)
      return await MatriculaService.batchMatricula(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao criar matrículas em lote")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { batchMatricula, loading, error }
}

// Matrículas por ano letivo
export function useMatriculasByAnoLectivo() {
  const [matriculas, setMatriculas] = useState<IMatricula[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatriculasByAnoLectivo = useCallback(async (params: IMatriculasByAnoLectivo) => {
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculasByAnoLectivo(params)
      setMatriculas(data)
      return data
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matrículas por ano letivo")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { 
    matriculas, 
    loading, 
    error, 
    fetchMatriculasByAnoLectivo 
  }
}

// Matrículas sem confirmação
export function useMatriculasWithoutConfirmacao() {
  const [matriculas, setMatriculas] = useState<IMatriculasWithoutConfirmation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatriculasWithoutConfirmacao = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculasWithoutConfirmacao()
      setMatriculas(data)
      return data
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matrículas sem confirmação")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto fetch on mount
  useEffect(() => {
    fetchMatriculasWithoutConfirmacao()
  }, [fetchMatriculasWithoutConfirmacao])

  return { 
    matriculas, 
    loading, 
    error, 
    refetch: fetchMatriculasWithoutConfirmacao 
  }
}