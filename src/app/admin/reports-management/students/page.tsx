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
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  GraduationCap,
  UserCheck,
  FileText,
  Loader2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useStudentReports } from '@/hooks/useReports';
import { useClasses } from '@/hooks/useClass';
import { useCourses } from '@/hooks/useCourse';

export default function StudentsReportsPage() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  
  const { report, isLoading, error, generateReport, exportToPDF, exportToExcel } = useStudentReports();
  
  // Buscar dados reais da API para as comboboxes
  const { classes } = useClasses();
  const { courses } = useCourses(1, 100, ""); // Buscar todos os cursos

  const reportTypes = [
    { value: "matriculas", label: "Relatório de Matrículas" },
    { value: "frequencia", label: "Relatório de Frequência" },
    { value: "aproveitamento", label: "Relatório de Aproveitamento" },
    { value: "transferencias", label: "Relatório de Transferências" },
    { value: "desistencias", label: "Relatório de Desistências" },
  ];

  const dateRanges = [
    { value: "hoje", label: "Hoje" },
    { value: "semana", label: "Esta Semana" },
    { value: "mes", label: "Este Mês" },
    { value: "trimestre", label: "Este Trimestre" },
    { value: "ano", label: "Este Ano" },
    { value: "personalizado", label: "Período Personalizado" },
  ];

  // Opções de classes baseadas nos dados reais da API
  const classOptions = [
    { value: "all", label: "Todas as Classes" },
    ...(classes || []).map(classe => ({
      value: classe.codigo.toString(),
      label: classe.designacao
    }))
  ];

  // Opções de cursos baseadas nos dados reais da API
  const courseOptions = [
    { value: "all", label: "Todos os Cursos" },
    ...(courses || [])
      .filter(course => course.designacao && course.designacao.trim() !== "")
      .map(course => ({
        value: course.codigo.toString(),
        label: course.designacao
      }))
  ];

  // Carregar relatório inicial
  useEffect(() => {
    console.log('🔄 Carregando relatório inicial...');
    generateReport();
  }, [generateReport]);

  // Debug do estado do relatório
  useEffect(() => {
    console.log('📊 Estado do relatório:', { report, isLoading, error });
  }, [report, isLoading, error]);

  // Debug dos dados das comboboxes
  useEffect(() => {
    console.log('🎯 Dados das comboboxes:', { 
      classes: classes.length, 
      courses: courses.length,
      classesData: classes.slice(0, 3),
      coursesData: courses.slice(0, 3)
    });
  }, [classes, courses]);

  const handleGenerateReport = () => {
    const filters = {
      startDate: dateRange === 'mes' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      endDate: new Date().toISOString(),
      classId: classFilter && classFilter !== 'all' ? parseInt(classFilter) : undefined,
      courseId: courseFilter && courseFilter !== 'all' ? parseInt(courseFilter) : undefined
    };
    console.log('🔍 Gerando relatório com filtros:', filters);
    generateReport(filters);
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
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Relatórios de Alunos
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Relatórios e Estatísticas de Alunos</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Gere relatórios detalhados sobre alunos, matrículas, frequência e aproveitamento. 
                Acompanhe estatísticas e tendências acadêmicas com dados atualizados.
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
          <span className="ml-2 text-gray-600">Carregando dados...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-600">{error}</span>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="font-bold text-xs text-emerald-600">+12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-[#182F59]">Total de Alunos</p>
              <p className="text-3xl font-bold text-gray-900">{report.totalStudents.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="font-bold text-xs text-blue-600">Ativos</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-emerald-600">Alunos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{report.activeStudents.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="font-bold text-xs text-emerald-600">+8.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-[#FFD002]">Novas Matrículas</p>
              <p className="text-3xl font-bold text-gray-900">{report.newEnrollments.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="font-bold text-xs text-blue-600">{((report.activeStudents / report.totalStudents) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-purple-600">Taxa de Atividade</p>
              <p className="text-3xl font-bold text-gray-900">{((report.activeStudents / report.totalStudents) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gerador de Relatórios */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Gerador de Relatórios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Classe
              </label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classe" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Curso
              </label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
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
            <Button 
              variant="outline" 
              onClick={exportToPDF}
              disabled={!report || isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button 
              variant="outline"
              onClick={exportToExcel}
              disabled={!report || isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Seção de Relatórios Detalhados com Dados Reais */}
      {report && (
        <>
          {/* Análise por Gênero */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Distribuição por Gênero</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Masculino</span>
                    <span className="text-sm font-bold">{report.byGender.male} ({((report.byGender.male / report.totalStudents) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(report.byGender.male / report.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Feminino</span>
                    <span className="text-sm font-bold">{report.byGender.female} ({((report.byGender.female / report.totalStudents) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: `${(report.byGender.female / report.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{report.totalStudents}</div>
                    <div className="text-sm text-gray-600">Total de Alunos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análise por Faixa Etária */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Distribuição por Faixa Etária</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.byAge.map((ageGroup, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{ageGroup.range}</span>
                      <span className="text-sm font-bold">{ageGroup.count} alunos</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#F9CD1D] h-2 rounded-full" 
                        style={{ width: `${(ageGroup.count / report.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise por Curso */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Distribuição por Curso</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.byCourse.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.course}</h4>
                      <Badge variant="outline">{course.count} vagas</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#3B6C4D] h-2 rounded-full" 
                        style={{ width: `${Math.min((course.count / Math.max(...report.byCourse.map(c => c.count))) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Análise por Classe */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Distribuição por Classe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.byClass.map((classItem, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-[#182F59] mb-1">{classItem.count}</div>
                    <div className="text-sm text-gray-600">{classItem.class}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Movimentações */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Movimentações de Alunos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{report.newEnrollments}</div>
                  <div className="text-sm text-green-700">Novas Matrículas</div>
                  <div className="text-xs text-green-600 mt-1">Este período</div>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{report.transfers}</div>
                  <div className="text-sm text-blue-700">Transferências</div>
                  <div className="text-xs text-blue-600 mt-1">Este período</div>
                </div>
                
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">{report.dropouts}</div>
                  <div className="text-sm text-red-700">Desistências</div>
                  <div className="text-xs text-red-600 mt-1">Este período</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}
