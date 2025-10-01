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
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Disciplina, Curso } from '@/types/academic-management.types';
import StatCard from '@/components/layout/StatCard';

// Dados mockados baseados na estrutura do backend
const mockDisciplinas: Disciplina[] = [
  {
    codigo: 1,
    designacao: "Programação I",
    codigo_Curso: 1,
    tb_cursos: {
      codigo: 1,
      designacao: "Informática de Gestão",
      observacoes: "Curso técnico profissional"
    }
  },
  {
    codigo: 2,
    designacao: "Base de Dados",
    codigo_Curso: 1,
    tb_cursos: {
      codigo: 1,
      designacao: "Informática de Gestão",
      observacoes: "Curso técnico profissional"
    }
  },
  {
    codigo: 3,
    designacao: "Contabilidade Geral",
    codigo_Curso: 2,
    tb_cursos: {
      codigo: 2,
      designacao: "Contabilidade",
      observacoes: "Curso comercial"
    }
  },
  {
    codigo: 4,
    designacao: "Matemática Financeira",
    codigo_Curso: 2,
    tb_cursos: {
      codigo: 2,
      designacao: "Contabilidade",
      observacoes: "Curso comercial"
    }
  },
  {
    codigo: 5,
    designacao: "Gestão de Recursos Humanos",
    codigo_Curso: 3,
    tb_cursos: {
      codigo: 3,
      designacao: "Administração",
      observacoes: "Curso de gestão"
    }
  },
  {
    codigo: 6,
    designacao: "Marketing Digital",
    codigo_Curso: 3,
    tb_cursos: {
      codigo: 3,
      designacao: "Administração",
      observacoes: "Curso de gestão"
    }
  }
];

const mockCursos: Curso[] = [
  { codigo: 1, designacao: "Informática de Gestão", observacoes: "Curso técnico profissional" },
  { codigo: 2, designacao: "Contabilidade", observacoes: "Curso comercial" },
  { codigo: 3, designacao: "Administração", observacoes: "Curso de gestão" },
];

const cursoOptions = [
  { value: "all", label: "Todos os Cursos" },
  ...mockCursos.map(curso => ({ value: curso.codigo.toString(), label: curso.designacao }))
];

export default function DisciplinesListPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(mockDisciplinas);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState<Disciplina[]>(mockDisciplinas);
  const [searchTerm, setSearchTerm] = useState("");
  const [cursoFilter, setCursoFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar disciplinas
  useEffect(() => {
    let filtered = disciplinas;

    if (searchTerm) {
      filtered = filtered.filter(disciplina =>
        disciplina.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disciplina.tb_cursos?.designacao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cursoFilter !== "all") {
      filtered = filtered.filter(disciplina => 
        disciplina.codigo_Curso.toString() === cursoFilter
      );
    }

    setFilteredDisciplinas(filtered);
    setCurrentPage(1);
  }, [searchTerm, cursoFilter, disciplinas]);

  // Paginação
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDisciplinas = filteredDisciplinas.slice(startIndex, endIndex);

  const handleViewDisciplina = (disciplinaId: number) => {
    window.location.href = `/admin/academic-management/disciplines/details/${disciplinaId}`;
  };

  const handleEditDisciplina = (disciplinaId: number) => {
    window.location.href = `/admin/academic-management/disciplines/edit/${disciplinaId}`;
  };

  const handleDeleteDisciplina = (disciplinaId: number) => {
    console.log("Excluir disciplina:", disciplinaId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas por curso
  const disciplinasPorCurso = mockCursos.map(curso => ({
    curso: curso.designacao,
    count: disciplinas.filter(d => d.codigo_Curso === curso.codigo).length
  }));

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
                    Disciplinas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Disciplinas Acadêmicas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as disciplinas do sistema. Organize por cursos, visualize informações detalhadas
                e mantenha a estrutura curricular sempre atualizada.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Dados
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/academic-management/disciplines/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Disciplina
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
        {/* Card Total de Disciplinas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Disciplinas</p>
            <p className="text-3xl font-bold text-gray-900">{disciplinas.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Cards por curso */}
        {disciplinasPorCurso.slice(0, 3).map((stat, index) => {
          const colors = [
            { bg: "from-emerald-50 via-white to-emerald-50/50", icon: "from-emerald-500 to-green-600", text: "text-emerald-600" },
            { bg: "from-amber-50 via-white to-yellow-50/50", icon: "from-[#FFD002] to-[#FFC107]", text: "text-[#FFD002]" },
            { bg: "from-purple-50 via-white to-purple-50/50", icon: "from-purple-500 to-purple-600", text: "text-purple-600" }
          ];
          const color = colors[index];

          return (
            <div key={stat.curso} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color.bg} border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color.icon} shadow-sm`}>
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span className="font-bold text-xs text-blue-600">Ativo</span>
                </div>
              </div>
              <div>
                <p className={`text-sm font-semibold mb-2 ${color.text}`}>{stat.curso}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
            </div>
          );
        })}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por disciplina ou curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={cursoFilter} onValueChange={setCursoFilter}>
                <SelectTrigger>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Disciplinas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Lista de Disciplinas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredDisciplinas.length} disciplinas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDisciplinas.map((disciplina) => (
                  <TableRow key={disciplina.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{disciplina.designacao}</p>
                          <p className="text-sm text-gray-500">ID: {disciplina.codigo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{disciplina.tb_cursos?.designacao}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {disciplina.codigo_Curso}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={disciplina.tb_cursos?.observacoes}>
                        {disciplina.tb_cursos?.observacoes || "Sem observações"}
                      </p>
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
                          <DropdownMenuItem onClick={() => handleViewDisciplina(disciplina.codigo)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDisciplina(disciplina.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDisciplina(disciplina.codigo)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredDisciplinas.length)} de {filteredDisciplinas.length} disciplinas
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