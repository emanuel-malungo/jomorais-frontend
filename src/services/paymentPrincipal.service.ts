import { toast } from "react-toastify"
import { 
  IPagamentoPrincipalInput, 
  IPagamentoPrincipal,
  IPagamentoPrincipalResponse,
  IPagamentoPrincipalListResponse,
  IAlunoBasicoResponse
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
    filters: any = {}
  ): Promise<{ data: IPagamentoPrincipal[]; pagination: any }> {
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

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar pagamentos principais');
      }

      const result = await response.json();
      
      // Verificar se a resposta tem estrutura esperada
      if (result.success && Array.isArray(result.data)) {
        return {
          data: result.data,
          pagination: result.pagination || {
            currentPage: page,
            totalPages: Math.ceil(result.data.length / limit),
            totalItems: result.data.length,
            itemsPerPage: limit
          }
        };
      } else if (Array.isArray(result)) {
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
      } else {
        throw new Error('Estrutura de resposta da API não reconhecida');
      }
    } catch (error) {
      console.error('Erro ao buscar pagamentos principais:', error);
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

  async getAlunosBasicos(): Promise<any[]> {
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
      return result.data || [];
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw error;
    }
  }
}

export const paymentPrincipalService = new PaymentPrincipalService();
