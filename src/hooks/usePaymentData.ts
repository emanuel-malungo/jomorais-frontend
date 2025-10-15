import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api.utils';

export interface IAnoLectivo {
  codigo: number;
  designacao: string;
  mesInicial: string;
  mesFinal: string;
  anoInicial: string;
  anoFinal: string;
}

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
  anoLetivo?: string; // Ano letivo extraído da string
  anoInicial?: number; // Ano inicial extraído
  anoFinal?: number; // Ano final extraído
}

export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IAluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  dadosAcademicos?: {
    classe: string;
    turma: string;
  };
}

// Função para extrair ano letivo da string do tipo de serviço
export const extractAnoLetivoFromString = (designacao: string): { anoLetivo?: string; anoInicial?: number; anoFinal?: number } => {
  // Padrões para diferentes formatos de ano letivo
  const patterns = [
    /(\d{4}\/\d{4})/g,           // 2024/2025
    /(\d{4}-\d{4})/g,           // 2024-2025
    /(\d{2}\/\d{2})/g,          // 22/23
    /(\d{4}\/\d{2})/g,          // 2024/25
  ];

  for (const pattern of patterns) {
    const match = designacao.match(pattern);
    if (match) {
      const anoLetivo = match[0];
      let anoInicial: number;
      let anoFinal: number;

      if (anoLetivo.includes('/')) {
        const [inicio, fim] = anoLetivo.split('/');
        if (inicio.length === 2) {
          // Formato 22/23 - assumir 20xx
          anoInicial = 2000 + parseInt(inicio);
          anoFinal = 2000 + parseInt(fim);
        } else if (fim.length === 2) {
          // Formato 2024/25
          anoInicial = parseInt(inicio);
          anoFinal = parseInt(inicio.substring(0, 2) + fim);
        } else {
          // Formato 2024/2025
          anoInicial = parseInt(inicio);
          anoFinal = parseInt(fim);
        }
      } else {
        // Formato com hífen 2024-2025
        const [inicio, fim] = anoLetivo.split('-');
        anoInicial = parseInt(inicio);
        anoFinal = parseInt(fim);
      }

      return {
        anoLetivo,
        anoInicial,
        anoFinal
      };
    }
  }

  return {};
};

// Função para verificar se um tipo de serviço corresponde a um ano letivo
export const matchesAnoLetivo = (tipoServico: ITipoServico, anoLectivoSelecionado: IAnoLectivo): boolean => {
  const { anoInicial: tipoAnoInicial, anoFinal: tipoAnoFinal } = tipoServico;
  
  if (!tipoAnoInicial || !tipoAnoFinal) {
    // Se não tem ano na string, é considerado compatível (serviço genérico)
    return true;
  }

  const anoLectivoInicial = parseInt(anoLectivoSelecionado.anoInicial);
  const anoLectivoFinal = parseInt(anoLectivoSelecionado.anoFinal);

  return tipoAnoInicial === anoLectivoInicial && tipoAnoFinal === anoLectivoFinal;
};

// Função para encontrar o ano letivo mais atual
export const findMostRecentAnoLetivo = (anosLectivos: IAnoLectivo[]): IAnoLectivo | null => {
  if (anosLectivos.length === 0) return null;
  
  return anosLectivos.reduce((latest, current) => {
    const latestYear = parseInt(latest.anoInicial);
    const currentYear = parseInt(current.anoInicial);
    return currentYear > latestYear ? current : latest;
  });
};

