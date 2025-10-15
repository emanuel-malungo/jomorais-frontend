import api from "@/utils/api.utils"
import { toast } from "react-toastify"
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
    try {
      const response = await api.post("/api/student-management/matriculas", payload)
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Matrícula criada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar matrícula")
      throw new Error(apiResponse.message || "Erro ao criar matrícula")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar matrícula"
      toast.error(errorMessage)
      throw error
    }
  }

  static async getMatriculas(page = 1, limit = 10, search = ""): Promise<IMatriculaListResponse> {
    try {
      const response = await api.get("/api/student-management/matriculas", {
        params: { page, limit, search }
      })
      const apiResponse = response.data
      if (apiResponse.success) {
        return { data: apiResponse.data, pagination: apiResponse.pagination }
      }
      throw new Error(apiResponse.message || "Erro ao buscar matrículas")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao buscar matrículas"
      throw error
    }
  }

  static async getMatriculaById(id: number): Promise<IMatriculaDetailed> {
    try {
      const response = await api.get(`/api/student-management/matriculas/${id}`)
      const apiResponse = response.data
      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar matrícula")
    } catch (error: any) {
      console.error("Erro ao buscar matrícula:", error)
      throw error
    }
  }

  static async updateMatricula(id: number, payload: Partial<IMatriculaInput>): Promise<IMatricula> {
    try {
      const response = await api.put(`/api/student-management/matriculas/${id}`, payload)
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Matrícula atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar matrícula")
      throw new Error(apiResponse.message || "Erro ao atualizar matrícula")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar matrícula"
      toast.error(errorMessage)
      throw error
    }
  }

  static async deleteMatricula(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/student-management/matriculas/${id}`)
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Matrícula deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar matrícula")
        throw new Error(apiResponse.message || "Erro ao deletar matrícula")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar matrícula"
      toast.error(errorMessage)
      throw error
    }
  }

  static async batchMatricula(payload: IMatriculaInput[]): Promise<IBatchResponse<IMatricula>> {
    try {
      const response = await api.post("/api/student-management/matriculas/batch", { matriculas: payload })
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Matrículas criadas em lote com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar matrículas em lote")
      throw new Error(apiResponse.message || "Erro ao criar matrículas em lote")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar matrículas em lote"
      toast.error(errorMessage)
      console.error("Erro ao criar matrículas em lote:", error)
      throw error
    }
  }

  static async getMatriculasByAnoLectivo(params: IMatriculasByAnoLectivo): Promise<IMatricula[]> {
    try {
      const response = await api.get(`/api/student-management/matriculas/ano-lectivo/${params.codigo_AnoLectivo}`)
      const apiResponse = response.data
      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar matrículas por ano letivo")
    } catch (error: any) {
      console.error("Erro ao buscar matrículas por ano letivo:", error)
      throw error
    }
  }

  static async getMatriculasWithoutConfirmacao(): Promise<IMatriculasWithoutConfirmation[]> {
    try {
      const response = await api.get("/api/student-management/matriculas/sem-confirmacao")
      const apiResponse = response.data
      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar matrículas sem confirmação")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao buscar matrículas sem confirmação"
      throw error
    }
  }
}