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
  BookOpen,
  ArrowLeft,
  Edit,
  User,
  Calendar,
  Clock,
  Users,
  GraduationCap,
  FileText,
  Award,
  School,
  Download,
  Printer,
} from 'lucide-react';

// Dados mockados da disciplina
const mockDisciplineDetails = {
  codigo: 1,
  designacao: "Matemática",
  codigo_disciplina: "MAT",
  carga_horaria: 4,
  creditos: 3,
  descricao: "Disciplina fundamental que aborda conceitos de álgebra, geometria, trigonometria e cálculo básico para o ensino secundário.",
  status: "Ativo",
  data_criacao: "2024-01-15",
  tb_cursos: {
    codigo: 1,
    designacao: "Informática de Gestão",
    duracao: "3 anos",
    descricao: "Curso técnico profissional de Informática de Gestão"
  },
  tb_classes: {
    codigo: 10,
    designacao: "10ª Classe"
  },
  tb_professores: {
    codigo: 1,
    nome: "Prof. João Manuel Silva",
    email: "joao.silva@jomorais.ao",
    telefone: "923456789",
    especialidade: "Matemática",
    grau_academico: "Licenciatura",
    experiencia_anos: 8
  },
  tb_utilizadores: {
    codigo: 1,
    nome: "Admin Sistema",
    user: "admin",
    email: "admin@jomorais.ao"
  },
  // Estatísticas
  total_turmas: 3,
  total_alunos: 85,
  media_notas: 14.2,
  taxa_aprovacao: 87.5
};

// Dados mockados de turmas que lecionam esta disciplina
const mockTurmas = [
  {
    codigo: 1,
    designacao: "IG-10A-2024",
    tb_classes: { designacao: "10ª Classe" },
    tb_salas: { designacao: "Sala 101" },
    tb_periodos: { designacao: "Manhã" },
    total_alunos: 28,
    horario: "Segunda, Quarta, Sexta - 07:30-09:00"
  },
  {
    codigo: 2,
    designacao: "IG-10B-2024",
    tb_classes: { designacao: "10ª Classe" },
    tb_salas: { designacao: "Sala 102" },
    tb_periodos: { designacao: "Tarde" },
    total_alunos: 30,
    horario: "Terça, Quinta - 13:30-15:00"
  },
  {
    codigo: 3,
    designacao: "CONT-10A-2024",
    tb_classes: { designacao: "10ª Classe" },
    tb_salas: { designacao: "Sala 201" },
    tb_periodos: { designacao: "Manhã" },
    total_alunos: 27,
    horario: "Segunda, Quarta - 09:15-10:45"
  }
];

// Dados mockados de conteúdo programático
const mockConteudoProgramatico = [
  {
    unidade: 1,
    titulo: "Números Reais e Operações",
    topicos: ["Conjuntos numéricos", "Operações fundamentais", "Propriedades dos números reais", "Potenciação e radiciação"],
    carga_horaria: 12
  },
  {
    unidade: 2,
    titulo: "Álgebra Básica",
    topicos: ["Expressões algébricas", "Equações do 1º grau", "Sistemas de equações", "Inequações"],
    carga_horaria: 16
  },
  {
    unidade: 3,
    titulo: "Geometria Plana",
    topicos: ["Figuras geométricas", "Perímetros e áreas", "Teorema de Pitágoras", "Semelhança de triângulos"],
    carga_horaria: 14
  },
  {
    unidade: 4,
    titulo: "Funções",
    topicos: ["Conceito de função", "Função linear", "Função quadrática", "Gráficos de funções"],
    carga_horaria: 18
  }
];

export default function DisciplineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const disciplineId = params.id;
  const discipline = mockDisciplineDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
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
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {discipline.designacao}
                  </h1>
                  <Badge className={getStatusColor(discipline.status)}>
                    {discipline.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Código: {discipline.codigo_disciplina} • {discipline.carga_horaria}h/semana • {discipline.creditos} créditos
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Curso: {discipline.tb_cursos.designacao} • Classe: {discipline.tb_classes.designacao}
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
                onClick={() => router.push(`/admin/academic-management/discipline/edit/${disciplineId}`)}
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
                <p className="text-sm font-medium text-muted-foreground">Total de Turmas</p>
                <p className="text-2xl font-bold text-foreground">{discipline.total_turmas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold text-foreground">{discipline.total_alunos}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Média de Notas</p>
                <p className="text-2xl font-bold text-foreground">{discipline.media_notas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-foreground">{discipline.taxa_aprovacao}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="professor">Professor</TabsTrigger>
          <TabsTrigger value="turmas">Turmas</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Informações da Disciplina
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Código</p>
                    <p className="text-foreground">{discipline.codigo_disciplina}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(discipline.status)}>
                      {discipline.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Carga Horária</p>
                    <p className="text-foreground">{discipline.carga_horaria}h/semana</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Créditos</p>
                    <p className="text-foreground">{discipline.creditos}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                    <p className="text-foreground">{formatDate(discipline.data_criacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  Configuração Acadêmica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Curso</p>
                  <p className="text-foreground">{discipline.tb_cursos.designacao}</p>
                  <p className="text-sm text-muted-foreground">{discipline.tb_cursos.descricao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classe</p>
                  <p className="text-foreground">{discipline.tb_classes.designacao}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {discipline.descricao}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Professor Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-[#3B6C4D] rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {discipline.tb_professores.nome}
                  </h3>
                  <p className="text-muted-foreground">
                    {discipline.tb_professores.especialidade} • {discipline.tb_professores.grau_academico}
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-foreground">{discipline.tb_professores.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{discipline.tb_professores.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Experiência</p>
                      <p className="text-foreground">{discipline.tb_professores.experiencia_anos} anos</p>
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
                <Users className="h-5 w-5 mr-2" />
                Turmas que Lecionam esta Disciplina
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTurmas.map((turma) => (
                  <div key={turma.codigo} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{turma.designacao}</h4>
                        <p className="text-sm text-muted-foreground">
                          {turma.tb_classes.designacao} • {turma.tb_salas.designacao} • {turma.tb_periodos.designacao}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {turma.horario}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Alunos</p>
                        <p className="text-lg font-semibold text-foreground">{turma.total_alunos}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conteudo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Conteúdo Programático
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockConteudoProgramatico.map((unidade) => (
                  <div key={unidade.unidade} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">
                        Unidade {unidade.unidade}: {unidade.titulo}
                      </h4>
                      <Badge variant="outline">
                        {unidade.carga_horaria}h
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {unidade.topicos.map((topico, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-[#3B6C4D] rounded-full mr-2"></div>
                          <span className="text-sm text-foreground">{topico}</span>
                        </div>
                      ))}
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
