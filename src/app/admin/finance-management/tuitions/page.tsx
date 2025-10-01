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
  DollarSign,
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
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  AlertTriangle,
} from 'lucide-react';

// Dados mockados das propinas
const mockTuitions = [
  {
    id: 1,
    aluno: "Ana Silva Santos",
    numeroMatricula: "2024001",
    classe: "10ª Classe",
    curso: "Informática de Gestão",
    trimestre: "1º Trimestre",
    anoLetivo: "2024/2025",
    valorPropina: 25000,
    valorPago: 25000,
    dataVencimento: "2024-03-31",
    dataPagamento: "2024-03-15",
    status: "Pago",
    observacoes: "Pagamento efetuado dentro do prazo"
  },
  {
    id: 2,
    aluno: "Carlos Manuel Ferreira",
    numeroMatricula: "2024002",
    classe: "11ª Classe",
    curso: "Contabilidade e Gestão",
    trimestre: "1º Trimestre",
    anoLetivo: "2024/2025",
    valorPropina: 25000,
    valorPago: 15000,
    dataVencimento: "2024-03-31",
    dataPagamento: null,
    status: "Parcial",
    observacoes: "Pagamento parcial de 15.000 AOA"
  },
  {
    id: 3,
    aluno: "Beatriz Costa Lima",
    numeroMatricula: "2024003",
    classe: "12ª Classe",
    curso: "Administração",
    trimestre: "2º Trimestre",
    anoLetivo: "2024/2025",
    valorPropina: 25000,
    valorPago: 25000,
    dataVencimento: "2024-06-30",
    dataPagamento: "2024-06-20",
    status: "Pago",
    observacoes: "Pagamento antecipado"
  },
  {
    id: 4,
    aluno: "David Nunes Pereira",
    numeroMatricula: "2024004",
    classe: "10ª Classe",
    curso: "Secretariado Executivo",
    trimestre: "1º Trimestre",
    anoLetivo: "2024/2025",
    valorPropina: 25000,
    valorPago: 0,
    dataVencimento: "2024-03-31",
    dataPagamento: null,
    status: "Em Atraso",
    observacoes: "Pagamento em atraso há 30 dias"
  },
  {
    id: 5,
    aluno: "Eduarda Mendes Silva",
    numeroMatricula: "2024005",
    classe: "11ª Classe",
    curso: "Electrónica e Telecomunicações",
    trimestre: "2º Trimestre",
    anoLetivo: "2024/2025",
    valorPropina: 25000,
    valorPago: 25000,
    dataVencimento: "2024-06-30",
    dataPagamento: "2024-06-25",
    status: "Pago",
    observacoes: "Pagamento via Multicaixa"
  },
  {
    id: 6,
    aluno: "Francisco José Costa",
    numeroMatricula: "2024006",
    classe: "12ª Classe",
    curso: "Informática de Gestão",
    trimestre: "3º Trimestre",
    anoLetivo: "2024/2025",
    valorPropina: 25000,
    valorPago: 0,
    dataVencimento: "2024-09-30",
    dataPagamento: null,
    status: "Pendente",
    observacoes: "Aguardando pagamento"
  }
];

const trimestreOptions = [
  { value: "all", label: "Todos os Trimestres" },
  { value: "1", label: "1º Trimestre" },
  { value: "2", label: "2º Trimestre" },
  { value: "3", label: "3º Trimestre" },
];

const classeOptions = [
  { value: "all", label: "Todas as Classes" },
  { value: "10", label: "10ª Classe" },
  { value: "11", label: "11ª Classe" },
  { value: "12", label: "12ª Classe" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "pago", label: "Pago" },
  { value: "parcial", label: "Parcial" },
  { value: "pendente", label: "Pendente" },
  { value: "atraso", label: "Em Atraso" },
];

