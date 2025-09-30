import api from "@/utils/api.utils";

interface authRegisterData {
    nome: string;
    user: string;
    passe: string;
    codigo_Tipo_Utilizador: number;
    estadoActual: string;
}

export default class authService {

    static async login(credentials: { user: string; passe: string }) {
        try {
            const response = await api.post("/api/auth/legacy/login", credentials);
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    }

    static async logout() {
        try {
            const response = await api.post("/api/auth/legacy/logout");
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            throw error;
        }
    }

    static async getCurrentUser() {
        try {
            const response = await api.get("/api/auth/legacy/me");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar usuário atual:", error);
            throw error;
        }
    }

    static async register(userData : authRegisterData) {
        try {
            const response = await api.post("/api/auth/legacy/register", userData);
            return response.data;
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            throw error;
        }
    }

}