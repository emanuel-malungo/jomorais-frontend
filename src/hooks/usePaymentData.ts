import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api.utils';

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
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
    curso: string;
    classe: string;
    turma: string;
  };
}

// Hook para tipos de serviço
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
        setTiposServico(response.data.data);
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

  return { tiposServico, loading, error, refetch: fetchTiposServico };
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

export interface IAnoLectivo {
  codigo: number;
  designacao: string;
  mesInicial: string;
  mesFinal: string;
  anoInicial: string;
  anoFinal: string;
}

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
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar anos letivos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar anos letivos';
      setError(errorMessage);
      throw new Error(errorMessage);
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
    refetch: fetchAnosLectivos
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
