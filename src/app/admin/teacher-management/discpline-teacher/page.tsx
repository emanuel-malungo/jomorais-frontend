"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
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
  GraduationCap,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  School,
} from 'lucide-react';

// Dados mockados das atribuições de disciplinas
const mockTeacherDisciplines = [
  {
    id: 1,
    professor: "João Silva Santos",
    disciplina: "Matemática",
    turma: "10ª A",
    cargaHoraria: 4,
    periodo: "Manhã",
    sala: "Sala A1",
    horario: "08:00 - 09:30",
    diasSemana: ["Segunda", "Quarta"],
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 2,
    professor: "João Silva Santos",
    disciplina: "Física",
    turma: "11ª B",
    cargaHoraria: 3,
    periodo: "Manhã",
    sala: "Lab. Física",
    horario: "09:45 - 11:15",
    diasSemana: ["Terça", "Quinta"],
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 3,
    professor: "Maria Santos Costa",
    disciplina: "Português",
    turma: "10ª A",
    cargaHoraria: 5,
    periodo: "Manhã",
    sala: "Sala A2",
    horario: "11:30 - 13:00",
    diasSemana: ["Segunda", "Terça", "Quinta"],
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 4,
    professor: "Maria Santos Costa",
    disciplina: "Literatura",
    turma: "12ª C",
    cargaHoraria: 2,
    periodo: "Tarde",
    sala: "Sala B1",
    horario: "14:00 - 15:30",
    diasSemana: ["Sexta"],
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 5,
    professor: "Carlos Mendes Lima",
    disciplina: "Informática",
    turma: "11ª A",
    cargaHoraria: 4,
    periodo: "Tarde",
    sala: "Lab. Informática",
    horario: "15:45 - 17:15",
    diasSemana: ["Segunda", "Quarta"],
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 6,
    professor: "Carlos Mendes Lima",
    disciplina: "Programação",
    turma: "12ª B",
    cargaHoraria: 3,
    periodo: "Tarde",
    sala: "Lab. Informática",
    horario: "17:30 - 19:00",
    diasSemana: ["Terça", "Quinta"],
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 7,
    professor: "Ana Costa Ferreira",
    disciplina: "História",
    turma: "9ª A",
    cargaHoraria: 3,
    periodo: "Manhã",
    sala: "Sala B2",
    horario: "08:00 - 09:30",
    diasSemana: ["Segunda", "Sexta"],
    anoLetivo: "2024/2025",
    status: "Inativo"
  }
];

const professorOptions = [
  { value: "all", label: "Todos os Professores" },
  { value: "joao", label: "João Silva Santos" },
  { value: "maria", label: "Maria Santos Costa" },
  { value: "carlos", label: "Carlos Mendes Lima" },
  { value: "ana", label: "Ana Costa Ferreira" },
];

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

export default function TeacherDisciplinesPage() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState(mockTeacherDisciplines);
  const [filteredDisciplines, setFilteredDisciplines] = useState(mockTeacherDisciplines);
  const [searchTerm, setSearchTerm] = useState("");
  const [professorFilter, setProfessorFilter] = useState("all");
  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar atribuições
  useEffect(() => {
    let filtered = disciplines;

    if (searchTerm) {
      filtered = filtered.filter(discipline =>
        discipline.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discipline.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discipline.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discipline.sala.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (professorFilter !== "all") {
      filtered = filtered.filter(discipline => {
        const professorName = discipline.professor.toLowerCase();
        switch (professorFilter) {
          case "joao":
            return professorName.includes("joão");
          case "maria":
            return professorName.includes("maria");
          case "carlos":
            return professorName.includes("carlos");
          case "ana":
            return professorName.includes("ana");
          default:
            return true;
        }
      });
    }

    if (periodoFilter !== "all") {
      filtered = filtered.filter(discipline => 
        discipline.periodo.toLowerCase() === periodoFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(discipline => 
        discipline.status.toLowerCase() === statusFilter
      );
    }

    setFilteredDisciplines(filtered);
    setCurrentPage(1);
  }, [searchTerm, professorFilter, periodoFilter, statusFilter, disciplines]);

  // Paginação
  const totalPages = Math.ceil(filteredDisciplines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDisciplines = filteredDisciplines.slice(startIndex, endIndex);

  const handleViewAssignment = (assignmentId: number) => {
    router.push(`/admin/teacher-management/discpline-teacher/details/${assignmentId}`);
  };

  const handleEditAssignment = (assignmentId: number) => {
    router.push(`/admin/teacher-management/discpline-teacher/edit/${assignmentId}`);
  };

  const handleDeleteAssignment = (assignmentId: number) => {
    console.log("Excluir atribuição:", assignmentId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas das atribuições
  const estatisticasAtribuicoes = [
    { periodo: "Manhã", count: disciplines.filter(d => d.periodo === "Manhã").length },
    { periodo: "Tarde", count: disciplines.filter(d => d.periodo === "Tarde").length },
    { periodo: "Noite", count: disciplines.filter(d => d.periodo === "Noite").length }
  ];

  const totalCargaHoraria = disciplines.reduce((sum, discipline) => sum + discipline.cargaHoraria, 0);
  const professoresUnicos = [...new Set(disciplines.map(d => d.professor))].length;

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Disciplinas do Docente
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Atribuições de Disciplinas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie as atribuições de disciplinas aos professores. Visualize horários, 
                cargas horárias e organize a distribuição das disciplinas por docente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Horários
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/teacher-management/discpline-teacher/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Atribuição
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
        {/* Card Total de Atribuições */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Atribuições</p>
            <p className="text-3xl font-bold text-gray-900">{disciplines.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Professores Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Ativos</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Professores Ativos</p>
            <p className="text-3xl font-bold text-gray-900">{professoresUnicos}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Carga Horária Total */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+5.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Carga Horária Total</p>
            <p className="text-3xl font-bold text-gray-900">{totalCargaHoraria}h</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Atribuições Ativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Ativas</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Atribuições Ativas</p>
            <p className="text-3xl font-bold text-gray-900">
              {disciplines.filter(d => d.status === "Ativo").length}
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por professor, disciplina, turma ou sala..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={professorFilter} onValueChange={setProfessorFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Professor" />
                </SelectTrigger>
                <SelectContent>
                  {professorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

      {/* Tabela de Atribuições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Atribuições de Disciplinas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredDisciplines.length} atribuições encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDisciplines.map((discipline) => (
                  <TableRow key={discipline.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{discipline.professor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{discipline.disciplina}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {discipline.turma}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <School className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{discipline.sala}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{discipline.horario}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {discipline.diasSemana.map((dia, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {dia}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{discipline.cargaHoraria}h</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={discipline.status === "Ativo" ? "default" : "secondary"}
                        className={discipline.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {discipline.status}
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
                          <DropdownMenuItem onClick={() => handleViewAssignment(discipline.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAssignment(discipline.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteAssignment(discipline.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredDisciplines.length)} de {filteredDisciplines.length} atribuições
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
    </Container>
  );
}
