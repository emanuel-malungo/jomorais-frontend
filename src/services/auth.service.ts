import api from "@/utils/api.utils";
import {
    LegacyLoginCredentials,
    LegacyRegisterData,
    ModernLoginCredentials,
    ModernRegisterData,
    AuthResponse,
    LoginResponse,
    LegacyUser,
    ModernUser,
    UserType
} from "@/types/auth.types";

export default class authService {

    static async login(credentials: LegacyLoginCredentials): Promise<AuthResponse<LoginResponse>> {
        try {
            const response = await api.post("/api/auth/legacy/login", credentials);
            
            // Salvar token e dados do usuário no localStorage
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    }

    static async logout(): Promise<AuthResponse> {
        try {
            const response = await api.post("/api/auth/legacy/logout");
            
            // Limpar dados do localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            
            // Mesmo se der erro no servidor, limpar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            throw error;
        }
    }

    static async getCurrentUser(): Promise<AuthResponse<LegacyUser>> {
        try {
            const response = await api.get("/api/auth/legacy/me");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar usuário atual:", error);
            throw error;
        }
    }

    static async register(userData: LegacyRegisterData): Promise<AuthResponse<LegacyUser>> {
        try {
            const response = await api.post("/api/auth/legacy/register", userData);
            return response.data;
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            throw error;
        }
    }

    // Método adicional para verificar se o usuário está autenticado
    static async isAuthenticated(): Promise<boolean> {
        try {
            await this.getCurrentUser();
            return true;
        } catch (error) {
            return false;
        }
    }

    // Método para obter tipos de usuário
    static async getUserTypes(): Promise<AuthResponse<UserType[]>> {
        try {
            const response = await api.get("/api/auth/user-types");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar tipos de usuário:", error);
            throw error;
        }
    }

    // ===============================
    // MÉTODOS PARA SISTEMA MODERNO
    // ===============================

    static async modernLogin(credentials: ModernLoginCredentials): Promise<AuthResponse<LoginResponse>> {
        try {
            const response = await api.post("/api/auth/login", credentials);
            
            // Salvar token e dados do usuário no localStorage
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer login (sistema moderno):", error);
            throw error;
        }
    }

    static async modernRegister(userData: ModernRegisterData): Promise<AuthResponse<ModernUser>> {
        try {
            const response = await api.post("/api/auth/register", userData);
            return response.data;
        } catch (error) {
            console.error("Erro ao registrar usuário (sistema moderno):", error);
            throw error;
        }
    }

    static async modernGetCurrentUser(): Promise<AuthResponse<ModernUser>> {
        try {
            const response = await api.get("/api/auth/me");
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar usuário atual (sistema moderno):", error);
            throw error;
        }
    }

    // ===============================
    // MÉTODOS UTILITÁRIOS
    // ===============================

    // Obter token do localStorage
    static getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    // Obter dados do usuário do localStorage
    static getStoredUser(): LegacyUser | ModernUser | null {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }

    // Verificar se há token válido
    static hasValidToken(): boolean {
        const token = this.getToken();
        return !!token;
    }

    // Limpar sessão completamente
    static clearSession(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

}