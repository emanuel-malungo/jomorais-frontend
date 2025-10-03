import { IInstitution, IInstitutionInput, IInstitutionResponse, IInstitutionListResponse } from '@/types/institution.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class InstitutionService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Buscar todos os dados institucionais
  async getInstitution(): Promise<IInstitutionListResponse> {
    return this.request<IInstitutionListResponse>('/api/institutional/dados-instituicao')
  }

  // Buscar dados principais da instituição (primeiro registro)
  async getInstitutionPrincipal(): Promise<IInstitutionResponse> {
    const response = await this.request<IInstitutionListResponse>('/api/institutional/dados-instituicao')
    // Retorna o primeiro registro como dados principais
    if (response.data && response.data.length > 0) {
      return {
        success: response.success,
        message: response.message,
        data: response.data[0]
      }
    }
    throw new Error('Nenhum dado institucional encontrado')
  }

  // Buscar dados institucionais por ID
  async getInstitutionById(id: number): Promise<IInstitutionResponse> {
    return this.request<IInstitutionResponse>(`/api/institutional/dados-instituicao/${id}`)
  }

  // Criar dados institucionais
  async createInstitution(data: IInstitutionInput): Promise<IInstitutionResponse> {
    return this.request<IInstitutionResponse>('/api/institutional-management/dados-instituicao', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Atualizar dados institucionais
  async updateInstitution(id: number, data: IInstitutionInput): Promise<IInstitutionResponse> {
    return this.request<IInstitutionResponse>(`/api/institutional-management/dados-instituicao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Upload de logo
  async uploadLogo(file: File): Promise<{ success: boolean; url: string }> {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await fetch(`${BASE_URL}/api/settings-management/instituicao/logo`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

const institutionService = new InstitutionService();
export default institutionService;
