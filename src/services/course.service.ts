import api from "@/utils/api.utils"
import { ICourse, ICourseInput, ICourseListResponse } from "@/types/course.types"

export default class CourseService {
  static async createCourse(payload: ICourseInput): Promise<ICourse> {
    const response = await api.post("/api/academic-management/cursos", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar curso")
  }

  static async getCourses(page = 1, limit = 10, search = ""): Promise<ICourseListResponse> {
    const response = await api.get("/api/academic-management/cursos", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar cursos")
  }

  static async getCourseById(id: number): Promise<ICourse> {
    const response = await api.get(`/api/academic-management/cursos/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar curso")
  }

  static async updateCourse(id: number, payload: ICourseInput): Promise<ICourse> {
    const response = await api.put(`/api/academic-management/cursos/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar curso")
  }

  static async deleteCourse(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/cursos/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar curso")
    }
  }
}
