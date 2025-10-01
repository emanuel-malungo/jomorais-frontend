import api from "@/utils/api.utils"
import { ISala, ISalaInput, ISalaListResponse } from "@/types/sala.types"

class SalaService {
  async getSalas(page = 1, limit = 10, search = ""): Promise<ISalaListResponse> {
    const response = await api.get("/api/academic-management/salas", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar salas")
  }

  async getSalaById(id: number): Promise<ISala> {
    const response = await api.get(`/api/academic-management/salas/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar sala")
  }

  async createSala(payload: ISalaInput): Promise<ISala> {
    const response = await api.post("/api/academic-management/salas", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar sala")
  }

  async updateSala(id: number, payload: ISalaInput): Promise<ISala> {
    const response = await api.put(`/api/academic-management/salas/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar sala")
  }

  async deleteSala(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/salas/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar sala")
    }
  }
}

export default new SalaService()
