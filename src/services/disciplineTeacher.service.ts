import { 
  IDisciplinaDocenteResponse, 
  IDisciplinaDocenteInput, 
  IDisciplinaDocenteActionResponse 
} from '@/types/disciplineTeacher.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class DisciplineTeacherService {
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

  // Listar disciplinas do docente com paginação
  async getDisciplinasDocente(
    page: number = 1, 
    limit: number = 10, 
    search: string = ''
  ): Promise<IDisciplinaDocenteResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    return this.request<IDisciplinaDocenteResponse>(`/api/academic-staff/disciplinas-docente?${params}`);
  }

  // Buscar disciplina do docente por ID
  async getDisciplinaDocenteById(id: number): Promise<IDisciplinaDocenteActionResponse> {
    return this.request<IDisciplinaDocenteActionResponse>(`/api/academic-staff/disciplinas-docente/${id}`);
  }

  // Criar nova associação disciplina-docente
  async createDisciplinaDocente(data: IDisciplinaDocenteInput): Promise<IDisciplinaDocenteActionResponse> {
    return this.request<IDisciplinaDocenteActionResponse>('/api/academic-staff/disciplinas-docente', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Atualizar associação disciplina-docente
  async updateDisciplinaDocente(id: number, data: IDisciplinaDocenteInput): Promise<IDisciplinaDocenteActionResponse> {
    return this.request<IDisciplinaDocenteActionResponse>(`/api/academic-staff/disciplinas-docente/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Excluir associação disciplina-docente
  async deleteDisciplinaDocente(id: number): Promise<IDisciplinaDocenteActionResponse> {
    return this.request<IDisciplinaDocenteActionResponse>(`/api/academic-staff/disciplinas-docente/${id}`, {
      method: 'DELETE',
    });
  }
}

export const disciplineTeacherService = new DisciplineTeacherService();
