import api from "@/utils/api.utils";
import { Student, StudentCreateData, StudentResponse } from "@/types/student.types";

export default class StudentService {

    static async getAllStudents(page: number, limit: number): Promise<{ students: Student[], pagination: any }> {
        try {
            const response = await api.get("/api/student-management/alunos", {
                params: { page, limit },
            });
            
            const apiResponse: StudentResponse = response.data;
            
            if (apiResponse.success) {
                return {
                    students: apiResponse.data,
                    pagination: apiResponse.pagination
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
            const response = await api.post("/api/student-management/alunos", studentData);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar aluno:", error);
            throw error;
        }
    }

    static async updateStudent(id: number, studentData: Student): Promise<Student> {
        try {
            const response = await api.put(`/api/student-management/alunos/${id}`, studentData);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            throw error;
        }
    }

    static async deleteStudent(id: number): Promise<void> {
        try {
            await api.delete(`/api/student-management/alunos/${id}`);
        } catch (error) {
            console.error("Erro ao deletar aluno:", error);
            throw error;
        }
    }

}