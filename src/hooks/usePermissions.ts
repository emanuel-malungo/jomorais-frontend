import { useMemo } from 'react';
import useAuth from './useAuth';
import { getUserPermissions, canAccessRoute, shouldShowMenuItem, UserPermissions } from '@/utils/permissions.utils';

export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo((): UserPermissions => {
    if (!user) {
      // Usuário não autenticado - sem permissões
      return {
        canAccessStudentManagement: false,
        canAccessAcademicManagement: false,
        canAccessFinancial: false,
        canAccessReports: false,
        canAccessSettings: false,
        canAccessPayments: false,
        canAccessInvoices: false,
        canAccessFinancialReports: false,
        canAccessSAFT: false,
        canAccessFinancialSettings: false,
      };
    }

    return getUserPermissions(user.tipo, user.tipoDesignacao);
  }, [user]);

  const canAccess = useMemo(() => ({
    route: (path: string) => canAccessRoute(path, permissions),
    menuItem: (menuPath: string) => shouldShowMenuItem(menuPath, permissions),
  }), [permissions]);

  return {
    permissions,
    canAccess,
    user,
    userType: user?.tipoDesignacao?.toLowerCase() || 'unknown',
    isAdmin: user?.tipoDesignacao?.toLowerCase() === 'administrador',
    isChefe: user?.tipoDesignacao?.toLowerCase() === 'chefe de secretaria',
    hasFullAccess: user?.tipoDesignacao?.toLowerCase() === 'administrador' || 
                   user?.tipoDesignacao?.toLowerCase() === 'chefe de secretaria',
  };
}
