"use client";

import React, { useState, useMemo } from 'react';
import Container from '@/components/layout/Container';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { Button } from '@/components/ui/button';
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
  Plus,
  MoreHorizontal,
  Edit,
  Users,
  Printer,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  FileText,
  UserX,
} from 'lucide-react';
import { useTurmaManagerPaginated } from '@/hooks';
import { TurmaReportService } from '@/services/turmaReport.service';
import api from '@/utils/api.utils';
import { ITurma } from '@/types/turma.types';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { toast } from 'react-toastify';

// Tipo para Ano Letivo
interface AnoLectivo {
  codigo: number;
  designacao: string;
}

export default function TurmasPage() {
  const {
    turmas,
    pagination,
    stats,
    isLoading,
    error,
    searchTerm,
    currentPage,
    handleSearch,
    handlePageChange,
    refetch
  } = useTurmaManagerPaginated();

  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [cursoFilter, setCursoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { statusOptions, courseOptions, periodoOptions } = useFilterOptions();

  // Estados para o modal de relatórios
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<ITurma | null>(null);
  const [reportType, setReportType] = useState<'single' | 'all'>('single');
  const [selectedAnoLectivo, setSelectedAnoLectivo] = useState<AnoLectivo | null>(null);
  const [anosLectivos, setAnosLectivos] = useState<AnoLectivo[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [loadingAnosLectivos, setLoadingAnosLectivos] = useState(false);

  // Filtrar turmas no frontend (enquanto backend não suporta filtros adicionais)
  const filteredTurmas = useMemo(() => {
    let filtered = turmas;

    if (periodoFilter !== "all") {
      filtered = filtered.filter(turma =>
        turma.tb_periodos?.codigo.toString() === periodoFilter
      );
    }

    if (cursoFilter !== "all") {
      filtered = filtered.filter(turma =>
        turma.tb_cursos?.codigo.toString() === cursoFilter
      );
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
  const generateStudentListPDF = async (turma: ITurma) => {
    setIsGeneratingPDF(true);
    try {
      await TurmaReportService.generateSingleTurmaPDF(turma);
      toast.success(`PDF da turma ${turma.designacao} gerado com sucesso!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF';
      toast.error(errorMessage);
    } finally {
      setIsGeneratingPDF(false);
      setShowReportModal(false);
    }
  };

  const generateAllTurmasPDF = async () => {
    if (!selectedAnoLectivo) {
      alert('Por favor, selecione um ano letivo');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await TurmaReportService.generateAllTurmasPDF(selectedAnoLectivo.codigo);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(errorMessage);
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

  // Usar dados da paginação do servidor combinados com filtros locais
  const totalPages = pagination.totalPages;
  const currentTurmas = filteredTurmas;

  const handleEditTurma = (turmaId: number) => {
    window.location.href = `/admin/academic-management/turmas/edit/${turmaId}`;
  };

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
      {/* Header usando WelcomeHeader */}
      <WelcomeHeader
        title="Gestão de Turmas"
        description="Gerencie todas as turmas do sistema educacional. Organize por cursos, períodos e classes, visualize informações detalhadas e mantenha o controle de matrículas e capacidade."
        iconMain={<School className="h-8 w-8 text-white" />}
        titleBtnLeft="Listar Alunos"
        iconBtnLeft={<Users className="w-5 h-5 mr-2" />}
        onClickBtnLeft={handleOpenModal}
        classNameBtnLeft="border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
        titleBtnRight="Nova Turma"
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/academic-management/turmas/add'}
      />

      {/* Stats Cards usando StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={School}
          title="Total de Turmas"
          value={stats.total.toString()}
          change="+7.3%"
          changeType="up"
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          icon={Users}
          title="Turmas Ativas"
          value={stats.active.toString()}
          change="+4.2%"
          changeType="up"
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Turmas Inativas"
          value={stats.inactive.toString()}
          change="Inativos"
          changeType="down"
          icon={UserX}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${totalPages || 1}`}
          change="Paginação"
          changeType="neutral"
          icon={Clock}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Filtros e Busca usando FilterSearchCard */}
      <FilterSearchCard
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por turma, classe, curso ou sala..."
        filters={[
          {
            label: "Período",
            value: periodoFilter,
            onChange: setPeriodoFilter,
            options: periodoOptions,
          },
          {
            label: "Curso",
            value: cursoFilter,
            onChange: setCursoFilter,
            options: courseOptions,
          },
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
          },
        ]}
      />

      {/* Tabela de Turmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <School className="h-5 w-5" />
              <span>Lista de Turmas</span>
            </div>
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
                Mostrando {((currentPage - 1) * pagination.itemsPerPage) + 1} a {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} turmas
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
                  setSelectedAnoLectivo(ano || null);
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
                    setSelectedTurma(turma || null);
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
