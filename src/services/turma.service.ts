import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { ITurma, ITurmaInput, ITurmaListResponse } from "@/types/turma.types"

class TurmaService {
  async createTurma(payload: ITurmaInput): Promise<ITurma> {
    try {
      const response = await api.post("/api/academic-management/turmas", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Turma criada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar turma")
      throw new Error(apiResponse.message || "Erro ao criar turma")
    } catch (error: any) {
      let errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar turma"
      
      // Verificar se é erro específico de sala já usada
      if (errorMessage.toLowerCase().includes('sala') && 
          (errorMessage.toLowerCase().includes('já') || 
           errorMessage.toLowerCase().includes('atribuída') ||
           errorMessage.toLowerCase().includes('ocupada') ||
           errorMessage.toLowerCase().includes('conflito'))) {
        errorMessage = "Sala já atribuída para outro horário. Por favor, escolha uma sala diferente ou verifique os horários disponíveis."
      }
      
      toast.error(errorMessage)
      console.error("Erro ao criar turma:", error)
      throw new Error(errorMessage)
    }
  }

  async getAllTurmas(search = ""): Promise<ITurmaListResponse> {
    console.log('TurmaService: Fazendo requisição para TODAS as turmas...', { search })
    const response = await api.get("/api/academic-management/turmas", {
      params: { page: 1, limit: 1000, search } // Buscar até 1000 registros
    })
    console.log('TurmaService: Resposta da API (todas):', response.data)
    const apiResponse = response.data

    if (apiResponse.success) {
      console.log('TurmaService: Dados de todas as turmas:', apiResponse.data)
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar todas as turmas")
  }

  async getTurmas(page = 1, limit = 10, search = ""): Promise<ITurmaListResponse> {
    console.log('TurmaService: Fazendo requisição para turmas...', { page, limit, search })
    const response = await api.get("/api/academic-management/turmas", {
      params: { page, limit, search }
    })
    console.log('TurmaService: Resposta da API:', response.data)
    const apiResponse = response.data

    if (apiResponse.success) {
      console.log('TurmaService: Dados das turmas:', apiResponse.data)
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar turmas")
  }

  async getTurmaById(id: number): Promise<ITurma> {
    const response = await api.get(`/api/academic-management/turmas/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar turma")
  }

  async updateTurma(id: number, payload: ITurmaInput): Promise<ITurma> {
    try {
      const response = await api.put(`/api/academic-management/turmas/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Turma atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar turma")
      throw new Error(apiResponse.message || "Erro ao atualizar turma")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar turma"
      toast.error(errorMessage)
      console.error("Erro ao atualizar turma:", error)
      throw error
    }
  }

  async deleteTurma(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/academic-management/turmas/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Turma deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar turma")
        throw new Error(apiResponse.message || "Erro ao deletar turma")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar turma"
      toast.error(errorMessage)
      console.error("Erro ao deletar turma:", error)
      throw error
    }
  }
}

const turmaService = new TurmaService();
export default turmaService;
