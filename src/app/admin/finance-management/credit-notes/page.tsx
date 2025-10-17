"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { Button } from '@/components/ui/button';
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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Activity,
  CreditCard,
  Receipt,
  RefreshCw,
  DollarSign,
  Calendar,
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
      {/* Header - Usando WelcomeHeader */}
      <WelcomeHeader
        title="Notas de Crédito"
        description="Gerencie todas as notas de crédito emitidas. Controle estornos, devoluções e créditos disponíveis para utilização futura pelos alunos."
        iconMain={<FileText />}
        titleBtnRight="Nova Nota de Crédito"
        iconBtnRight={<Plus />}
        onClickBtnRight={() => window.location.href = '/admin/finance-management/credit-notes/add'}
      />

      {/* Stats Cards usando StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Créditos"
          value={formatCurrency(totalCreditos)}
          change="+8.7%"
          changeType="up"
          icon={DollarSign}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />
        
        <StatCard
          title="Créditos Ativos"
          value={formatCurrency(creditosAtivos)}
          change="Ativos"
          changeType="neutral"
          icon={CreditCard}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        
        <StatCard
          title="Créditos Utilizados"
          value={creditosUtilizados.toString()}
          change="Utilizados"
          changeType="neutral"
          icon={Receipt}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />
        
        <StatCard
          title="Créditos Expirados"
          value={creditosExpirados.toString()}
          change="Expirados"
          changeType="down"
          icon={RefreshCw}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Filtros e Busca usando FilterSearchCard */}
      <FilterSearchCard
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por aluno, matrícula, número da nota ou descrição..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
          },
          {
            label: 'Tipo de Serviço',
            value: tipoServicoFilter,
            onChange: setTipoServicoFilter,
            options: tipoServicoOptions,
          },
        ]}
      />

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
