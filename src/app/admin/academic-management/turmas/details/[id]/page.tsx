"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  School,
  ArrowLeft,
  Edit,
  Users,
  MapPin,
  Clock,
  GraduationCap,
  User,
  BookOpen,
  Calendar,
  TrendingUp,
  Download,
  Printer,
  Award,
} from 'lucide-react';

// Dados mockados da turma
const mockTurmaDetails = {
  id: 1,
  designacao: "IG-10A-2024",
  classe: "10ª Classe",
  curso: "Informática de Gestão",
  sala: {
    nome: "Sala A1",
    capacidade: 30,
    localizacao: "Bloco A",
    recursos: ["Projetor", "Computadores", "Quadro Interativo"]
  },
  periodo: "Manhã",
  horario: "07:30 - 12:00",
  anoLetivo: "2024/2025",
  capacidade: 30,
  matriculados: 28,
  diretor: {
    nome: "Prof. João Silva Santos",
    email: "joao.silva@jomorais.ao",
    telefone: "+244 923 456 789",
    especialidade: "Informática"
  },
  status: "Ativo",
  dataCriacao: "2024-01-15",
  observacoes: "Turma com foco em tecnologias de informação e gestão empresarial. Metodologia prática com projetos reais.",
  // Estatísticas
  taxaOcupacao: 93.3,
  mediaIdadeAlunos: 16.2,
  taxaAprovacao: 89.3,
  mediaGeral: 15.1
};

// Dados mockados de alunos da turma
const mockAlunos = [
  {
    id: 1,
    nome: "Ana Silva Santos",
    numeroEstudante: "2024001",
    idade: 16,
    telefone: "+244 923 111 111",
    responsavel: "Maria Silva",
    media: 16.5,
    faltas: 2
  },
  {
    id: 2,
    nome: "Carlos Manuel Costa",
    numeroEstudante: "2024002",
    idade: 17,
    telefone: "+244 923 222 222",
    responsavel: "João Costa",
    media: 15.8,
    faltas: 1
  },
  {
    id: 3,
    nome: "Maria João Francisco",
    numeroEstudante: "2024003",
    idade: 16,
    telefone: "+244 923 333 333",
    responsavel: "Ana Francisco",
    media: 17.2,
    faltas: 0
  },
  {
    id: 4,
    nome: "Pedro Alberto Neto",
    numeroEstudante: "2024004",
    idade: 16,
    telefone: "+244 923 444 444",
    responsavel: "Carlos Neto",
    media: 14.9,
    faltas: 3
  }
];

// Dados mockados de disciplinas da turma
const mockDisciplinas = [
  {
    id: 1,
    nome: "Matemática",
    codigo: "MAT",
    cargaHoraria: 5,
    professor: "Prof. Ana Costa",
    mediaNotas: 15.2,
    totalAulas: 40,
    aulasMinistradas: 35
  },
  {
    id: 2,
    nome: "Informática",
    codigo: "INF",
    cargaHoraria: 6,
    professor: "Prof. João Silva",
    mediaNotas: 16.8,
    totalAulas: 48,
    aulasMinistradas: 42
  },
  {
    id: 3,
    nome: "Gestão",
    codigo: "GES",
    cargaHoraria: 4,
    professor: "Prof. Maria Santos",
    mediaNotas: 15.5,
    totalAulas: 32,
    aulasMinistradas: 28
  },
  {
    id: 4,
    nome: "Língua Portuguesa",
    codigo: "LP",
    cargaHoraria: 4,
    professor: "Prof. Carlos Lima",
    mediaNotas: 14.8,
    totalAulas: 32,
    aulasMinistradas: 30
  }
];

export default function TurmaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const turmaId = params.id;
  const turmaData = mockTurmaDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
      case 'Planejado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Container>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-card border p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-border bg-background text-foreground hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <School className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {turmaData.designacao}
                  </h1>
                  <Badge className={getStatusColor(turmaData.status)}>
                    {turmaData.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {turmaData.classe} • {turmaData.curso}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {turmaData.sala.nome} • {turmaData.periodo} • {turmaData.matriculados}/{turmaData.capacidade} alunos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button
                onClick={() => router.push(`/admin/academic-management/turmas/edit/${turmaId}`)}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Alunos Matriculados</p>
                <p className="text-2xl font-bold text-foreground">{turmaData.matriculados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                <p className="text-2xl font-bold text-foreground">{turmaData.taxaOcupacao}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-foreground">{turmaData.taxaAprovacao}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                <p className="text-2xl font-bold text-foreground">{turmaData.mediaGeral}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="diretor">Diretor</TabsTrigger>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  Informações da Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Designação</p>
                    <p className="text-foreground">{turmaData.designacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classe</p>
                    <p className="text-foreground">{turmaData.classe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Curso</p>
                    <p className="text-foreground">{turmaData.curso}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ano Letivo</p>
                    <p className="text-foreground">{turmaData.anoLetivo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Período</p>
                    <p className="text-foreground">{turmaData.periodo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Horário</p>
                    <p className="text-foreground">{turmaData.horario}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Informações da Sala
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sala</p>
                    <p className="text-foreground">{turmaData.sala.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Localização</p>
                    <p className="text-foreground">{turmaData.sala.localizacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacidade</p>
                    <p className="text-foreground">{turmaData.sala.capacidade} alunos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(turmaData.status)}>
                      {turmaData.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Recursos Disponíveis</p>
                  <div className="flex flex-wrap gap-2">
                    {turmaData.sala.recursos.map((recurso, index) => (
                      <Badge key={index} variant="outline">
                        {recurso}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {turmaData.observacoes}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diretor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Diretor de Turma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-[#3B6C4D] rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {turmaData.diretor.nome}
                  </h3>
                  <p className="text-muted-foreground">
                    Especialidade: {turmaData.diretor.especialidade}
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-foreground">{turmaData.diretor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{turmaData.diretor.telefone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alunos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Lista de Alunos ({mockAlunos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlunos.map((aluno) => (
                  <div key={aluno.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{aluno.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          Nº {aluno.numeroEstudante} • {aluno.idade} anos
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Responsável: {aluno.responsavel} • Tel: {aluno.telefone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Média</p>
                        <p className="text-lg font-semibold text-foreground">{aluno.media}</p>
                        <p className="text-xs text-muted-foreground">{aluno.faltas} faltas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplinas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Disciplinas da Turma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDisciplinas.map((disciplina) => (
                  <div key={disciplina.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{disciplina.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          Código: {disciplina.codigo} • {disciplina.cargaHoraria}h/semana
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Professor: {disciplina.professor}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Progresso: {disciplina.aulasMinistradas}/{disciplina.totalAulas} aulas
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Média</p>
                        <p className="text-lg font-semibold text-foreground">{disciplina.mediaNotas}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
