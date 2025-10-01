"use client";

import React, { useState, useEffect } from 'react';
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
  GraduationCap,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Users,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

import { useCourse } from '@/hooks';
import { Course } from '@/types';

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

const nivelOptions = [
  { value: "all", label: "Todos os Níveis" },
  { value: "ensino primário", label: "Ensino Primário" },
  { value: "1º ciclo secundário", label: "1º Ciclo Secundário" },
  { value: "2º ciclo secundário", label: "2º Ciclo Secundário" },
  { value: "pré-universitário", label: "Pré-Universitário" },
  { value: "técnico profissional", label: "Técnico Profissional" },
];

const modalidadeOptions = [
  { value: "all", label: "Todas as Modalidades" },
  { value: "presencial", label: "Presencial" },
  { value: "semi-presencial", label: "Semi-Presencial" },
  { value: "à distância", label: "À Distância" },
];

export default function ListCoursePage() {
  const { courses, loading, error, pagination, getAllCourses } = useCourse();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [nivelFilter, setNivelFilter] = useState("all");
  const [modalidadeFilter, setModalidadeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Carregar cursos quando o componente for montado ou página mudar
  useEffect(() => {
    getAllCourses(currentPage, itemsPerPage);
  }, [getAllCourses, currentPage, itemsPerPage]);

  // Filtrar cursos (aplicado aos dados da página atual)
  useEffect(() => {
    let filtered = courses;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.codigo?.toString().includes(searchTerm) ||
        course.observacoes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(course => 
        course.codigo_Status?.toString() === statusFilter
      );
    }

    // Filtro por nível
    if (nivelFilter !== "all") {
      filtered = filtered.filter(course => {
        return course.nivel?.toLowerCase().includes(nivelFilter);
      });
    }

    // Filtro por modalidade
    if (modalidadeFilter !== "all") {
      filtered = filtered.filter(course => {
        return course.modalidade?.toLowerCase().includes(modalidadeFilter);
      });
    }

    setFilteredCourses(filtered);
  }, [searchTerm, statusFilter, nivelFilter, modalidadeFilter, courses]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    if (searchTerm || statusFilter !== "all" || nivelFilter !== "all" || modalidadeFilter !== "all") {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, nivelFilter, modalidadeFilter]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentCourses = filteredCourses; // Já são os dados da página atual
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredCourses.length;

  const handleViewCourse = (courseId: number) => {
    window.location.href = `/admin/course-management/course/details/${courseId}`;
  };

  const handleEditCourse = (courseId: number) => {
    window.location.href = `/admin/course-management/course/edit/${courseId}`;
  };

  const handleDeleteCourse = (courseId: number) => {
    console.log("Excluir curso:", courseId);
    // Implementar confirmação e exclusão do curso com o hook
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Cursos"
        description="Gerencie todos os cursos oferecidos pela instituição. Visualize informações detalhadas, acompanhe disciplinas e mantenha os dados sempre atualizados."
        titleBtnRight='Novo Curso'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/course-management/course/add'}
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Cursos"
          value={totalItems.toString()}
          change="+5.2%"
          changeType="up"
          icon={GraduationCap}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Cursos Ativos"
          value={courses.filter(c => c.codigo_Status === 1).length.toString()}
          change="+2.1%"
          changeType="up"
          icon={BookOpen}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Com Disciplinas"
          value={courses.filter(c => c.tb_disciplinas && c.tb_disciplinas.length > 0).length.toString()}
          change="+3.5%"
          changeType="up"
          icon={Users}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${totalPages}`}
          change="Paginação"
          changeType="neutral"
          icon={Activity}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome, código ou observações..."
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
            label: "Nível",
            value: nivelFilter,
            onChange: setNivelFilter,
            options: nivelOptions,
            width: "w-48"
          },
          {
            label: "Modalidade",
            value: modalidadeFilter,
            onChange: setModalidadeFilter,
            options: modalidadeOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Cursos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Cursos da Página {currentPage} ({filteredCourses.length} de {itemsPerPage})
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} - Total: {totalItems} cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Modalidade</TableHead>
                  <TableHead>Disciplinas</TableHead>
                  <TableHead>Duração</TableHead>
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
                ) : currentCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <GraduationCap className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum curso encontrado</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCourses.map((course, index) => (
                    <TableRow key={course.codigo || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {course.designacao.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{course.designacao}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {course.codigo || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {course.nivel || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {course.modalidade || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {course.tb_disciplinas?.length || 0} disciplinas
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {course.duracao || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={course.codigo_Status === 1 ? "default" : "secondary"}
                          className={course.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {course.codigo_Status === 1 ? "Ativo" : "Inativo"}
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
                            <DropdownMenuItem onClick={() => handleViewCourse(course.codigo || 0)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCourse(course.codigo || 0)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCourse(course.codigo || 0)}
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} cursos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
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
                          disabled={loading}
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
                  disabled={currentPage === totalPages || loading}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
