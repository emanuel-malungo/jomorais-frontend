import api from "@/utils/api.utils";

export default class DocumentService {

    // ---------------------------------------------
    // SERVICES PARA TIPOS DE DOCUMENTO
    // ----------------------------------------------

    static async getAllDocumentTypes(): Promise<{ codigo: number; designacao: string }[]> {
        try {
            const response = await api.get("/api/institutional/tipos-documento");
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao buscar tipos de documento');
            }
        } catch (error) {
            console.error("Erro ao buscar tipos de documento:", error);
            throw error;
        }
    }

    static async getDocumentTypeById(id: number): Promise<{ codigo: number; designacao: string }> {
        try {
            const response = await api.get(`/api/institutional/tipos-documento/${id}`);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao buscar tipo de documento');
            }
        } catch (error) {
            console.error("Erro ao buscar tipo de documento:", error);
            throw error;
        }
    }

    // ---------------------------------------------
    // SERVICES PARA NUMERAÇÃO DOCUMENTOS
    // ----------------------------------------------

    static async getDocumentNumbering(): Promise<{ designacao: string; next: number }[]> {
        try {
            const response = await api.get("/api/institutional-management/numeracao-documentos");
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao buscar numeração de documentos');
            }
        } catch (error) {
            console.error("Erro ao buscar numeração de documentos:", error);
            throw error;
        }
    }

    static async getDocumentNumberingById(id: number): Promise<{ designacao: string; next: number }> {
        try {
            const response = await api.get(`/api/institutional-management/numeracao-documentos/${id}`);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao buscar numeração de documento');
            }
        } catch (error) {
            console.error("Erro ao buscar numeração de documento:", error);
            throw error;
        }
    }

    static async updateDocumentNumbering(id: number, numberingData: { designacao: string; next: number }): Promise<{ designacao: string; next: number }> {
        try {
            const response = await api.put(`/api/institutional-management/numeracao-documentos/${id}`, numberingData);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao atualizar numeração de documento');
            }
        } catch (error) {
            console.error("Erro ao atualizar numeração de documento:", error);
            throw error;
        }
    }

    static async createDocumentNumbering(numberingData: { designacao: string; next: number }): Promise<{ designacao: string; next: number }> {
        try {
            const response = await api.post("/api/institutional-management/numeracao-documentos", numberingData);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return apiResponse.data;
            } else {
                throw new Error(apiResponse.message || 'Erro ao criar numeração de documento');
            }
        } catch (error) {
            console.error("Erro ao criar numeração de documento:", error);
            throw error;
        }
    }

    static async deleteDocumentNumbering(id: number): Promise<void> {
        try {
            const response = await api.delete(`/api/institutional-management/numeracao-documentos/${id}`);
            const apiResponse = response.data;

            if (apiResponse.success) {
                return;
            } else {
                throw new Error(apiResponse.message || 'Erro ao deletar numeração de documento');
            }
        } catch (error) {
            console.error("Erro ao deletar numeração de documento:", error);
            throw error;
        }
    }

}