import { ITransfer, ITransferInput, ITransferListResponse } from '@/types/transfer.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class TransferService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}/api/student-management${endpoint}`
    
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

  // Listar transferências com paginação e busca
  async getTransfers(page = 1, limit = 10, search = ""): Promise<ITransferListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    return this.request<ITransferListResponse>(`/transferencias?${params}`)
  }

  // Buscar transferência por ID
  async getTransferById(id: number): Promise<ITransfer> {
    return this.request<ITransfer>(`/transferencias/${id}`)
  }

  // Criar nova transferência
  async createTransfer(data: ITransferInput): Promise<ITransfer> {
    return this.request<ITransfer>('/transferencias', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Atualizar transferência
  async updateTransfer(id: number, data: ITransferInput): Promise<ITransfer> {
    return this.request<ITransfer>(`/transferencias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Excluir transferência
  async deleteTransfer(id: number): Promise<void> {
    return this.request<void>(`/transferencias/${id}`, {
      method: 'DELETE',
    })
  }
}

export default new TransferService()
