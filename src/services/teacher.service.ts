import { toast } from "react-toastify"
import { 
  IDocente, 
  IDocenteInput, 
  IDocenteResponse, 
  IDocenteListResponse,
  IEspecialidadeResponse,
  IDisciplinaDocenteResponse
} from '@/types/teacher.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class TeacherService {
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

  // ===============================
  // DOCENTES - CRUD
  // ===============================

  // Buscar todos os docentes
  async getDocentes(page: number = 1, limit: number = 10, search?: string): Promise<IDocenteListResponse> {
    let endpoint = `/api/academic-staff/docentes?page=${page}&limit=${limit}`
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`
    }
    return this.request<IDocenteListResponse>(endpoint)
  }

  // Buscar docentes ativos
  async getDocentesAtivos(): Promise<IDocenteListResponse> {
    return this.request<IDocenteListResponse>('/api/academic-staff/docentes/ativos')
  }

  // Buscar docente por ID
  async getDocenteById(id: number): Promise<IDocenteResponse> {
    return this.request<IDocenteResponse>(`/api/academic-staff/docentes/${id}`)
  }

  // Criar docente
  async createDocente(data: IDocenteInput): Promise<IDocenteResponse> {
    try {
      const result = await this.request<IDocenteResponse>('/api/academic-staff/docentes', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success(result.message || "Docente criado com sucesso!")
      return result
    } catch (error: any) {
      toast.error(error?.message || "Erro ao criar docente")
      throw error
    }
  }

  // Atualizar docente
  async updateDocente(id: number, data: IDocenteInput): Promise<IDocenteResponse> {
    try {
      const result = await this.request<IDocenteResponse>(`/api/academic-staff/docentes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      toast.success(result.message || "Docente atualizado com sucesso!")
      return result
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar docente")
      throw error
    }
  }

  // Excluir docente
  async deleteDocente(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.request<{ success: boolean; message: string }>(`/api/academic-staff/docentes/${id}`, {
        method: 'DELETE',
      })
      toast.success(result.message || "Docente excluído com sucesso!")
      return result
    } catch (error: any) {
      toast.error(error?.message || "Erro ao excluir docente")
      throw error
    }
  }

  // ===============================
  // ESPECIALIDADES
  // ===============================

  // Buscar todas as especialidades
  async getEspecialidades(): Promise<IEspecialidadeResponse> {
    return this.request<IEspecialidadeResponse>('/api/academic-staff/especialidades')
  }

  // Buscar docentes por especialidade
  async getDocentesPorEspecialidade(especialidadeId: number): Promise<IDocenteListResponse> {
    return this.request<IDocenteListResponse>(`/api/academic-staff/especialidades/${especialidadeId}/docentes`)
  }

  // ===============================
  // DISCIPLINAS DOCENTE
  // ===============================

  // Buscar disciplinas do docente
  async getDisciplinasDocente(): Promise<IDisciplinaDocenteResponse> {
    return this.request<IDisciplinaDocenteResponse>('/api/academic-staff/disciplinas-docente')
  }

  // Criar associação disciplina-docente
  async createDisciplinaDocente(data: { codigoCurso: number; codigoDisciplina: number; codigoDocente: number }): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.request<{ success: boolean; message: string }>('/api/academic-staff/disciplinas-docente', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success(result.message || "Disciplina associada ao docente com sucesso!")
      return result
    } catch (error: any) {
      toast.error(error?.message || "Erro ao associar disciplina ao docente")
      throw error
    }
  }

  // Excluir associação disciplina-docente
  async deleteDisciplinaDocente(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.request<{ success: boolean; message: string }>(`/api/academic-staff/disciplinas-docente/${id}`, {
        method: 'DELETE',
      })
      toast.success(result.message || "Associação removida com sucesso!")
      return result
    } catch (error: any) {
      toast.error(error?.message || "Erro ao remover associação")
      throw error
    }
  }

  // ===============================
  // CONSULTAS ESPECIAIS
  // ===============================

  // Buscar turmas por docente
  async getTurmasPorDocente(docenteId: number): Promise<any> {
    return this.request<any>(`/api/academic-staff/docentes/${docenteId}/turmas`)
  }

  // Buscar docentes por turma
  async getDocentesPorTurma(turmaId: number): Promise<IDocenteListResponse> {
    return this.request<IDocenteListResponse>(`/api/academic-staff/turmas/${turmaId}/docentes`)
  }

  // Relatório acadêmico
  async getRelatorioAcademico(): Promise<any> {
    return this.request<any>('/api/academic-staff/relatorio')
  }
}

const teacherService = new TeacherService()
export default teacherService
