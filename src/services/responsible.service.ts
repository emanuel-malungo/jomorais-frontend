import api from "@/utils/api.utils";

export default class ResponsibleService {
    // Criar responsável
    static async createResponsible(data: {
        nome: string;
        telefone: string;
        email: string;
        codigo_Profissao: number;
        local_Trabalho: string;
        codigo_Utilizador: number;
        status: number;
    }) {
        try {
            const response = await api.post("/api/student-management/encarregados", data);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || "Erro ao criar responsável");
            }
        } catch (error) {
            console.error("Erro ao criar responsável:", error);
            throw error;
        }
    }

    // Listar responsáveis com paginação e busca
    static async getResponsibles(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) {
        try {
            const response = await api.get("/api/student-management/encarregados", { params });
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || "Erro ao buscar responsáveis");
            }
        } catch (error) {
            console.error("Erro ao buscar responsáveis:", error);
            throw error;
        }
    }

    // Obter responsável por ID
    static async getResponsibleById(id: number) {
        try {
            const response = await api.get(`/api/student-management/encarregados/${id}`);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || "Erro ao buscar responsável");
            }
        } catch (error) {
            console.error("Erro ao buscar responsável:", error);
            throw error;
        }
    }

    // Atualizar responsável
    static async updateResponsible(
        id: number,
        data: {
            nome: string;
            telefone: string;
            email: string;
            codigo_Profissao: number;
            local_Trabalho: string;
            codigo_Utilizador: number;
            status: number;
        }
    ) {
        try {
            const response = await api.put(`/api/student-management/encarregados/${id}`, data);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || "Erro ao atualizar responsável");
            }
        } catch (error) {
            console.error("Erro ao atualizar responsável:", error);
            throw error;
        }
    }

    // Deletar responsável
    static async deleteResponsible(id: number) {
        try {
            const response = await api.delete(`/api/student-management/encarregados/${id}`);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return;
            } else {
                throw new Error(apiResponse.message || "Erro ao deletar responsável");
            }
        } catch (error) {
            console.error("Erro ao deletar responsável:", error);
            throw error;
        }
    }
}
