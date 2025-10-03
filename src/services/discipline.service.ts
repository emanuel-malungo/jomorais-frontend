import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { IDiscipline, IDisciplineInput, IDisciplineListResponse } from "@/types/discipline.types"

class DisciplineService {
  async createDiscipline(payload: IDisciplineInput): Promise<IDiscipline> {
    try {
      const response = await api.post("/api/academic-management/disciplinas", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Disciplina criada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar disciplina")
      throw new Error(apiResponse.message || "Erro ao criar disciplina")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar disciplina"
      toast.error(errorMessage)
      console.error("Erro ao criar disciplina:", error)
      throw error
    }
  }

  async getDisciplines(page = 1, limit = 10, search = ""): Promise<IDisciplineListResponse> {
    try {
      const response = await api.get("/api/academic-management/disciplinas", {
        params: { page, limit, search }
      })
      const apiResponse = response.data

      if (apiResponse.success) {
        return { data: apiResponse.data, pagination: apiResponse.pagination }
      }
      throw new Error(apiResponse.message || "Erro ao buscar disciplinas")
    } catch (error: any) {
      console.error("Erro ao buscar disciplinas:", error)
      throw error
    }
  }

  async getDisciplineById(id: number): Promise<IDiscipline> {
    try {
      const response = await api.get(`/api/academic-management/disciplinas/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar disciplina")
    } catch (error: any) {
      console.error("Erro ao buscar disciplina:", error)
      throw error
    }
  }

  async updateDiscipline(id: number, payload: IDisciplineInput): Promise<IDiscipline> {
    try {
      const response = await api.put(`/api/academic-management/disciplinas/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Disciplina atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar disciplina")
      throw new Error(apiResponse.message || "Erro ao atualizar disciplina")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar disciplina"
      toast.error(errorMessage)
      console.error("Erro ao atualizar disciplina:", error)
      throw error
    }
  }

  async deleteDiscipline(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/academic-management/disciplinas/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Disciplina deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar disciplina")
        throw new Error(apiResponse.message || "Erro ao deletar disciplina")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar disciplina"
      toast.error(errorMessage)
      console.error("Erro ao deletar disciplina:", error)
      throw error
    }
  }
}

const disciplineService = new DisciplineService();
export default disciplineService;
