"use client";

import authService from "@/services/auth.service";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LegacyUser, AuthResponse, LoginResponse } from "@/types/auth.types";
import { toast } from "react-toastify";

interface AuthContextType {
  isAuthenticated: boolean;
  user: LegacyUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<LegacyUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Primeiro verifica se há token armazenado
        if (!authService.hasValidToken()) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        // Se há token, tenta buscar dados do usuário
        const response: AuthResponse<LegacyUser> = await authService.getCurrentUser();
        
        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          // Token inválido, limpar sessão
          authService.clearSession();
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em caso de erro, limpar sessão
        authService.clearSession();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      const response: AuthResponse<LoginResponse> = await authService.login({ 
        user: username, 
        passe: password 
      });
      
      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUser(response.data.user as LegacyUser);
        toast.success(response.message || "Login realizado com sucesso!");
        router.push("/admin"); // Redirect para área administrativa
      } else {
        throw new Error(response.message || "Erro no login");
      }
    } catch (error: any) {
      console.error("Falha no login:", error);
      setIsAuthenticated(false);
      setUser(null);
      
      // Mostrar mensagem de erro
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(errorMessage);
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await authService.logout();
      
      if (response.success) {
        toast.success(response.message || "Logout realizado com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro no logout:", error);
      
      // Mostrar mensagem de aviso, mas não bloquear o logout
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Erro ao fazer logout no servidor, mas você foi desconectado localmente.";
      toast.warning(errorMessage);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      router.push("/"); // Redirect para página de login
    }
  };

  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return;
      
      const response: AuthResponse<LegacyUser> = await authService.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      // Se falhar, fazer logout
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}


