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
  UserCheck,
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
  School,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  Phone,
  Mail,
} from 'lucide-react';

// Dados mockados dos diretores de turma
const mockDirectors = [
  {
    id: 1,
    professor: "João Silva Santos",
    email: "joao.silva@jomorais.com",
    telefone: "923456789",
    turma: "10ª A",
    classe: "10ª Classe",
    curso: "Informática de Gestão",
    totalAlunos: 28,
    periodo: "Manhã",
    sala: "Sala A1",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Ativo"
  },
  {
    id: 2,
    professor: "Maria Santos Costa",
    email: "maria.santos@jomorais.com",
    telefone: "934567890",
    turma: "11ª B",
    classe: "11ª Classe",
    curso: "Contabilidade e Gestão",
    totalAlunos: 25,
    periodo: "Tarde",
    sala: "Sala A2",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Ativo"
  },
  {
    id: 3,
    professor: "Carlos Mendes Lima",
    email: "carlos.mendes@jomorais.com",
    telefone: "945678901",
    turma: "12ª C",
    classe: "12ª Classe",
    curso: "Administração",
    totalAlunos: 30,
    periodo: "Manhã",
    sala: "Sala B1",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Ativo"
  },
  {
    id: 4,
    professor: "Ana Costa Ferreira",
    email: "ana.costa@jomorais.com",
    telefone: "956789012",
    turma: "10ª D",
    classe: "10ª Classe",
    curso: "Secretariado Executivo",
    totalAlunos: 22,
    periodo: "Tarde",
    sala: "Sala A3",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Ativo"
  },
  {
    id: 5,
    professor: "Pedro Lima Nunes",
    email: "pedro.lima@jomorais.com",
    telefone: "967890123",
    turma: "11ª A",
    classe: "11ª Classe",
    curso: "Electrónica e Telecomunicações",
    totalAlunos: 18,
    periodo: "Manhã",
    sala: "Lab. Electrónica",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Ativo"
  },
  {
    id: 6,
    professor: "Isabel Ferreira Silva",
    email: "isabel.ferreira@jomorais.com",
    telefone: "978901234",
    turma: "12ª B",
    classe: "12ª Classe",
    curso: "Informática de Gestão",
    totalAlunos: 26,
    periodo: "Tarde",
    sala: "Lab. Informática",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Ativo"
  },
  {
    id: 7,
    professor: "Fernando Costa Pereira",
    email: "fernando.costa@jomorais.com",
    telefone: "989012345",
    turma: "9ª A",
    classe: "9ª Classe",
    curso: "Ensino Geral",
    totalAlunos: 32,
    periodo: "Manhã",
    sala: "Sala B2",
    anoLetivo: "2024/2025",
    dataAtribuicao: "2024-02-01",
    status: "Inativo"
  }
];

const classeOptions = [
  { value: "all", label: "Todas as Classes" },
  { value: "9", label: "9ª Classe" },
  { value: "10", label: "10ª Classe" },
  { value: "11", label: "11ª Classe" },
  { value: "12", label: "12ª Classe" },
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

export default function DirectorTurmaPage() {
  const router = useRouter();
  const [directors, setDirectors] = useState(mockDirectors);
  const [filteredDirectors, setFilteredDirectors] = useState(mockDirectors);
  const [searchTerm, setSearchTerm] = useState("");
  const [classeFilter, setClasseFilter] = useState("all");
  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar diretores
  useEffect(() => {
    let filtered = directors;

    if (searchTerm) {
      filtered = filtered.filter(director =>
        director.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (classeFilter !== "all") {
      filtered = filtered.filter(director => 
        director.classe.includes(classeFilter + "ª")
      );
    }

    if (periodoFilter !== "all") {
      filtered = filtered.filter(director => 
        director.periodo.toLowerCase() === periodoFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(director => 
        director.status.toLowerCase() === statusFilter
      );
    }

    setFilteredDirectors(filtered);
    setCurrentPage(1);
  }, [searchTerm, classeFilter, periodoFilter, statusFilter, directors]);

  // Paginação
  const totalPages = Math.ceil(filteredDirectors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDirectors = filteredDirectors.slice(startIndex, endIndex);

  const handleViewDirector = (directorId: number) => {
    router.push(`/admin/teacher-management/director-turma/details/${directorId}`);
  };

  const handleEditDirector = (directorId: number) => {
    router.push(`/admin/teacher-management/director-turma/edit/${directorId}`);
  };

  const handleDeleteDirector = (directorId: number) => {
    console.log("Excluir diretor de turma:", directorId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas dos diretores
  const estatisticasDiretores = [
    { periodo: "Manhã", count: directors.filter(d => d.periodo === "Manhã").length },
    { periodo: "Tarde", count: directors.filter(d => d.periodo === "Tarde").length },
    { periodo: "Noite", count: directors.filter(d => d.periodo === "Noite").length }
  ];

  const totalAlunos = directors.reduce((sum, director) => sum + director.totalAlunos, 0);
  const mediaAlunosPorTurma = (totalAlunos / directors.length).toFixed(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
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
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Diretores de Turma
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Diretores de Turma</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie os diretores de turma da instituição. Visualize atribuições, 
                acompanhe responsabilidades e mantenha o controle das turmas sempre organizado.
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
                onClick={() => window.location.href = '/admin/teacher-management/director-turma/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Diretor
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
        {/* Card Total de Diretores */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+4.7%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Diretores</p>
            <p className="text-3xl font-bold text-gray-900">{directors.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Diretores Ativos */}
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
            <p className="text-sm font-semibold mb-2 text-emerald-600">Diretores Ativos</p>
            <p className="text-3xl font-bold text-gray-900">
              {directors.filter(d => d.status === "Ativo").length}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Total de Alunos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+6.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Total de Alunos</p>
            <p className="text-3xl font-bold text-gray-900">{totalAlunos}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Média por Turma */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Média</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Média por Turma</p>
            <p className="text-3xl font-bold text-gray-900">{mediaAlunosPorTurma}</p>
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
                  placeholder="Buscar por professor, turma, curso ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={classeFilter} onValueChange={setClasseFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  {classeOptions.map((option) => (
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

      {/* Tabela de Diretores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Lista de Diretores de Turma</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredDirectors.length} diretores encontrados
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
                  <TableHead>Turma</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDirectors.map((director) => (
                  <TableRow key={director.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{director.professor}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Desde {formatDate(director.dataAtribuicao)}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-2 text-gray-400" />
                          <span className="text-gray-600">{director.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />
                          <span className="text-gray-600">{director.telefone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{director.turma}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <School className="w-3 h-3" />
                          <span>{director.sala}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{director.classe}</p>
                        <p className="text-sm text-gray-500">{director.curso}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{director.totalAlunos}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {director.periodo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={director.status === "Ativo" ? "default" : "secondary"}
                        className={director.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {director.status}
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
                          <DropdownMenuItem onClick={() => handleViewDirector(director.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDirector(director.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDirector(director.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredDirectors.length)} de {filteredDirectors.length} diretores
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
