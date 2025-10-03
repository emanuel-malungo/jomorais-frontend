"use client";

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Loader2,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { useMatriculas, useCreateMatricula, useUpdateMatricula, useDeleteMatricula } from '@/hooks/useMatricula';
import { IMatriculaInput } from '@/types/matricula.types';

// Dados de configuração para filtros
const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativa" },
  { value: "0", label: "Inativa" },
];

const courseOptions = [
  { value: "all", label: "Todos os Cursos" },
  { value: "1", label: "Informática de Gestão" },
  { value: "2", label: "Contabilidade" },
  { value: "3", label: "Administração" },
  { value: "4", label: "Marketing" },
];

export default function EnrollmentsListPage() {
  // Hooks da API
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { matriculas, pagination, loading, error, refetch } = useMatriculas(currentPage, itemsPerPage, debouncedSearchTerm);
  const { createMatricula, loading: createLoading } = useCreateMatricula();
  const { deleteMatricula, loading: deleteLoading } = useDeleteMatricula();
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  
  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, nome: string} | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset para primeira página quando buscar
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filtrar matrículas localmente
  const filteredMatriculas = matriculas.filter((matricula: any) => {
    // Filtro por status
    if (statusFilter !== "all" && matricula.codigoStatus.toString() !== statusFilter) {
      return false;
    }
    
    // Filtro por curso
    if (courseFilter !== "all" && matricula.codigo_Curso.toString() !== courseFilter) {
      return false;
    }
    
    return true;
  });

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, courseFilter]);

  // Funções para gerenciar matrículas
  const handleDeleteClick = (matricula: any) => {
    setItemToDelete({ id: matricula.codigo, nome: matricula.tb_alunos.nome });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeletingId(itemToDelete.id);
    setShowDeleteModal(false);
    
    try {
      await deleteMatricula(itemToDelete.id);
      await refetch();
    } catch (error: any) {
      console.error('Erro ao excluir matrícula:', error);
      alert(`Erro ao excluir matrícula: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleViewEnrollment = (enrollmentId: number) => {
    window.location.href = `/admin/student-management/enrolls/details/${enrollmentId}`;
  };

  const handleEditEnrollment = (enrollmentId: number) => {
    window.location.href = `/admin/student-management/enrolls/edit/${enrollmentId}`;
  };

  const handleDeleteEnrollment = (enrollmentId: number) => {
    const matricula = matriculas.find(m => m.codigo === enrollmentId);
    if (matricula) {
      handleDeleteClick(matricula);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
                    Matrículas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Matrículas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as matrículas dos alunos. Visualize informações detalhadas,
                acompanhe confirmações e mantenha os registros sempre atualizados.
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
                onClick={() => window.location.href = '/admin/student-management/enrolls/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Matrícula
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
        {/* Card Total de Matrículas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+12.5%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Matrículas</p>
            <p className="text-3xl font-bold text-gray-900">{filteredMatriculas.length}</p>
            {filteredMatriculas.length !== matriculas.length && (
              <p className="text-xs text-gray-500">de {matriculas.length} total</p>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Matrículas Ativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Matrículas Ativas</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredMatriculas.filter(e => e.codigoStatus === 1).length}
            </p>
            {filteredMatriculas.filter(e => e.codigoStatus === 1).length !== matriculas.filter(e => e.codigoStatus === 1).length && (
              <p className="text-xs text-gray-500">de {matriculas.filter(e => e.codigoStatus === 1).length} total</p>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Com Confirmação */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+5.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Com Confirmação</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredMatriculas.filter(e => e.tb_confirmacoes && e.tb_confirmacoes.length > 0).length}
            </p>
            {filteredMatriculas.filter(e => e.tb_confirmacoes && e.tb_confirmacoes.length > 0).length !== matriculas.filter(e => e.tb_confirmacoes && e.tb_confirmacoes.length > 0).length && (
              <p className="text-xs text-gray-500">de {matriculas.filter(e => e.tb_confirmacoes && e.tb_confirmacoes.length > 0).length} total</p>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Pendentes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Atenção</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-600">Sem Confirmação</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredMatriculas.filter(e => !e.tb_confirmacoes || e.tb_confirmacoes.length === 0).length}
            </p>
            {filteredMatriculas.filter(e => !e.tb_confirmacoes || e.tb_confirmacoes.length === 0).length !== matriculas.filter(e => !e.tb_confirmacoes || e.tb_confirmacoes.length === 0).length && (
              <p className="text-xs text-gray-500">de {matriculas.filter(e => !e.tb_confirmacoes || e.tb_confirmacoes.length === 0).length} total</p>
            )}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por aluno ou curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
            <div className="md:w-48">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  {courseOptions.map((option) => (
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

      {/* Tabela de Matrículas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Matrículas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination?.totalItems || 0} matrículas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Data Matrícula</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confirmação</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#F9CD1D]" />
                      <p className="mt-2 text-gray-600">Carregando matrículas...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={() => refetch()} variant="outline">
                        Tentar novamente
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : filteredMatriculas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-600">
                          {searchTerm || statusFilter !== "all" || courseFilter !== "all" 
                            ? "Nenhuma matrícula encontrada com os filtros aplicados." 
                            : "Nenhuma matrícula encontrada."}
                        </p>
                        {(searchTerm || statusFilter !== "all" || courseFilter !== "all") && (
                          <p className="text-sm text-gray-500">Tente ajustar os filtros de busca.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatriculas.map((enrollment) => (
                  <TableRow key={enrollment.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.tb_alunos.nome}</p>
                          <p className="text-sm text-gray-500">
                            {enrollment.tb_alunos.dataNascimento ? calculateAge(enrollment.tb_alunos.dataNascimento) : 'N/A'} anos • {enrollment.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{enrollment.tb_cursos.designacao}</p>
                        <p className="text-sm text-gray-500">{enrollment.tb_cursos.duracao}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{formatDate(enrollment.data_Matricula)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={enrollment.codigoStatus === 1 ? "default" : "secondary"}
                        className={enrollment.codigoStatus === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {enrollment.codigoStatus === 1 ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0 ? (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmada
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium">{enrollment.tb_confirmacoes[0].tb_turmas.designacao}</p>
                          <p className="text-xs text-gray-500">{enrollment.tb_confirmacoes[0].tb_turmas.tb_classes.designacao}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Não atribuída</span>
                      )}
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
                          <DropdownMenuItem onClick={() => handleViewEnrollment(enrollment.codigo)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEnrollment(enrollment.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEnrollment(enrollment.codigo)}
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
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} matrículas
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
                  disabled={currentPage === pagination.totalPages || loading}
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
            <DialogDescription className="text-left">
              Tem certeza que deseja excluir a matrícula de{' '}
              <span className="font-semibold text-gray-900">
                {itemToDelete?.nome}
              </span>
              ?
              <br />
              <br />
              <span className="text-red-600 font-medium">
                Esta ação não pode ser desfeita.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deletingId !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deletingId !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId === itemToDelete?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
