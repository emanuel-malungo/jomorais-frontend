"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/" 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[ProtectedRoute] Estado:', { isAuthenticated, loading, isInitialized, redirectTo, currentPath: window.location.pathname });
    
    // Só fazer redirecionamento após a inicialização estar completa
    if (isInitialized && !loading && !isAuthenticated) {
      // Verificar se já estamos na página de destino para evitar redirecionamento desnecessário
      if (window.location.pathname !== redirectTo) {
        console.log('[ProtectedRoute] Redirecionando para:', redirectTo);
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, loading, isInitialized, router, redirectTo]);

  // Mostrar loading enquanto não inicializou ou ainda está carregando
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Usuário não autenticado, aguardando redirecionamento...');
    return null; // O useEffect já fará o redirecionamento
  }

  console.log('[ProtectedRoute] Usuário autenticado, renderizando children');
  return <>{children}</>;
}