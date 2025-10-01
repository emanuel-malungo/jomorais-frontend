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
  GraduationCap,
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  School,
  BookOpen,
  User,
  Award,
  TrendingUp,
  Download,
  Printer,
  Clock,
} from 'lucide-react';

// Dados mockados da classe
const mockClassDetails = {
  id: 1,
  nome: "10ª Classe",
  nivel: "2º Ciclo Secundário",
  coordenador: {
    nome: "Prof. Maria Silva Santos",
    email: "maria.santos@jomorais.ao",
    telefone: "+244 923 456 789",
    especialidade: "Pedagogia"
  },
  anoLetivo: "2024/2025",
  capacidadeMaxima: 120,
  totalAlunos: 95,
  totalTurmas: 4,
  status: "Ativo",
  dataCriacao: "2024-01-15",
  descricao: "Classe do 2º Ciclo do Ensino Secundário focada na preparação dos alunos para o ensino superior, com ênfase em disciplinas científicas e humanísticas.",
  // Estatísticas
  taxaOcupacao: 79.2,
  mediaIdadeAlunos: 16.5,
  taxaAprovacao: 88.5,
  mediaGeral: 14.8
};

// Dados mockados de turmas da classe
const mockTurmas = [
  {
    id: 1,
    designacao: "10A-2024",
    sala: "Sala 201",
    periodo: "Manhã",
    totalAlunos: 25,
    diretorTurma: "Prof. João Costa",
    horario: "07:30 - 12:00"
  },
  {
    id: 2,
    designacao: "10B-2024",
    sala: "Sala 202",
    periodo: "Manhã",
    totalAlunos: 24,
    diretorTurma: "Prof. Ana Francisco",
    horario: "07:30 - 12:00"
  },
  {
    id: 3,
    designacao: "10C-2024",
    sala: "Sala 203",
    periodo: "Tarde",
    totalAlunos: 23,
    diretorTurma: "Prof. Carlos Neto",
    horario: "13:30 - 18:00"
  },
  {
    id: 4,
    designacao: "10D-2024",
    sala: "Sala 204",
    periodo: "Tarde",
    totalAlunos: 23,
    diretorTurma: "Prof. Paula Lima",
    horario: "13:30 - 18:00"
  }
];

// Dados mockados de disciplinas da classe
const mockDisciplinas = [
  {
    id: 1,
    nome: "Matemática",
    codigo: "MAT",
    cargaHoraria: 5,
    professor: "Prof. João Costa",
    mediaNotas: 15.2
  },
  {
    id: 2,
    nome: "Física",
    codigo: "FIS",
    cargaHoraria: 4,
    professor: "Prof. Ana Francisco",
    mediaNotas: 14.8
  },
  {
    id: 3,
    nome: "Química",
    codigo: "QUI",
    cargaHoraria: 4,
    professor: "Prof. Carlos Neto",
    mediaNotas: 14.5
  },
  {
    id: 4,
    nome: "Biologia",
    codigo: "BIO",
    cargaHoraria: 3,
    professor: "Prof. Paula Lima",
    mediaNotas: 15.8
  },
  {
    id: 5,
    nome: "Língua Portuguesa",
    codigo: "LP",
    cargaHoraria: 5,
    professor: "Prof. Maria Santos",
    mediaNotas: 14.2
  },
  {
    id: 6,
    nome: "História",
    codigo: "HIS",
    cargaHoraria: 3,
    professor: "Prof. Pedro Silva",
    mediaNotas: 15.1
  }
];

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const classId = params.id;
  const classData = mockClassDetails;

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
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {classData.nome}
                  </h1>
                  <Badge className={getStatusColor(classData.status)}>
                    {classData.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {classData.nivel} • {classData.anoLetivo}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {classData.totalAlunos} alunos • {classData.totalTurmas} turmas • Coordenador: {classData.coordenador.nome}
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
                onClick={() => router.push(`/admin/academic-management/classes/edit/${classId}`)}
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
                <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold text-foreground">{classData.totalAlunos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <School className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total de Turmas</p>
                <p className="text-2xl font-bold text-foreground">{classData.totalTurmas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                <p className="text-2xl font-bold text-foreground">{classData.taxaOcupacao}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-foreground">{classData.taxaAprovacao}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="coordenador">Coordenador</TabsTrigger>
          <TabsTrigger value="turmas">Turmas</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Informações da Classe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-foreground">{classData.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nível</p>
                    <p className="text-foreground">{classData.nivel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ano Letivo</p>
                    <p className="text-foreground">{classData.anoLetivo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(classData.status)}>
                      {classData.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacidade Máxima</p>
                    <p className="text-foreground">{classData.capacidadeMaxima} alunos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                    <p className="text-foreground">{formatDate(classData.dataCriacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Estatísticas Acadêmicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média de Idade</p>
                    <p className="text-foreground">{classData.mediaIdadeAlunos} anos</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                    <p className="text-foreground">{classData.mediaGeral}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</p>
                    <p className="text-foreground">{classData.taxaAprovacao}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                    <p className="text-foreground">{classData.taxaOcupacao}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {classData.descricao}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coordenador" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Coordenador da Classe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-[#3B6C4D] rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {classData.coordenador.nome}
                  </h3>
                  <p className="text-muted-foreground">
                    Especialidade: {classData.coordenador.especialidade}
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-foreground">{classData.coordenador.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{classData.coordenador.telefone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turmas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <School className="h-5 w-5 mr-2" />
                Turmas da Classe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTurmas.map((turma) => (
                  <div key={turma.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{turma.designacao}</h4>
                        <p className="text-sm text-muted-foreground">
                          {turma.sala} • {turma.periodo} • {turma.horario}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Diretor: {turma.diretorTurma}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Alunos</p>
                        <p className="text-lg font-semibold text-foreground">{turma.totalAlunos}</p>
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
                Disciplinas da Classe
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
