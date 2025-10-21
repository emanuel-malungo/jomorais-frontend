import api from "@/utils/api.utils";
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
        return this.getAllStudents(1, 100);
    }

    static async getAllStudents(page: number, limit: number, search: string = ''): Promise<{ students: Student[], pagination: IPagination }> {

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

        return {
            students: apiResponse.data,
            pagination: apiResponse.pagination || {
                currentPage: page,
                totalPages: 1,
                totalItems: apiResponse.data.length,
                itemsPerPage: limit
            }
        };

    }

    static async getStudentById(id: number): Promise<Student> {
        const response = await api.get(`/api/student-management/alunos/${id}`);
        const apiResponse = response.data;
        return apiResponse.data;
    }

    static async createStudent(studentData: Student): Promise<Student> {

        const payload = { ...studentData };

        const response = await api.post("/api/student-management/alunos", payload);
        const apiResponse = response.data;
        return apiResponse.data;
    }

    static async updateStudent(id: number, studentData: Student): Promise<Student> {
        const response = await api.put(`/api/student-management/alunos/${id}`, studentData);
        return response.data.data;
    }

    static async deleteStudent(id: number): Promise<void> {
        await api.delete(`/api/student-management/alunos/${id}`);
    }


}