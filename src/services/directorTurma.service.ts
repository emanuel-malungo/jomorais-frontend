import {
  IDiretorTurma,
  IDiretorTurmaInput,
  IDiretorTurmaResponse,
  IDiretorTurmaListResponse,
  IDiretorTurmaActionResponse
} from '@/types/directorTurma.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class DirectorTurmaService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
  // Listar diretores de turma com paginação
  async getDiretoresTurma(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<IDiretorTurmaListResponse> {
    let endpoint = `/api/academic-staff/diretores-turmas?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.request<IDiretorTurmaListResponse>(endpoint);
  }

  // Buscar diretor de turma por ID
  async getDiretorTurmaById(id: number): Promise<IDiretorTurmaResponse> {
    return this.request<IDiretorTurmaResponse>(`/api/academic-staff/diretores-turmas/${id}`);
  }

  // Criar diretor de turma
  async createDiretorTurma(data: IDiretorTurmaInput): Promise<IDiretorTurmaActionResponse> {
    return this.request<IDiretorTurmaActionResponse>('/api/academic-staff/diretores-turmas', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Atualizar diretor de turma
  async updateDiretorTurma(id: number, data: IDiretorTurmaInput): Promise<IDiretorTurmaActionResponse> {
    return this.request<IDiretorTurmaActionResponse>(`/api/academic-staff/diretores-turmas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Excluir diretor de turma
  async deleteDiretorTurma(id: number): Promise<IDiretorTurmaActionResponse> {
    return this.request<IDiretorTurmaActionResponse>(`/api/academic-staff/diretores-turmas/${id}`, {
      method: 'DELETE',
    });
  }
}

export const directorTurmaService = new DirectorTurmaService();
