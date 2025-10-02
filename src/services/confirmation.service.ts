import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { 
  IConfirmation, 
  IConfirmationInput, 
  IConfirmationListResponse,
  IConfirmationsByClassAndYear
} from "@/types/confirmation.types"

export default class ConfirmationService {
  static async createConfirmation(payload: IConfirmationInput): Promise<IConfirmation> {
    console.log('Service: Enviando requisição POST para /api/student-management/confirmacoes')
    console.log('Service: Payload completo:', JSON.stringify(payload, null, 2))
    console.log('Service: Tipos dos campos:', {
      codigo_Matricula: typeof payload.codigo_Matricula,
      codigo_Turma: typeof payload.codigo_Turma,
      data_Confirmacao: typeof payload.data_Confirmacao,
      codigo_Ano_lectivo: typeof payload.codigo_Ano_lectivo,
      codigo_Utilizador: typeof payload.codigo_Utilizador,
      codigo_Status: typeof payload.codigo_Status,
      classificacao: typeof payload.classificacao,
      mes_Comecar: typeof payload.mes_Comecar
    })
    
    try {
      const response = await api.post("/api/student-management/confirmacoes", payload)
      console.log('Service: Resposta da API:', response.data)
      
      const apiResponse = response.data
      if (apiResponse.success) {
        console.log('Service: Confirmação criada com sucesso:', apiResponse.data)
        toast.success(apiResponse.message || "Confirmação criada com sucesso!")
        return apiResponse.data
      }
      
      console.error('Service: API retornou success=false:', apiResponse.message)
      toast.error(apiResponse.message || "Erro ao criar confirmação")
      throw new Error(apiResponse.message || "Erro ao criar confirmação")
    } catch (error: any) {
      console.error('Service: Erro na requisição:', error)
      console.error('Service: Status:', error.response?.status)
      console.error('Service: Headers da resposta:', error.response?.headers)
      console.error('Service: Data da resposta:', error.response?.data)
      console.error('Service: Config da requisição:', error.config)
      
      // Se a resposta está vazia, pode ser problema de CORS ou servidor
      if (error.response?.status === 400 && (!error.response?.data || Object.keys(error.response.data).length === 0)) {
        const errorMsg = 'Erro 400: Servidor retornou resposta vazia. Verifique se o backend está funcionando corretamente.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar confirmação";
      toast.error(errorMessage);
      throw error;
    }
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
    try {
      const response = await api.put(`/api/student-management/confirmacoes/${id}`, payload)
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Confirmação atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar confirmação")
      throw new Error(apiResponse.message || "Erro ao atualizar confirmação")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar confirmação";
      toast.error(errorMessage);
      console.error("Erro ao atualizar confirmação:", error);
      throw error;
    }
  }

  static async deleteConfirmation(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/student-management/confirmacoes/${id}`)
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Confirmação deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar confirmação")
        throw new Error(apiResponse.message || "Erro ao deletar confirmação")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar confirmação";
      toast.error(errorMessage);
      console.error("Erro ao deletar confirmação:", error);
      throw error;
    }
  }

  static async batchConfirmation(payload: IConfirmationInput[]): Promise<IConfirmation[]> {
    try {
      const response = await api.post("/api/student-management/confirmacoes/batch", { confirmacoes: payload })
      const apiResponse = response.data
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Confirmações criadas em lote com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar confirmações em lote")
      throw new Error(apiResponse.message || "Erro ao criar confirmações em lote")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar confirmações em lote";
      toast.error(errorMessage);
      console.error("Erro ao criar confirmações em lote:", error);
      throw error;
    }
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