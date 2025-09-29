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
  Mail,
  Phone,
  Calendar,
  Settings,
} from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'admin' | 'secretario' | 'professor' | 'financeiro';
  status: 'ativo' | 'inativo' | 'suspenso';
  ultimoAcesso: string;
  dataCriacao: string;
  permissoes: string[];
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerfil, setSelectedPerfil] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [usuarios] = useState<Usuario[]>([
    {
      id: '1',
      nome: 'João Morais',
      email: 'joao.morais@jomorais.edu.ao',
      telefone: '+244 923 456 789',
      perfil: 'admin',
      status: 'ativo',
      ultimoAcesso: '2024-03-15T10:30:00',
      dataCriacao: '2024-01-15T08:00:00',
      permissoes: ['gestao_usuarios', 'configuracoes', 'relatorios', 'financeiro']
    },
    {
      id: '2',
      nome: 'Maria Silva',
      email: 'maria.silva@jomorais.edu.ao',
      telefone: '+244 912 345 678',
      perfil: 'secretario',
      status: 'ativo',
      ultimoAcesso: '2024-03-14T16:45:00',
      dataCriacao: '2024-02-01T09:00:00',
      permissoes: ['gestao_alunos', 'matriculas', 'horarios']
    },
    {
      id: '3',
      nome: 'Carlos Santos',
      email: 'carlos.santos@jomorais.edu.ao',
      telefone: '+244 934 567 890',
      perfil: 'professor',
      status: 'ativo',
      ultimoAcesso: '2024-03-13T14:20:00',
      dataCriacao: '2024-02-10T10:30:00',
      permissoes: ['gestao_notas', 'horarios', 'disciplinas']
    },
    {
      id: '4',
      nome: 'Ana Costa',
      email: 'ana.costa@jomorais.edu.ao',
      telefone: '+244 945 678 901',
      perfil: 'financeiro',
      status: 'ativo',
      ultimoAcesso: '2024-03-12T11:15:00',
      dataCriacao: '2024-02-15T14:00:00',
      permissoes: ['gestao_financeira', 'pagamentos', 'relatorios_financeiros']
    },
    {
      id: '5',
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@jomorais.edu.ao',
      telefone: '+244 956 789 012',
      perfil: 'professor',
      status: 'suspenso',
      ultimoAcesso: '2024-03-01T09:30:00',
      dataCriacao: '2024-01-20T16:00:00',
      permissoes: ['gestao_notas', 'disciplinas']
    }
  ]);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    perfil: 'professor',
    senha: '',
    confirmarSenha: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'secretario': return 'bg-blue-100 text-blue-800';
      case 'professor': return 'bg-green-100 text-green-800';
      case 'financeiro': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'suspenso': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <UserCheck className="h-4 w-4" />;
      case 'inativo': return <UserX className="h-4 w-4" />;
      case 'suspenso': return <Shield className="h-4 w-4" />;
      default: return <UserX className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPerfil = selectedPerfil === '' || usuario.perfil === selectedPerfil;
    const matchesStatus = selectedStatus === '' || usuario.status === selectedStatus;
    
    return matchesSearch && matchesPerfil && matchesStatus;
  });

  const getUsuariosPorPerfil = (perfil: string) => {
    return usuarios.filter(u => u.perfil === perfil).length;
  };

  const getUsuariosAtivos = () => {
    return usuarios.filter(u => u.status === 'ativo').length;
  };

  return (
    <Container>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Gestão de Usuários
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Controle de Acesso e Permissões</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie usuários do sistema, configure perfis de acesso, 
                defina permissões e monitore atividades dos usuários.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">{usuarios.length}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-blue-600">Total de Usuários</p>
            <p className="text-3xl font-bold text-gray-900">{usuarios.length}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-sm">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <UserCheck className="h-3 w-3 text-green-500" />
              <span className="font-bold text-xs text-green-600">{getUsuariosAtivos()}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-green-600">Usuários Ativos</p>
            <p className="text-3xl font-bold text-gray-900">{getUsuariosAtivos()}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Shield className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-xs text-yellow-600">{getUsuariosPorPerfil('admin')}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Administradores</p>
            <p className="text-3xl font-bold text-gray-900">{getUsuariosPorPerfil('admin')}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Settings className="h-3 w-3 text-purple-500" />
              <span className="font-bold text-xs text-purple-600">{getUsuariosPorPerfil('professor')}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Professores</p>
            <p className="text-3xl font-bold text-gray-900">{getUsuariosPorPerfil('professor')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Novo Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Novo Usuário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nome Completo
              </label>
              <Input
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do usuário"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@jomorais.edu.ao"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Telefone
              </label>
              <Input
                value={novoUsuario.telefone}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="+244 9xx xxx xxx"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Perfil de Acesso
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={novoUsuario.perfil}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, perfil: e.target.value }))}
              >
                <option value="professor">Professor</option>
                <option value="secretario">Secretário</option>
                <option value="financeiro">Financeiro</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="Senha do usuário"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Criar Usuário
              </Button>
            </div>
          </CardContent>
        </Card>

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
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedPerfil}
                  onChange={(e) => setSelectedPerfil(e.target.value)}
                >
                  <option value="">Todos os perfis</option>
                  <option value="admin">Administrador</option>
                  <option value="secretario">Secretário</option>
                  <option value="professor">Professor</option>
                  <option value="financeiro">Financeiro</option>
                </select>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
              </div>

              {/* Lista */}
              <div className="space-y-4">
                {filteredUsuarios.map((usuario) => (
                  <div key={usuario.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{usuario.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{usuario.telefone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          <Badge className={getPerfilColor(usuario.perfil)}>
                            {usuario.perfil}
                          </Badge>
                          <Badge className={getStatusColor(usuario.status)}>
                            {getStatusIcon(usuario.status)}
                            <span className="ml-1 capitalize">{usuario.status}</span>
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
                        <Calendar className="h-4 w-4" />
                        <span>Último acesso: {formatDate(usuario.ultimoAcesso)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em: {formatDate(usuario.dataCriacao)}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Permissões:</p>
                      <div className="flex flex-wrap gap-2">
                        {usuario.permissoes.map((permissao, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permissao.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
