"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DollarSign,
  Download,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  FileText,
  Wallet,
  Loader2,
  AlertCircle,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { useFinancialReports } from '@/hooks/useReports';

export default function FinancialReportsPage() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  
  const { report, isLoading, error, generateReport, exportToPDF, exportToExcel } = useFinancialReports();

  const reportTypes = [
    { value: "receitas", label: "Relatório de Receitas" },
    { value: "pagamentos", label: "Relatório de Pagamentos" },
    { value: "propinas", label: "Relatório de Propinas" },
    { value: "inadimplencia", label: "Relatório de Inadimplência" },
    { value: "fluxo-caixa", label: "Fluxo de Caixa" },
  ];

  const dateRanges = [
    { value: "hoje", label: "Hoje" },
    { value: "semana", label: "Esta Semana" },
    { value: "mes", label: "Este Mês" },
    { value: "trimestre", label: "Este Trimestre" },
    { value: "ano", label: "Este Ano" },
  ];

  // Carregar relatório inicial
  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const handleGenerateReport = () => {
    const filters = {
      startDate: dateRange === 'mes' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      endDate: new Date().toISOString(),
    };
    generateReport(filters);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  return (
    <Container>
      {/* Header */}
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
                    Relatórios Financeiros
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Relatórios e Análises Financeiras</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gere relatórios financeiros detalhados. Acompanhe receitas, pagamentos, 
                inadimplência e fluxo de caixa com análises completas.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards - Dados Reais da API */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#F9CD1D]" />
          <span className="ml-2 text-gray-600">Carregando dados financeiros...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-600">{error}</span>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm font-semibold mb-2 text-emerald-600">Receita Total</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(report.totalRevenue)}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="font-bold text-xs text-blue-600">Recebido</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-[#182F59]">Pagamentos Recebidos</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(report.totalPaid)}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <TrendingUp className="h-3 w-3 text-yellow-500" />
                <span className="font-bold text-xs text-yellow-600">Pendente</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-[#FFD002]">Valores Pendentes</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(report.totalPending)}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-sm">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Activity className="h-3 w-3 text-red-500" />
                <span className="font-bold text-xs text-red-600">{report.defaultRate.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-red-600">Taxa de Inadimplência</p>
              <p className="text-3xl font-bold text-gray-900">{report.defaultRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gerador de Relatórios */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Gerador de Relatórios Financeiros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Relatório
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Período
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={!report || isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>


      {/* Seção de Relatórios Detalhados com Dados Reais */}
      {report && (
        <>

          {/* Análise por Tipo de Serviço */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Receitas por Tipo de Serviço</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.paymentsByService.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm">{service.service}</h4>
                      <Badge variant="outline">{formatCurrency(service.amount)}</Badge>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {((service.amount / report.totalPaid) * 100).toFixed(1)}% do total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Resumo Financeiro</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-emerald-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{formatCurrency(report.totalRevenue)}</div>
                  <div className="text-sm text-emerald-700">Receita Total</div>
                  <div className="text-xs text-emerald-600 mt-1">100% do faturamento</div>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(report.totalPaid)}</div>
                  <div className="text-sm text-blue-700">Valores Recebidos</div>
                  <div className="text-xs text-blue-600 mt-1">{((report.totalPaid / report.totalRevenue) * 100).toFixed(1)}% da receita</div>
                </div>
                
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{formatCurrency(report.totalPending)}</div>
                  <div className="text-sm text-yellow-700">Valores Pendentes</div>
                  <div className="text-xs text-yellow-600 mt-1">{((report.totalPending / report.totalRevenue) * 100).toFixed(1)}% da receita</div>
                </div>
                
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">{formatCurrency(report.totalOverdue)}</div>
                  <div className="text-sm text-red-700">Valores em Atraso</div>
                  <div className="text-xs text-red-600 mt-1">{((report.totalOverdue / report.totalRevenue) * 100).toFixed(1)}% da receita</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicadores de Performance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Indicadores de Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-4xl font-bold text-[#182F59] mb-2">{report.defaultRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-700">Taxa de Inadimplência</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {report.defaultRate < 5 ? 'Excelente' : report.defaultRate < 10 ? 'Bom' : 'Atenção necessária'}
                  </div>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-4xl font-bold text-[#F9CD1D] mb-2">{report.averagePaymentTime}</div>
                  <div className="text-sm text-gray-700">Tempo Médio de Pagamento</div>
                  <div className="text-xs text-gray-500 mt-1">dias</div>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-4xl font-bold text-[#3B6C4D] mb-2">{((report.totalPaid / report.totalRevenue) * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-700">Taxa de Recebimento</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((report.totalPaid / report.totalRevenue) * 100) > 90 ? 'Excelente' : 'Em desenvolvimento'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}
