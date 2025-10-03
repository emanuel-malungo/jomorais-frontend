import { toast } from "react-toastify"
import { 
  IPagamentoPrincipalInput, 
  IPagamentoPrincipal,
  IPagamentoPrincipalResponse,
  IPagamentoPrincipalListResponse,
  IAlunoBasicoResponse,
  IAlunoBasico
} from '@/types/financialService.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class PaymentPrincipalService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // ===============================
  // PAGAMENTOS PRINCIPAIS
  // ===============================

  async createPagamentoPrincipal(data: IPagamentoPrincipalInput): Promise<IPagamentoPrincipal> {
    try {
      const response = await fetch(`${BASE_URL}/api/payment-management/pagamentos-principais`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao criar pagamento principal');
        throw new Error(errorData.message || 'Erro ao criar pagamento principal');
      }

      const result: IPagamentoPrincipalResponse = await response.json();
      toast.success(result.message || 'Pagamento principal criado com sucesso!');
      return result.data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao criar pagamento principal';
      if (!error?.message?.includes('Erro ao criar pagamento principal')) {
        toast.error(errorMessage);
      }
      console.error('Erro ao criar pagamento principal:', error);
      throw error;
    }
  }

  async getPagamentosPrincipais(
    page: number = 1, 
    limit: number = 10, 
    filters: Record<string, unknown> = {}
  ): Promise<{ data: IPagamentoPrincipal[]; pagination: Record<string, unknown> }> {
    try {
      // Construir parâmetros apenas com valores válidos
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('_t', Date.now().toString()); // Cache buster
      
      // Adicionar filtros apenas se tiverem valores válidos
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `${BASE_URL}/api/payment-management/pagamentos-principais?${params}`;

      console.log('🌐 Fazendo requisição para:', url);
      console.log('🔑 Headers enviados:', this.getAuthHeaders());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 Status text:', response.statusText);
      console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `Erro HTTP ${response.status}`;
        let responseText = '';
        try {
          responseText = await response.text();
          console.log('📄 Texto da resposta de erro:', responseText);
          
          // Tentar fazer parse como JSON
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.log('⚠️ Resposta não é JSON válido:', responseText);
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('📄 Texto bruto da resposta:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Erro ao fazer parse do JSON:', e);
        throw new Error(`Dados inválidos: Resposta não é um JSON válido. Recebido: ${responseText.substring(0, 200)}...`);
      }
      
      console.log('🔍 Resposta da API de pagamentos (parsed):', result);
      console.log('🔍 Tipo da resposta:', typeof result);
      console.log('🔍 É array?', Array.isArray(result));
      console.log('🔍 Tem success?', result.success);
      console.log('🔍 Tem data?', result.data);
      console.log('🔍 Estrutura completa:', JSON.stringify(result, null, 2));
      
      // Verificar se a resposta tem estrutura esperada
      if (result.success && Array.isArray(result.data)) {
        console.log('✅ Estrutura padrão reconhecida (com success)');
        return {
          data: result.data,
          pagination: result.pagination || {
            currentPage: page,
            totalPages: Math.ceil(result.data.length / limit),
            totalItems: result.data.length,
            itemsPerPage: limit
          }
        };
      } else if (result.data && Array.isArray(result.data) && result.pagination) {
        console.log('✅ Estrutura com data e pagination (sem success)');
        // Estrutura: { data: [...], pagination: {...} }
        return {
          data: result.data,
          pagination: result.pagination
        };
      } else if (Array.isArray(result)) {
        console.log('✅ Array direto reconhecido');
        // Se a API retornar diretamente um array
        return {
          data: result,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.length / limit),
            totalItems: result.length,
            itemsPerPage: limit
          }
        };
      } else if (result.data && Array.isArray(result.data)) {
        console.log('✅ Estrutura alternativa reconhecida (só data)');
        // Estrutura alternativa sem success e sem pagination
        return {
          data: result.data,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.data.length / limit),
            totalItems: result.data.length,
            itemsPerPage: limit
          }
        };
      } else if (result.message && !result.data) {
        console.log('⚠️ API retornou apenas mensagem, sem dados');
        // API retornou mensagem mas sem dados
        return {
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit
          }
        };
      } else {
        console.error('❌ Estrutura de resposta não reconhecida:', result);
        console.error('❌ Chaves disponíveis:', Object.keys(result));
        console.error('❌ Tipo de result.data:', typeof result.data, Array.isArray(result.data));
        console.error('❌ Tipo de result.pagination:', typeof result.pagination);
        throw new Error(`Dados inválidos: Estrutura de resposta da API não reconhecida. Recebido: ${JSON.stringify(result).substring(0, 500)}...`);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar pagamentos principais:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      
      throw error;
    }
  }

  async getPagamentoPrincipalById(id: number): Promise<IPagamentoPrincipal> {
    try {
      const response = await fetch(
        `${BASE_URL}/api/payment-management/pagamentos-principais/${id}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar pagamento principal');
      }

      const result: IPagamentoPrincipalResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar pagamento principal:', error);
      throw error;
    }
  }

  async updatePagamentoPrincipal(id: number, data: Partial<IPagamentoPrincipalInput>): Promise<IPagamentoPrincipal> {
    try {
      const response = await fetch(
        `${BASE_URL}/api/payment-management/pagamentos-principais/${id}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao atualizar pagamento principal');
        throw new Error(errorData.message || 'Erro ao atualizar pagamento principal');
      }

      const result: IPagamentoPrincipalResponse = await response.json();
      toast.success(result.message || 'Pagamento principal atualizado com sucesso!');
      return result.data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao atualizar pagamento principal';
      if (!error?.message?.includes('Erro ao atualizar pagamento principal')) {
        toast.error(errorMessage);
      }
      console.error('Erro ao atualizar pagamento principal:', error);
      throw error;
    }
  }

  async deletePagamentoPrincipal(id: number): Promise<void> {
    try {
      const response = await fetch(
        `${BASE_URL}/api/payment-management/pagamentos-principais/${id}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao excluir pagamento principal');
        throw new Error(errorData.message || 'Erro ao excluir pagamento principal');
      }

      const result = await response.json();
      toast.success(result.message || 'Pagamento principal excluído com sucesso!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao excluir pagamento principal';
      if (!error?.message?.includes('Erro ao excluir pagamento principal')) {
        toast.error(errorMessage);
      }
      console.error('Erro ao excluir pagamento principal:', error);
      throw error;
    }
  }

  // ===============================
  // ALUNOS (para seleção)
  // ===============================

  async getAlunosBasicos(): Promise<IAlunoBasico[]> {
    try {
      // Buscar todos os alunos com limite alto para garantir que pegue todos
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '1000'); // Limite alto para pegar todos os alunos
      
      const url = `${BASE_URL}/api/student-management/alunos?${params}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar alunos');
      }

      const result = await response.json();
      const rawData = result.data || [];
      
      // Transform raw API data to IAlunoBasico format
      const alunosBasicos: IAlunoBasico[] = rawData.map((aluno: Record<string, unknown>) => ({
        codigo: (aluno.codigo as number) || (aluno.id as number),
        nome: (aluno.nome as string) || (aluno.name as string) || 'Nome não informado',
        dataNascimento: aluno.dataNascimento as string || aluno.data_nascimento as string,
        sexo: aluno.sexo as string || aluno.gender as string
      }));
      
      return alunosBasicos;
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw error;
    }
  }
}

export const paymentPrincipalService = new PaymentPrincipalService();
