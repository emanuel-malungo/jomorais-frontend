import { useState, useEffect, useCallback } from "react"
import ConfirmationService from "@/services/confirmation.service"
import { 
  IConfirmation, 
  IConfirmationInput, 
  IConfirmationListResponse, 
  IConfirmationsByClassAndYear 
} from "@/types/confirmation.types"

// Listagem com paginação
export function useConfirmations(page = 1, limit = 10, search = "") {
  const [confirmations, setConfirmations] = useState<IConfirmation[]>([])
  const [pagination, setPagination] = useState<IConfirmationListResponse["pagination"] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfirmations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, pagination } = await ConfirmationService.getConfirmations(page, limit, search)
      setConfirmations(data)
      setPagination(pagination)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar confirmações")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchConfirmations()
  }, [fetchConfirmations])

  return { confirmations, pagination, loading, error, refetch: fetchConfirmations }
}

// Uma confirmação por ID
export function useConfirmation(id?: number) {
  const [confirmation, setConfirmation] = useState<IConfirmation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfirmation = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await ConfirmationService.getConfirmationById(id)
      setConfirmation(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar confirmação")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchConfirmation()
  }, [fetchConfirmation])

  return { confirmation, loading, error, refetch: fetchConfirmation }
}

// Criar
export function useCreateConfirmation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createConfirmation = useCallback(async (payload: IConfirmationInput) => {
    try {
      setLoading(true)
      setError(null)
      return await ConfirmationService.createConfirmation(payload)
    } catch (err: any) {
      const errorMessage = err.response?.status === 409 
        ? "Já existe uma confirmação para esta matrícula neste ano letivo"
        : err.response?.status === 404
        ? "Matrícula, turma ou utilizador não encontrado"
        : err.message || "Erro ao criar confirmação"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { createConfirmation, loading, error }
}

// Atualizar
export function useUpdateConfirmation(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateConfirmation = useCallback(async (payload: Partial<IConfirmationInput>) => {
    try {
      setLoading(true)
      setError(null)
      return await ConfirmationService.updateConfirmation(id, payload)
    } catch (err: any) {
      const errorMessage = err.response?.status === 404
        ? "Confirmação, matrícula, turma ou utilizador não encontrado"
        : err.message || "Erro ao atualizar confirmação"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [id])

  return { updateConfirmation, loading, error }
}

// Deletar
export function useDeleteConfirmation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteConfirmation = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await ConfirmationService.deleteConfirmation(id)
    } catch (err: any) {
      const errorMessage = err.response?.status === 404
        ? "Confirmação não encontrada"
        : err.message || "Erro ao deletar confirmação"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteConfirmation, loading, error }
}

// Batch
export function useBatchConfirmation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const batchConfirmation = useCallback(async (payload: IConfirmationInput[]) => {
    try {
      setLoading(true)
      setError(null)
      return await ConfirmationService.batchConfirmation(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao criar confirmações em lote")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { batchConfirmation, loading, error }
}

// Confirmações por turma e ano
export function useConfirmationsByClassAndYear() {
  const [confirmations, setConfirmations] = useState<IConfirmation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfirmationsByClassAndYear = useCallback(async (params: IConfirmationsByClassAndYear) => {
    try {
      setLoading(true)
      setError(null)
      const data = await ConfirmationService.getConfirmationsByClassAndYear(params)
      setConfirmations(data)
      return data
    } catch (err: any) {
      setError(err.message || "Erro ao carregar confirmações por turma e ano")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { 
    confirmations, 
    loading, 
    error, 
    fetchConfirmationsByClassAndYear 
  }
}