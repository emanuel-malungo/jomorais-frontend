"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Container from '@/components/layout/Container';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useMatriculas, useDeleteMatricula } from '@/hooks/useMatricula';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';


import { useStatus } from '@/hooks/useStatusControl';
import { useCourses } from '@/hooks/useCourse';

export default function EnrollmentsListPage() {
  // Hooks da API
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { matriculas, pagination, loading, error, refetch } = useMatriculas(currentPage, itemsPerPage, debouncedSearchTerm);
  const { deleteMatricula } = useDeleteMatricula();


  const { status } = useStatus(1, 100, "");
  const { courses } = useCourses(1, 100, "");

  const statusOptions = useMemo(() => {
    const options = [{ value: "all", label: "Todos os Status" }];
    if (status && status.length > 0) {
      status.forEach((s) => {
        options.push({
          value: s.codigo.toString(),
          label: s.designacao
        });
      });
    }
    return options;
  }, [status]);

  const courseOptions = useMemo(() => {
    const options = [{ value: "all", label: "Todos os Cursos" }];
    if (courses && courses.length > 0) {
      courses.forEach((c) => {
        options.push({
          value: c.codigo.toString(),
          label: c.designacao
        });
      });
    }
    return options;
  }, [courses]);

  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, nome: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset para primeira página quando buscar
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filtrar matrículas localmente (apenas para filtros de status e curso)
  // A busca por texto já é feita pela API
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

      <WelcomeHeader
        title="Gestão de Matrículas"
        description="erencie todas as matrículas dos alunos. Visualize informações detalhadas, acompanhe confirmações e mantenha os registros sempre atualizados."
        titleBtnRight=' Nova Matrícula'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/student-management/enrolls/add'}
      />

      {/* Stats Cards seguindo padrão do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Card Total de Matrículas */}

        <StatCard
          title="Total de Matrículas"
          value={(pagination?.totalItems || 0).toString()}
          change="Total"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Matrículas Ativos"
          value={filteredMatriculas.filter(s => s.codigoStatus === 1).length.toString()}
          change="Ativos"
          changeType="up"
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Matrículas Com Confirmação"
          value={filteredMatriculas.filter(s => s.codigoStatus === 1).length.toString()}
          change="Confirmação"
          changeType="up"
          icon={BookOpen}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Matrículas Sem Confirmação"
          value={filteredMatriculas.filter(e => !e.tb_confirmacoes || e.tb_confirmacoes.length === 0).length.toString()}
          change="Atenção"
          changeType="up"
          icon={Clock}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600 "
        />
      </div>

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por aluno ou curso..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            width: "w-48"
          },
          {
            label: "Curso",
            value: courseFilter,
            onChange: setCourseFilter,
            options: courseOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Matrículas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Matrículas</span>
            </div>
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
                            <DropdownMenuItem onClick={() => handleEditEnrollment(enrollment.codigo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
