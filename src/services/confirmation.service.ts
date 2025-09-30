import api from "@/utils/api.utils"
import { 
  IConfirmation, 
  IConfirmationInput, 
  IConfirmationListResponse,
  IConfirmationsByClassAndYear
} from "@/types/confirmation.types"

export default class ConfirmationService {
  static async createConfirmation(payload: IConfirmationInput): Promise<IConfirmation> {
    const response = await api.post("/api/student-management/confirmacoes", payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar confirmação")
  }

  static async getConfirmations(page = 1, limit = 10, search = ""): Promise<IConfirmationListResponse> {
    const response = await api.get("/api/student-management/confirmacoes", {
      params: { page, limit, search }
    })
    const apiResponse = response.data
    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar confirmações")
  }

  static async getConfirmationById(id: number): Promise<IConfirmation> {
    const response = await api.get(`/api/student-management/confirmacoes/${id}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar confirmação")
  }

  static async updateConfirmation(id: number, payload: Partial<IConfirmationInput>): Promise<IConfirmation> {
    const response = await api.put(`/api/student-management/confirmacoes/${id}`, payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar confirmação")
  }

  static async deleteConfirmation(id: number): Promise<void> {
    const response = await api.delete(`/api/student-management/confirmacoes/${id}`)
    const apiResponse = response.data
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar confirmação")
    }
  }

  static async batchConfirmation(payload: IConfirmationInput[]): Promise<IConfirmation[]> {
    const response = await api.post("/api/student-management/confirmacoes/batch", { confirmacoes: payload })
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar confirmações em lote")
  }

  static async getConfirmationsByClassAndYear(params: IConfirmationsByClassAndYear): Promise<IConfirmation[]> {
    const response = await api.get(`/api/student-management/confirmacoes/turma/${params.codigo_Turma}/ano/${params.codigo_AnoLectivo}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar confirmações por turma e ano")
  }
}