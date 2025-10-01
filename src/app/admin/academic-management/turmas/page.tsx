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
  School,
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
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  MapPin,
  Clock,
} from 'lucide-react';

// Dados mockados das turmas
const mockTurmas = [
  {
    id: 1,
    designacao: "IG-10A-2024",
    classe: "10ª Classe",
    curso: "Informática de Gestão",
    sala: "Sala A1",
    periodo: "Manhã",
    anoLetivo: "2024/2025",
    capacidade: 30,
    matriculados: 28,
    diretor: "Prof. João Silva",
    status: "Ativo"
  },
  {
    id: 2,
    designacao: "CG-11B-2024",
    classe: "11ª Classe",
    curso: "Contabilidade e Gestão",
    sala: "Sala A2",
    periodo: "Tarde",
    anoLetivo: "2024/2025",
    capacidade: 25,
    matriculados: 23,
    diretor: "Prof. Maria Santos",
    status: "Ativo"
  },
  {
    id: 3,
    designacao: "AD-12C-2024",
    classe: "12ª Classe",
    curso: "Administração",
    sala: "Sala B1",
    periodo: "Manhã",
    anoLetivo: "2024/2025",
    capacidade: 35,
    matriculados: 32,
    diretor: "Prof. Carlos Mendes",
    status: "Ativo"
  },
  {
    id: 4,
    designacao: "SE-10D-2024",
    classe: "10ª Classe",
    curso: "Secretariado Executivo",
    sala: "Sala A3",
    periodo: "Tarde",
    anoLetivo: "2024/2025",
    capacidade: 20,
    matriculados: 18,
    diretor: "Prof. Ana Costa",
    status: "Ativo"
  },
  {
    id: 5,
    designacao: "ET-11A-2024",
    classe: "11ª Classe",
    curso: "Electrónica e Telecomunicações",
    sala: "Lab. Electrónica",
    periodo: "Manhã",
    anoLetivo: "2024/2025",
    capacidade: 15,
    matriculados: 14,
    diretor: "Prof. Pedro Lima",
    status: "Ativo"
  },
  {
    id: 6,
    designacao: "IG-12B-2024",
    classe: "12ª Classe",
    curso: "Informática de Gestão",
    sala: "Lab. Informática",
    periodo: "Tarde",
    anoLetivo: "2024/2025",
    capacidade: 20,
    matriculados: 19,
    diretor: "Prof. Isabel Ferreira",
    status: "Ativo"
  },
  {
    id: 7,
    designacao: "CG-9A-2024",
    classe: "9ª Classe",
    curso: "Contabilidade e Gestão",
    sala: "Sala B2",
    periodo: "Manhã",
    anoLetivo: "2024/2025",
    capacidade: 30,
    matriculados: 25,
    diretor: "Prof. Fernando Costa",
    status: "Inativo"
  }
];

