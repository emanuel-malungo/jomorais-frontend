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
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  School,
} from 'lucide-react';
import Link from 'next/link';

// Dados mockados das classes baseados na estrutura do backend
const mockClasses = [
  {
    id: 1,
    nome: "1ª Classe",
    nivel: "Ensino Primário",
    totalAlunos: 45,
    totalTurmas: 2,
    coordenador: "Prof. Maria Silva",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 2,
    nome: "2ª Classe",
    nivel: "Ensino Primário",
    totalAlunos: 42,
    totalTurmas: 2,
    coordenador: "Prof. João Santos",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 3,
    nome: "3ª Classe",
    nivel: "Ensino Primário",
    totalAlunos: 40,
    totalTurmas: 2,
    coordenador: "Prof. Pedro Lima",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 4,
    nome: "4ª Classe",
    nivel: "Ensino Primário",
    totalAlunos: 38,
    totalTurmas: 2,
    coordenador: "Prof. Carla Mendes",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 5,
    nome: "5ª Classe",
    nivel: "Ensino Primário",
    totalAlunos: 35,
    totalTurmas: 2,
    coordenador: "Prof. António Silva",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 6,
    nome: "6ª Classe",
    nivel: "Ensino Primário",
    totalAlunos: 33,
    totalTurmas: 2,
    coordenador: "Prof. Rosa Santos",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 7,
    nome: "7ª Classe",
    nivel: "1º Ciclo Secundário",
    totalAlunos: 38,
    totalTurmas: 2,
    coordenador: "Prof. Ana Costa",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 8,
    nome: "8ª Classe",
    nivel: "1º Ciclo Secundário",
    totalAlunos: 36,
    totalTurmas: 2,
    coordenador: "Prof. Manuel Pereira",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 9,
    nome: "9ª Classe",
    nivel: "1º Ciclo Secundário",
    totalAlunos: 34,
    totalTurmas: 2,
    coordenador: "Prof. Luísa Ferreira",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 10,
    nome: "10ª Classe",
    nivel: "2º Ciclo Secundário",
    totalAlunos: 35,
    totalTurmas: 2,
    coordenador: "Prof. Carlos Mendes",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 11,
    nome: "11ª Classe",
    nivel: "2º Ciclo Secundário",
    totalAlunos: 33,
    totalTurmas: 2,
    coordenador: "Prof. Isabel Ferreira",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 12,
    nome: "12ª Classe",
    nivel: "2º Ciclo Secundário",
    totalAlunos: 32,
    totalTurmas: 2,
    coordenador: "Prof. Fernando Costa",
    anoLetivo: "2024/2025",
    status: "Ativo"
  },
  {
    id: 13,
    nome: "13ª Classe",
    nivel: "Pré-Universitário",
    totalAlunos: 28,
    totalTurmas: 1,
    coordenador: "Prof. Beatriz Lima",
    anoLetivo: "2024/2025",
    status: "Ativo"
  }
];

const nivelOptions = [
  { value: "all", label: "Todos os Níveis" },
  { value: "primario", label: "Ensino Primário" },
  { value: "1ciclo", label: "1º Ciclo Secundário" },
  { value: "2ciclo", label: "2º Ciclo Secundário" },
  { value: "preuniversitario", label: "Pré-Universitário" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState(mockClasses);
  const [filteredClasses, setFilteredClasses] = useState(mockClasses);
  const [searchTerm, setSearchTerm] = useState("");
  const [nivelFilter, setNivelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar classes
  useEffect(() => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(classe =>
        classe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.nivel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.coordenador.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (nivelFilter !== "all") {
      filtered = filtered.filter(classe => {
        switch (nivelFilter) {
          case "primario":
            return classe.nivel === "Ensino Primário";
          case "1ciclo":
            return classe.nivel === "1º Ciclo Secundário";
          case "2ciclo":
            return classe.nivel === "2º Ciclo Secundário";
          case "preuniversitario":
            return classe.nivel === "Pré-Universitário";
          default:
            return true;
        }
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(classe => 
        classe.status.toLowerCase() === statusFilter
      );
    }

    setFilteredClasses(filtered);
    setCurrentPage(1);
  }, [searchTerm, nivelFilter, statusFilter, classes]);

  // Paginação
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

  const handleViewClass = (classId: number) => {
    window.location.href = `/admin/academic-management/classes/details/${classId}`;
  };

  const handleEditClass = (classId: number) => {
    window.location.href = `/admin/academic-management/classes/edit/${classId}`;
  };

  const handleDeleteClass = (classId: number) => {
    console.log("Excluir classe:", classId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas por nível
  const classesPorNivel = [
    { nivel: "Ensino Primário", count: classes.filter(c => c.nivel === "Ensino Primário").length },
    { nivel: "1º Ciclo Secundário", count: classes.filter(c => c.nivel === "1º Ciclo Secundário").length },
    { nivel: "2º Ciclo Secundário", count: classes.filter(c => c.nivel === "2º Ciclo Secundário").length },
    { nivel: "Pré-Universitário", count: classes.filter(c => c.nivel === "Pré-Universitário").length }
  ];

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
                    Classes
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Classes Acadêmicas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as classes do sistema educacional. Organize por níveis de ensino, 
                visualize informações detalhadas e mantenha a estrutura curricular sempre atualizada.
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
                onClick={() => window.location.href = '/admin/academic-management/classes/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Classe
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
        {/* Card Total de Classes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+5.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Classes</p>
            <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Cards por nível */}
        {classesPorNivel.slice(0, 3).map((stat, index) => {
          const colors = [
            { bg: "from-emerald-50 via-white to-emerald-50/50", icon: "from-emerald-500 to-green-600", text: "text-emerald-600" },
            { bg: "from-amber-50 via-white to-yellow-50/50", icon: "from-[#FFD002] to-[#FFC107]", text: "text-[#FFD002]" },
            { bg: "from-purple-50 via-white to-purple-50/50", icon: "from-purple-500 to-purple-600", text: "text-purple-600" }
          ];
          const color = colors[index];

          return (
            <div key={stat.nivel} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color.bg} border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color.icon} shadow-sm`}>
                  <School className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span className="font-bold text-xs text-blue-600">Ativo</span>
                </div>
              </div>
              <div>
                <p className={`text-sm font-semibold mb-2 ${color.text}`}>{stat.nivel}</p>
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
                  placeholder="Buscar por classe, nível ou coordenador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={nivelFilter} onValueChange={setNivelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Nível de Ensino" />
                </SelectTrigger>
                <SelectContent>
                  {nivelOptions.map((option) => (
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

      {/* Tabela de Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Lista de Classes</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredClasses.length} classes encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Classe</TableHead>
                  <TableHead>Nível de Ensino</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Coordenador</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClasses.map((classe) => (
                  <TableRow key={classe.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{classe.nome}</p>
                          <p className="text-sm text-gray-500">{classe.anoLetivo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {classe.nivel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{classe.totalAlunos}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{classe.totalTurmas}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{classe.coordenador}</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={classe.status === "Ativo" ? "default" : "secondary"}
                        className={classe.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                      >
                        {classe.status}
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
                          <DropdownMenuItem onClick={() => handleViewClass(classe.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClass(classe.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClass(classe.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClasses.length)} de {filteredClasses.length} classes
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
