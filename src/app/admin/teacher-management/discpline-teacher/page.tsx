"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { useDisciplinasDocente, useDeleteDisciplinaDocente } from '@/hooks/useDisciplineTeacher';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  BookOpen,
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
  GraduationCap,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  School,
} from 'lucide-react';

// Dados removidos - agora usando API real

const professorOptions = [
  { value: "all", label: "Todos os Professores" },
  { value: "joao", label: "João Silva Santos" },
  { value: "maria", label: "Maria Santos Costa" },
  { value: "carlos", label: "Carlos Mendes Lima" },
  { value: "ana", label: "Ana Costa Ferreira" },
];

const periodoOptions = [
  { value: "all", label: "Todos os Períodos" },
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

export default function TeacherDisciplinesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [professorFilter, setProfessorFilter] = useState("all");
  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nome: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Hooks da API
  const { data: disciplines, pagination, loading, error, refetch } = useDisciplinasDocente(currentPage, itemsPerPage, searchTerm);
  const { deleteDisciplinaDocente, loading: deleteLoading } = useDeleteDisciplinaDocente();

  // Funções de manipulação
  const handleDeleteClick = (discipline: any) => {
    setItemToDelete({
      id: discipline.codigo,
      nome: `${discipline.tb_docente.nome} - ${discipline.tb_disciplinas.designacao}`
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeletingId(itemToDelete.id);
      await deleteDisciplinaDocente(itemToDelete.id);
      await refetch(); // Recarregar dados
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir disciplina do docente:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleViewAssignment = (assignmentId: number) => {
    router.push(`/admin/teacher-management/discpline-teacher/details/${assignmentId}`);
  };

  const handleEditAssignment = (assignmentId: number) => {
    router.push(`/admin/teacher-management/discpline-teacher/edit/${assignmentId}`);
  };

  const handleDeleteAssignment = (assignmentId: number) => {
    const discipline = disciplines?.find(d => d.codigo === assignmentId);
    if (discipline) {
      handleDeleteClick(discipline);
    }
  };

  // Estatísticas baseadas nos dados reais da API
  const totalAtribuicoes = disciplines?.length || 0;
  const professoresUnicos = disciplines ? [...new Set(disciplines.map(d => d.tb_docente.nome))].length : 0;
  const cursosUnicos = disciplines ? [...new Set(disciplines.map(d => d.tb_cursos.designacao))].length : 0;
  const disciplinasUnicas = disciplines ? [...new Set(disciplines.map(d => d.tb_disciplinas.designacao))].length : 0;

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Disciplinas do Docente
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Atribuições de Disciplinas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie as atribuições de disciplinas aos professores. Visualize horários, 
                cargas horárias e organize a distribuição das disciplinas por docente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Horários
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/teacher-management/discpline-teacher/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Atribuição
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
        {/* Card Total de Atribuições */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Atribuições</p>
            <p className="text-3xl font-bold text-gray-900">{totalAtribuicoes}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Professores Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Ativos</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Professores Ativos</p>
            <p className="text-3xl font-bold text-gray-900">{professoresUnicos}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Carga Horária Total */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+5.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Cursos Únicos</p>
            <p className="text-3xl font-bold text-gray-900">{cursosUnicos}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Atribuições Ativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Ativas</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Disciplinas Únicas</p>
            <p className="text-3xl font-bold text-gray-900">{disciplinasUnicas}</p>
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
                  placeholder="Buscar por professor, disciplina, turma ou sala..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={professorFilter} onValueChange={setProfessorFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Professor" />
                </SelectTrigger>
                <SelectContent>
                  {professorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periodoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Atribuições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Atribuições de Disciplinas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination.totalItems} atribuições encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9CD1D]"></div>
              <span className="ml-2 text-gray-600">Carregando disciplinas do docente...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : !disciplines || disciplines.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhuma disciplina do docente encontrada</p>
              <p className="text-sm text-gray-500">Comece criando uma nova atribuição</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplines.map((discipline) => (
                    <TableRow key={discipline.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-[#F9CD1D]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{discipline.tb_docente.nome}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{discipline.tb_disciplinas.designacao}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {discipline.tb_cursos.designacao}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={deletingId === discipline.codigo}
                            >
                              {deletingId === discipline.codigo ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300"></div>
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewAssignment(discipline.codigo)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditAssignment(discipline.codigo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAssignment(discipline.codigo)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalItems)} de {pagination.totalItems} atribuições
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                          onClick={() => setCurrentPage(1)}
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
                          onClick={() => setCurrentPage(i)}
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
                          onClick={() => setCurrentPage(pagination.totalPages)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
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

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a atribuição de disciplina: <strong>{itemToDelete?.nome}</strong>?
              <br />
              <span className="text-red-600 text-sm mt-2 block">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
