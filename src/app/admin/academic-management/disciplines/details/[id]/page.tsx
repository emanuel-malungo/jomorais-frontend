"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BookOpen,
  ArrowLeft,
  Edit,
  GraduationCap,
  AlertCircle,
  Loader2,
  Users,
  Calendar,
  Clock,
  BookOpenCheck,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Disciplina } from '@/types/academic-management.types';

// Dados mockados
const mockDisciplinas: Disciplina[] = [
  {
    codigo: 1,
    designacao: "Programação I",
    codigo_Curso: 1,
    tb_cursos: {
      codigo: 1,
      designacao: "Informática de Gestão",
      observacoes: "Curso técnico profissional"
    }
  },
  {
    codigo: 2,
    designacao: "Base de Dados",
    codigo_Curso: 1,
    tb_cursos: {
      codigo: 1,
      designacao: "Informática de Gestão",
      observacoes: "Curso técnico profissional"
    }
  },
  {
    codigo: 3,
    designacao: "Contabilidade Geral",
    codigo_Curso: 2,
    tb_cursos: {
      codigo: 2,
      designacao: "Contabilidade",
      observacoes: "Curso comercial"
    }
  },
];

// Mock data para turmas relacionadas
const mockTurmasRelacionadas = [
  {
    codigo: 1,
    designacao: "10IG-A",
    classe: "10ª Classe",
    periodo: "Manhã",
    sala: "Lab 1",
    totalAlunos: 25,
    anoLectivo: "2024/2025"
  },
  {
    codigo: 2,
    designacao: "10IG-B",
    classe: "10ª Classe",
    periodo: "Tarde",
    sala: "Lab 2",
    totalAlunos: 23,
    anoLectivo: "2024/2025"
  },
  {
    codigo: 3,
    designacao: "11IG-A",
    classe: "11ª Classe",
    periodo: "Manhã",
    sala: "Lab 1",
    totalAlunos: 20,
    anoLectivo: "2024/2025"
  },
];

// Mock data para professores
const mockProfessores = [
  {
    codigo: 1,
    nome: "Prof. João Silva",
    especialidade: "Programação",
    email: "joao.silva@escola.ao",
    telefone: "912345678"
  },
  {
    codigo: 2,
    nome: "Prof.ª Maria Santos",
    especialidade: "Base de Dados",
    email: "maria.santos@escola.ao",
    telefone: "923456789"
  },
];

export default function DisciplineDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = parseInt(params.id as string);
  
  const [isLoading, setIsLoading] = useState(true);
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [error, setError] = useState<string>("");

  // Carregar dados da disciplina
  useEffect(() => {
    const loadDisciplina = async () => {
      setIsLoading(true);
      try {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundDisciplina = mockDisciplinas.find(d => d.codigo === disciplinaId);
        if (foundDisciplina) {
          setDisciplina(foundDisciplina);
        } else {
          setError("Disciplina não encontrada");
        }
      } catch (error) {
        console.error("Erro ao carregar disciplina:", error);
        setError("Erro ao carregar dados da disciplina");
      } finally {
        setIsLoading(false);
      }
    };

    if (disciplinaId) {
      loadDisciplina();
    }
  }, [disciplinaId]);

  // Filtrar turmas relacionadas (simulação)
  const turmasRelacionadas = disciplinaId === 1 ? mockTurmasRelacionadas : 
                            disciplinaId === 2 ? mockTurmasRelacionadas.slice(0, 2) :
                            mockTurmasRelacionadas.slice(0, 1);

  const professoresRelacionados = disciplinaId === 1 ? mockProfessores : 
                                 disciplinaId === 2 ? mockProfessores.slice(1) :
                                 mockProfessores.slice(0, 1);

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#F9CD1D]" />
            <p className="text-gray-600">Carregando detalhes da disciplina...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao Carregar</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!disciplina) {
    return null;
  }

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
                    {disciplina.designacao}
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">
                    {disciplina.tb_cursos?.designacao} - ID: {disciplina.codigo}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Visualize todas as informações detalhadas da disciplina, incluindo turmas associadas,
                professores e estatísticas de desempenho.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>

              <Button
                onClick={() => router.push(`/admin/academic-management/disciplines/edit/${disciplina.codigo}`)}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total de Turmas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-xs text-emerald-600">Ativo</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Turmas Ativas</p>
            <p className="text-3xl font-bold text-gray-900">{turmasRelacionadas.length}</p>
          </div>
          
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Total de Alunos */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Matriculados</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Total de Alunos</p>
            <p className="text-3xl font-bold text-gray-900">
              {turmasRelacionadas.reduce((total, turma) => total + turma.totalAlunos, 0)}
            </p>
          </div>
          
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Professores */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <BookOpenCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="font-bold text-xs text-green-600">Ativos</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Professores</p>
            <p className="text-3xl font-bold text-gray-900">{professoresRelacionados.length}</p>
          </div>
          
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Ano Letivo */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Atual</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Ano Letivo</p>
            <p className="text-2xl font-bold text-gray-900">2024/2025</p>
          </div>
          
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Informações da Disciplina</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Código</p>
                  <Badge variant="outline" className="bg-gray-50">
                    {disciplina.codigo}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</p>
                  <p className="text-gray-900 font-medium">{disciplina.designacao}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Curso</p>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{disciplina.tb_cursos?.designacao}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Código do Curso</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {disciplina.codigo_Curso}
                  </Badge>
                </div>
              </div>

              {disciplina.tb_cursos?.observacoes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Observações do Curso</p>
                  <p className="text-gray-600">{disciplina.tb_cursos.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Turmas Relacionadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Turmas que Cursam esta Disciplina</span>
                </div>
                <Badge variant="outline" className="text-sm">
                  {turmasRelacionadas.length} turmas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turma</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Alunos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {turmasRelacionadas.map((turma) => (
                      <TableRow key={turma.codigo}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                              <Users className="h-4 w-4 text-[#F9CD1D]" />
                            </div>
                            <span className="font-medium">{turma.designacao}</span>
                          </div>
                        </TableCell>
                        <TableCell>{turma.classe}</TableCell>
                        <TableCell>{turma.periodo}</TableCell>
                        <TableCell>{turma.sala}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {turma.totalAlunos}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Professores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpenCheck className="h-5 w-5" />
                <span>Professores</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {professoresRelacionados.map((professor) => (
                <div key={professor.codigo} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                      <BookOpenCheck className="h-5 w-5 text-[#F9CD1D]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{professor.nome}</p>
                      <p className="text-sm text-gray-600">{professor.especialidade}</p>
                      <p className="text-sm text-gray-500">{professor.email}</p>
                      <p className="text-sm text-gray-500">{professor.telefone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status e Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Status e Ações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Status da Disciplina</p>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Ativa
                </Badge>
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button
                  onClick={() => router.push(`/admin/academic-management/disciplines/edit/${disciplina.codigo}`)}
                  className="w-full bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Disciplina
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <span>Informações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Esta disciplina está sendo cursada por {turmasRelacionadas.reduce((total, turma) => total + turma.totalAlunos, 0)} alunos</p>
                <p>• Ministrada por {professoresRelacionados.length} professor(es)</p>
                <p>• Pertence ao curso de {disciplina.tb_cursos?.designacao}</p>
                <p>• Código de identificação: {disciplina.codigo}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
