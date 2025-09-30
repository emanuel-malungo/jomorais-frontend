import api from "@/utils/api.utils"
import { 
  IMatricula, 
  IMatriculaInput, 
  IMatriculaListResponse,
  IMatriculaDetailed,
  IMatriculasByAnoLectivo,
  IMatriculasWithoutConfirmation,
  IBatchResponse
} from "@/types/matricula.types"

export default class MatriculaService {
  static async createMatricula(payload: IMatriculaInput): Promise<IMatricula> {
    const response = await api.post("/api/student-management/matriculas", payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar matrícula")
  }

  static async getMatriculas(page = 1, limit = 10, search = ""): Promise<IMatriculaListResponse> {
    const response = await api.get("/api/student-management/matriculas", {
      params: { page, limit, search }
    })
    const apiResponse = response.data
    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar matrículas")
  }

  static async getMatriculaById(id: number): Promise<IMatriculaDetailed> {
    const response = await api.get(`/api/student-management/matriculas/${id}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar matrícula")
  }

  static async updateMatricula(id: number, payload: Partial<IMatriculaInput>): Promise<IMatricula> {
    const response = await api.put(`/api/student-management/matriculas/${id}`, payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar matrícula")
  }

  static async deleteMatricula(id: number): Promise<void> {
    const response = await api.delete(`/api/student-management/matriculas/${id}`)
    const apiResponse = response.data
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar matrícula")
    }
  }

  static async batchMatricula(payload: IMatriculaInput[]): Promise<IBatchResponse<IMatricula>> {
    const response = await api.post("/api/student-management/matriculas/batch", { matriculas: payload })
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar matrículas em lote")
  }

  static async getMatriculasByAnoLectivo(params: IMatriculasByAnoLectivo): Promise<IMatricula[]> {
    const response = await api.get(`/api/student-management/matriculas/ano-lectivo/${params.codigo_AnoLectivo}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar matrículas por ano letivo")
  }

  static async getMatriculasWithoutConfirmacao(): Promise<IMatriculasWithoutConfirmation[]> {
    const response = await api.get("/api/student-management/matriculas/sem-confirmacao")
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar matrículas sem confirmação")
  }
}