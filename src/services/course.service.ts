import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { ICourse, ICourseInput, ICourseListResponse } from "@/types/course.types"

export default class CourseService {
  static async createCourse(payload: ICourseInput): Promise<ICourse> {
    try {
      const response = await api.post("/api/academic-management/cursos", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Curso criado com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar curso")
      throw new Error(apiResponse.message || "Erro ao criar curso")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar curso"
      toast.error(errorMessage)
      console.error("Erro ao criar curso:", error)
      throw error
    }
  }

  static async getCourses(page = 1, limit = 10, search = ""): Promise<ICourseListResponse> {
    try {
      const response = await api.get("/api/academic-management/cursos", {
        params: { page, limit, search }
      })
      const apiResponse = response.data

      if (apiResponse.success) {
        return { data: apiResponse.data, pagination: apiResponse.pagination }
      }
      throw new Error(apiResponse.message || "Erro ao buscar cursos")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao buscar cursos"
      console.error("Erro ao buscar cursos:", error)
      throw error
    }
  }

  static async getCourseById(id: number): Promise<ICourse> {
    try {
      const response = await api.get(`/api/academic-management/cursos/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar curso")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao buscar curso"
      console.error("Erro ao buscar curso:", error)
      throw error
    }
  }

  static async updateCourse(id: number, payload: ICourseInput): Promise<ICourse> {
    try {
      const response = await api.put(`/api/academic-management/cursos/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Curso atualizado com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar curso")
      throw new Error(apiResponse.message || "Erro ao atualizar curso")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar curso"
      toast.error(errorMessage)
      console.error("Erro ao atualizar curso:", error)
      throw error
    }
  }

  static async deleteCourse(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/academic-management/cursos/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Curso deletado com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar curso")
        throw new Error(apiResponse.message || "Erro ao deletar curso")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar curso"
      toast.error(errorMessage)
      console.error("Erro ao deletar curso:", error)
      throw error
    }
  }
}
