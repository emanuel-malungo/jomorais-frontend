"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useConfirmations, useDeleteConfirmation } from '@/hooks/useConfirmation';
import { IConfirmation } from '@/types/confirmation.types';
import { useToast, ToastContainer } from '@/components/ui/toast';
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
  UserCheck,
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
  Clock,
  School,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

// Opções para filtros
const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativa" },
  { value: "0", label: "Inativa" },
];

const classificationOptions = [
  { value: "all", label: "Todas as Classificações" },
  { value: "Aprovado", label: "Aprovado" },
  { value: "Pendente", label: "Pendente" },
  { value: "Reprovado", label: "Reprovado" },
];

const academicYearOptions = [
  { value: "all", label: "Todos os Anos" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2025", label: "2025" },
];


export default function ConfirmationsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Hook para buscar confirmações da API
  const { 
    confirmations, 
    pagination, 
    loading: isLoading, 
    error, 
    refetch: fetchConfirmations 
  } = useConfirmations(currentPage, itemsPerPage, searchTerm);
  
  // Hook para deletar confirmações
  const { deleteConfirmation, loading: deletingConfirmation } = useDeleteConfirmation();
  
  // Hook para toasts
  const { toasts, removeToast, success, error: showError, warning } = useToast();
  
  // Estados derivados
  const [filteredConfirmations, setFilteredConfirmations] = useState<IConfirmation[]>(confirmations || []);

  // Aplicar filtros locais (além da busca que já é feita na API)
  useEffect(() => {
    if (!confirmations) {
      setFilteredConfirmations([]);
      return;
    }

    let filtered = confirmations;

    // Filtros locais (a busca por texto já é feita na API)
    if (statusFilter !== "all") {
      filtered = filtered.filter((confirmation: IConfirmation) => 
        confirmation.codigo_Status.toString() === statusFilter
      );
    }

    if (classificationFilter !== "all") {
      filtered = filtered.filter((confirmation: IConfirmation) => 
        confirmation.classificacao === classificationFilter
      );
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter((confirmation: IConfirmation) => 
        confirmation.codigo_Ano_lectivo.toString() === yearFilter
      );
    }

    setFilteredConfirmations(filtered);
  }, [statusFilter, classificationFilter, yearFilter, confirmations]);

  // Recarregar quando mudar a busca (com debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchConfirmations();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchConfirmations]);

  // Recarregar quando mudar a página
  useEffect(() => {
    fetchConfirmations();
  }, [currentPage, fetchConfirmations]);

  // Usar paginação da API quando disponível, senão usar paginação local
  const totalPages = pagination?.totalPages || Math.ceil(filteredConfirmations.length / itemsPerPage);
  const totalItems = pagination?.totalItems || filteredConfirmations.length;
  
  // Se estamos usando paginação da API, mostrar todos os itens filtrados
  // Se não, fazer paginação local
  const currentConfirmations = pagination ? filteredConfirmations : (() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredConfirmations.slice(startIndex, endIndex);
  })();
  
  const startIndex = pagination ? ((currentPage - 1) * itemsPerPage) + 1 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = pagination ? Math.min(currentPage * itemsPerPage, totalItems) : Math.min(currentPage * itemsPerPage, filteredConfirmations.length);

  const handleViewConfirmation = (confirmationId: number) => {
    window.location.href = `/admin/student-management/confirmations/details/${confirmationId}`;
  };

  const handleEditConfirmation = (confirmationId: number) => {
    window.location.href = `/admin/student-management/confirmations/edit/${confirmationId}`;
  };

  const handleDeleteConfirmation = async (confirmationId: number) => {
    const confirmation = confirmations?.find(c => c.codigo === confirmationId);
    const studentName = confirmation?.tb_matriculas?.tb_alunos?.nome || 'Aluno';
    
    if (window.confirm(`Tem certeza que deseja excluir a confirmação de ${studentName}?`)) {
      try {
        await deleteConfirmation(confirmationId);
        success(
          'Confirmação excluída com sucesso!',
          `A confirmação de ${studentName} foi removida do sistema.`
        );
        fetchConfirmations(); // Recarregar a lista
      } catch (error) {
        showError(
          'Erro ao excluir confirmação',
          error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
        );
      }
    }
  };

  // Verificar se há mensagens de sucesso na URL (vindas de outras páginas)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('success');
    const errorMessage = urlParams.get('error');
    
    if (successMessage) {
      switch (successMessage) {
        case 'created':
          success('Confirmação criada com sucesso!', 'A nova confirmação foi adicionada ao sistema.');
          break;
        case 'updated':
          success('Confirmação alterada com sucesso!', 'As informações da confirmação foram atualizadas.');
          break;
        case 'deleted':
          success('Confirmação excluída com sucesso!', 'A confirmação foi removida do sistema.');
          break;
        default:
          success('Operação realizada com sucesso!');
      }
      
      // Limpar a URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    if (errorMessage) {
      showError('Erro na operação', decodeURIComponent(errorMessage));
      // Limpar a URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [success, showError]);

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
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Confirmações
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Confirmações de Turma</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as confirmações de turma dos alunos. Visualize informações detalhadas,
                acompanhe classificações e mantenha os registros sempre atualizados.
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
                onClick={() => window.location.href = '/admin/student-management/confirmations/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Confirmação
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
        {/* Card Total de Confirmações */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+15.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Confirmações</p>
            <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Confirmações Ativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.7%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Confirmações Ativas</p>
            <p className="text-3xl font-bold text-gray-900">
              {confirmations?.filter((c: IConfirmation) => c.codigo_Status === 1).length || 0}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Aprovados */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+12.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Aprovados</p>
            <p className="text-3xl font-bold text-gray-900">
              {confirmations?.filter((c: IConfirmation) => c.classificacao === "Aprovado").length || 0}
            </p>
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
            <p className="text-sm font-semibold mb-2 text-red-600">Pendentes</p>
            <p className="text-3xl font-bold text-gray-900">
              {confirmations?.filter((c: IConfirmation) => c.classificacao === "Pendente").length || 0}
            </p>
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
                  placeholder="Buscar por aluno, turma ou classificação..."
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
              <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Classificação" />
                </SelectTrigger>
                <SelectContent>
                  {classificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano Letivo" />
                </SelectTrigger>
                <SelectContent>
                  {academicYearOptions.map((option) => (
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

      {/* Tabela de Confirmações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Confirmações</span>
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F9CD1D]"></div>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">
                <strong>Erro ao carregar confirmações:</strong> {error}
              </p>
              <Button 
                onClick={() => fetchConfirmations()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          )}
          
          {isLoading && !confirmations?.length ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9CD1D]"></div>
              <span className="ml-2 text-gray-600">Carregando confirmações...</span>
            </div>
          ) : currentConfirmations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma confirmação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Tente ajustar os filtros ou criar uma nova confirmação
              </p>
            </div>
          ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Data Confirmação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentConfirmations.map((confirmation) => (
                  <TableRow key={confirmation.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{confirmation.tb_matriculas.tb_alunos.nome}</p>
                          <p className="text-sm text-gray-500">
                            {confirmation.tb_matriculas.tb_alunos.dataNascimento ? calculateAge(confirmation.tb_matriculas.tb_alunos.dataNascimento) : 'N/A'} anos • {confirmation.tb_matriculas.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{confirmation.tb_turmas.designacao}</p>
                        <p className="text-sm text-gray-500">
                          {confirmation.tb_turmas.tb_classes.designacao} • {confirmation.tb_turmas.tb_periodos.designacao}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{confirmation.tb_matriculas.tb_cursos.designacao}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{confirmation.data_Confirmacao ? formatDate(confirmation.data_Confirmacao) : 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={confirmation.codigo_Status === 1 ? "default" : "secondary"}
                        className={confirmation.codigo_Status === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                      >
                        {confirmation.codigo_Status === 1 ? "Ativa" : "Inativa"}
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
                          <DropdownMenuItem onClick={() => handleViewConfirmation(confirmation.codigo)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditConfirmation(confirmation.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* <DropdownMenuItem 
                            onClick={() => handleDeleteConfirmation(confirmation.codigo)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} confirmações
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
                    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
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
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Container>
  );
}