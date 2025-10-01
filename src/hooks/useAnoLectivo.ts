import { useState, useEffect } from "react"
import anoLectivoService from "@/services/anoLectivo.service"
import { IAnoLectivo, IAnoLectivoInput, IAnoLectivoListResponse } from "@/types/anoLectivo.types"

// Hook para listar anos letivos
export const useAnosLectivos = () => {
  const [anosLectivos, setAnosLectivos] = useState<IAnoLectivo[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnosLectivos = async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await anoLectivoService.getAnosLectivos(page, limit, search)
      setAnosLectivos(response.data)
      setPagination(response.pagination)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar anos letivos")
      setAnosLectivos([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    anosLectivos,
    pagination,
    isLoading,
    error,
    fetchAnosLectivos,
    refetch: () => fetchAnosLectivos()
  }
}

// Hook para buscar um ano letivo específico
export const useAnoLectivo = (id: number) => {
  const [anoLectivo, setAnoLectivo] = useState<IAnoLectivo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnoLectivo = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await anoLectivoService.getAnoLectivoById(id)
      setAnoLectivo(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar ano letivo")
      setAnoLectivo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnoLectivo()
  }, [id])

  return {
    anoLectivo,
    isLoading,
    error,
    refetch: fetchAnoLectivo
  }
}
