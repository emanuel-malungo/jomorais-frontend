"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  usePagamentosPrincipais, 
  usePagamentoPrincipal,
  useDeletePagamentoPrincipal,
  useUpdatePagamentoPrincipal
} from '@/hooks/usePaymentPrincipal';
import StatCard from '@/components/layout/StatCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

// Opções de filtros
const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

const tipoServicoOptions = [
  { value: "all", label: "Todos os Serviços" },
  { value: "propina", label: "Propina" },
  { value: "matricula", label: "Matrícula" },
  { value: "certificado", label: "Certificado" },
  { value: "exame", label: "Exame" },
];

const metodoPagamentoOptions = [
  { value: "all", label: "Todos os Métodos" },
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "multicaixa", label: "Multicaixa Express" },
];

export default function PaymentsPage() {
  // Estados para filtros e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tipoServicoFilter, setTipoServicoFilter] = useState("all");
  const [metodoPagamentoFilter, setMetodoPagamentoFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, nome: string} | null>(null);
  
  // Estados para formulário de novo pagamento
  const [formData, setFormData] = useState({
    data: '',
    codigo_Aluno: '',
    status: 1,
    valorEntregue: '',
    dataBanco: '',
    totalDesconto: 0,
    obs: ''
  });
  
  // Debounce para o campo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Memoizar os filtros para evitar re-renders infinitos
  const filters = useMemo(() => {
    const filterObj: any = {};
    
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      filterObj.search = debouncedSearchTerm.trim();
    }
    
    if (statusFilter !== "all") {
      const statusNum = parseInt(statusFilter);
      if (!isNaN(statusNum)) {
        filterObj.status = statusNum;
      }
    }
    
    return filterObj;
  }, [debouncedSearchTerm, statusFilter]);
  
  // Hooks da API - Carregar TODOS os pagamentos para pesquisa global
  const { pagamentos: allPagamentos, isLoading: loading, error, pagination, refetch } = usePagamentosPrincipais(1, 1000, filters);
  const { deletePagamentoPrincipal: deletePagamento, isDeleting: deleteLoading } = useDeletePagamentoPrincipal();



  // Filtros locais para pesquisa em TODOS os dados carregados
  const filteredPagamentos = useMemo(() => {
    if (!allPagamentos) return [];
    
    let filtered = [...allPagamentos];
    
    // Filtro por busca
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(pagamento => 
        pagamento.aluno?.nome?.toLowerCase().includes(searchLower) ||
        pagamento.tb_alunos?.nome?.toLowerCase().includes(searchLower) ||
        pagamento.detalhes?.[0]?.tipoServico?.designacao?.toLowerCase().includes(searchLower) ||
        pagamento.codigo?.toString().includes(searchLower)
      );
    }
    
    // Filtro por status
    if (statusFilter !== "all") {
      const statusNum = parseInt(statusFilter);
      if (!isNaN(statusNum)) {
        filtered = filtered.filter(pagamento => pagamento.status === statusNum);
      }
    }
    
    return filtered;
  }, [allPagamentos, debouncedSearchTerm, statusFilter]);

  // Paginação local dos resultados filtrados
  const paginatedPagamentos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPagamentos.slice(startIndex, endIndex);
  }, [filteredPagamentos, currentPage, itemsPerPage]);

  // Cálculo da paginação local
  const localPagination = useMemo(() => {
    const totalItems = filteredPagamentos.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [filteredPagamentos.length, currentPage, itemsPerPage]);

  // Cálculos para exibição
  const startIndex = ((currentPage - 1) * itemsPerPage) + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, localPagination.totalItems);

  const handleViewPayment = (paymentId: number) => {
    window.location.href = `/admin/finance-management/payments/details/${paymentId}`;
  };

  const handleEditPayment = (paymentId: number) => {
    window.location.href = `/admin/finance-management/payments/edit/${paymentId}`;
  };

  // Funções de manipulação
  const handleDeleteClick = (payment: any) => {
    setItemToDelete({
      id: payment.codigo,
      nome: payment.aluno?.nome || payment.tb_alunos?.nome || 'Pagamento'
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deletePagamento(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
      refetch(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  // Estatísticas calculadas dos dados reais
  const totalReceita = useMemo(() => {
    if (allPagamentos && pagination && allPagamentos.length > 0) {
      const mediaPorPagamento = allPagamentos.reduce((sum: number, p) => sum + (p.valorEntregue || 0), 0) / allPagamentos.length;
      return mediaPorPagamento * pagination.totalItems;
    }
    return 0;
  }, [allPagamentos, pagination]);
  
  const totalPendente = useMemo(() => {
    if (allPagamentos && pagination && allPagamentos.length > 0) {
      const mediaPendentePorPagamento = allPagamentos.reduce((sum: number, p) => sum + ((p.total || 0) - (p.valorEntregue || 0)), 0) / allPagamentos.length;
      return mediaPendentePorPagamento * pagination.totalItems;
    }
    return 0;
  }, [allPagamentos, pagination]);
  
  const totalPagamentos = pagination?.totalItems || 0;
  const pagamentosAtivos = useMemo(() => {
    if (allPagamentos && pagination && allPagamentos.length > 0) {
      const percentualAtivos = allPagamentos.filter(p => p.status === 1).length / allPagamentos.length;
      return Math.round(percentualAtivos * pagination.totalItems);
    }
    return 0;
  }, [allPagamentos, pagination]);

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
            <p className="text-sm font-semibold mb-2 text-emerald-600">Total Recebido (Geral)</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalReceita)}</p>
            <p className="text-xs text-emerald-500 mt-1">
              Estimativa baseada nos dados atuais
            </p>
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
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Pagamentos Pendentes (Geral)</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPendente)}</p>
            <p className="text-xs text-[#FFD002] mt-1">
              Estimativa baseada nos dados atuais
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Card Pagamentos Ativos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-sm">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="font-bold text-xs text-green-600">Ativo</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-green-600">Pagamentos Ativos (Geral)</p>
            <p className="text-3xl font-bold text-gray-900">{pagamentosAtivos}</p>
            <p className="text-xs text-green-500 mt-1">Estimativa baseada na amostra</p>
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
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Pagamentos</p>
            <p className="text-3xl font-bold text-gray-900">{totalPagamentos}</p>
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
              {pagination?.totalItems || 0} pagamentos encontrados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando pagamentos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : paginatedPagamentos.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Wallet className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum pagamento encontrado</p>
              </div>
            </div>
          ) : (
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
                    <TableHead>Documento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPagamentos.map((payment) => (
                  <TableRow key={payment.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.aluno?.nome || payment.tb_alunos?.nome || 'N/A'}</p>
                          <p className="text-sm text-gray-500">Cód: {payment.aluno?.codigo || payment.codigo_Aluno}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.detalhes?.[0]?.tipoServico?.designacao || 'Pagamento Principal'}
                        </p>
                        <p className="text-sm text-gray-500">{payment.obs || 'Sem descrição'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(payment.total || 0)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(payment.valorEntregue || 0)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(payment.dataBanco)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(payment.data)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {payment.tipoDocumento || 'Não especificado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status === 1 ? "Ativo" : "Inativo")}>
                        {payment.status === 1 ? "Ativo" : "Inativo"}
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
                          <DropdownMenuItem onClick={() => handleViewPayment(payment.codigo)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPayment(payment.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(payment)}
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

              {/* Paginação */}
              {localPagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {localPagination.totalItems} pagamentos
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
                    const endPage = Math.min(localPagination.totalPages, startPage + maxPagesToShow - 1);
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
                    if (endPage < localPagination.totalPages) {
                      if (endPage < localPagination.totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={localPagination.totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(localPagination.totalPages)}
                        >
                          {localPagination.totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, localPagination.totalPages))}
                  disabled={currentPage === localPagination.totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
                </div>
              </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o pagamento de <strong>{itemToDelete?.nome}</strong>?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </Container>
  );
}