const periodoOptions = [
  { value: "all", label: "Todos os Períodos" },
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

const cursoOptions = [
  { value: "all", label: "Todos os Cursos" },
  { value: "informatica", label: "Informática de Gestão" },
  { value: "contabilidade", label: "Contabilidade e Gestão" },
  { value: "administracao", label: "Administração" },
  { value: "secretariado", label: "Secretariado Executivo" },
  { value: "electronica", label: "Electrónica e Telecomunicações" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

export default function TurmasPage() {
  const [turmas, setTurmas] = useState(mockTurmas);
  const [filteredTurmas, setFilteredTurmas] = useState(mockTurmas);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodoFilter, setPeriodoFilter] = useState("all");
  const [cursoFilter, setCursoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar turmas
  useEffect(() => {
    let filtered = turmas;

    if (searchTerm) {
      filtered = filtered.filter(turma =>
        turma.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.diretor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.sala.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (periodoFilter !== "all") {
      filtered = filtered.filter(turma => 
        turma.periodo.toLowerCase() === periodoFilter
      );
    }

    if (cursoFilter !== "all") {
      filtered = filtered.filter(turma => {
        const cursoName = turma.curso.toLowerCase();
        switch (cursoFilter) {
          case "informatica":
            return cursoName.includes("informática");
          case "contabilidade":
            return cursoName.includes("contabilidade");
          case "administracao":
            return cursoName.includes("administração");
          case "secretariado":
            return cursoName.includes("secretariado");
          case "electronica":
            return cursoName.includes("electrónica");
          default:
            return true;
        }
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(turma => 
        turma.status.toLowerCase() === statusFilter
      );
    }

    setFilteredTurmas(filtered);
    setCurrentPage(1);
  }, [searchTerm, periodoFilter, cursoFilter, statusFilter, turmas]);

  // Paginação
  const totalPages = Math.ceil(filteredTurmas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTurmas = filteredTurmas.slice(startIndex, endIndex);

  const handleViewTurma = (turmaId: number) => {
    window.location.href = `/admin/academic-management/turmas/details/${turmaId}`;
  };

  const handleEditTurma = (turmaId: number) => {
    window.location.href = `/admin/academic-management/turmas/edit/${turmaId}`;
  };

  const handleDeleteTurma = (turmaId: number) => {
    console.log("Excluir turma:", turmaId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas das turmas
  const estatisticasTurmas = [
    { periodo: "Manhã", count: turmas.filter(t => t.periodo === "Manhã").length },
    { periodo: "Tarde", count: turmas.filter(t => t.periodo === "Tarde").length },
    { periodo: "Noite", count: turmas.filter(t => t.periodo === "Noite").length }
  ];

  const totalMatriculados = turmas.reduce((sum, turma) => sum + turma.matriculados, 0);
  const totalCapacidade = turmas.reduce((sum, turma) => sum + turma.capacidade, 0);
  const ocupacao = ((totalMatriculados / totalCapacidade) * 100).toFixed(1);

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <School className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Turmas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Turmas Acadêmicas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as turmas do sistema educacional. Organize por cursos, períodos e classes, 
                visualize informações detalhadas e mantenha o controle de matrículas e capacidade.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Turmas
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Turmas
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/academic-management/turmas/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Turma
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
        {/* Card Total de Turmas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <School className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+7.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Turmas</p>
            <p className="text-3xl font-bold text-gray-900">{turmas.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Total de Alunos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+4.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Total Matriculados</p>
            <p className="text-3xl font-bold text-gray-900">{totalMatriculados}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Capacidade Total */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Estável</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Capacidade Total</p>
            <p className="text-3xl font-bold text-gray-900">{totalCapacidade}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Taxa de Ocupação */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+2.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Taxa de Ocupação</p>
            <p className="text-3xl font-bold text-gray-900">{ocupacao}%</p>
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
                  placeholder="Buscar por turma, classe, curso, diretor ou sala..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
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

              <Select value={cursoFilter} onValueChange={setCursoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursoOptions.map((option) => (
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

      {/* Tabela de Turmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <School className="h-5 w-5" />
              <span>Lista de Turmas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredTurmas.length} turmas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Classe/Curso</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Diretor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTurmas.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <School className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{turma.designacao}</p>
                          <p className="text-sm text-gray-500">{turma.anoLetivo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{turma.classe}</p>
                        <p className="text-sm text-gray-500">{turma.curso}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{turma.sala}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {turma.periodo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {turma.matriculados}/{turma.capacidade}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-[#F9CD1D] h-2 rounded-full" 
                            style={{ width: `${(turma.matriculados / turma.capacidade) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{turma.diretor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={turma.status === "Ativo" ? "default" : "secondary"}
                        className={turma.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {turma.status}
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
                          <DropdownMenuItem onClick={() => handleViewTurma(turma.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTurma(turma.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTurma(turma.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTurmas.length)} de {filteredTurmas.length} turmas
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
