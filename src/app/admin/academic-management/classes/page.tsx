"use client";

import React from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Users,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  School,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { useClassManager, useDeleteClass } from '@/hooks/useClass';
import { ClassModal } from '@/components/classes/classes-modal';
import { ConfirmDeleteModal } from '@/components/classes/confirm-delete-modal';

export default function ClassesPage() {
  const {
    classes,
    pagination,
    stats,
    isLoading,
    error,
    currentPage,
    searchTerm,
    limit,
    selectedClass,
    isModalOpen,
    isDeleteModalOpen,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    refetch,
  } = useClassManager();

  const { deleteClass, isLoading: deleting, error: deleteError } = useDeleteClass();

  const handleDeleteConfirm = async () => {
    if (selectedClass) {
      try {
        await deleteClass(selectedClass.codigo);
        closeDeleteModal();
        refetch();
      } catch (error) {
        console.error('Erro ao deletar classe:', error);
      }
    }
  };

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Classes
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Classes Acadêmicas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as classes do sistema educacional. Organize por níveis de ensino, 
                visualize informações detalhadas e mantenha a estrutura curricular sempre atualizada.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Dados
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={openCreateModal}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Classe
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards seguindo padrão do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Card Total de Classes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+5.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Classes</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Classes Ativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">Ativas</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Classes Ativas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Classes Inativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-red-500" />
              <span className="font-bold text-xs text-red-600">Inativas</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-600">Classes Inativas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Paginação */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Página {currentPage}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Total de Páginas</p>
            <p className="text-3xl font-bold text-gray-900">{pagination?.totalPages || 0}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por classe..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={limit.toString()} onValueChange={(value) => handleLimitChange(parseInt(value))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Items por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Lista de Classes</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination?.totalItems || 0} classes encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Classe</TableHead>
                  <TableHead>Nota Máxima</TableHead>
                  <TableHead>Exame</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F9CD1D]"></div>
                        <span>Carregando classes...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-red-600">
                        <p>Erro ao carregar classes: {error}</p>
                        <Button onClick={refetch} variant="outline" className="mt-2">
                          Tentar novamente
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma classe encontrada</p>
                        <Button onClick={openCreateModal} variant="outline" className="mt-2">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar primeira classe
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((classe) => (
                    <TableRow key={classe.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-[#F9CD1D]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{classe.designacao}</p>
                            <p className="text-sm text-gray-500">Código: {classe.codigo}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{classe.notaMaxima}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={classe.exame ? "default" : "secondary"}>
                          {classe.exame ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={classe.status === 1 ? "default" : "secondary"}
                          className={classe.status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {classe.status === 1 ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditModal(classe)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => openDeleteModal(classe)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * limit) + 1} a {Math.min(currentPage * limit, pagination.totalItems)} de {pagination.totalItems} classes
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
                    const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);
                    
                    const pages = [];
                    
                    // Primeira página
                    if (adjustedStartPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </Button>
                      );
                      if (adjustedStartPage > 2) {
                        pages.push(<span key="ellipsis1" className="px-2">...</span>);
                      }
                    }
                    
                    // Páginas do meio
                    for (let i = adjustedStartPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className={currentPage === i ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }
                    
                    // Última página
                    if (endPage < pagination.totalPages) {
                      if (endPage < pagination.totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={pagination.totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.totalPages)}
                        >
                          {pagination.totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <ClassModal
        open={isModalOpen}
        onOpenChange={closeModal}
        classItem={selectedClass}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Excluir Classe"
        description={`Tem certeza que deseja excluir a classe "${selectedClass?.designacao}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
        error={deleteError}
      />
    </Container>
  );
}
