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
  isInitialized: boolean;
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[AuthContext] Verificando autenticação inicial...');
        setLoading(true);
        
        // Primeiro verifica se há token armazenado
        if (!authService.hasValidToken()) {
          console.log('[AuthContext] Sem token válido');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        console.log('[AuthContext] Token válido encontrado, buscando dados do usuário...');
        // Se há token, tenta buscar dados do usuário
        const response: AuthResponse<LegacyUser> = await authService.getCurrentUser();
        
        if (response.success && response.data) {
          console.log('[AuthContext] Usuário autenticado:', response.data.nome);
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          console.log('[AuthContext] Falha ao buscar usuário, limpando sessão');
          // Token inválido, limpar sessão
          authService.clearSession();
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("[AuthContext] Erro ao verificar autenticação:", error);
        // Em caso de erro, limpar sessão
        authService.clearSession();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
        console.log('[AuthContext] Verificação inicial concluída');
      }
    };

    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized]);

  const login = async (username: string, password: string) => {
    try {
      console.log('[AuthContext] Iniciando login para:', username);
      setLoading(true);
      
      const response: AuthResponse<LoginResponse> = await authService.login({ 
        user: username, 
        passe: password 
      });
      
      console.log('[AuthContext] Resposta do login:', { success: response.success, hasData: !!response.data });
      
      if (response.success && response.data) {
        const userData = response.data.user as LegacyUser;
        
        // Atualizar estado
        setIsAuthenticated(true);
        setUser(userData);
        
        console.log('[AuthContext] Login bem-sucedido para:', userData.nome);
        
        toast.success(response.message || "Login realizado com sucesso!");
        
        // Redirecionar imediatamente
        router.push("/admin");
      } else {
        throw new Error(response.message || "Erro no login");
      }
    } catch (error: any) {
      console.error("[AuthContext] Falha no login:", error);
      setIsAuthenticated(false);
      setUser(null);
      authService.clearSession();
      
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
      isInitialized, 
      login, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}


