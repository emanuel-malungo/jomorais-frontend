import { useState, useEffect } from "react"
import salaService from "@/services/sala.service"
import { ISala, ISalaInput, ISalaListResponse } from "@/types/sala.types"

// Hook para listar salas
export const useSalas = () => {
  const [salas, setSalas] = useState<ISala[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSalas = async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await salaService.getSalas(page, limit, search)
      setSalas(response.data)
      setPagination(response.pagination)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar salas")
      setSalas([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    salas,
    pagination,
    isLoading,
    error,
    fetchSalas,
    refetch: () => fetchSalas()
  }
}

// Hook para buscar uma sala específica
export const useSala = (id: number) => {
  const [sala, setSala] = useState<ISala | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSala = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await salaService.getSalaById(id)
      setSala(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar sala")
      setSala(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSala()
  }, [id])

  return {
    sala,
    isLoading,
    error,
    refetch: fetchSala
  }
}
