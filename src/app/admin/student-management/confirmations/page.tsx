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
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  School,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

// Dados mockados baseados na estrutura do backend
const mockConfirmations = [
  {
    codigo: 1,
    data_Confirmacao: "2024-02-15",
    classificacao: "Aprovado",
    codigo_Ano_lectivo: 2024,
    codigo_Status: 1,
    codigo_Matricula: 1,
    codigo_Turma: 1,
    tb_matriculas: {
      codigo: 1,
      data_Matricula: "2024-02-01",
      tb_alunos: {
        codigo: 1,
        nome: "Ana Silva Santos",
        dataNascimento: "2005-03-15",
        sexo: "F",
        url_Foto: "/avatars/ana.jpg"
      },
      tb_cursos: {
        codigo: 1,
        designacao: "Informática de Gestão"
      }
    },
    tb_turmas: {
      codigo: 1,
      designacao: "IG-2024-M",
      tb_classes: {
        codigo: 10,
        designacao: "10ª Classe"
      },
      tb_salas: {
        codigo: 1,
        designacao: "Sala 101"
      },
      tb_periodos: {
        codigo: 1,
        designacao: "Manhã"
      }
    },
    tb_utilizadores: {
      codigo: 1,
      nome: "Admin",
      user: "admin"
    }
  },
  {
    codigo: 2,
    data_Confirmacao: "2024-02-10",
    classificacao: "Aprovado",
    codigo_Ano_lectivo: 2024,
    codigo_Status: 1,
    codigo_Matricula: 3,
    codigo_Turma: 2,
    tb_matriculas: {
      codigo: 3,
      data_Matricula: "2024-01-28",
      tb_alunos: {
        codigo: 3,
        nome: "Maria João Francisco",
        dataNascimento: "2005-11-10",
        sexo: "F",
        url_Foto: "/avatars/maria.jpg"
      },
      tb_cursos: {
        codigo: 1,
        designacao: "Informática de Gestão"
      }
    },
    tb_turmas: {
      codigo: 2,
      designacao: "IG-2024-T",
      tb_classes: {
        codigo: 10,
        designacao: "10ª Classe"
      },
      tb_salas: {
        codigo: 2,
        designacao: "Sala 102"
      },
      tb_periodos: {
        codigo: 2,
        designacao: "Tarde"
      }
    },
    tb_utilizadores: {
      codigo: 1,
      nome: "Admin",
      user: "admin"
    }
  },
  {
    codigo: 3,
    data_Confirmacao: "2024-02-20",
    classificacao: "Pendente",
    codigo_Ano_lectivo: 2024,
    codigo_Status: 0,
    codigo_Matricula: 4,
    codigo_Turma: 3,
    tb_matriculas: {
      codigo: 4,
      data_Matricula: "2024-02-05",
      tb_alunos: {
        codigo: 4,
        nome: "Pedro António Silva",
        dataNascimento: "2004-08-18",
        sexo: "M",
        url_Foto: "/avatars/pedro.jpg"
      },
      tb_cursos: {
        codigo: 2,
        designacao: "Contabilidade"
      }
    },
    tb_turmas: {
      codigo: 3,
      designacao: "CONT-2024-M",
      tb_classes: {
        codigo: 11,
        designacao: "11ª Classe"
      },
      tb_salas: {
        codigo: 3,
        designacao: "Sala 201"
      },
      tb_periodos: {
        codigo: 1,
        designacao: "Manhã"
      }
    },
    tb_utilizadores: {
      codigo: 1,
      nome: "Admin",
      user: "admin"
    }
  }
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativa" },
  { value: "0", label: "Inativa" },
];

const classificationOptions = [
  { value: "all", label: "Todas as Classificações" },
  { value: "Aprovado", label: "Aprovado" },
  { value: "Pendente", label: "Pendente" },
  { value: "Reprovado", label: "Reprovado" },
];

