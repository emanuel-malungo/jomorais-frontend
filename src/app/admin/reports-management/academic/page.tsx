"use client";

import React, { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
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
  BookOpen,
  Download,
  BarChart3,
  TrendingUp,
  Activity,
  GraduationCap,
  FileText,
  Award,
  Users,
  ChevronDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAcademicReports } from '@/hooks/useReports';

export default function AcademicReportsPage() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const { report, isLoading, error, generateReport, exportToPDF, exportToExcel } = useAcademicReports();

  const reportTypes = [
    { value: "notas", label: "Relatório de Notas" },
    { value: "frequencia", label: "Relatório de Frequência" },
    { value: "aprovacao", label: "Relatório de Aprovação" },
    { value: "disciplinas", label: "Relatório de Disciplinas" },
    { value: "turmas", label: "Relatório de Turmas" },
  ];

  const dateRangeOptions = [
    { value: "current_month", label: "Mês Atual" },
    { value: "previous_month", label: "Mês Anterior" },
    { value: "specific_month", label: "Mês Específico" },
    { value: "custom", label: "Período Personalizado" },
  ];

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  // Carregar relatório inicial
  React.useEffect(() => {
    console.log('🔄 Carregando relatório acadêmico inicial...');
    generateReport();
  }, [generateReport]);

  const handleGenerateReport = () => {
    console.log('📊 Gerando relatório acadêmico...');
    generateReport();
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
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Relatórios Acadêmicos
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Relatórios e Análises Acadêmicas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gere relatórios acadêmicos detalhados. Acompanhe notas, frequência, 
                aprovação e desempenho das disciplinas e turmas.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      {isLoading && !report ? (
        <div className="flex items-center justify-center py-12 mb-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#F9CD1D] mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando estatísticas acadêmicas...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar relatório</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="font-bold text-xs text-blue-600">Ativas</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-[#182F59]">Disciplinas Ativas</p>
              <p className="text-3xl font-bold text-gray-900">{report.totalSubjects}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-emerald-600">Taxa de Aprovação</p>
              <p className="text-3xl font-bold text-gray-900">{report.passRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-[#FFD002]">Trimestres</p>
              <p className="text-3xl font-bold text-gray-900">{report.resumo?.totalTrimestres || 0}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-purple-600">Média Geral</p>
              <p className="text-3xl font-bold text-gray-900">{report.averageGrade.toFixed(1)}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gerador de Relatórios */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Gerador de Relatórios Acadêmicos</span>
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
                  <SelectItem value="trimestre1">1º Trimestre</SelectItem>
                  <SelectItem value="trimestre2">2º Trimestre</SelectItem>
                  <SelectItem value="trimestre3">3º Trimestre</SelectItem>
                  <SelectItem value="ano">Ano Letivo</SelectItem>
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
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar como Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Dados Adicionais da API */}
      {report?.resumo && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Estatísticas Detalhadas do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tipos de Avaliação</p>
                <p className="text-2xl font-bold text-blue-600">{report.resumo.totalTiposAvaliacao}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tipos de Nota</p>
                <p className="text-2xl font-bold text-green-600">{report.resumo.totalTiposNota}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tipos Nota Ativos</p>
                <p className="text-2xl font-bold text-emerald-600">{report.resumo.tiposNotaAtivos}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Valores de Nota</p>
                <p className="text-2xl font-bold text-purple-600">{report.resumo.totalTiposNotaValor}</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tipos de Pauta</p>
                <p className="text-2xl font-bold text-amber-600">{report.resumo.totalTiposPauta}</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Trimestres</p>
                <p className="text-2xl font-bold text-indigo-600">{report.resumo.totalTrimestres}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
