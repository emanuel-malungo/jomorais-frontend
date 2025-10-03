import { useState, useEffect, useCallback } from "react"
import turmaService from "@/services/turma.service"
import { ITurma, ITurmaInput, ITurmaListResponse } from "@/types/turma.types"

// Hook para listar turmas
export const useTurmas = () => {
  const [turmas, setTurmas] = useState<ITurma[]>([])
  const [pagination, setPagination] = useState<ITurmaListResponse['pagination'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTurmas = useCallback(async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Hook useTurmas: Buscando turmas...', { page, limit, search })
      const response = await turmaService.getTurmas(page, limit, search)
      console.log('Hook useTurmas: Resposta recebida:', response)
      setTurmas(response.data)
      setPagination(response.pagination)
    } catch (error: unknown) {
      console.error('Hook useTurmas: Erro ao buscar turmas:', error)
      setError(error instanceof Error ? error.message : "Erro ao buscar turmas")
      setTurmas([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    turmas,
    pagination,
    isLoading,
    error,
    fetchTurmas,
    refetch: () => fetchTurmas()
  }
}

// Hook para buscar uma turma específica
export const useTurma = (id: number) => {
  const [turma, setTurma] = useState<ITurma | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTurma = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.getTurmaById(id)
      setTurma(response)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao buscar turma")
      setTurma(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTurma()
  }, [fetchTurma])

  return {
    turma,
    isLoading,
    error,
    refetch: fetchTurma
  }
}

// Hook para criar turma
export const useCreateTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTurma = async (data: ITurmaInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.createTurma(data)
      return response
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar turma")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createTurma,
    isLoading,
    error
  }
}

// Hook para atualizar turma
export const useUpdateTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTurma = async (id: number, data: ITurmaInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.updateTurma(id, data)
      return response
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar turma")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateTurma,
    isLoading,
    error
  }
}

// Hook para deletar turma
export const useDeleteTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTurma = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      await turmaService.deleteTurma(id)
      return true
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao deletar turma")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteTurma,
    isLoading,
    error
  }
}

// Hook personalizado para gerenciar estado local das turmas
export const useTurmaManager = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState(10)
  const [selectedTurma, setSelectedTurma] = useState<ITurma | null>(null)

  const { turmas, pagination, isLoading, error, fetchTurmas } = useTurmas()

  // Effect para carregar dados quando parâmetros mudarem
  useEffect(() => {
    fetchTurmas(currentPage, limit, searchTerm)
  }, [currentPage, limit, searchTerm, fetchTurmas])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset para primeira página ao fazer busca
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }, [])

  const refetch = useCallback(() => {
    fetchTurmas(currentPage, limit, searchTerm)
  }, [fetchTurmas, currentPage, limit, searchTerm])

  // Estatísticas básicas
  const stats = {
    total: pagination?.totalItems || 0,
    active: turmas?.filter((t: ITurma) => t.status === "Ativo").length || 0,
    inactive: turmas?.filter((t: ITurma) => t.status === "Inativo").length || 0,
  }

  return {
    // Dados
    turmas: turmas || [],
    pagination,
    stats,
    isLoading,
    error,
    
    // Estado local
    currentPage,
    searchTerm,
    limit,
    selectedTurma,
    
    // Ações
    handleSearch,
    handlePageChange,
    handleLimitChange,
    setSelectedTurma,
    refetch,
  }
}
