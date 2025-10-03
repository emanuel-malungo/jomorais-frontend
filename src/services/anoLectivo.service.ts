import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { IAnoLectivo, IAnoLectivoInput, IAnoLectivoListResponse } from "@/types/anoLectivo.types"

class AnoLectivoService {
  async getAnosLectivos(page = 1, limit = 10, search = ""): Promise<IAnoLectivoListResponse> {
    try {
      const response = await api.get("/api/academic-management/anos-lectivos", {
        params: { page, limit, search }
      })
      const apiResponse = response.data

      if (apiResponse.success) {
        return { data: apiResponse.data, pagination: apiResponse.pagination }
      }
      throw new Error(apiResponse.message || "Erro ao buscar anos letivos")
    } catch (error: any) {
      console.error("Erro ao buscar anos letivos:", error)
      throw error
    }
  }

  async getAnoLectivoById(id: number): Promise<IAnoLectivo> {
    try {
      const response = await api.get(`/api/academic-management/anos-lectivos/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar ano letivo")
    } catch (error: any) {
      console.error("Erro ao buscar ano letivo:", error)
      throw error
    }
  }

  async createAnoLectivo(payload: IAnoLectivoInput): Promise<IAnoLectivo> {
    try {
      const response = await api.post("/api/academic-management/anos-lectivos", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Ano letivo criado com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar ano letivo")
      throw new Error(apiResponse.message || "Erro ao criar ano letivo")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar ano letivo"
      toast.error(errorMessage)
      console.error("Erro ao criar ano letivo:", error)
      throw error
    }
  }

  async updateAnoLectivo(id: number, payload: IAnoLectivoInput): Promise<IAnoLectivo> {
    try {
      const response = await api.put(`/api/academic-management/anos-lectivos/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Ano letivo atualizado com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar ano letivo")
      throw new Error(apiResponse.message || "Erro ao atualizar ano letivo")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar ano letivo"
      toast.error(errorMessage)
      console.error("Erro ao atualizar ano letivo:", error)
      throw error
    }
  }

  async deleteAnoLectivo(id: number): Promise<void> {
    try {
      console.log(`Fazendo requisição DELETE para: /api/academic-management/anos-lectivos/${id}`);
      
      const response = await api.delete(`/api/academic-management/anos-lectivos/${id}`)
      console.log('Resposta da API DELETE:', response);
      
      const apiResponse = response.data
      console.log('Dados da resposta:', apiResponse);

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Ano letivo deletado com sucesso!")
        console.log('Ano letivo deletado com sucesso via API');
      } else {
        console.error('API retornou erro:', apiResponse.message);
        toast.error(apiResponse.message || "Erro ao deletar ano letivo")
        throw new Error(apiResponse.message || "Erro ao deletar ano letivo")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar ano letivo"
      toast.error(errorMessage)
      console.error("Erro ao deletar ano letivo:", error)
      throw error
    }
  }
}

const anoLectivoService = new AnoLectivoService();
export default anoLectivoService;