// Função para encontrar automaticamente o melhor tipo de serviço para um aluno e ano letivo
export const findBestTipoServicoForAluno = (
  tiposServico: ITipoServico[], 
  anoLectivoSelecionado: IAnoLectivo | null,
  tipoServicoTurma?: ITipoServico | null
): ITipoServico | null => {
  if (tiposServico.length === 0) return null;

  // 1. Primeiro, tentar encontrar tipos específicos para o ano letivo selecionado
  if (anoLectivoSelecionado) {
    const tiposEspecificos = tiposServico.filter(tipo => 
      matchesAnoLetivo(tipo, anoLectivoSelecionado)
    );

    if (tiposEspecificos.length > 0) {
      // Priorizar propinas (que geralmente contêm "PROPINA" no nome)
      const propinas = tiposEspecificos.filter(tipo => 
        tipo.designacao.toUpperCase().includes('PROPINA')
      );
      
      if (propinas.length > 0) {
        // Retornar a propina com maior preço (geralmente mais específica/atual)
        return propinas.reduce((best, current) => 
          current.preco > best.preco ? current : best
        );
      }
      
      // Se não há propinas, retornar o primeiro tipo específico
      return tiposEspecificos[0];
    }
  }

  // 2. Se não encontrou tipos específicos, usar o tipo de serviço da turma
  if (tipoServicoTurma) {
    return tipoServicoTurma;
  }

  // 3. Como último recurso, buscar o tipo mais atual disponível
  const tiposComAno = tiposServico.filter(tipo => tipo.anoInicial && tipo.anoFinal);
  if (tiposComAno.length > 0) {
    // Encontrar o tipo com ano mais recente
    const tipoMaisAtual = tiposComAno.reduce((latest, current) => {
      const latestYear = latest.anoInicial || 0;
      const currentYear = current.anoInicial || 0;
      return currentYear > latestYear ? current : latest;
    });
    return tipoMaisAtual;
  }

  // 4. Se nada mais funcionar, retornar tipos genéricos (sem ano)
  const tiposGenericos = tiposServico.filter(tipo => !tipo.anoInicial && !tipo.anoFinal);
  if (tiposGenericos.length > 0) {
    // Priorizar propinas genéricas
    const propinasGenericas = tiposGenericos.filter(tipo => 
      tipo.designacao.toUpperCase().includes('PROPINA')
    );
    return propinasGenericas.length > 0 ? propinasGenericas[0] : tiposGenericos[0];
  }

  return null;
};

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
  anoLetivo?: string; // Ano letivo extraído da string
  anoInicial?: number; // Ano inicial extraído
  anoFinal?: number; // Ano final extraído
}

export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IAluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  dadosAcademicos?: {
    classe: string;
    turma: string;
  };
}

