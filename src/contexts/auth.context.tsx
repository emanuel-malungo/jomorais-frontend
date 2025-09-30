import authService from "@/services/auth.service";
import { createContext, useState, useEffect, ReactNode, use, useContext } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
      router.push("/dashboard"); // Redirect to dashboard or any protected route
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    router.push("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


