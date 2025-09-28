"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

// Dados mockados baseados na estrutura do backend
const mockStudents = [
  {
    codigo: 1,
    nome: "Ana Silva Santos",
    pai: "João Santos",
    mae: "Maria Silva",
    email: "ana.santos@email.com",
    telefone: "923456789",
    dataNascimento: "2005-03-15",
    sexo: "F",
    n_documento_identificacao: "123456789LA041",
    morada: "Rua das Flores, 123, Luanda",
    url_Foto: "/avatars/ana.jpg",
    codigo_Status: 1,
    dataCadastro: "2024-01-15",
    tb_encarregados: {
      nome: "João Santos",
      telefone: "912345678",
      tb_profissao: { designacao: "Engenheiro" }
    },
    tb_tipo_documento: { designacao: "Bilhete de Identidade" },
    tb_matriculas: {
      data_Matricula: "2024-02-01",
      codigoStatus: 1,
      tb_cursos: { designacao: "Informática de Gestão" },
      tb_confirmacoes: [{
        tb_turmas: {
          designacao: "IG-2024-M",
          tb_classes: { designacao: "10ª Classe" }
        }
      }]
    }
  },
  {
    codigo: 2,
    nome: "Carlos Manuel Ferreira",
    pai: "Manuel Ferreira",
    mae: "Rosa Manuel",
    email: "carlos.ferreira@email.com",
    telefone: "934567890",
    dataNascimento: "2004-07-22",
    sexo: "M",
    n_documento_identificacao: "987654321LA042",
    morada: "Av. Marginal, 456, Luanda",
    url_Foto: "/avatars/carlos.jpg",
    codigo_Status: 1,
    dataCadastro: "2024-01-20",
    tb_encarregados: {
      nome: "Manuel Ferreira",
      telefone: "923456789",
      tb_profissao: { designacao: "Professor" }
    },
    tb_tipo_documento: { designacao: "Bilhete de Identidade" },
    tb_matriculas: {
      data_Matricula: "2024-02-05",
      codigoStatus: 1,
      tb_cursos: { designacao: "Contabilidade e Gestão" },
      tb_confirmacoes: [{
        tb_turmas: {
          designacao: "CG-2024-T",
          tb_classes: { designacao: "11ª Classe" }
        }
      }]
    }
  },
  {
    codigo: 3,
    nome: "Beatriz Costa Lima",
    pai: "António Lima",
    mae: "Esperança Costa",
    email: "beatriz.lima@email.com",
    telefone: "945678901",
    dataNascimento: "2005-11-08",
    sexo: "F",
    n_documento_identificacao: "456789123LA043",
    morada: "Bairro Operário, 789, Luanda",
    url_Foto: "/avatars/beatriz.jpg",
    codigo_Status: 1,
    dataCadastro: "2024-01-25",
    tb_encarregados: {
      nome: "António Lima",
      telefone: "934567890",
      tb_profissao: { designacao: "Comerciante" }
    },
    tb_tipo_documento: { designacao: "Bilhete de Identidade" },
    tb_matriculas: {
      data_Matricula: "2024-02-10",
      codigoStatus: 1,
      tb_cursos: { designacao: "Secretariado Executivo" },
      tb_confirmacoes: [{
        tb_turmas: {
          designacao: "SE-2024-M",
          tb_classes: { designacao: "10ª Classe" }
        }
      }]
    }
  },
  {
    codigo: 4,
    nome: "David Nunes Pereira",
    pai: "José Pereira",
    mae: "Luísa Nunes",
    email: "david.pereira@email.com",
    telefone: "956789012",
    dataNascimento: "2003-12-03",
    sexo: "M",
    n_documento_identificacao: "789123456LA044",
    morada: "Zona Industrial, 321, Luanda",
    url_Foto: "/avatars/david.jpg",
    codigo_Status: 1,
    dataCadastro: "2024-02-01",
    tb_encarregados: {
      nome: "José Pereira",
      telefone: "945678901",
      tb_profissao: { designacao: "Mecânico" }
    },
    tb_tipo_documento: { designacao: "Bilhete de Identidade" },
    tb_matriculas: {
      data_Matricula: "2024-02-15",
      codigoStatus: 1,
      tb_cursos: { designacao: "Electrónica e Telecomunicações" },
      tb_confirmacoes: [{
        tb_turmas: {
          designacao: "ET-2024-T",
          tb_classes: { designacao: "12ª Classe" }
        }
      }]
    }
  },
  {
    codigo: 5,
    nome: "Eduarda Mendes Silva",
    pai: "Fernando Silva",
    mae: "Carla Mendes",
    email: "eduarda.silva@email.com",
    telefone: "967890123",
    dataNascimento: "2005-05-18",
    sexo: "F",
    n_documento_identificacao: "321654987LA045",
    morada: "Bairro Azul, 654, Luanda",
    url_Foto: "/avatars/eduarda.jpg",
    codigo_Status: 0, // Inativo
    dataCadastro: "2024-02-05",
    tb_encarregados: {
      nome: "Fernando Silva",
      telefone: "956789012",
      tb_profissao: { designacao: "Advogado" }
    },
    tb_tipo_documento: { designacao: "Bilhete de Identidade" },
    tb_matriculas: null // Sem matrícula
  }
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

const courseOptions = [
  { value: "all", label: "Todos os Cursos" },
  { value: "informatica", label: "Informática de Gestão" },
  { value: "contabilidade", label: "Contabilidade e Gestão" },
  { value: "secretariado", label: "Secretariado Executivo" },
  { value: "electronica", label: "Electrónica e Telecomunicações" },
];

export default function ListStudentPage() {
  const [students, setStudents] = useState(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar estudantes
  useEffect(() => {
    let filtered = students;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.telefone.includes(searchTerm) ||
        student.n_documento_identificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.pai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mae.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => 
        student.codigo_Status.toString() === statusFilter
      );
    }

    // Filtro por curso
    if (courseFilter !== "all") {
      filtered = filtered.filter(student => {
        if (!student.tb_matriculas) return false;
        const courseName = student.tb_matriculas.tb_cursos.designacao.toLowerCase();
        return courseName.includes(courseFilter);
      });
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, courseFilter, students]);

  // Paginação
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handleViewStudent = (studentId: number) => {
    window.location.href = `/admin/student-management/student-details/${studentId}`;
  };

  const handleEditStudent = (studentId: number) => {
    window.location.href = `/admin/student-management/edit-student/${studentId}`;
  };

  const handleDeleteStudent = (studentId: number) => {
    console.log("Excluir aluno:", studentId);
    // Implementar confirmação e exclusão do aluno
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
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Lista de Alunos
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Estudantes</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todos os alunos matriculados na instituição. Visualize informações detalhadas,
                acompanhe matrículas e mantenha os dados sempre atualizados.
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
                onClick={() => window.location.href = '/admin/student-management/add-student'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Aluno
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
        {/* Card Total de Alunos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Alunos</p>
            <p className="text-3xl font-bold text-gray-900">{students.length}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Alunos Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+3.5%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Alunos Ativos</p>
            <p className="text-3xl font-bold text-gray-900">
              {students.filter(s => s.codigo_Status === 1).length}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Com Matrícula */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+2.1%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Com Matrícula</p>
            <p className="text-3xl font-bold text-gray-900">
              {students.filter(s => s.tb_matriculas).length}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Sem Matrícula */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <UserX className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Atenção</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Sem Matrícula</p>
            <p className="text-3xl font-bold text-gray-900">
              {students.filter(s => !s.tb_matriculas).length}
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
                  placeholder="Buscar por nome, email, telefone, documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
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

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  {courseOptions.map((option) => (
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

      {/* Tabela de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Alunos Encontrados ({filteredStudents.length})
          </CardTitle>
          <CardDescription>
            Lista de todos os alunos com suas informações principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Encarregado</TableHead>
                  <TableHead>Curso/Turma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59]"></div>
                        <span>Carregando alunos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum aluno encontrado</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentStudents.map((student, index) => (
                    <TableRow key={student.codigo} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {student.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.nome}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {calculateAge(student.dataNascimento)} anos
                              </span>
                              <span>{student.sexo === 'M' ? 'Masculino' : 'Feminino'}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{student.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{student.telefone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{student.n_documento_identificacao}</p>
                          <p className="text-xs text-gray-500">{student.tb_tipo_documento.designacao}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{student.tb_encarregados.nome}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {student.tb_encarregados.telefone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.tb_matriculas ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {student.tb_matriculas.tb_cursos.designacao}
                            </p>
                            {student.tb_matriculas.tb_confirmacoes?.[0] && (
                              <Badge variant="outline" className="text-xs">
                                {student.tb_matriculas.tb_confirmacoes[0].tb_turmas.designacao}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Sem Matrícula
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={student.codigo_Status === 1 ? "default" : "secondary"}
                          className={student.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {student.codigo_Status === 1 ? "Ativo" : "Inativo"}
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
                            <DropdownMenuItem onClick={() => handleViewStudent(student.codigo)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStudent(student.codigo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteStudent(student.codigo)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredStudents.length)} de {filteredStudents.length} alunos
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
                      className={currentPage === page ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
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