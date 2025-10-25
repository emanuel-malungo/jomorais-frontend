"use client";

import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Shield } from 'lucide-react';

export function UserPermissionsDebug() {
  const { permissions, user, userType, hasFullAccess } = usePermissions();

  if (!user) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Usuário não autenticado
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const permissionItems = [
    { key: 'canAccessStudentManagement', label: 'Gestão de Alunos' },
    { key: 'canAccessAcademicManagement', label: 'Gestão Acadêmica' },
    { key: 'canAccessFinancial', label: 'Financeiro (Geral)' },
    { key: 'canAccessPayments', label: 'Pagamentos' },
    { key: 'canAccessInvoices', label: 'Faturas' },
    { key: 'canAccessFinancialReports', label: 'Relatórios Financeiros' },
    { key: 'canAccessSAFT', label: 'SAFT' },
    { key: 'canAccessReports', label: 'Relatórios' },
    { key: 'canAccessSettings', label: 'Configurações' },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissões do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do usuário */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Informações do Usuário</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Nome:</strong> {user.nome}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Tipo:</strong> {user.tipo}</p>
            <p><strong>Designação:</strong> {user.tipoDesignacao}</p>
            <p><strong>Status:</strong> {user.estadoActual}</p>
          </div>
          <div className="mt-2">
            <Badge variant={hasFullAccess ? "default" : "secondary"}>
              {hasFullAccess ? "Acesso Total" : `Acesso Limitado (${userType})`}
            </Badge>
          </div>
        </div>

        {/* Lista de permissões */}
        <div>
          <h3 className="font-semibold mb-3">Permissões Detalhadas</h3>
          <div className="grid grid-cols-1 gap-2">
            {permissionItems.map(({ key, label }) => {
              const hasPermission = permissions[key as keyof typeof permissions];
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    hasPermission ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                  {hasPermission ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
