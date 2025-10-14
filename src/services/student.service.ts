import api from "@/utils/api.utils";
import { toast } from "react-toastify";
import { Student, StudentResponse } from "@/types/student.types";

interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default class StudentService {

    static async getAllStudentsComplete(): Promise<{ students: Student[], pagination: IPagination }> {
        // Buscar todos os estudantes sem paginação
        return this.getAllStudents(1, 1000);
    }

    static async getAllStudents(page: number, limit: number, search: string = ''): Promise<{ students: Student[], pagination: IPagination }> {
        try {

            // Construir a query string explicitamente para garantir que o backend
            // receba os parâmetros no formato esperado (evita comportamento de
            // serialização de `axios` que pode interferir em includes relacionados).
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (search) {
                params.append('search', search);
            }
            // Cache buster para evitar respostas cacheadas durante desenvolvimento
            params.append('_t', Date.now().toString());

            const response = await api.get(`/api/student-management/alunos?${params.toString()}`);
            
            const apiResponse: StudentResponse = response.data;
            
            if (apiResponse.success) {
                return {
                    students: apiResponse.data,
                    pagination: apiResponse.pagination || {
                        currentPage: page,
                        totalPages: 1,
                        totalItems: apiResponse.data.length,
                        itemsPerPage: limit
                    }
                };
            } else {
                throw new Error(apiResponse.message || 'Erro ao buscar alunos');
            }
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
            throw error;
        }
    }

    static async getStudentById(id: number): Promise<Student> {
        try {
            const response = await api.get(`/api/student-management/alunos/${id}`);
            
            const apiResponse = response.data;
            
            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao buscar aluno');
            }
        } catch (error) {
            console.error("Erro ao buscar aluno:", error);
            throw error;
        }
    }

    static async createStudent(studentData: Student): Promise<Student> {
        try {
            // Criar cópia dos dados para não modificar o original
            const cleanData = { ...studentData };
            
            console.log('=== DADOS RECEBIDOS NO SERVICE ===');
            console.log('studentData original:', JSON.stringify(cleanData, null, 2));
            
            // Estruturar dados conforme esperado pelo backend
            // Se há dados do encarregado no formulário, estruturar como objeto aninhado
            // Converter data para string ISO se for objeto Date
            const formatDate = (date: any) => {
                if (!date) return undefined;
                if (date instanceof Date) {
                    return date.toISOString();
                }
                if (typeof date === 'string') {
                    return new Date(date).toISOString();
                }
                return date;
            };

            const payload: any = {
                // Dados do aluno - TODOS OS CAMPOS OBRIGATÓRIOS
                nome: cleanData.nome,
                pai: cleanData.pai || '',
                mae: cleanData.mae || '',
                sexo: cleanData.sexo || 'M',
                dataNascimento: formatDate(cleanData.dataNascimento),
                telefone: cleanData.telefone || '',
                email: cleanData.email || '',
                morada: cleanData.morada || '',
                
                // Campos numéricos obrigatórios
                codigo_Nacionalidade: Number(cleanData.codigo_Nacionalidade) || 2,
                codigo_Estado_Civil: 1, // SEMPRE 1 (SOLTEIRO) como padrão
                codigo_Comuna: Number(cleanData.codigo_Comuna) || 1,
                codigoTipoDocumento: Number(cleanData.codigoTipoDocumento) || 1,
                codigo_Status: 1, // SEMPRE 1 (NORMAL) como padrão
                escolaProveniencia: 1, // SEMPRE 1 como padrão
                codigo_Utilizador: "1", // Usuário padrão como string para conversão BigInt
                
                // Campos de documento obrigatórios
                n_documento_identificacao: cleanData.n_documento_identificacao || `AUTO${Date.now()}`,
                dataEmissao: new Date().toISOString(), // DATA ATUAL como padrão
                provinciaEmissao: 'Luanda', // LUANDA como padrão
                
                // Dados do encarregado como objeto aninhado (já vem estruturado do formulário)
                encarregado: {
                    nome: (cleanData as any).encarregado?.nome,
                    telefone: (cleanData as any).encarregado?.telefone,
                    email: (cleanData as any).encarregado?.email || '',
                    codigo_Profissao: (() => {
                        const profissaoId = Number((cleanData as any).encarregado?.codigo_Profissao);
                        // Se for 153 (que não existe), usar 1 (Professor)
                        // Se for qualquer outro ID inválido, usar 1 como padrão
                        if (profissaoId === 153 || !profissaoId || profissaoId < 1) {
                            return 1; // Professor como padrão
                        }
                        return profissaoId;
                    })(),
                    local_Trabalho: (cleanData as any).encarregado?.local_Trabalho || 'Não informado',
                    codigo_Utilizador: "1", // String para conversão BigInt
                    status: Number((cleanData as any).encarregado?.status) || 1
                }
            };
            
            console.log('=== PAYLOAD FINAL ===');
            console.log('Payload completo:', JSON.stringify(payload, null, 2));
            
            const response = await api.post("/api/student-management/alunos", payload);
            
            const apiResponse = response.data;
            
            if (apiResponse.success) {
                toast.success(apiResponse.message || 'Aluno criado com sucesso!');
                return apiResponse.data;
            } else {
                toast.error(apiResponse.message || 'Erro ao criar aluno');
                throw new Error(apiResponse.message || 'Erro ao criar aluno');
            }
        } catch (error: any) {
            let errorMessage = 'Erro ao criar aluno';
            
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            // Mensagens específicas para erros comuns
            if (errorMessage.includes('documento de identificação')) {
                errorMessage = 'Já existe um aluno com este documento de identificação. Use um documento diferente.';
            } else if (errorMessage.includes('email')) {
                errorMessage = 'Já existe um aluno com este email. Use um email diferente.';
            }
            
            toast.error(errorMessage);
            console.error("Erro ao criar aluno:", error);
            console.error("Mensagem de erro:", errorMessage);
            throw error;
        }
    }

    static async updateStudent(id: number, studentData: Student): Promise<Student> {
        try {
            // Criar cópia dos dados para não modificar o original
            const cleanData = { ...studentData };
            
            // Remover campos que não existem no backend
            // @ts-ignore - removendo campos auxiliares do frontend
            delete cleanData.provincia;
            // @ts-ignore
            delete cleanData.municipio;
            
            // Debug: console.log('Service - Dados antes de enviar:', cleanData);
            
            const response = await api.put(`/api/student-management/alunos/${id}`, cleanData);
            
            const apiResponse = response.data;
            
            if (apiResponse.success) {
                toast.success(apiResponse.message || 'Aluno atualizado com sucesso!');
                return apiResponse.data;
            } else {
                toast.error(apiResponse.message || 'Erro ao atualizar aluno');
                throw new Error(apiResponse.message || 'Erro ao atualizar aluno');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar aluno';
            toast.error(errorMessage);
            console.error("Erro ao atualizar aluno:", error);
            throw error;
        }
    }

    static async deleteStudent(id: number): Promise<void> {
        try {
            const response = await api.delete(`/api/student-management/alunos/${id}`);
            
            const apiResponse = response.data;
            
            if (apiResponse.success) {
                toast.success(apiResponse.message || 'Aluno deletado com sucesso!');
            } else {
                toast.error(apiResponse.message || 'Erro ao deletar aluno');
                throw new Error(apiResponse.message || 'Erro ao deletar aluno');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao deletar aluno';
            toast.error(errorMessage);
            console.error("Erro ao deletar aluno:", error);
            throw error;
        }
    }

}