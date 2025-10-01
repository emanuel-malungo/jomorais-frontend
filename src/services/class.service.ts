import api from "@/utils/api.utils"
import { IClass, IClassInput, IClassListResponse } from "@/types/class.types"

class ClassService {
  async createClass(payload: IClassInput): Promise<IClass> {
    const response = await api.post("/api/academic-management/classes", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar classe")
  }

  async getClasses(page = 1, limit = 10, search = ""): Promise<IClassListResponse> {
    const response = await api.get("/api/academic-management/classes", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar classes")
  }

  async getClassById(id: number): Promise<IClass> {
    const response = await api.get(`/api/academic-management/classes/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar classe")
  }

  async updateClass(id: number, payload: IClassInput): Promise<IClass> {
    const response = await api.put(`/api/academic-management/classes/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar classe")
  }

  async deleteClass(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/classes/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar classe")
    }
  }
}

export default new ClassService()