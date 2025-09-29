"use client";

import React, { useState, useEffect } from 'react';
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
  GraduationCap,
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
  BookOpen,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  MapPin,
} from 'lucide-react';

// Dados mockados dos professores
const mockTeachers = [
  {
    id: 1,
    nome: "João Silva Santos",
    email: "joao.silva@jomorais.com",
    telefone: "923456789",
    especialidade: "Matemática",
    grauAcademico: "Licenciatura",
    experiencia: 8,
    turmasAtribuidas: 3,
    disciplinas: ["Matemática", "Física"],
    status: "Ativo",
    dataContratacao: "2020-02-15",
    salario: 85000
  },
  {
    id: 2,
    nome: "Maria Santos Costa",
    email: "maria.santos@jomorais.com",
    telefone: "934567890",
    especialidade: "Português",
    grauAcademico: "Mestrado",
    experiencia: 12,
    turmasAtribuidas: 4,
    disciplinas: ["Português", "Literatura"],
    status: "Ativo",
    dataContratacao: "2018-08-20",
    salario: 95000
  },
  {
    id: 3,
    nome: "Carlos Mendes Lima",
    email: "carlos.mendes@jomorais.com",
    telefone: "945678901",
    especialidade: "Informática",
    grauAcademico: "Licenciatura",
    experiencia: 6,
    turmasAtribuidas: 2,
    disciplinas: ["Informática", "Programação"],
    status: "Ativo",
    dataContratacao: "2021-01-10",
    salario: 90000
  },
  {
    id: 4,
    nome: "Ana Costa Ferreira",
    email: "ana.costa@jomorais.com",
    telefone: "956789012",
    especialidade: "História",
    grauAcademico: "Licenciatura",
    experiencia: 10,
    turmasAtribuidas: 3,
    disciplinas: ["História", "Geografia"],
    status: "Ativo",
    dataContratacao: "2019-03-05",
    salario: 88000
  },
  {
    id: 5,
    nome: "Pedro Lima Nunes",
    email: "pedro.lima@jomorais.com",
    telefone: "967890123",
    especialidade: "Física",
    grauAcademico: "Mestrado",
    experiencia: 15,
    turmasAtribuidas: 4,
    disciplinas: ["Física", "Química"],
    status: "Ativo",
    dataContratacao: "2016-09-12",
    salario: 100000
  },
  {
    id: 6,
    nome: "Isabel Ferreira Silva",
    email: "isabel.ferreira@jomorais.com",
    telefone: "978901234",
    especialidade: "Química",
    grauAcademico: "Licenciatura",
    experiencia: 7,
    turmasAtribuidas: 2,
    disciplinas: ["Química", "Biologia"],
    status: "Ativo",
    dataContratacao: "2020-11-18",
    salario: 87000
  },
  {
    id: 7,
    nome: "Fernando Costa Pereira",
    email: "fernando.costa@jomorais.com",
    telefone: "989012345",
    especialidade: "Biologia",
    grauAcademico: "Licenciatura",
    experiencia: 9,
    turmasAtribuidas: 3,
    disciplinas: ["Biologia", "Ciências Naturais"],
    status: "Inativo",
    dataContratacao: "2018-05-22",
    salario: 82000
  }
];

const especialidadeOptions = [
  { value: "all", label: "Todas as Especialidades" },
  { value: "matematica", label: "Matemática" },
  { value: "portugues", label: "Português" },
  { value: "informatica", label: "Informática" },
  { value: "historia", label: "História" },
  { value: "fisica", label: "Física" },
  { value: "quimica", label: "Química" },
  { value: "biologia", label: "Biologia" },
];

const grauOptions = [
  { value: "all", label: "Todos os Graus" },
  { value: "licenciatura", label: "Licenciatura" },
  { value: "mestrado", label: "Mestrado" },
  { value: "doutorado", label: "Doutorado" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

export default function TeachersListPage() {
  const [teachers, setTeachers] = useState(mockTeachers);
  const [filteredTeachers, setFilteredTeachers] = useState(mockTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [especialidadeFilter, setEspecialidadeFilter] = useState("all");
  const [grauFilter, setGrauFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar professores
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.disciplinas.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (especialidadeFilter !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.especialidade.toLowerCase().includes(especialidadeFilter)
      );
    }

    if (grauFilter !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.grauAcademico.toLowerCase() === grauFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.status.toLowerCase() === statusFilter
      );
    }

    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [searchTerm, especialidadeFilter, grauFilter, statusFilter, teachers]);

  // Paginação
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  const handleViewTeacher = (teacherId: number) => {
    window.location.href = `/admin/teacher-management/list/details/${teacherId}`;
  };

  const handleEditTeacher = (teacherId: number) => {
    window.location.href = `/admin/teacher-management/list/edit/${teacherId}`;
  };

  const handleDeleteTeacher = (teacherId: number) => {
    console.log("Excluir professor:", teacherId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas dos professores
  const estatisticasProfessores = [
    { grau: "Licenciatura", count: teachers.filter(t => t.grauAcademico === "Licenciatura").length },
    { grau: "Mestrado", count: teachers.filter(t => t.grauAcademico === "Mestrado").length },
    { grau: "Doutorado", count: teachers.filter(t => t.grauAcademico === "Doutorado").length }
  ];

  const totalTurmas = teachers.reduce((sum, teacher) => sum + teacher.turmasAtribuidas, 0);
  const experienciaMedia = (teachers.reduce((sum, teacher) => sum + teacher.experiencia, 0) / teachers.length).toFixed(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(salary);
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Professores
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão do Corpo Docente</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todos os professores da instituição. Visualize informações detalhadas, 
                acompanhe especialidades e mantenha o controle do corpo docente sempre atualizado.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Lista
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/teacher-management/list/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Professor
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
        {/* Card Total de Professores */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+6.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Professores</p>
            <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Professores Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Ativos</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Professores Ativos</p>
            <p className="text-3xl font-bold text-gray-900">
              {teachers.filter(t => t.status === "Ativo").length}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Total de Turmas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+4.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Total de Turmas</p>
            <p className="text-3xl font-bold text-gray-900">{totalTurmas}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Experiência Média */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Anos</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Experiência Média</p>
            <p className="text-3xl font-bold text-gray-900">{experienciaMedia}</p>
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
                  placeholder="Buscar por nome, email, especialidade ou disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidadeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={grauFilter} onValueChange={setGrauFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Grau Acadêmico" />
                </SelectTrigger>
                <SelectContent>
                  {grauOptions.map((option) => (
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

      {/* Tabela de Professores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Lista de Professores</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredTeachers.length} professores encontrados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Grau Acadêmico</TableHead>
                  <TableHead>Experiência</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{teacher.nome}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Desde {formatDate(teacher.dataContratacao)}</span>
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
                      <div>
                        <p className="font-medium text-gray-900">{teacher.especialidade}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacher.disciplinas.map((disciplina, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {disciplina}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {teacher.grauAcademico}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{teacher.experiencia} anos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{teacher.turmasAtribuidas}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={teacher.status === "Ativo" ? "default" : "secondary"}
                        className={teacher.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {teacher.status}
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
                          <DropdownMenuItem onClick={() => handleViewTeacher(teacher.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTeacher(teacher.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTeacher(teacher.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTeachers.length)} de {filteredTeachers.length} professores
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  ))}
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
