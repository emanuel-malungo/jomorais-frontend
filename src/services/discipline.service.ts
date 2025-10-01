import api from "@/utils/api.utils"
import { IDiscipline, IDisciplineInput, IDisciplineListResponse } from "@/types/discipline.types"

class DisciplineService {
  async createDiscipline(payload: IDisciplineInput): Promise<IDiscipline> {
    const response = await api.post("/api/academic-management/disciplinas", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar disciplina")
  }

  async getDisciplines(page = 1, limit = 10, search = ""): Promise<IDisciplineListResponse> {
    const response = await api.get("/api/academic-management/disciplinas", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar disciplinas")
  }

  async getDisciplineById(id: number): Promise<IDiscipline> {
    const response = await api.get(`/api/academic-management/disciplinas/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar disciplina")
  }

  async updateDiscipline(id: number, payload: IDisciplineInput): Promise<IDiscipline> {
    const response = await api.put(`/api/academic-management/disciplinas/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar disciplina")
  }

  async deleteDiscipline(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/disciplinas/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar disciplina")
    }
  }
}

export default new DisciplineService()
