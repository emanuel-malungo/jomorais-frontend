"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Trash2,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';



import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

import useStudent from '@/hooks/useStudent';
import { Student } from '@/types/student.types';
import { useStatus } from '@/hooks/useStatusControl';
import { useCourses } from '@/hooks/useCourse';

export default function ListStudentPage() {
  const { students, loading, pagination, getAllStudents, deleteStudent } = useStudent();


  // Buscar dados de status e cursos
  const { status } = useStatus(1, 100, ""); // Carregar todos os status
  const { courses } = useCourses(1, 100, ""); // Carregar todos os cursos
  
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para modal de confirmação de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Criar opções de status dinamicamente
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

  // Criar opções de cursos dinamicamente
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

  // Carregar TODOS os estudantes para pesquisa global
  useEffect(() => {
    getAllStudents(1, 1000); // Carregar até 1000 estudantes
  }, [getAllStudents]);

  // Filtrar estudantes (aplicado aos dados da página atual)
  useEffect(() => {
    let filtered = students;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.telefone?.includes(searchTerm) ||
        student.n_documento_identificacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.pai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mae?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => 
        student.codigo_Status.toString() === statusFilter
      );
    }

    // Filtro por curso
    if (courseFilter !== "all") {
      filtered = filtered.filter(student => {
        if (!student.tb_matriculas) return false;
        return student.tb_matriculas.tb_cursos.codigo.toString() === courseFilter;
      });
    }

    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, courseFilter, students]);

  // Paginação local dos resultados filtrados
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Cálculo da paginação local
  const localPagination = useMemo(() => {
    const totalItems = filteredStudents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [filteredStudents.length, currentPage, itemsPerPage]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, courseFilter]);

  // Cálculos para exibição
  const startIndex = ((currentPage - 1) * itemsPerPage) + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, localPagination.totalItems);

  const handleViewStudent = (studentId: number) => {
    window.location.href = `/admin/student-management/student/details/${studentId}`;
  };

  const handleEditStudent = (studentId: number) => {
    window.location.href = `/admin/student-management/student/edit/${studentId}`;
  };

  const handleDeleteStudent = (studentId: number) => {
    const student = students.find(s => s.codigo === studentId);
    if (student) {
      setStudentToDelete(student);
      setDeleteModalOpen(true);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: any) => {
    // Se o birthDate for um objeto vazio ou inválido, retorna "N/A"
    if (!birthDate || typeof birthDate === 'object' && Object.keys(birthDate).length === 0) {
      return "N/A";
    }
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      // Verifica se a data é válida
      if (isNaN(birth.getTime())) {
        return "N/A";
      }
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age.toString();
    } catch (error) {
      return "N/A";
    }
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
          change="+8.2%"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Alunos Ativos"
          value={students.filter(s => s.codigo_Status === 1).length.toString()}
          change="+3.5%"
          changeType="up"
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Com Matrícula"
          value={students.filter(s => s.tb_matriculas).length.toString()}
          change="+2.1%"
          changeType="up"
          icon={GraduationCap}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${localPagination.totalPages}`}
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
            Alunos da Página {currentPage} ({filteredStudents.length} de {itemsPerPage})
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {localPagination.totalPages} - Total: {localPagination.totalItems} alunos
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
                  <TableHead>Encarregado</TableHead>
                  <TableHead>Curso/Turma</TableHead>
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
                ) : paginatedStudents.length === 0 ? (
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
                  paginatedStudents.map((student, index) => (
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
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{student.email}</span>
                          </div>
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
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{student.tb_encarregados?.nome || 'N/A'}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {student.tb_encarregados?.telefone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.tb_matriculas ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {student.tb_matriculas.tb_cursos.designacao}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              Matrícula #{student.tb_matriculas.codigo}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="destructive" className="text-xs text-white">
                            Sem Matrícula
                          </Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => handleViewStudent(student.codigo || 0)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStudent(student.codigo || 0)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteStudent(student.codigo || 0)}
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
          {localPagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {localPagination.totalItems} alunos
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
                    const endPage = Math.min(localPagination.totalPages, startPage + maxPagesToShow - 1);
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
                    if (endPage < localPagination.totalPages) {
                      if (endPage < localPagination.totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={localPagination.totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(localPagination.totalPages)}
                          disabled={loading}
                        >
                          {localPagination.totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, localPagination.totalPages))}
                  disabled={currentPage === localPagination.totalPages || loading}
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