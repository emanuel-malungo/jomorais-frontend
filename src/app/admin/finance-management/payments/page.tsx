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
  Wallet,
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
  AlertCircle,
} from 'lucide-react';

// Dados mockados dos pagamentos
const mockPayments = [
  {
    id: 1,
    aluno: "Ana Silva Santos",
    numeroMatricula: "2024001",
    tipoServico: "Propina",
    descricao: "Propina - 1º Trimestre 2024",
    valor: 25000,
    valorPago: 25000,
    dataVencimento: "2024-03-31",
    dataPagamento: "2024-03-15",
    metodoPagamento: "Transferência Bancária",
    status: "Pago",
    observacoes: "Pagamento efetuado dentro do prazo"
  },
  {
    id: 2,
    aluno: "Carlos Manuel Ferreira",
    numeroMatricula: "2024002",
    tipoServico: "Propina",
    descricao: "Propina - 1º Trimestre 2024",
    valor: 25000,
    valorPago: 15000,
    dataVencimento: "2024-03-31",
    dataPagamento: null,
    metodoPagamento: null,
    status: "Pendente",
    observacoes: "Pagamento parcial efetuado"
  },
  {
    id: 3,
    aluno: "Beatriz Costa Lima",
    numeroMatricula: "2024003",
    tipoServico: "Matrícula",
    descricao: "Taxa de Matrícula 2024",
    valor: 15000,
    valorPago: 15000,
    dataVencimento: "2024-02-15",
    dataPagamento: "2024-02-10",
    metodoPagamento: "Dinheiro",
    status: "Pago",
    observacoes: "Pagamento antecipado"
  },
  {
    id: 4,
    aluno: "David Nunes Pereira",
    numeroMatricula: "2024004",
    tipoServico: "Certificado",
    descricao: "Emissão de Certificado",
    valor: 5000,
    valorPago: 0,
    dataVencimento: "2024-04-15",
    dataPagamento: null,
    metodoPagamento: null,
    status: "Em Atraso",
    observacoes: "Pagamento em atraso há 15 dias"
  },
  {
    id: 5,
    aluno: "Eduarda Mendes Silva",
    numeroMatricula: "2024005",
    tipoServico: "Propina",
    descricao: "Propina - 2º Trimestre 2024",
    valor: 25000,
    valorPago: 25000,
    dataVencimento: "2024-06-30",
    dataPagamento: "2024-06-20",
    metodoPagamento: "Multicaixa",
    status: "Pago",
    observacoes: "Pagamento via Multicaixa Express"
  },
  {
    id: 6,
    aluno: "Francisco José Costa",
    numeroMatricula: "2024006",
    tipoServico: "Exame",
    descricao: "Taxa de Exame Final",
    valor: 8000,
    valorPago: 8000,
    dataVencimento: "2024-11-15",
    dataPagamento: "2024-11-10",
    metodoPagamento: "Transferência Bancária",
    status: "Pago",
    observacoes: "Pagamento confirmado"
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
  { value: "pago", label: "Pago" },
  { value: "pendente", label: "Pendente" },
  { value: "atraso", label: "Em Atraso" },
];

const metodoPagamentoOptions = [
  { value: "all", label: "Todos os Métodos" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "multicaixa", label: "Multicaixa" },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoServicoFilter, setTipoServicoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [metodoPagamentoFilter, setMetodoPagamentoFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar pagamentos
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.numeroMatricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tipoServicoFilter !== "all") {
      filtered = filtered.filter(payment => 
        payment.tipoServico.toLowerCase().includes(tipoServicoFilter)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => {
        switch (statusFilter) {
          case "pago":
            return payment.status === "Pago";
          case "pendente":
            return payment.status === "Pendente";
          case "atraso":
            return payment.status === "Em Atraso";
          default:
            return true;
        }
      });
    }

    if (metodoPagamentoFilter !== "all") {
      filtered = filtered.filter(payment => {
        if (!payment.metodoPagamento) return false;
        const metodo = payment.metodoPagamento.toLowerCase();
        switch (metodoPagamentoFilter) {
          case "transferencia":
            return metodo.includes("transferência");
          case "dinheiro":
            return metodo.includes("dinheiro");
          case "multicaixa":
            return metodo.includes("multicaixa");
          default:
            return true;
        }
      });
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchTerm, tipoServicoFilter, statusFilter, metodoPagamentoFilter, payments]);

  // Paginação
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handleViewPayment = (paymentId: number) => {
    window.location.href = `/admin/finance-management/payments/details/${paymentId}`;
  };

  const handleEditPayment = (paymentId: number) => {
    window.location.href = `/admin/finance-management/payments/edit/${paymentId}`;
  };

  const handleDeletePayment = (paymentId: number) => {
    console.log("Excluir pagamento:", paymentId);
    // Implementar confirmação e exclusão
  };

  // Estatísticas dos pagamentos
  const totalReceita = payments.filter(p => p.status === "Pago").reduce((sum, payment) => sum + payment.valorPago, 0);
  const totalPendente = payments.filter(p => p.status === "Pendente").reduce((sum, payment) => sum + (payment.valor - payment.valorPago), 0);
  const totalAtraso = payments.filter(p => p.status === "Em Atraso").reduce((sum, payment) => sum + payment.valor, 0);
  const pagamentosHoje = payments.filter(p => {
    if (!p.dataPagamento) return false;
    const hoje = new Date().toISOString().split('T')[0];
    return p.dataPagamento.split('T')[0] === hoje;
  }).length;

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
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Pagamentos
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Pagamentos</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gerencie todos os pagamentos da instituição. Controle propinas, matrículas, 
                certificados e outros serviços com acompanhamento em tempo real.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar Relatório
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Importar Dados
              </Button>

              <Button
                onClick={() => window.location.href = '/admin/finance-management/payments/add'}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Pagamento
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
        {/* Card Total de Receita */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">+15.2%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Total Recebido</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalReceita)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Pagamentos Pendentes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Pendente</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Pagamentos Pendentes</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPendente)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Pagamentos em Atraso */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="font-bold text-xs text-red-600">Atraso</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-red-600">Em Atraso</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAtraso)}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Pagamentos Hoje */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Hoje</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Pagamentos Hoje</p>
            <p className="text-3xl font-bold text-gray-900">{pagamentosHoje}</p>
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
                  placeholder="Buscar por aluno, matrícula ou descrição..."
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

              <Select value={metodoPagamentoFilter} onValueChange={setMetodoPagamentoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Método de Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {metodoPagamentoOptions.map((option) => (
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

      {/* Tabela de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Registro de Pagamentos</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredPayments.length} pagamentos encontrados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.aluno}</p>
                          <p className="text-sm text-gray-500">Mat: {payment.numeroMatricula}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{payment.tipoServico}</p>
                        <p className="text-sm text-gray-500">{payment.descricao}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(payment.valor)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(payment.valorPago)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(payment.dataVencimento)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(payment.dataPagamento)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.metodoPagamento ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {payment.metodoPagamento}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
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
                          <DropdownMenuItem onClick={() => handleViewPayment(payment.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPayment(payment.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeletePayment(payment.id)}
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPayments.length)} de {filteredPayments.length} pagamentos
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
