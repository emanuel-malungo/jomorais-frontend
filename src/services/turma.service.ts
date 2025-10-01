import api from "@/utils/api.utils"
import { ITurma, ITurmaInput, ITurmaListResponse } from "@/types/turma.types"

class TurmaService {
  async createTurma(payload: ITurmaInput): Promise<ITurma> {
    const response = await api.post("/api/academic-management/turmas", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar turma")
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
    const response = await api.put(`/api/academic-management/turmas/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar turma")
  }

  async deleteTurma(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/turmas/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar turma")
    }
  }
}

export default new TurmaService()
