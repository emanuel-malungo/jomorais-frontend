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
  BookOpen,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

import useTeacher from '@/hooks/useTeacher';
import { Teacher } from '@/types/teacher.types';

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

const especialidadeOptions = [
  { value: "all", label: "Todas as Especialidades" },
  { value: "matemática", label: "Matemática" },
  { value: "língua portuguesa", label: "Língua Portuguesa" },
  { value: "física", label: "Física" },
  { value: "química", label: "Química" },
  { value: "biologia", label: "Biologia" },
  { value: "história", label: "História" },
  { value: "geografia", label: "Geografia" },
  { value: "inglês", label: "Inglês" },
  { value: "educação física", label: "Educação Física" },
];

export default function ListTeacherPage() {
  const { teachers, loading, error, pagination, getAllTeachers } = useTeacher();

  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [especialidadeFilter, setEspecialidadeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Carregar professores quando o componente for montado ou página mudar
  useEffect(() => {
    getAllTeachers(currentPage, itemsPerPage);
  }, [getAllTeachers, currentPage, itemsPerPage]);

  // Filtrar professores (aplicado aos dados da página atual)
  useEffect(() => {
    let filtered = teachers;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.telefone?.includes(searchTerm) ||
        teacher.n_documento_identificacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.codigo_Status.toString() === statusFilter
      );
    }

    // Filtro por especialidade
    if (especialidadeFilter !== "all") {
      filtered = filtered.filter(teacher => {
        if (!teacher.especialidade) return false;
        return teacher.especialidade.toLowerCase().includes(especialidadeFilter);
      });
    }

    setFilteredTeachers(filtered);
  }, [searchTerm, statusFilter, especialidadeFilter, teachers]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    if (searchTerm || statusFilter !== "all" || especialidadeFilter !== "all") {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, especialidadeFilter]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentTeachers = filteredTeachers; // Já são os dados da página atual
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredTeachers.length;

  const handleViewTeacher = (teacherId: number) => {
    window.location.href = `/admin/teacher-management/teacher/details/${teacherId}`;
  };

  const handleEditTeacher = (teacherId: number) => {
    window.location.href = `/admin/teacher-management/teacher/edit/${teacherId}`;
  };

  const handleDeleteTeacher = (teacherId: number) => {
    console.log("Excluir professor:", teacherId);
    // Implementar confirmação e exclusão do professor com o hook
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

  const formatSalary = (salary: number | undefined) => {
    if (!salary) return "N/A";
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Professores"
        description="Gerencie todos os professores da instituição. Visualize informações detalhadas, acompanhe especialidades e mantenha os dados sempre atualizados."
        titleBtnRight='Novo Professor'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/teacher-management/teacher/add'}
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Professores"
          value={totalItems.toString()}
          change="+5.2%"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Professores Ativos"
          value={teachers.filter(t => t.codigo_Status === 1).length.toString()}
          change="+2.1%"
          changeType="up"
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Com Disciplinas"
          value={teachers.filter(t => t.tb_disciplinas_professores && t.tb_disciplinas_professores.length > 0).length.toString()}
          change="+1.8%"
          changeType="up"
          icon={BookOpen}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${totalPages}`}
          change="Paginação"
          changeType="neutral"
          icon={GraduationCap}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome, email, telefone, documento, especialidade..."
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
            label: "Especialidade",
            value: especialidadeFilter,
            onChange: setEspecialidadeFilter,
            options: especialidadeOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Professores */}
      <Card>
        <CardHeader>
          <CardTitle>
            Professores da Página {currentPage} ({filteredTeachers.length} de {itemsPerPage})
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} - Total: {totalItems} professores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Experiência</TableHead>
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
                ) : currentTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum professor encontrado</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTeachers.map((teacher, index) => (
                    <TableRow key={teacher.codigo || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {teacher.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teacher.nome}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {calculateAge(teacher.dataNascimento) !== "N/A" 
                                  ? `${calculateAge(teacher.dataNascimento)} anos`
                                  : "Idade N/A"
                                }
                              </span>
                              <span>{teacher.sexo === 'M' ? 'Masculino' : 'Feminino'}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{teacher.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{teacher.telefone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{teacher.n_documento_identificacao || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Bilhete de Identidade</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{teacher.especialidade || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{teacher.grau_academico || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {teacher.experiencia_anos ? `${teacher.experiencia_anos} anos` : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {teacher.data_contratacao ? `Desde ${formatDate(teacher.data_contratacao)}` : 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={teacher.codigo_Status === 1 ? "default" : "secondary"}
                          className={teacher.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {teacher.codigo_Status === 1 ? "Ativo" : "Inativo"}
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
                            <DropdownMenuItem onClick={() => handleViewTeacher(teacher.codigo || 0)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTeacher(teacher.codigo || 0)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTeacher(teacher.codigo || 0)}
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
                Mostrando {startIndex} a {endIndex} de {totalItems} professores
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
