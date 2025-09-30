"use client";

import React, { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Calendar,
  Settings,
} from 'lucide-react';
import { useUsersLegacy } from '@/hooks/useUsers';

import WelcomeHeader from '@/components/layout/WelcomeHeader';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import StatCard from '@/components/layout/StatCard';

interface Usuario {
  codigo: number;
  nome: string;
  user: string;
  passe: string;
  codigo_Tipo_Utilizador: number;
  estadoActual: 'Activo' | 'Desactivo';
  dataCadastro: object;
  loginStatus: 'ON' | 'OFF';
  tb_tipos_utilizador: {
    codigo: number;
    designacao: string;
  };
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipoUsuario, setSelectedTipoUsuario] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { users, meta, loading, error, page, setPage } = useUsersLegacy(1, 10);

  const getTipoUsuarioColor = (designacao: string) => {
    switch (designacao.toLowerCase()) {
      case 'administrador': return 'bg-red-100 text-red-800';
      case 'operador': return 'bg-blue-100 text-blue-800';
      case 'assistente administrativo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Desactivo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Activo': return <UserCheck className="h-4 w-4" />;
      case 'Desactivo': return <UserX className="h-4 w-4" />;
      default: return <UserX className="h-4 w-4" />;
    }
  };

  const getLoginStatusColor = (loginStatus: string) => {
    switch (loginStatus) {
      case 'ON': return 'bg-green-100 text-green-800';
      case 'OFF': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const filteredUsuarios = (users as Usuario[])?.filter((usuario) => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipoUsuario = selectedTipoUsuario === '' || usuario.tb_tipos_utilizador.designacao === selectedTipoUsuario;
    const matchesStatus = selectedStatus === '' || usuario.estadoActual === selectedStatus;

    return matchesSearch && matchesTipoUsuario && matchesStatus;
  }) || [];

  const getUsuariosPorTipo = (tipo: string) => {
    return (users as Usuario[])?.filter((u) => u.tb_tipos_utilizador.designacao === tipo).length || 0;
  };

  const getUsuariosAtivos = () => {
    return (users as Usuario[])?.filter((u) => u.estadoActual === 'Activo').length || 0;
  };

  const getTiposUsuario = () => {
    const tipos = (users as Usuario[])?.map((u) => u.tb_tipos_utilizador.designacao) || [];
    return [...new Set(tipos)];
  };

  return (
    <Container>

      <WelcomeHeader
        iconMain={<Users className="h-8 w-8 text-white" />}
        title="Gestão de Usuários"
        description="Gerencie usuários do sistema, configure perfis de acesso, defina permissões e monitore atividades dos usuários."
        titleBtnRight="Novo Usuário"
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => { }}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Usuários"
          value={`${users?.length || 0}`}
          change={`${users?.length || 0}`}
          changeType="neutral"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <StatCard
          title="Usuários Ativos"
          value={`${getUsuariosAtivos()}`}
          change={`${getUsuariosAtivos()}`}
          changeType="up"
          icon={UserCheck}
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-50 via-white to-green-50/50"
          accentColor="bg-gradient-to-br from-green-500 to-green-600"
        />

        <StatCard
          title="Administradores"
          value={`${getUsuariosPorTipo('Administrador')}`}
          change={`${getUsuariosPorTipo('Administrador')}`}
          changeType="neutral"
          icon={Shield}
          color="text-yellow-600"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Operadores"
          value={`${getUsuariosPorTipo('Operador')}`}
          change={`${getUsuariosPorTipo('Operador')}`}
          changeType="neutral"
          icon={Settings}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <FilterSearchCard
        title="Buscar e Filtrar Usuários"
        searchPlaceholder="Buscar usuário..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterLabel="Tipo de Usuário"
        filterValue={selectedTipoUsuario}
        onFilterChange={setSelectedTipoUsuario}
        filterOptions={getTiposUsuario().map((tipo) => ({ value: tipo, label: tipo }))}
      />

      <div className="">

        {/* Lista de Usuários */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Lista de Usuários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>

              {/* Lista */}
              <div className="space-y-4">
                {loading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9CD1D]"></div>
                  </div>
                )}


                {!loading && !error && filteredUsuarios.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum usuário encontrado.
                  </div>
                )}

                {!loading && !error && filteredUsuarios.map((usuario: Usuario) => (
                  <div key={usuario.codigo} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>Usuário: {usuario.user}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Shield className="h-4 w-4" />
                            <span>Código: {usuario.codigo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex flex-col space-y-2">
                          <Badge className={getTipoUsuarioColor(usuario.tb_tipos_utilizador.designacao)}>
                            {usuario.tb_tipos_utilizador.designacao}
                          </Badge>
                          <Badge className={getStatusColor(usuario.estadoActual)}>
                            {getStatusIcon(usuario.estadoActual)}
                            <span className="ml-1">{usuario.estadoActual}</span>
                          </Badge>
                          <Badge className={getLoginStatusColor(usuario.loginStatus)}>
                            <span className="ml-1">Login: {usuario.loginStatus}</span>
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>Tipo: {usuario.tb_tipos_utilizador.designacao}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Status Login: {usuario.loginStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {meta && (meta as any).totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-700">
                    Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, (meta as any).total)} de {(meta as any).total} usuários
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, (meta as any).totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={page === pageNum ? "bg-[#F9CD1D] hover:bg-[#F9CD1D]/90" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === (meta as any).totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
