"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';
import React, { useState, useMemo } from 'react';
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
  Users,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';

import StatCard from '@/components/layout/StatCard';
import { WelcomeHeader } from '@/components/dashboard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { ConfirmDeleteStudentModal } from '@/components/student/confirm-delete-student-modal';

import { useRouter } from 'next/navigation';
import { calculateAge } from '@/utils/calculateAge.utils';
import { useFilterOptions } from '@/contexts/FilterOptionsContext';
import { toast } from 'react-toastify';
import { useStudentsQuery, useStudentStatisticsQuery } from '@/hooks/useQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StudentService from '@/services/student.service';

export default function ListStudentPage() {

  const router = useRouter();
  const queryClient = useQueryClient();

  // Usar Context para filtros (carregado uma única vez no layout)
  const { statusOptions, courseOptions } = useFilterOptions();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Usar React Query para carregar estudantes (com cache automático)
  const {
    data: studentsData,
    isLoading: loadingStudents,
  } = useStudentsQuery(
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter === 'all' ? null : statusFilter,
    courseFilter === 'all' ? null : courseFilter,
    true // enabled
  );

  // Usar React Query para carregar estatísticas (com cache automático)
  const {
    data: statistics,
    isLoading: loadingStats,
  } = useStudentStatisticsQuery(
    statusFilter === 'all' ? null : statusFilter,
    courseFilter === 'all' ? null : courseFilter,
    true // enabled
  );

  // Modal de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    codigo: number;
    nome: string;
    documento?: string;
    status: number;
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<{
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean>;
    info?: string;
  } | null>(null);

  // Mutation para deletar estudante
  const deleteMutation = useMutation({
    mutationFn: (studentId: number) => StudentService.deleteStudent(studentId),
    onSuccess: (response) => {
      toast.success('Aluno excluído com sucesso!');
      
      // Definir resultado para exibir detalhes
      setDeleteResult({
        tipo: 'cascade_delete',
        detalhes: (response as unknown as { detalhes?: Record<string, number | boolean> })?.detalhes || {},
        info: (response as unknown as { info?: string })?.info
      });

      // Invalidar queries para recarregar dados
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        queryClient.invalidateQueries({ queryKey: ['studentStatistics'] });
        setDeleteModalOpen(false);
        setStudentToDelete(null);
        setDeleteResult(null);
      }, 2000);
    },
    onError: (error: Error) => {
      setDeleteError(error.message || 'Erro ao excluir aluno. Tente novamente.');
    },
  });

  // Resetar para primeira página quando filtros mudarem
  useMemo(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, courseFilter]);

  // Handler para abrir modal de exclusão
  const handleDeleteClick = (student: { codigo: number; nome: string; n_documento_identificacao?: string; codigo_Status: number }) => {
    setStudentToDelete({
      codigo: student.codigo,
      nome: student.nome,
      documento: student.n_documento_identificacao,
      status: student.codigo_Status
    });
    setDeleteError(null);
    setDeleteResult(null);
    setDeleteModalOpen(true);
  };

  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    deleteMutation.mutate(studentToDelete.codigo);
  };

  // Handler para fechar modal
  const handleCloseDeleteModal = () => {
    if (!deleteMutation.isPending) {
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      setDeleteError(null);
      setDeleteResult(null);
    }
  };

  // Os estudantes vêm do React Query
  const displayStudents = studentsData?.students || [];
  const loading = loadingStudents;

  // Usar paginação do React Query
  const serverPagination = useMemo(() => {
    return studentsData?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    };
  }, [studentsData]);

  // Cálculos para exibição
  const startIndex = ((serverPagination.currentPage - 1) * serverPagination.itemsPerPage) + 1;
  const endIndex = Math.min(serverPagination.currentPage * serverPagination.itemsPerPage, serverPagination.totalItems);

  return (
    <Container>
     
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Alunos"
        description="Gerencie todos os alunos matriculados na instituição. Visualize informações detalhadas, acompanhe matrículas e mantenha os dados sempre atualizados."
        titleBtnRight='Novo Aluno'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/student-management/student/add'}
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Alunos"
          value={loadingStats ? "..." : (statistics?.totalAlunos || 0).toString()}
          change={loadingStats ? "Carregando..." : 'Total'}
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Alunos Ativos"
          value={loadingStats ? "..." : (statistics?.alunosAtivos || 0).toString()}
          change={loadingStats ? "Carregando..." : 'Ativos'}
          changeType="up"
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Alunos Inativos"
          value={loadingStats ? "..." : (statistics?.alunosInativos || 0).toString()}
          change={loadingStats ? "Carregando..." : 'Inativos'}
          changeType="down"
          icon={UserX}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />

        <StatCard
          title="Com Matrícula"
          value={loadingStats ? "..." : (statistics?.alunosComMatricula || 0).toString()}
          change={loadingStats ? "Carregando..." : 'Matrícula'}
          changeType="up"
          icon={UserCheck}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome, email, telefone, documento..."
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

      {/* Tabela de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Alunos ({displayStudents.length} na página)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59]"></div>
                        <span>Carregando página {currentPage}...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum aluno encontrado</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayStudents.map((student, index) => (
                    <TableRow key={student.codigo || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {student.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.nome}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {calculateAge(student.dataNascimento) !== "N/A"
                                  ? `${calculateAge(student.dataNascimento)} anos`
                                  : "Idade N/A"
                                }
                              </span>
                              <span>{student.sexo}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{student.telefone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{student.n_documento_identificacao || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{student.tb_tipo_documento?.designacao || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={student.codigo_Status === 1 ? "default" : "secondary"}
                          className={student.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {student.codigo_Status === 1 ? "Ativo" : "Inativo"}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/student-management/student/details/${student.codigo || 0}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/student-management/student/edit/${student.codigo || 0}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(student)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
          {serverPagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {serverPagination.totalItems} alunos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(serverPagination.totalPages, startPage + maxPagesToShow - 1);
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
                          disabled={loading}
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
                          disabled={loading}
                          className={currentPage === i ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Última página
                    if (endPage < serverPagination.totalPages) {
                      if (endPage < serverPagination.totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={serverPagination.totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(serverPagination.totalPages)}
                          disabled={loading}
                        >
                          {serverPagination.totalPages}
                        </Button>
                      );
                    }

                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, serverPagination.totalPages))}
                  disabled={currentPage === serverPagination.totalPages || loading}
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
      <ConfirmDeleteStudentModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
        loading={deleteMutation.isPending}
        error={deleteError}
        deleteResult={deleteResult}
      />
    </Container>
  );
}