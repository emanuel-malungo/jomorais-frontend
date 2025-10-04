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
      // Buscar dados do pagamento
      const response = await api.get(`/api/payment-management/pagamentos/${paymentId}`);
      
      if (response.data.success) {
        const payment = response.data.data;
        
        // Buscar dados completos do aluno
        let alunoCompleto = null;
        try {
          const alunoResponse = await api.get(`/api/payment-management/aluno/${payment.codigo_Aluno}/completo`);
          if (alunoResponse.data.success) {
            alunoCompleto = alunoResponse.data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar dados completos do aluno:', error);
        }
        
        // Preparar dados para a fatura térmica
        const dadosFatura = {
          numeroFatura: payment.fatura || `FAT_${Date.now()}`,
          dataEmissao: new Date(payment.data || new Date()).toLocaleString('pt-BR'),
          aluno: {
            nome: payment.aluno?.nome || 'Aluno não identificado',
            curso: alunoCompleto?.dadosAcademicos?.curso || 'Curso não especificado',
            classe: alunoCompleto?.dadosAcademicos?.classe || 'Classe não especificada',
            turma: alunoCompleto?.dadosAcademicos?.turma || 'Turma não especificada'
          },
          servicos: [
            {
              descricao: payment.tipoServico?.designacao || 'Serviço',
              quantidade: 1,
              precoUnitario: payment.preco || 0,
              total: payment.preco || 0
            }
          ],
          formaPagamento: payment.formaPagamento?.designacao || 'DINHEIRO',
          subtotal: payment.preco || 0,
          iva: 0.00,
          desconto: 0.00,
          totalPagar: payment.preco || 0,
          totalPago: payment.preco || 0,
          pagoEmSaldo: 0.00,
          saldoAtual: 0.00,
          operador: 'Sistema'
        };
        
        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Fatura - ${dadosFatura.numeroFatura}</title>
              <style>
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.2;
                  margin: 0;
                  padding: 8px;
                  width: 80mm;
                  background: white;
                  color: black;
                }
                .header {
                  text-align: center;
                  border-bottom: 1px solid #000;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
                }
                .header h2 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0 0 4px 0;
                }
                .header p {
                  margin: 2px 0;
                  font-size: 11px;
                }
                .aluno {
                  margin-bottom: 8px;
                  font-size: 11px;
                }
                .aluno p {
                  margin: 2px 0;
                }
                .servicos-table {
                  width: 100%;
                  border-top: 1px solid #000;
                  border-bottom: 1px solid #000;
                  margin: 8px 0;
                  border-collapse: collapse;
                }
                .servicos-table th,
                .servicos-table td {
                  padding: 2px 4px;
                  font-size: 10px;
                  text-align: left;
                }
                .servicos-table th {
                  border-bottom: 1px solid #000;
                }
                .text-right {
                  text-align: right;
                }
                .totais {
                  font-size: 11px;
                  margin: 8px 0;
                }
                .totais p {
                  margin: 2px 0;
                }
                .rodape {
                  text-align: center;
                  border-top: 1px solid #000;
                  padding-top: 8px;
                  margin-top: 12px;
                  font-size: 10px;
                }
                .rodape p {
                  margin: 2px 0;
                }
                .selo-pago {
                  text-align: center;
                  margin-top: 16px;
                }
                .selo-pago span {
                  font-weight: bold;
                  font-size: 16px;
                  color: #2563eb;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>COMPLEXO ESCOLAR PRIVADO JOMORAIS</h2>
                <p>NIF: 5101165107</p>
                <p>Bairro 1º de Maio, Zongoio - Cabinda</p>
                <p>Tlf: 915312187</p>
                <p>Data: ${dadosFatura.dataEmissao}</p>
                <p>Fatura: ${dadosFatura.numeroFatura}</p>
              </div>

              <div class="aluno">
                <p><strong>Aluno(a):</strong> ${dadosFatura.aluno.nome}</p>
                <p>Consumidor Final</p>
                <p>${dadosFatura.aluno.curso}</p>
                <p>${dadosFatura.aluno.classe} - ${dadosFatura.aluno.turma}</p>
              </div>

              <table class="servicos-table">
                <thead>
                  <tr>
                    <th style="width: 50%">Serviços</th>
                    <th class="text-right" style="width: 15%">Qtd</th>
                    <th class="text-right" style="width: 17.5%">P.Unit</th>
                    <th class="text-right" style="width: 17.5%">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${dadosFatura.servicos.map(servico => `
                    <tr>
                      <td>${servico.descricao}</td>
                      <td class="text-right">${servico.quantidade}</td>
                      <td class="text-right">${servico.precoUnitario.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</td>
                      <td class="text-right">${servico.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totais">
                <p>Forma de Pagamento: ${dadosFatura.formaPagamento}</p>
                <p>Total: ${dadosFatura.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Total IVA: ${dadosFatura.iva.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>N.º de Itens: ${dadosFatura.servicos.length}</p>
                <p>Desconto: ${dadosFatura.desconto.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>A Pagar: ${dadosFatura.totalPagar.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Total Pago: ${dadosFatura.totalPago.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Pago em Saldo: ${dadosFatura.pagoEmSaldo.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Saldo Actual: ${dadosFatura.saldoAtual.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
              </div>

              <div class="rodape">
                <p>Operador: ${dadosFatura.operador}</p>
                <p>Emitido em: ${dadosFatura.dataEmissao.split(' ')[0]}</p>
                <p>REGIME SIMPLIFICADO</p>
                <p>Processado pelo computador</p>
              </div>

              <div class="selo-pago">
                <span>[ PAGO ]</span>
              </div>
            </body>
            </html>
          `);
          
          printWindow.document.close();
          printWindow.focus();
          
          // Aguardar o carregamento e imprimir
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      } else {
        throw new Error('Pagamento não encontrado');
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao gerar fatura';
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
