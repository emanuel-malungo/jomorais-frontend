"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  School,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Upload,
  Users,
  FileText,
  Printer,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Activity,
} from 'lucide-react';
import { useTurmaManager } from '@/hooks';
import { TurmaReportService } from '@/services/turmaReport.service';
import api from '@/utils/api.utils';

// Dados vêm da API real através do hook useTurmaManager

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

export default function TurmasPage() {
  const {
    turmas,
    pagination,
    stats,
    isLoading,
    error,
    currentPage,
    searchTerm,
    limit,
    handleSearch,
    handlePageChange,
    refetch
  } = useTurmaManager();
  
  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [cursoFilter, setCursoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Opções de curso dinâmicas baseadas nos dados reais
  const cursoOptions = useMemo(() => {
    const cursosUnicos = Array.from(new Set(
      turmas
        .filter((turma: any) => turma.tb_cursos?.designacao)
        .map((turma: any) => turma.tb_cursos!.designacao)
    ));
    
    return [
      { value: "all", label: "Todos os Cursos" },
      ...cursosUnicos.map((curso: string) => ({
        value: curso.toLowerCase().replace(/\s+/g, '-'),
        label: curso
      }))
    ];
  }, [turmas]);
  
  // Estados para o modal de relatórios
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<any>(null);
  const [reportType, setReportType] = useState<'single' | 'all'>('single');
  const [selectedAnoLectivo, setSelectedAnoLectivo] = useState<any>(null);
  const [anosLectivos, setAnosLectivos] = useState<any[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [loadingAnosLectivos, setLoadingAnosLectivos] = useState(false);

  // Os dados são carregados automaticamente pelo hook useTurmaManager

  // Aplicar filtros locais aos dados da API
  const filteredTurmas = useMemo(() => {
    let filtered = turmas;

    if (periodoFilter !== "all") {
      filtered = filtered.filter(turma => 
        turma.tb_periodos?.designacao.toLowerCase() === periodoFilter
      );
    }

    if (cursoFilter !== "all") {
      filtered = filtered.filter(turma => {
        const cursoName = turma.tb_cursos?.designacao.toLowerCase() || '';
        switch (cursoFilter) {
          case "informatica":
            return cursoName.includes("informática");
          case "contabilidade":
            return cursoName.includes("contabilidade");
          case "administracao":
            return cursoName.includes("administração");
          case "secretariado":
            return cursoName.includes("secretariado");
          case "electronica":
            return cursoName.includes("electrónica");
          default:
            return true;
        }
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(turma => 
        turma.status?.toLowerCase() === statusFilter
      );
    }

    return filtered;
  }, [turmas, periodoFilter, cursoFilter, statusFilter]);

  // Função para carregar anos letivos
  const loadAnosLectivos = async () => {
    setLoadingAnosLectivos(true);
    try {
      const response = await api.get('/api/academic-management/anos-lectivos');
      if (response.data.success) {
        setAnosLectivos(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar anos letivos:', error);
    } finally {
      setLoadingAnosLectivos(false);
    }
  };

  // Carregar anos letivos quando o modal abrir
  const handleOpenModal = () => {
    setShowReportModal(true);
    loadAnosLectivos();
  };

  // Funções para geração de PDF
  const generateStudentListPDF = async (turma: any) => {
    setIsGeneratingPDF(true);
    try {
      console.log('Gerando PDF para turma:', turma);
      await TurmaReportService.generateSingleTurmaPDF(turma);
      alert(`PDF da turma ${turma.designacao} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
    } finally {
      setIsGeneratingPDF(false);
      setShowReportModal(false);
    }
  };

  const generateAllTurmasPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('Gerando PDF para todas as turmas do ano letivo:', selectedAnoLectivo);
      
      if (!selectedAnoLectivo) {
        throw new Error('Ano letivo é obrigatório');
      }
      
      await TurmaReportService.generateAllTurmasPDF(selectedAnoLectivo.codigo);
      alert(`PDF de todas as turmas do ano letivo ${selectedAnoLectivo.designacao} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao gerar PDF: ${errorMessage}`);
    } finally {
      setIsGeneratingPDF(false);
      setShowReportModal(false);
    }
  };

  const handleGeneratePDF = () => {
    if (reportType === 'single' && selectedTurma) {
      generateStudentListPDF(selectedTurma);
    } else if (reportType === 'all') {
      generateAllTurmasPDF();
    }
  };

  // Usar dados diretamente da API (já paginados)
  const currentTurmas = turmas;
  const totalPages = pagination?.totalPages || 1;


  const handleEditTurma = (turmaId: number) => {
    window.location.href = `/admin/academic-management/turmas/edit/${turmaId}`;
  };

  const handleDeleteTurma = (turmaId: number) => {
    console.log("Excluir turma:", turmaId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas das turmas baseadas nos dados da API
  const estatisticasTurmas = [
    { periodo: "Manhã", count: turmas.filter(t => t.tb_periodos?.designacao === "Manhã").length },
    { periodo: "Tarde", count: turmas.filter(t => t.tb_periodos?.designacao === "Tarde").length },
    { periodo: "Noite", count: turmas.filter(t => t.tb_periodos?.designacao === "Noite").length }
  ];

  // Em produção, dados de matrícula viriam de endpoint específico
  const totalMatriculados = 0; // Placeholder
  const totalCapacidade = turmas.reduce((sum, turma) => sum + (turma.max_Alunos || 0), 0);
  const ocupacao = '0'; // Placeholder até integrar com API de matrículas

  // Estados de loading e error
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B6C4D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando turmas...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar turmas</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <School className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Turmas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Turmas Acadêmicas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as turmas do sistema educacional. Organize por cursos, períodos e classes, 
                visualize informações detalhadas e mantenha o controle de matrículas e capacidade.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Turmas
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Turmas
              </Button>

              <Button
                onClick={handleOpenModal}
                variant="outline"
                className="px-6 py-3 rounded-xl font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Listar Alunos
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/academic-management/turmas/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Turma
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
        {/* Card Total de Turmas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <School className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+7.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Turmas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Total de Alunos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+4.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Total Matriculados</p>
            <p className="text-3xl font-bold text-gray-900">{totalMatriculados}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Capacidade Total */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Estável</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Capacidade Total</p>
            <p className="text-3xl font-bold text-gray-900">{totalCapacidade}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Taxa de Ocupação */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+2.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Taxa de Ocupação</p>
            <p className="text-3xl font-bold text-gray-900">{ocupacao}%</p>
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
                  placeholder="Buscar por turma, classe, curso ou sala..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
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

              <Select value={cursoFilter} onValueChange={setCursoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursoOptions.map((option) => (
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

      {/* Tabela de Turmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <School className="h-5 w-5" />
              <span>Lista de Turmas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination?.totalItems || turmas.length} turmas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Classe/Curso</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTurmas.map((turma) => (
                  <TableRow key={turma.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <School className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{turma.designacao}</p>
                          <p className="text-sm text-gray-500">Código: {turma.codigo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{turma.tb_classes?.designacao || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{turma.tb_cursos?.designacao || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{turma.tb_salas?.designacao || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {turma.tb_periodos?.designacao || 'N/A'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        {turma.max_Alunos || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={turma.status === "Ativo" ? "default" : "secondary"}
                        className={turma.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {turma.status || 'Ativo'}
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
                          <DropdownMenuItem onClick={() => handleEditTurma(turma.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTurma(turma.codigo)}
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
Mostrando {((currentPage - 1) * limit) + 1} a {Math.min(currentPage * limit, pagination?.totalItems || 0)} de {pagination?.totalItems || 0} turmas
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
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
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
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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

      {/* Modal de Relatórios de Alunos */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Relatório de Alunos por Turma
            </DialogTitle>
            <DialogDescription>
              Selecione o tipo de relatório que deseja gerar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Filtro por Ano Letivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ano Letivo *
              </label>
              <Select
                value={selectedAnoLectivo?.codigo?.toString() || ""}
                onValueChange={(value) => {
                  const ano = anosLectivos.find(a => a.codigo.toString() === value);
                  setSelectedAnoLectivo(ano);
                }}
                disabled={loadingAnosLectivos}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingAnosLectivos ? "Carregando..." : "Selecione o ano letivo"} />
                </SelectTrigger>
                <SelectContent>
                  {anosLectivos.map((ano) => (
                    <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                      {ano.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Relatório */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Tipo de Relatório
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="single"
                    name="reportType"
                    value="single"
                    checked={reportType === 'single'}
                    onChange={(e) => setReportType(e.target.value as 'single' | 'all')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="single" className="text-sm text-gray-700">
                    Turma Específica
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="all"
                    name="reportType"
                    value="all"
                    checked={reportType === 'all'}
                    onChange={(e) => setReportType(e.target.value as 'single' | 'all')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="all" className="text-sm text-gray-700">
                    Todas as Turmas
                  </label>
                </div>
              </div>
            </div>

            {/* Seleção de Turma (se tipo for 'single') */}
            {reportType === 'single' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Selecionar Turma
                </label>
                <Select
                  value={selectedTurma?.codigo?.toString() || ""}
                  onValueChange={(value) => {
                    const turma = turmas.find(t => t.codigo.toString() === value);
                    setSelectedTurma(turma);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas
                      .filter(turma => !selectedAnoLectivo || turma.codigo_AnoLectivo === selectedAnoLectivo?.codigo)
                      .map((turma) => (
                        <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{turma.designacao}</span>
                            <span className="text-xs text-gray-500">
                              {turma.tb_classes?.designacao} - {turma.tb_cursos?.designacao}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF || !selectedAnoLectivo || (reportType === 'single' && !selectedTurma)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar PDF
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF || !selectedAnoLectivo || (reportType === 'single' && !selectedTurma)}
                variant="outline"
                className="flex-1"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Imprimindo...
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
