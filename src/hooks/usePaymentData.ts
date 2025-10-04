import { useState, useEffect } from 'react';
import api from '@/utils/api.utils';

export interface ITipoServico {
  codigo: number;
  designacao: string;
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
        { codigo: 1, designacao: 'Propina' },
        { codigo: 2, designacao: 'Confirmação de Matrícula' },
        { codigo: 3, designacao: 'Cartão de Estudante' },
        { codigo: 4, designacao: 'Certificado' },
        { codigo: 5, designacao: 'Outros Serviços' }
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
