import api from "@/utils/api.utils"
import { IAnoLectivo, IAnoLectivoInput, IAnoLectivoListResponse } from "@/types/anoLectivo.types"

class AnoLectivoService {
  async getAnosLectivos(page = 1, limit = 10, search = ""): Promise<IAnoLectivoListResponse> {
    const response = await api.get("/api/academic-management/anos-lectivos", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar anos letivos")
  }

  async getAnoLectivoById(id: number): Promise<IAnoLectivo> {
    const response = await api.get(`/api/academic-management/anos-lectivos/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar ano letivo")
  }

  async createAnoLectivo(payload: IAnoLectivoInput): Promise<IAnoLectivo> {
    const response = await api.post("/api/academic-management/anos-lectivos", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar ano letivo")
  }

  async updateAnoLectivo(id: number, payload: IAnoLectivoInput): Promise<IAnoLectivo> {
    const response = await api.put(`/api/academic-management/anos-lectivos/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar ano letivo")
  }

  async deleteAnoLectivo(id: number): Promise<void> {
    console.log(`Fazendo requisição DELETE para: /api/academic-management/anos-lectivos/${id}`);
    
    const response = await api.delete(`/api/academic-management/anos-lectivos/${id}`)
    console.log('Resposta da API DELETE:', response);
    
    const apiResponse = response.data
    console.log('Dados da resposta:', apiResponse);

    if (!apiResponse.success) {
      console.error('API retornou erro:', apiResponse.message);
      throw new Error(apiResponse.message || "Erro ao deletar ano letivo")
    }
    
    console.log('Ano letivo deletado com sucesso via API');
  }
}

export default new AnoLectivoService()