export default function TuitionsPage() {
  const [tuitions, setTuitions] = useState(mockTuitions);
  const [filteredTuitions, setFilteredTuitions] = useState(mockTuitions);
  const [searchTerm, setSearchTerm] = useState("");
  const [trimestreFilter, setTrimestreFilter] = useState("all");
  const [classeFilter, setClasseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar propinas
  useEffect(() => {
    let filtered = tuitions;

    if (searchTerm) {
      filtered = filtered.filter(tuition =>
        tuition.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tuition.numeroMatricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tuition.curso.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (trimestreFilter !== "all") {
      filtered = filtered.filter(tuition => 
        tuition.trimestre.includes(trimestreFilter + "º")
      );
    }

    if (classeFilter !== "all") {
      filtered = filtered.filter(tuition => 
        tuition.classe.includes(classeFilter + "ª")
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(tuition => {
        switch (statusFilter) {
          case "pago":
            return tuition.status === "Pago";
          case "parcial":
            return tuition.status === "Parcial";
          case "pendente":
            return tuition.status === "Pendente";
          case "atraso":
            return tuition.status === "Em Atraso";
          default:
            return true;
        }
      });
    }

    setFilteredTuitions(filtered);
    setCurrentPage(1);
  }, [searchTerm, trimestreFilter, classeFilter, statusFilter, tuitions]);

  // Paginação
  const totalPages = Math.ceil(filteredTuitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTuitions = filteredTuitions.slice(startIndex, endIndex);

  const handleViewTuition = (tuitionId: number) => {
    window.location.href = `/admin/finance-management/tuitions/details/${tuitionId}`;
  };

  const handleEditTuition = (tuitionId: number) => {
    window.location.href = `/admin/finance-management/tuitions/edit/${tuitionId}`;
  };

  const handleDeleteTuition = (tuitionId: number) => {
    console.log("Excluir propina:", tuitionId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas das propinas
  const totalArrecadado = tuitions.reduce((sum, tuition) => sum + tuition.valorPago, 0);
  const totalPendente = tuitions.filter(t => t.status !== "Pago").reduce((sum, tuition) => sum + (tuition.valorPropina - tuition.valorPago), 0);
  const propinasPagas = tuitions.filter(t => t.status === "Pago").length;
  const propinasAtrasadas = tuitions.filter(t => t.status === "Em Atraso").length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não pago";
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-emerald-100 text-emerald-800";
      case "Parcial":
        return "bg-blue-100 text-blue-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Em Atraso":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Propinas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Propinas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as propinas dos alunos. Controle pagamentos por trimestre, 
                acompanhe status e mantenha o controle financeiro sempre atualizado.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Propinas
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/finance-management/tuitions/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Propina
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
        {/* Card Total Arrecadado */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+18.5%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Total Arrecadado</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalArrecadado)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Propinas Pagas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Pagas</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Propinas Pagas</p>
            <p className="text-3xl font-bold text-gray-900">{propinasPagas}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Valor Pendente */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-xs text-yellow-600">Pendente</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Valor Pendente</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPendente)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Propinas Atrasadas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="font-bold text-xs text-red-600">Atraso</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-600">Propinas Atrasadas</p>
            <p className="text-3xl font-bold text-gray-900">{propinasAtrasadas}</p>
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
                  placeholder="Buscar por aluno, matrícula ou curso..."
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

      {/* Tabela de Propinas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Controle de Propinas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredTuitions.length} propinas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Classe/Curso</TableHead>
                  <TableHead>Trimestre</TableHead>
                  <TableHead>Valor Propina</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTuitions.map((tuition) => (
                  <TableRow key={tuition.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tuition.aluno}</p>
                          <p className="text-sm text-gray-500">Mat: {tuition.numeroMatricula}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{tuition.classe}</p>
                        <p className="text-sm text-gray-500">{tuition.curso}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {tuition.trimestre}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(tuition.valorPropina)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(tuition.valorPago)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(tuition.dataVencimento)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(tuition.dataPagamento)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tuition.status)}>
                        {tuition.status}
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
                          <DropdownMenuItem onClick={() => handleViewTuition(tuition.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTuition(tuition.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTuition(tuition.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTuitions.length)} de {filteredTuitions.length} propinas
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
