import { useState } from 'react';
import { ThermalInvoiceService } from '@/services/thermalInvoiceService';
import { ThermalInvoiceData } from '@/components/ThermalInvoice';
import api from '@/utils/api.utils';

export interface IPayment {
  codigo: number;
  codigo_Aluno: number;
  thermalInvoice?: ThermalInvoiceData;
  codigo_Tipo_Servico: number;
  data: string;
  mes: string;
  ano: number;
  preco: number;
  observacao: string;
  fatura: string;
  aluno?: {
    codigo: number;
    nome: string;
    n_documento_identificacao: string;
  };
  tipoServico?: {
    codigo: number;
    designacao: string;
  };
}

export interface ICreatePaymentData {
  codigo_Aluno: number;
  codigo_Tipo_Servico: number;
  mes: string;
  ano: number;
  preco: number;
  observacao?: string;
  codigo_FormaPagamento?: number;
}

export interface IStudentConfirmed {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  tb_matriculas: Array<{
    tb_cursos: {
      codigo: number;
      designacao: string;
    };
    tb_confirmacoes: Array<{
      tb_turmas: {
        codigo: number;
        designacao: string;
        tb_classes: {
          designacao: string;
        };
      };
    }>;
  }>;
}

export interface IStudentFinancialData {
  aluno: {
    codigo: number;
    nome: string;
    documento: string;
    email: string;
    telefone: string;
    curso: string;
    turma: string;
    classe: string;
  };
  mesesPropina: Array<{
    mes: string;
    status: 'PAGO' | 'NÃO_PAGO';
    valor: number;
    dataPagamento: string | null;
    codigoPagamento: number | null;
  }>;
  historicoFinanceiro: Array<{
    codigo: number;
    data: string;
    servico: string;
    valor: number;
    observacao: string;
    fatura: string;
  }>;
  resumo: {
    totalMeses: number;
    mesesPagos: number;
    mesesPendentes: number;
    valorMensal: number;
    totalPago: number;
    totalPendente: number;
  };
}

// Hook para criar pagamento
export const useCreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (data: ICreatePaymentData): Promise<IPayment> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/payment-management/pagamentos', data);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao criar pagamento');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading, error };
};

// Hook para listar alunos confirmados
export const useStudentsConfirmed = () => {
  const [students, setStudents] = useState<IStudentConfirmed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchStudents = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    turma?: number,
    curso?: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (turma) params.append('turma', turma.toString());
      if (curso) params.append('curso', curso.toString());

      console.log('Fazendo requisição para:', `/api/payment-management/alunos-confirmados?${params}`);
      const response = await api.get(`/api/payment-management/alunos-confirmados?${params}`);
      
      if (response.data.success) {
        console.log('Alunos recebidos:', response.data.data.length);
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar alunos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar alunos';
      console.error('Erro ao buscar alunos:', errorMessage);
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return { 
    students, 
    loading, 
    error, 
    pagination, 
    fetchStudents 
  };
};

// Hook para dados financeiros do aluno
export const useStudentFinancialData = () => {
  const [data, setData] = useState<IStudentFinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = async (studentId: number, anoLectivo?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = anoLectivo ? `?ano_lectivo=${anoLectivo}` : '';
      const response = await api.get(`/api/payment-management/aluno/${studentId}/financeiro${params}`);
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados financeiros');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados financeiros';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    fetchFinancialData,
    clearData: () => setData(null)
  };
};

// Hook para gerar fatura PDF
export const useGenerateInvoicePDF = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (paymentId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/pagamento/${paymentId}/fatura`, {
        responseType: 'blob'
      });
      
      // Criar URL do blob e fazer download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fatura_${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao gerar PDF';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { generatePDF, loading, error };
};

// Hook para listar todos os pagamentos processados
export const usePaymentsList = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchPayments = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    tipoServico?: string,
    dataInicio?: string,
    dataFim?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (tipoServico) params.append('tipo_servico', tipoServico);
      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);

      const response = await api.get(`/api/payment-management/pagamentos?${params}`);
      
      if (response.data.success) {
        setPayments(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar pagamentos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar pagamentos';
      setError(errorMessage);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  return { 
    payments, 
    loading, 
    error, 
    pagination, 
    fetchPayments 
  };
};
