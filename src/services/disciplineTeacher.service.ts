import { toast } from "react-toastify"
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
    try {
      const result = await this.request<IDisciplinaDocenteActionResponse>('/api/academic-staff/disciplinas-docente', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success(result.message || "Disciplina associada ao docente com sucesso!");
      return result;
    } catch (error: any) {
      toast.error(error?.message || "Erro ao associar disciplina ao docente");
      throw error;
    }
  }

  // Atualizar associação disciplina-docente
  async updateDisciplinaDocente(id: number, data: IDisciplinaDocenteInput): Promise<IDisciplinaDocenteActionResponse> {
    try {
      const result = await this.request<IDisciplinaDocenteActionResponse>(`/api/academic-staff/disciplinas-docente/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      toast.success(result.message || "Associação atualizada com sucesso!");
      return result;
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar associação");
      throw error;
    }
  }

  // Excluir associação disciplina-docente
  async deleteDisciplinaDocente(id: number): Promise<IDisciplinaDocenteActionResponse> {
    try {
      const result = await this.request<IDisciplinaDocenteActionResponse>(`/api/academic-staff/disciplinas-docente/${id}`, {
        method: 'DELETE',
      });
      toast.success(result.message || "Associação removida com sucesso!");
      return result;
    } catch (error: any) {
      toast.error(error?.message || "Erro ao remover associação");
      throw error;
    }
  }
}

export const disciplineTeacherService = new DisciplineTeacherService();
