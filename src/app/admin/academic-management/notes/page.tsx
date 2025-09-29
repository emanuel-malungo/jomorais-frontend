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
  FileText,
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
  Award,
  Calendar,
} from 'lucide-react';

// Dados mockados das notas
const mockGrades = [
  {
    id: 1,
    aluno: "Ana Silva Santos",
    disciplina: "Matemática",
    professor: "Prof. João Silva",
    turma: "10ª A",
    trimestre: "1º Trimestre",
    nota: 16.5,
    situacao: "Aprovado",
    observacoes: "Excelente desempenho",
    dataAvaliacao: "2024-03-15"
  },
  {
    id: 2,
    aluno: "Carlos Manuel Ferreira",
    disciplina: "Português",
    professor: "Prof. Maria Santos",
    turma: "10ª A",
    trimestre: "1º Trimestre",
    nota: 14.0,
    situacao: "Aprovado",
    observacoes: "Bom aproveitamento",
    dataAvaliacao: "2024-03-18"
  },
  {
    id: 3,
    aluno: "Beatriz Costa Lima",
    disciplina: "Informática",
    professor: "Prof. Carlos Mendes",
    turma: "11ª B",
    trimestre: "2º Trimestre",
    nota: 18.5,
    situacao: "Aprovado",
    observacoes: "Desempenho excepcional",
    dataAvaliacao: "2024-06-10"
  },
  {
    id: 4,
    aluno: "David Nunes Pereira",
    disciplina: "História",
    professor: "Prof. Ana Costa",
    turma: "12ª C",
    trimestre: "1º Trimestre",
    nota: 12.0,
    situacao: "Aprovado",
    observacoes: "Precisa melhorar",
    dataAvaliacao: "2024-03-22"
  },
  {
    id: 5,
    aluno: "Eduarda Mendes Silva",
    disciplina: "Física",
    professor: "Prof. Pedro Lima",
    turma: "11ª A",
    trimestre: "2º Trimestre",
    nota: 8.5,
    situacao: "Reprovado",
    observacoes: "Necessita recuperação",
    dataAvaliacao: "2024-06-15"
  },
  {
    id: 6,
    aluno: "Francisco José Costa",
    disciplina: "Química",
    professor: "Prof. Isabel Ferreira",
    turma: "12ª B",
    trimestre: "1º Trimestre",
    nota: 15.5,
    situacao: "Aprovado",
    observacoes: "Bom desempenho",
    dataAvaliacao: "2024-03-25"
  },
  {
    id: 7,
    aluno: "Gabriela Santos Lima",
    disciplina: "Biologia",
    professor: "Prof. Fernando Costa",
    turma: "11ª C",
    trimestre: "2º Trimestre",
    nota: 17.0,
    situacao: "Aprovado",
    observacoes: "Muito bom",
    dataAvaliacao: "2024-06-20"
  },
  {
    id: 8,
    aluno: "Hugo Manuel Pereira",
    disciplina: "Geografia",
    professor: "Prof. Beatriz Lima",
    turma: "10ª B",
    trimestre: "1º Trimestre",
    nota: 9.5,
    situacao: "Recuperação",
    observacoes: "Precisa de apoio",
    dataAvaliacao: "2024-03-28"
  }
];

const trimestreOptions = [
  { value: "all", label: "Todos os Trimestres" },
  { value: "1", label: "1º Trimestre" },
  { value: "2", label: "2º Trimestre" },
  { value: "3", label: "3º Trimestre" },
];

const situacaoOptions = [
  { value: "all", label: "Todas as Situações" },
  { value: "aprovado", label: "Aprovado" },
  { value: "reprovado", label: "Reprovado" },
  { value: "recuperacao", label: "Recuperação" },
];

