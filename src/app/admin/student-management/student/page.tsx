"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
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
} from 'lucide-react';

import StatCard from '@/components/layout/StatCard';
import { WelcomeHeader } from '@/components/dashboard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

import { useRouter } from 'next/navigation';
import useStudent from '@/hooks/useStudent';
import { Student } from '@/types/student.types';
import { calculateAge } from '@/utils/calculateAge.utils';
import useFilterOptions from '@/hooks/useFilterOptions';

export default function ListStudentPage() {

  const { students, loading, pagination, getAllStudents, deleteStudent } = useStudent();
  const router = useRouter();

  // Usar hook de opções de filtros
  const { statusOptions, courseOptions } = useFilterOptions();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados para modal de confirmação de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Carregar estudantes do backend quando filtros mudarem
  useEffect(() => {
    getAllStudents(currentPage, itemsPerPage, searchTerm, statusFilter, courseFilter);
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, courseFilter, getAllStudents]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, courseFilter]);

  // Os estudantes já vêm filtrados do backend
  const displayStudents = students;

  // Usar paginação do backend
  const serverPagination = useMemo(() => {
    return pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    };
  }, [pagination]);

  // Cálculos para exibição
  const startIndex = ((serverPagination.currentPage - 1) * serverPagination.itemsPerPage) + 1;
  const endIndex = Math.min(serverPagination.currentPage * serverPagination.itemsPerPage, serverPagination.totalItems);

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      setDeleting(true);
      await deleteStudent(studentToDelete.codigo!);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      // Recarregar TODOS os alunos após exclusão (mesmo comportamento do carregamento inicial)
      await getAllStudents(1, 1000);
      // Resetar para primeira página se a página atual ficar vazia
      const totalStudentsAfterDelete = students.length - 1;
      const totalPagesAfterDelete = Math.ceil(totalStudentsAfterDelete / itemsPerPage);
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }
      // Toast de sucesso já é exibido pelo StudentService.deleteStudent
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteStudent = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

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
          value={(pagination?.totalItems || 0).toString()}
          change="Total"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Alunos Ativos"
          value={students.filter(s => s.codigo_Status === 1).length.toString()}
          change="Ativos"
          changeType="up"
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Alunos Inativos"
          value={students.filter(s => s.codigo_Status !== 1).length.toString()}
          change="Inativos"
          changeType="down"
          icon={UserX}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${serverPagination.totalPages}`}
          change="Paginação"
          changeType="neutral"
          icon={UserX}
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
            Alunos da Página {currentPage} ({displayStudents.length} alunos)
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {serverPagination.totalPages} - Total: {serverPagination.totalItems} alunos
          </CardDescription>
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
                            {/* <DropdownMenuItem 
                              onClick={() => handleDeleteStudent(student.codigo || 0)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem> */}
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
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir o aluno <strong>{studentToDelete?.nome}</strong>?
              <br />
              <span className="text-red-600 text-sm mt-2 block">
                Esta ação não pode ser desfeita. Todos os dados relacionados ao aluno serão removidos.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDeleteStudent}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteStudent}
              disabled={deleting}
            >
              {deleting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Excluindo...</span>
                </div>
              ) : (
                'Excluir Aluno'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}