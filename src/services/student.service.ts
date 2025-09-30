import api from "@/utils/api.utils";



// Interface básica do Student para o frontend
interface Student {
    id: number;
    nome: string;
    idade: number;
    turma: string;
}

// Interface completa baseada no backend
interface StudentCreateData {
    nome: string;
    pai?: string;
    mae?: string;
    codigo_Nacionalidade: number;
    dataNascimento: string;
    email?: string;
    telefone?: string;
    codigo_Comuna: number;
    codigo_Encarregado?: number;
    codigo_Utilizador: number;
    sexo: 'M' | 'F';
    n_documento_identificacao?: string;
    saldo?: number;
    morada?: string;
}

// Interface para resposta da API
interface StudentResponse {
    success: boolean;
    message: string;
    data?: any;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export default class StudentService {

    static async getAllStudents(page: number, limit: number): Promise<Student[]> {
        try {
            const response = await api.get("/api/student-management/alunos", {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
            throw error;
        }
    }

    static async getStudentById(id: number): Promise<Student> {
        try {
            const response = await api.get(`/api/student-management/alunos/${id}`);
            return response.data;
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
            await api.delete(`/api/students/${id}`);
        } catch (error) {
            console.error("Erro ao deletar aluno:", error);
            throw error;
        }
    }

}