export default function NotesPage() {
  const [grades, setGrades] = useState(mockGrades);
  const [filteredGrades, setFilteredGrades] = useState(mockGrades);
  const [searchTerm, setSearchTerm] = useState("");
  const [trimestreFilter, setTrimestreFilter] = useState("all");
  const [situacaoFilter, setSituacaoFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar notas
  useEffect(() => {
    let filtered = grades;

    if (searchTerm) {
      filtered = filtered.filter(grade =>
        grade.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.turma.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (trimestreFilter !== "all") {
      filtered = filtered.filter(grade => 
        grade.trimestre.includes(trimestreFilter + "º")
      );
    }

    if (situacaoFilter !== "all") {
      filtered = filtered.filter(grade => 
        grade.situacao.toLowerCase() === situacaoFilter
      );
    }

    setFilteredGrades(filtered);
    setCurrentPage(1);
  }, [searchTerm, trimestreFilter, situacaoFilter, grades]);

  // Paginação
  const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGrades = filteredGrades.slice(startIndex, endIndex);

  const handleViewGrade = (gradeId: number) => {
    window.location.href = `/admin/academic-management/notes/details/${gradeId}`;
  };

  const handleEditGrade = (gradeId: number) => {
    window.location.href = `/admin/academic-management/notes/edit/${gradeId}`;
  };

  const handleDeleteGrade = (gradeId: number) => {
    console.log("Excluir nota:", gradeId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas das notas
  const estatisticasNotas = [
    { situacao: "Aprovados", count: grades.filter(g => g.situacao === "Aprovado").length },
    { situacao: "Reprovados", count: grades.filter(g => g.situacao === "Reprovado").length },
    { situacao: "Recuperação", count: grades.filter(g => g.situacao === "Recuperação").length }
  ];

  const getNotaColor = (nota: number) => {
    if (nota >= 16) return "text-green-600 bg-green-50 border-green-200";
    if (nota >= 14) return "text-blue-600 bg-blue-50 border-blue-200";
    if (nota >= 10) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

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
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Notas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Notas e Avaliações</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as notas e avaliações dos alunos. Organize por trimestres, disciplinas e turmas, 
                visualize desempenho acadêmico e mantenha o controle das aprovações.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Notas
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Notas
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/academic-management/notes/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Nota
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
        {/* Card Total de Notas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+12.5%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Notas</p>
            <p className="text-3xl font-bold text-gray-900">{grades.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Cards por situação */}
        {estatisticasNotas.map((stat, index) => {
          const colors = [
            { bg: "from-emerald-50 via-white to-emerald-50/50", icon: "from-emerald-500 to-green-600", text: "text-emerald-600" },
            { bg: "from-red-50 via-white to-red-50/50", icon: "from-red-500 to-red-600", text: "text-red-600" },
            { bg: "from-amber-50 via-white to-yellow-50/50", icon: "from-[#FFD002] to-[#FFC107]", text: "text-[#FFD002]" }
          ];
          const color = colors[index];

          return (
            <div key={stat.situacao} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color.bg} border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color.icon} shadow-sm`}>
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span className="font-bold text-xs text-blue-600">Atual</span>
                </div>
              </div>
              <div>
                <p className={`text-sm font-semibold mb-2 ${color.text}`}>{stat.situacao}</p>
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por aluno, disciplina, professor ou turma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={trimestreFilter} onValueChange={setTrimestreFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trimestre" />
                </SelectTrigger>
                <SelectContent>
                  {trimestreOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  {situacaoOptions.map((option) => (
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

      {/* Tabela de Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Registro de Notas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredGrades.length} notas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Trimestre</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{grade.aluno}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{grade.disciplina}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{grade.professor}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {grade.turma}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {grade.trimestre}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getNotaColor(grade.nota)}>
                        {grade.nota.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={grade.situacao === "Aprovado" ? "default" : grade.situacao === "Reprovado" ? "destructive" : "secondary"}
                        className={
                          grade.situacao === "Aprovado" ? "bg-emerald-100 text-emerald-800" : 
                          grade.situacao === "Reprovado" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {grade.situacao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(grade.dataAvaliacao)}</span>
                      </div>
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
                          <DropdownMenuItem onClick={() => handleViewGrade(grade.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditGrade(grade.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteGrade(grade.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredGrades.length)} de {filteredGrades.length} notas
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
