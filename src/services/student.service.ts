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

    static async getAllStudents(page: number, limit: number): Promise<{ students: Student[], pagination: IPagination }> {
        try {
            const response = await api.get("/api/student-management/alunos", {
                params: { page, limit },
            });
            
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
            
            // Remover campos que não existem no backend
            // @ts-ignore - removendo campos auxiliares do frontend
            delete cleanData.provincia;
            // @ts-ignore
            delete cleanData.municipio;
            // @ts-ignore
            delete cleanData.codigo_Utilizador;
            
            const response = await api.post("/api/student-management/alunos", cleanData);
            
            const apiResponse = response.data;
            
            if (apiResponse.success) {
                toast.success(apiResponse.message || 'Aluno criado com sucesso!');
                return apiResponse.data;
            } else {
                toast.error(apiResponse.message || 'Erro ao criar aluno');
                throw new Error(apiResponse.message || 'Erro ao criar aluno');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao criar aluno';
            toast.error(errorMessage);
            console.error("Erro ao criar aluno:", error);
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