// Hook para buscar tipos de serviço
export const useTiposServico = () => {
  const [tiposServico, setTiposServico] = useState<ITipoServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposServico = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/tipos-servico');
      if (response.data.success) {
        // Processar tipos de serviço para extrair informações de ano letivo
        const processedTiposServico = response.data.data.map((tipo: ITipoServico) => {
          const anoInfo = extractAnoLetivoFromString(tipo.designacao);
          return {
            ...tipo,
            ...anoInfo
          };
        });
        setTiposServico(processedTiposServico);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipos de serviço');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipos de serviço';
      setError(errorMessage);
      // Dados mockados como fallback
      setTiposServico([
        { codigo: 1, designacao: 'Propina', preco: 15000 },
        { codigo: 2, designacao: 'Confirmação de Matrícula', preco: 5000 },
        { codigo: 3, designacao: 'Cartão de Estudante', preco: 2000 },
        { codigo: 4, designacao: 'Certificado', preco: 3000 },
        { codigo: 5, designacao: 'Outros Serviços', preco: 1000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposServico();
  }, []);

  return {
    tiposServico,
    loading,
    error,
    fetchTiposServico
  };
};

// Hook para filtrar tipos de serviço por ano letivo
export const useTiposServicoFiltrados = (anoLectivoSelecionado: IAnoLectivo | null) => {
  const { tiposServico, loading, error, fetchTiposServico } = useTiposServico();
  const [tiposServicoFiltrados, setTiposServicoFiltrados] = useState<ITipoServico[]>([]);

  useEffect(() => {
    if (!anoLectivoSelecionado) {
      // Se não há ano letivo selecionado, mostrar todos
      setTiposServicoFiltrados(tiposServico);
      return;
    }

    // Filtrar tipos de serviço que correspondem ao ano letivo selecionado
    const tiposFiltrados = tiposServico.filter((tipo: ITipoServico) => {
      return matchesAnoLetivo(tipo, anoLectivoSelecionado);
    });

    // Se não encontrou tipos específicos para o ano, incluir tipos genéricos (sem ano na string)
    const tiposGenericos = tiposServico.filter((tipo: ITipoServico) => !tipo.anoInicial && !tipo.anoFinal);
    
    // Combinar tipos específicos com genéricos, priorizando específicos
    const tiposFinais = tiposFiltrados.length > 0 ? tiposFiltrados : [...tiposFiltrados, ...tiposGenericos];
    
    setTiposServicoFiltrados(tiposFinais);
  }, [tiposServico, anoLectivoSelecionado]);

  return {
    tiposServico: tiposServicoFiltrados,
    loading,
    error,
    fetchTiposServico
  };
};

// Hook para formas de pagamento
export const useFormasPagamento = () => {
  const [formasPagamento, setFormasPagamento] = useState<IFormaPagamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormasPagamento = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/formas-pagamento');
      if (response.data.success) {
        setFormasPagamento(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar formas de pagamento');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar formas de pagamento';
      setError(errorMessage);
      // Dados mockados como fallback
      setFormasPagamento([
        { codigo: 1, designacao: 'Dinheiro' },
        { codigo: 2, designacao: 'Transferência Bancária' },
        { codigo: 3, designacao: 'Multicaixa' },
        { codigo: 4, designacao: 'Cheque' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormasPagamento();
  }, []);

  return { formasPagamento, loading, error, refetch: fetchFormasPagamento };
};

// Hook para buscar alunos (para o select de alunos)
export const useAlunosSearch = () => {
  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAlunos = async (search: string = '', limit: number = 50) => {
    if (!search.trim()) {
      setAlunos([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        limit: limit.toString(),
        page: '1'
      });

      const response = await api.get(`/api/payment-management/alunos-confirmados?${params}`);
      if (response.data.success) {
        setAlunos(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar alunos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar alunos';
      setError(errorMessage);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAlunos = () => {
    setAlunos([]);
    setError(null);
  };

  return { 
    alunos, 
    loading, 
    error, 
    searchAlunos,
    clearAlunos
  };
};

// Constantes úteis
export const MESES_ANO_LECTIVO = [
  'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'
];

export const MESES_OPTIONS = MESES_ANO_LECTIVO.map(mes => ({
  value: mes,
  label: mes.charAt(0) + mes.slice(1).toLowerCase()
}));

export const ANOS_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i - 5;
  return { value: year, label: year.toString() };
});

// Hook para buscar dados completos do aluno
export const useAlunoCompleto = () => {
  const [aluno, setAluno] = useState<IAluno | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunoCompleto = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/completo`);
      if (response.data.success) {
        setAluno(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados do aluno');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados do aluno';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearAluno = () => {
    setAluno(null);
    setError(null);
  };

  return {
    aluno,
    loading,
    error,
    fetchAlunoCompleto,
    clearAluno
  };
};

// Hook para buscar tipo de serviço específico da turma do aluno
export const useTipoServicoTurmaAluno = () => {
  const [tipoServico, setTipoServico] = useState<ITipoServico | null>(null);
  const [dadosAluno, setDadosAluno] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoServicoTurma = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/tipo-servico-turma`);
      if (response.data.success) {
        setTipoServico(response.data.data);
        setDadosAluno(null); // Não há dados do aluno nesta resposta
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipo de serviço da turma');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipo de serviço da turma';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearTipoServico = () => {
    setTipoServico(null);
    setDadosAluno(null);
    setError(null);
  };

  return {
    tipoServico,
    dadosAluno,
    loading,
    error,
    fetchTipoServicoTurma,
    clearTipoServico
  };
};

// Hook para buscar meses pendentes do aluno
export const useMesesPendentesAluno = () => {
  const [mesesPendentes, setMesesPendentes] = useState<string[]>([]);
  const [mesesPagos, setMesesPagos] = useState<string[]>([]);
  const [proximoMes, setProximoMes] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMesesPendentes = async (alunoId: number, codigoAnoLectivo?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = codigoAnoLectivo ? `?codigoAnoLectivo=${codigoAnoLectivo}` : '';
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/meses-pendentes${params}`);
      if (response.data.success) {
        const data = response.data.data;
        setMesesPendentes(data.mesesPendentes || []);
        setMesesPagos(data.mesesPagos || []);
        setProximoMes(data.proximoMes || null);
        setMensagem(data.mensagem || null);
        
        return data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar meses pendentes');
      }
    } catch (err: any) {
      // Se for erro 400, pode ser que o aluno não esteja matriculado no ano
      if (err.response?.status === 400) {
        console.log('Aluno não encontrado no ano letivo especificado');
        setMesesPendentes([]);
        setMesesPagos([]);
        setProximoMes(null);
        return {
          mesesPendentes: [],
          mesesPagos: [],
          totalMeses: 0,
          mesesPagosCount: 0,
          mesesPendentesCount: 0,
          proximoMes: null,
          dividasAnteriores: [],
          temDividas: false,
          mensagem: 'Aluno não encontrado no ano letivo especificado'
        };
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar meses pendentes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearMesesPendentes = useCallback(() => {
    setMesesPendentes([]);
    setMesesPagos([]);
    setProximoMes(null);
    setMensagem(null);
    setLoading(false);
    setError(null);
  }, []);

  const refreshMesesPendentes = useCallback(async (alunoId: number, codigoAnoLectivo?: number) => {
    // Força uma nova busca limpando o cache primeiro
    clearMesesPendentes();
    await fetchMesesPendentes(alunoId, codigoAnoLectivo);
  }, [fetchMesesPendentes, clearMesesPendentes]);

  return {
    mesesPendentes,
    mesesPagos,
    proximoMes,
    mensagem,
    loading,
    error,
    fetchMesesPendentes,
    clearMesesPendentes,
    refreshMesesPendentes
  };
};

// Hook para buscar anos letivos
export const useAnosLectivos = () => {
  const [anosLectivos, setAnosLectivos] = useState<IAnoLectivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnosLectivos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/anos-lectivos');
      if (response.data.success) {
        setAnosLectivos(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar anos letivos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar anos letivos';
      setError(errorMessage);
      // Dados mockados como fallback
      setAnosLectivos([
        { codigo: 1, designacao: '2024/2025', anoInicial: '2024', anoFinal: '2025', mesInicial: 'SETEMBRO', mesFinal: 'JULHO' },
        { codigo: 2, designacao: '2025/2026', anoInicial: '2025', anoFinal: '2026', mesInicial: 'SETEMBRO', mesFinal: 'JULHO' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnosLectivos();
  }, []);

  return {
    anosLectivos,
    loading,
    error,
    fetchAnosLectivos
  };
};

// Hook para buscar propina específica da classe do aluno no ano letivo
export const usePropinaClasse = () => {
  const [propinaClasse, setPropinaClasse] = useState<ITipoServico | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPropinaClasse = async (alunoId: number, anoLectivoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/propina-classe/${anoLectivoId}`);
      if (response.data.success) {
        setPropinaClasse(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar propina da classe');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar propina da classe';
      setError(errorMessage);
      setPropinaClasse(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearPropinaClasse = () => {
    setPropinaClasse(null);
    setError(null);
  };

  return {
    propinaClasse,
    loading,
    error,
    fetchPropinaClasse,
    clearPropinaClasse
  };
};

// Hook para validar número de borderô
export const useValidateBordero = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateBordero = async (bordero: string, excludeId?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = excludeId ? `?excludeId=${excludeId}` : '';
      const response = await api.post(`/api/payment-management/validate-bordero${params}`, {
        bordero
      });
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Número de borderô inválido');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao validar borderô';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    validateBordero,
    loading,
    error
  };
};
