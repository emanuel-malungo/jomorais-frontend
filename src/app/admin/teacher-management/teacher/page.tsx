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

import { useDocentes, useDeleteDocente, useEspecialidades } from '@/hooks/useTeacher';
import { IDocente } from '@/types/teacher.types';

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

// Opções de especialidades serão geradas dinamicamente

export default function ListTeacherPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [especialidadeFilter, setEspecialidadeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Usar os novos hooks
  const { docentes, loading, error, pagination, refetch } = useDocentes(currentPage, itemsPerPage, searchTerm);
  const { deleteDocente, loading: deleteLoading } = useDeleteDocente();
  const { especialidades } = useEspecialidades();

  const [filteredDocentes, setFilteredDocentes] = useState<IDocente[]>([]);

  // Gerar opções de especialidades dinamicamente
  const especialidadeOptions = [
    { value: "all", label: "Todas as Especialidades" },
    ...especialidades.map(esp => ({
      value: esp.codigo.toString(),
      label: esp.designacao
    }))
  ];

  // Filtrar docentes (aplicado aos dados da página atual)
  useEffect(() => {
    let filtered = docentes;

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((docente: IDocente) => 
        docente.status.toString() === statusFilter
      );
    }

    // Filtro por especialidade
    if (especialidadeFilter !== "all") {
      filtered = filtered.filter((docente: IDocente) => {
        if (!docente.tb_especialidade) return false;
        return docente.tb_especialidade.codigo.toString() === especialidadeFilter;
      });
    }

    setFilteredDocentes(filtered);
  }, [statusFilter, especialidadeFilter, docentes]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    if (searchTerm || statusFilter !== "all" || especialidadeFilter !== "all") {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, especialidadeFilter]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentDocentes = filteredDocentes; // Já são os dados da página atual
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredDocentes.length;

  const handleViewTeacher = (teacherId: number) => {
    window.location.href = `/admin/teacher-management/teacher/details/${teacherId}`;
  };

  const handleEditTeacher = (teacherId: number) => {
    window.location.href = `/admin/teacher-management/teacher/edit/${teacherId}`;
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    if (confirm('Tem certeza que deseja excluir este docente?')) {
      const success = await deleteDocente(teacherId);
      if (success) {
        refetch(); // Recarregar a lista
      }
    }
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
        title="Gestão de Docentes"
        titleBtnRight='Novo Docente'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/teacher-management/teacher/add'}
      />

      {/* Estados de Loading e Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">⚠️</div>
            <div>
              <span className="text-red-700 font-medium">Erro ao carregar docentes:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={refetch}
                className="text-red-600 underline text-sm mt-2 hover:text-red-800"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}
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
          title="Docentes Ativos"
          value={docentes.filter((d: IDocente) => d.status === 1).length.toString()}
          change="+2.1%"
          changeType="up"
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Com Disciplinas"
          value={docentes.filter((d: IDocente) => d.tb_disciplinas_docente && d.tb_disciplinas_docente.length > 0).length.toString()}
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
            Docentes da Página {currentPage} ({filteredDocentes.length} de {itemsPerPage})
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} - Total: {totalItems} docentes
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
                ) : currentDocentes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum docente encontrado</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentDocentes.map((teacher: IDocente, index: number) => (
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
                                ID: {teacher.user_id || 'N/A'}
                              </span>
                              <span>Status: {teacher.status === 1 ? 'Ativo' : 'Inativo'}</span>
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
                            <span className="text-gray-600">{teacher.contacto || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Código: {teacher.codigo}</p>
                          <p className="text-xs text-gray-500">ID Utilizador: {teacher.codigo_Utilizador}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{teacher.tb_especialidade?.designacao || 'N/A'}</p>
                          <p className="text-xs text-gray-500">
                            {teacher.tb_disciplinas_docente?.length || 0} disciplina(s)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {teacher.tb_disciplinas_docente?.length || 0} disciplina(s)
                          </p>
                          <p className="text-xs text-gray-500">
                            {teacher.tb_directores_turmas?.length || 0} turma(s) dirigida(s)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={teacher.status === 1 ? "default" : "secondary"}
                          className={teacher.status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {teacher.status === 1 ? "Ativo" : "Inativo"}
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
                Mostrando {startIndex} a {endIndex} de {totalItems} docentes
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
