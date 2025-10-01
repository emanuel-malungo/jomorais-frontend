import { useState, useEffect } from "react"
import classService from "@/services/class.service"
import { IClass, IClassInput, IClassListResponse } from "@/types/class.types"

// Hook para listar classes
export const useClasses = () => {
  const [classes, setClasses] = useState<IClass[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.getClasses(page, limit, search)
      setClasses(response.data)
      setPagination(response.pagination)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar classes")
      setClasses([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    classes,
    pagination,
    isLoading,
    error,
    fetchClasses,
    refetch: () => fetchClasses()
  }
}

// Hook para buscar uma classe específica
export const useClass = (id: number) => {
  const [classItem, setClassItem] = useState<IClass | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClass = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.getClassById(id)
      setClassItem(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar classe")
      setClassItem(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClass()
  }, [id])

  return {
    classItem,
    isLoading,
    error,
    refetch: fetchClass
  }
}

// Hook para criar classe
export const useCreateClass = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createClass = async (data: IClassInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.createClass(data)
      return response
    } catch (error: any) {
      setError(error.message || "Erro ao criar classe")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createClass,
    isLoading,
    error
  }
}

// Hook para atualizar classe
export const useUpdateClass = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateClass = async (id: number, data: IClassInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.updateClass(id, data)
      return response
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar classe")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateClass,
    isLoading,
    error
  }
}

// Hook para deletar classe
export const useDeleteClass = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteClass = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      await classService.deleteClass(id)
      return true
    } catch (error: any) {
      setError(error.message || "Erro ao deletar classe")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteClass,
    isLoading,
    error
  }
}

// Hook personalizado para gerenciar estado local das classes
export const useClassManager = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState(10)
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { classes, pagination, isLoading, error, fetchClasses } = useClasses()

  // Effect para carregar dados quando parâmetros mudarem
  useEffect(() => {
    fetchClasses(currentPage, limit, searchTerm)
  }, [currentPage, limit, searchTerm])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset para primeira página ao fazer busca
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }

  const openCreateModal = () => {
    setSelectedClass(null)
    setIsModalOpen(true)
  }

  const openEditModal = (classItem: IClass) => {
    setSelectedClass(classItem)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedClass(null)
  }

  const openDeleteModal = (classItem: IClass) => {
    setSelectedClass(classItem)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedClass(null)
  }

  const refetch = () => {
    fetchClasses(currentPage, limit, searchTerm)
  }

  // Estatísticas básicas
  const stats = {
    total: pagination?.total || 0,
    active: classes?.filter((c: IClass) => c.status === 1).length || 0,
    inactive: classes?.filter((c: IClass) => c.status === 0).length || 0,
  }

  return {
    // Dados
    classes: classes || [],
    pagination,
    stats,
    isLoading,
    error,
    
    // Estado local
    currentPage,
    searchTerm,
    limit,
    selectedClass,
    isModalOpen,
    isDeleteModalOpen,
    
    // Ações
    handleSearch,
    handlePageChange,
    handleLimitChange,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    refetch,
  }
}