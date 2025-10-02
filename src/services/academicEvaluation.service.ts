import {
  ITipoAvaliacao,
  ITipoAvaliacaoInput,
  ITipoAvaliacaoResponse,
  ITipoAvaliacaoListResponse,
  ITipoNota,
  ITipoNotaInput,
  ITipoNotaResponse,
  ITipoNotaListResponse,
  ITipoNotaValor,
  ITipoNotaValorInput,
  ITipoNotaValorResponse,
  ITipoNotaValorListResponse,
  ITipoPauta,
  ITipoPautaInput,
  ITipoPautaResponse,
  ITipoPautaListResponse,
  ITrimestre,
  ITrimestreInput,
  ITrimestreResponse,
  ITrimestreListResponse,
  IAcademicEvaluationReport,
  IAcademicEvaluationReportResponse,
  IEstatisticasNotas,
  IAcademicEvaluationActionResponse,
} from '@/types/academicEvaluation.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class AcademicEvaluationService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    console.log('Fazendo requisição para:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }
  // ===============================
  // TIPOS DE AVALIAÇÃO
  // ===============================

  // Listar tipos de avaliação
  async getTiposAvaliacao(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITipoAvaliacaoListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-avaliacao?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.request<ITipoAvaliacaoListResponse>(endpoint);
  }

  // Buscar tipo de avaliação por ID
  async getTipoAvaliacaoById(id: number): Promise<ITipoAvaliacaoResponse> {
    return this.request<ITipoAvaliacaoResponse>(`/api/academic-evaluation/tipos-avaliacao/${id}`);
  }

  // Buscar tipos de avaliação por tipo
  async getTiposAvaliacaoPorTipo(tipoAvaliacao: number): Promise<ITipoAvaliacaoListResponse> {
    return this.request<ITipoAvaliacaoListResponse>(`/api/academic-evaluation/tipos-avaliacao/tipo/${tipoAvaliacao}`);
  }

  // Criar tipo de avaliação
  async createTipoAvaliacao(data: ITipoAvaliacaoInput): Promise<ITipoAvaliacaoResponse> {
    return this.request<ITipoAvaliacaoResponse>('/api/academic-evaluation/tipos-avaliacao', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Atualizar tipo de avaliação
  async updateTipoAvaliacao(id: number, data: ITipoAvaliacaoInput): Promise<ITipoAvaliacaoResponse> {
    return this.request<ITipoAvaliacaoResponse>(`/api/academic-evaluation/tipos-avaliacao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Excluir tipo de avaliação
  async deleteTipoAvaliacao(id: number): Promise<IAcademicEvaluationActionResponse> {
    return this.request<IAcademicEvaluationActionResponse>(`/api/academic-evaluation/tipos-avaliacao/${id}`, {
      method: 'DELETE',
    });
  }

  // ===============================
  // TIPOS DE NOTA
  // ===============================

  // Listar tipos de nota
  async getTiposNota(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITipoNotaListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-nota?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.request<ITipoNotaListResponse>(endpoint);
  }

  // Buscar tipo de nota por ID
  async getTipoNotaById(id: number): Promise<ITipoNotaResponse> {
    return this.request<ITipoNotaResponse>(`/api/academic-evaluation/tipos-nota/${id}`);
  }

  // Buscar tipos de nota ativos
  async getTiposNotaAtivos(): Promise<ITipoNotaListResponse> {
    return this.request<ITipoNotaListResponse>('/api/academic-evaluation/tipos-nota/ativos');
  }

  // Criar tipo de nota
  async createTipoNota(data: ITipoNotaInput): Promise<ITipoNotaResponse> {
    return this.request<ITipoNotaResponse>('/api/academic-evaluation/tipos-nota', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Atualizar tipo de nota
  async updateTipoNota(id: number, data: ITipoNotaInput): Promise<ITipoNotaResponse> {
    return this.request<ITipoNotaResponse>(`/api/academic-evaluation/tipos-nota/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Excluir tipo de nota
  async deleteTipoNota(id: number): Promise<IAcademicEvaluationActionResponse> {
    return this.request<IAcademicEvaluationActionResponse>(`/api/academic-evaluation/tipos-nota/${id}`, {
      method: 'DELETE',
    });
  }

  // ===============================
  // TIPOS DE NOTA VALOR
  // ===============================

  // Listar tipos de nota valor
  async getTiposNotaValor(
    page: number = 1,
    limit: number = 10,
    tipoNotaId?: number
  ): Promise<ITipoNotaValorListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-nota-valor?page=${page}&limit=${limit}`;
    
    if (tipoNotaId) {
      endpoint += `&tipoNotaId=${tipoNotaId}`;
    }
    
    return this.request<ITipoNotaValorListResponse>(endpoint);
  }

  // Buscar tipo de nota valor por ID
  async getTipoNotaValorById(id: number): Promise<ITipoNotaValorResponse> {
    return this.request<ITipoNotaValorResponse>(`/api/academic-evaluation/tipos-nota-valor/${id}`);
  }

  // Buscar valores por tipo de nota
  async getValoresPorTipoNota(tipoNotaId: number): Promise<ITipoNotaValorListResponse> {
    return this.request<ITipoNotaValorListResponse>(`/api/academic-evaluation/tipos-nota/${tipoNotaId}/valores`);
  }

  // ===============================
  // TIPOS DE PAUTA
  // ===============================

  // Listar tipos de pauta
  async getTiposPauta(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITipoPautaListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-pauta?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.request<ITipoPautaListResponse>(endpoint);
  }

  // Buscar tipo de pauta por ID
  async getTipoPautaById(id: number): Promise<ITipoPautaResponse> {
    return this.request<ITipoPautaResponse>(`/api/academic-evaluation/tipos-pauta/${id}`);
  }

  // ===============================
  // TRIMESTRES
  // ===============================

  // Listar trimestres
  async getTrimestres(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITrimestreListResponse> {
    let endpoint = `/api/academic-evaluation/trimestres?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.request<ITrimestreListResponse>(endpoint);
  }

  // Buscar trimestre por ID
  async getTrimestreById(id: number): Promise<ITrimestreResponse> {
    return this.request<ITrimestreResponse>(`/api/academic-evaluation/trimestres/${id}`);
  }

  // Criar trimestre
  async createTrimestre(data: ITrimestreInput): Promise<ITrimestreResponse> {
    return this.request<ITrimestreResponse>('/api/academic-evaluation/trimestres', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Atualizar trimestre
  async updateTrimestre(id: number, data: ITrimestreInput): Promise<ITrimestreResponse> {
    return this.request<ITrimestreResponse>(`/api/academic-evaluation/trimestres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Excluir trimestre
  async deleteTrimestre(id: number): Promise<IAcademicEvaluationActionResponse> {
    return this.request<IAcademicEvaluationActionResponse>(`/api/academic-evaluation/trimestres/${id}`, {
      method: 'DELETE',
    });
  }

  // ===============================
  // RELATÓRIOS E ESTATÍSTICAS
  // ===============================

  // Gerar relatório de avaliação
  async getRelatorioAvaliacao(): Promise<IAcademicEvaluationReportResponse> {
    console.log('🔍 Chamando getRelatorioAvaliacao...');
    console.log('🌐 URL base:', BASE_URL);
    console.log('📍 Endpoint completo:', `${BASE_URL}/api/academic-evaluation/relatorio`);
    
    try {
      const result = await this.request<IAcademicEvaluationReportResponse>('/api/academic-evaluation/relatorio');
      console.log('✅ Relatório carregado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao carregar relatório:', error);
      throw error;
    }
  }

  // Gerar estatísticas de notas
  async getEstatisticasNotas(): Promise<{ success: boolean; message: string; data: IEstatisticasNotas }> {
    return this.request<{ success: boolean; message: string; data: IEstatisticasNotas }>('/api/academic-evaluation/estatisticas/notas');
  }
}

const academicEvaluationService = new AcademicEvaluationService();
export default academicEvaluationService;
