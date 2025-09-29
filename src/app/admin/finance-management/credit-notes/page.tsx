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
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  RefreshCw,
} from 'lucide-react';

// Dados mockados das notas de crédito
const mockCreditNotes = [
  {
    id: 1,
    numeroNota: "NC-2024-001",
    aluno: "Ana Silva Santos",
    numeroMatricula: "2024001",
    tipoServico: "Propina",
    descricao: "Estorno de propina - Transferência de curso",
    valorOriginal: 25000,
    valorCredito: 25000,
    dataEmissao: "2024-06-15",
    dataVencimento: "2024-12-15",
    status: "Ativo",
    motivo: "Transferência para outro curso",
    observacoes: "Crédito disponível para uso futuro"
  },
  {
    id: 2,
    numeroNota: "NC-2024-002",
    aluno: "Carlos Manuel Ferreira",
    numeroMatricula: "2024002",
    tipoServico: "Certificado",
    descricao: "Estorno de taxa de certificado - Cancelamento",
    valorOriginal: 15000,
    valorCredito: 15000,
    dataEmissao: "2024-05-20",
    dataVencimento: "2024-11-20",
    status: "Utilizado",
    motivo: "Cancelamento de solicitação",
    observacoes: "Crédito utilizado em nova propina"
  },
  {
    id: 3,
    numeroNota: "NC-2024-003",
    aluno: "Beatriz Costa Lima",
    numeroMatricula: "2024003",
    tipoServico: "Exame",
    descricao: "Estorno de taxa de exame - Erro de cobrança",
    valorOriginal: 8000,
    valorCredito: 8000,
    dataEmissao: "2024-07-10",
    dataVencimento: "2025-01-10",
    status: "Ativo",
    motivo: "Erro na cobrança duplicada",
    observacoes: "Aguardando utilização pelo aluno"
  },
  {
    id: 4,
    numeroNota: "NC-2024-004",
    aluno: "David Nunes Pereira",
    numeroMatricula: "2024004",
    tipoServico: "Matrícula",
    descricao: "Estorno de taxa de matrícula - Desistência",
    valorOriginal: 15000,
    valorCredito: 12000,
    dataEmissao: "2024-04-05",
    dataVencimento: "2024-10-05",
    status: "Expirado",
    motivo: "Desistência do curso",
    observacoes: "Crédito expirado - não utilizado"
  }
];

const tipoServicoOptions = [
  { value: "all", label: "Todos os Serviços" },
  { value: "propina", label: "Propina" },
  { value: "matricula", label: "Matrícula" },
  { value: "certificado", label: "Certificado" },
  { value: "exame", label: "Exame" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "ativo", label: "Ativo" },
  { value: "utilizado", label: "Utilizado" },
  { value: "expirado", label: "Expirado" },
];

export default function CreditNotesPage() {
  const [creditNotes, setCreditNotes] = useState(mockCreditNotes);
  const [filteredCreditNotes, setFilteredCreditNotes] = useState(mockCreditNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoServicoFilter, setTipoServicoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtrar notas de crédito
  useEffect(() => {
    let filtered = creditNotes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.numeroMatricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.numeroNota.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tipoServicoFilter !== "all") {
      filtered = filtered.filter(note => 
        note.tipoServico.toLowerCase().includes(tipoServicoFilter)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(note => 
        note.status.toLowerCase() === statusFilter
      );
    }

    setFilteredCreditNotes(filtered);
    setCurrentPage(1);
  }, [searchTerm, tipoServicoFilter, statusFilter, creditNotes]);

  // Paginação
  const totalPages = Math.ceil(filteredCreditNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCreditNotes = filteredCreditNotes.slice(startIndex, endIndex);

  const handleViewCreditNote = (noteId: number) => {
    window.location.href = `/admin/finance-management/credit-notes/details/${noteId}`;
  };

  const handleEditCreditNote = (noteId: number) => {
    window.location.href = `/admin/finance-management/credit-notes/edit/${noteId}`;
  };

  const handleDeleteCreditNote = (noteId: number) => {
    console.log("Excluir nota de crédito:", noteId);
  };

  // Estatísticas das notas de crédito
  const totalCreditos = creditNotes.reduce((sum, note) => sum + note.valorCredito, 0);
  const creditosAtivos = creditNotes.filter(n => n.status === "Ativo").reduce((sum, note) => sum + note.valorCredito, 0);
  const creditosUtilizados = creditNotes.filter(n => n.status === "Utilizado").length;
  const creditosExpirados = creditNotes.filter(n => n.status === "Expirado").length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-emerald-100 text-emerald-800";
      case "Utilizado":
        return "bg-blue-100 text-blue-800";
      case "Expirado":
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
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Notas de Crédito
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Notas de Crédito</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todas as notas de crédito emitidas. Controle estornos, devoluções 
                e créditos disponíveis para utilização futura pelos alunos.
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
                onClick={() => window.location.href = '/admin/finance-management/credit-notes/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Nota de Crédito
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
        {/* Card Total de Créditos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+8.7%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Créditos</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCreditos)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Créditos Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Ativos</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Créditos Ativos</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(creditosAtivos)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Créditos Utilizados */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-xs text-yellow-600">Utilizados</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Créditos Utilizados</p>
            <p className="text-3xl font-bold text-gray-900">{creditosUtilizados}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Créditos Expirados */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <RefreshCw className="h-3 w-3 text-red-500" />
              <span className="font-bold text-xs text-red-600">Expirados</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-600">Créditos Expirados</p>
            <p className="text-3xl font-bold text-gray-900">{creditosExpirados}</p>
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
                  placeholder="Buscar por aluno, matrícula, número da nota ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={tipoServicoFilter} onValueChange={setTipoServicoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de Serviço" />
                </SelectTrigger>
                <SelectContent>
                  {tipoServicoOptions.map((option) => (
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

      {/* Tabela de Notas de Crédito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Controle de Notas de Crédito</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredCreditNotes.length} notas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número da Nota</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Valor Original</TableHead>
                  <TableHead>Valor Crédito</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCreditNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{note.numeroNota}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{note.aluno}</p>
                        <p className="text-sm text-gray-500">Mat: {note.numeroMatricula}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {note.tipoServico}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(note.valorOriginal)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(note.valorCredito)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(note.dataEmissao)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(note.dataVencimento)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(note.status)}>
                        {note.status}
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
                          <DropdownMenuItem onClick={() => handleViewCreditNote(note.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCreditNote(note.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCreditNote(note.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredCreditNotes.length)} de {filteredCreditNotes.length} notas
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