const academicYearOptions = [
  { value: "all", label: "Todos os Anos" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

export default function ConfirmationsListPage() {
  const [confirmations, setConfirmations] = useState(mockConfirmations);
  const [filteredConfirmations, setFilteredConfirmations] = useState(mockConfirmations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar confirmações
  useEffect(() => {
    let filtered = confirmations;

    if (searchTerm) {
      filtered = filtered.filter(confirmation =>
        confirmation.tb_matriculas.tb_alunos.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        confirmation.tb_turmas.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        confirmation.classificacao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(confirmation => 
        confirmation.codigo_Status.toString() === statusFilter
      );
    }

    if (classificationFilter !== "all") {
      filtered = filtered.filter(confirmation => 
        confirmation.classificacao === classificationFilter
      );
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter(confirmation => 
        confirmation.codigo_Ano_lectivo.toString() === yearFilter
      );
    }

    setFilteredConfirmations(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, classificationFilter, yearFilter, confirmations]);

  // Paginação
  const totalPages = Math.ceil(filteredConfirmations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentConfirmations = filteredConfirmations.slice(startIndex, endIndex);

  const handleViewConfirmation = (confirmationId: number) => {
    window.location.href = `/admin/student-management/confirmations/details/${confirmationId}`;
  };

  const handleEditConfirmation = (confirmationId: number) => {
    window.location.href = `/admin/student-management/confirmations/edit/${confirmationId}`;
  };

  const handleDeleteConfirmation = (confirmationId: number) => {
    console.log("Excluir confirmação:", confirmationId);
    // Implementar confirmação e exclusão
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
                    Confirmações
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Confirmações de Turma</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as confirmações de turma dos alunos. Visualize informações detalhadas,
                acompanhe classificações e mantenha os registros sempre atualizados.
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
                onClick={() => window.location.href = '/admin/student-management/confirmations/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Confirmação
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
        {/* Card Total de Confirmações */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+15.3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Confirmações</p>
            <p className="text-3xl font-bold text-gray-900">{confirmations.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Confirmações Ativas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.7%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Confirmações Ativas</p>
            <p className="text-3xl font-bold text-gray-900">
              {confirmations.filter(c => c.codigo_Status === 1).length}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Aprovados */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+12.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Aprovados</p>
            <p className="text-3xl font-bold text-gray-900">
              {confirmations.filter(c => c.classificacao === "Aprovado").length}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Pendentes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Atenção</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-600">Pendentes</p>
            <p className="text-3xl font-bold text-gray-900">
              {confirmations.filter(c => c.classificacao === "Pendente").length}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por aluno, turma ou classificação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
            <div className="md:w-48">
              <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Classificação" />
                </SelectTrigger>
                <SelectContent>
                  {classificationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:w-48">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano Letivo" />
                </SelectTrigger>
                <SelectContent>
                  {academicYearOptions.map((option) => (
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

      {/* Tabela de Confirmações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Confirmações</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredConfirmations.length} confirmações encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Data Confirmação</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentConfirmations.map((confirmation) => (
                  <TableRow key={confirmation.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{confirmation.tb_matriculas.tb_alunos.nome}</p>
                          <p className="text-sm text-gray-500">
                            {calculateAge(confirmation.tb_matriculas.tb_alunos.dataNascimento)} anos • {confirmation.tb_matriculas.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{confirmation.tb_turmas.designacao}</p>
                        <p className="text-sm text-gray-500">
                          {confirmation.tb_turmas.tb_classes.designacao} • {confirmation.tb_turmas.tb_salas.designacao}
                        </p>
                        <p className="text-xs text-gray-400">{confirmation.tb_turmas.tb_periodos.designacao}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{confirmation.tb_matriculas.tb_cursos.designacao}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{formatDate(confirmation.data_Confirmacao)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          confirmation.classificacao === "Aprovado" ? "default" : 
                          confirmation.classificacao === "Pendente" ? "secondary" : 
                          "destructive"
                        }
                        className={
                          confirmation.classificacao === "Aprovado" ? "bg-green-100 text-green-800" :
                          confirmation.classificacao === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {confirmation.classificacao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{confirmation.codigo_Ano_lectivo}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={confirmation.codigo_Status === 1 ? "default" : "secondary"}
                        className={confirmation.codigo_Status === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                      >
                        {confirmation.codigo_Status === 1 ? "Ativa" : "Inativa"}
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
                          <DropdownMenuItem onClick={() => handleViewConfirmation(confirmation.codigo)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditConfirmation(confirmation.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteConfirmation(confirmation.codigo)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredConfirmations.length)} de {filteredConfirmations.length} confirmações
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