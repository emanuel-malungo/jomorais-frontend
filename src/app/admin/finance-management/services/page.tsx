"use client";

import React, { useState, useMemo, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Settings,
  DollarSign,
  Search,
} from 'lucide-react';
import { useTiposServicos, useDeleteTipoServico, useRelatorioFinanceiro } from '@/hooks/useFinancialService';
import { ITipoServicoFilter, TipoServicoEnum, StatusServicoEnum } from '@/types/financialService.types';
import { useRouter } from 'next/navigation';

// Opções de filtros
const tipoServicoOptions = [
  { value: "all", label: "Todos os Tipos" },
  { value: TipoServicoEnum.PROPINA, label: "Propina" },
  { value: TipoServicoEnum.TAXA, label: "Taxa" },
  { value: TipoServicoEnum.MULTA, label: "Multa" },
  { value: TipoServicoEnum.CERTIFICADO, label: "Certificado" },
  { value: TipoServicoEnum.OUTRO, label: "Outro" },
];

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: StatusServicoEnum.ACTIVO, label: "Ativo" },
  { value: StatusServicoEnum.INACTIVO, label: "Inativo" },
];

export default function ServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [tipoServicoFilter, setTipoServicoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);

  // Debounce para o termo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset da página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, tipoServicoFilter, statusFilter]);

  // Filtros para API - Temporariamente desabilitados devido a erro 400
  const filters = useMemo((): ITipoServicoFilter => ({
    // search: debouncedSearchTerm || undefined,
    // tipoServico: tipoServicoFilter !== "all" ? tipoServicoFilter : undefined,
    // status: statusFilter !== "all" ? statusFilter : undefined,
  }), [debouncedSearchTerm, tipoServicoFilter, statusFilter]);

  // Hooks da API - Carregar TODOS os serviços para pesquisa local
  const { tiposServicos: allTiposServicos, loading, error, pagination, refetch } = useTiposServicos(1, 1000, filters); // Carregar até 1000 serviços

  // Filtros locais para pesquisa em TODOS os dados carregados
  const filteredTiposServicos = useMemo(() => {
    if (!allTiposServicos) return [];
    
    let filtered = [...allTiposServicos];
    
    // Filtro por busca
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(servico => 
        servico.designacao?.toLowerCase().includes(searchLower) ||
        servico.descricao?.toLowerCase().includes(searchLower) ||
        servico.tipoServico?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtro por tipo de serviço
    if (tipoServicoFilter !== "all") {
      filtered = filtered.filter(servico => 
        servico.tipoServico === tipoServicoFilter
      );
    }
    
    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(servico => 
        servico.status === statusFilter
      );
    }
    
    return filtered;
  }, [allTiposServicos, debouncedSearchTerm, tipoServicoFilter, statusFilter]);

  // Paginação local dos resultados filtrados
  const paginatedTiposServicos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTiposServicos.slice(startIndex, endIndex);
  }, [filteredTiposServicos, currentPage, itemsPerPage]);

  // Cálculo da paginação local
  const localPagination = useMemo(() => {
    const totalItems = filteredTiposServicos.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [filteredTiposServicos.length, currentPage, itemsPerPage]);
  const { relatorio, loading: relatorioLoading } = useRelatorioFinanceiro();
  const { deleteTipoServico, loading: deleteLoading } = useDeleteTipoServico();

  // Debug logs
  useEffect(() => {
    console.log('🔍 Filtros atuais:', filters);
    console.log('📊 Dados carregados:', { 
      allTiposServicos: allTiposServicos?.length || 0, 
      filteredTiposServicos: filteredTiposServicos?.length || 0,
      loading, 
      error,
      pagination 
    });
  }, [filters, allTiposServicos, filteredTiposServicos, loading, error, pagination]);

  // Funções de navegação
  const handleViewService = (serviceId: number) => {
    router.push(`/admin/finance-management/services/details/${serviceId}`);
  };

  const handleEditService = (serviceId: number) => {
    router.push(`/admin/finance-management/services/edit/${serviceId}`);
  };

  const handleDeleteService = (serviceId: number) => {
    setDeletingServiceId(serviceId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingServiceId) return;
    
    try {
      await deleteTipoServico(deletingServiceId);
      setShowDeleteModal(false);
      setDeletingServiceId(null);
      refetch(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingServiceId(null);
  };


  // Estatísticas dos serviços baseadas na API
  const totalServicos = pagination?.totalItems || 0;
  const servicosAtivos = relatorio?.resumo?.servicosAtivos || 0;
  const servicosComMulta = relatorio?.resumo?.servicosComMulta || 0;
  const servicosComDesconto = relatorio?.resumo?.servicosComDesconto || 0;
  
  // Valor temporário para totalArrecadado (até API ser atualizada)
  // Usando um valor mockado baseado no número de serviços ativos
  const totalArrecadado = relatorio?.resumo?.totalArrecadado || (servicosAtivos * 50000);
  
  // Valor temporário para servicosPagos (até API ser atualizada)
  // Usando um valor mockado baseado no número de serviços ativos (aproximadamente 80% dos ativos)
  const servicosPagos = relatorio?.resumo?.servicosPagos || Math.floor(servicosAtivos * 0.8);
  
  // Valor temporário para servicosPendentes (até API ser atualizada)
  // Usando um valor mockado baseado no número de serviços ativos (aproximadamente 20% dos ativos)
  const servicosPendentes = relatorio?.resumo?.servicosPendentes || Math.floor(servicosAtivos * 0.2);
  
  // Valor temporário para servicosAtrasados (até API ser atualizada)
  // Usando um valor mockado baseado no número de serviços ativos (aproximadamente 10% dos ativos)
  const servicosAtrasados = relatorio?.resumo?.servicosAtrasados || Math.floor(servicosAtivos * 0.1);

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
      case StatusServicoEnum.ACTIVO:
        return "bg-emerald-100 text-emerald-800";
      case StatusServicoEnum.INACTIVO:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Estados de interface
  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando serviços...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar serviços</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header usando WelcomeHeader */}
      <WelcomeHeader
        title="Serviços"
        description="Gerencie todos os serviços acadêmicos oferecidos. Controle certificados, declarações, exames e outros serviços com acompanhamento financeiro completo."
        iconMain={<FileText className="h-8 w-8 text-white" />}
        titleBtnRight="Novo Serviço"
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/finance-management/services/add'}
      />

      {/* Stats Cards usando StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Arrecadado"
          value={formatCurrency(totalArrecadado)}
          change="+22.1%"
          changeType="up"
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          icon={Receipt}
          title="Serviços Pagos"
          value={servicosPagos.toString()}
          change="Pagos"
          changeType="neutral"
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          icon={CreditCard}
          title="Serviços Pendentes"
          value={servicosPendentes.toString()}
          change="Pendente"
          changeType="neutral"
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          icon={Settings}
          title="Serviços Atrasados"
          value={servicosAtrasados.toString()}
          change="Atraso"
          changeType="down"
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Filtros e Busca usando FilterSearchCard */}
      <FilterSearchCard
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nome, descrição ou tipo de serviço..."
        filters={[
          {
            label: "Tipo de Serviço",
            value: tipoServicoFilter,
            onChange: setTipoServicoFilter,
            options: tipoServicoOptions,
          },
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
          },
        ]}
      />

      {/* Info sobre filtros */}
      {(debouncedSearchTerm || tipoServicoFilter !== "all" || statusFilter !== "all") && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            🔍 Pesquisa em TODOS os serviços carregados • 
            <span className="font-semibold ml-1">
              {filteredTiposServicos.length} de {allTiposServicos?.length || 0} resultados
            </span>
          </p>
        </div>
      )}

      {/* Tabela de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Controle de Serviços</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination?.totalItems || 0} serviços encontrados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Multa</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Moeda</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTiposServicos?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Search className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-medium text-foreground">Nenhum serviço encontrado</h3>
                          <p className="text-muted-foreground">
                            {debouncedSearchTerm || tipoServicoFilter !== "all" || statusFilter !== "all" 
                              ? "Tente ajustar os filtros de pesquisa"
                              : "Não há serviços cadastrados"
                            }
                          </p>
                        </div>
                        {(debouncedSearchTerm || tipoServicoFilter !== "all" || statusFilter !== "all") && (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSearchTerm("");
                              setTipoServicoFilter("all");
                              setStatusFilter("all");
                            }}
                          >
                            Limpar filtros
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTiposServicos?.map((service) => (
                  <TableRow key={service.codigo}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-[#F9CD1D]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.designacao}</p>
                          <p className="text-sm text-gray-500">Código: {service.codigo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {service.tipoServico}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{service.descricao}</p>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{formatCurrency(service.preco)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.aplicarMulta ? "destructive" : "secondary"} className="text-xs">
                        {service.aplicarMulta ? `${formatCurrency(service.valorMulta)}` : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.aplicarDesconto ? "default" : "secondary"} className="text-xs">
                        {service.aplicarDesconto ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {service.tb_moedas?.designacao || "AOA"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
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
                          <DropdownMenuItem onClick={() => handleViewService(service.codigo)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditService(service.codigo)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service.codigo)}
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
          {localPagination && localPagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, localPagination.totalItems)} de {localPagination.totalItems} serviços
                {(debouncedSearchTerm || tipoServicoFilter !== "all" || statusFilter !== "all") && (
                  <span className="text-[#3B6C4D] font-medium"> (filtrados de {allTiposServicos?.length || 0} total)</span>
                )}
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
                    const totalPages = localPagination.totalPages;
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
                          onClick={() => setCurrentPage(localPagination.totalPages)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, localPagination.totalPages))}
                  disabled={!localPagination.hasNextPage}
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
