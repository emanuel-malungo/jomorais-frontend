"use client";

import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  BookOpen,
  User,
  Clock,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
} from 'lucide-react';

interface DisciplineTeacher {
  id: number;
  professor: string;
  email: string;
  telefone: string;
  disciplina: string;
  codigo: string;
  turma: string;
  classe: string;
  curso: string;
  sala: string;
  periodo: string;
  cargaHoraria: number;
  diasSemana: string[];
  horarioInicio: string;
  horarioFim: string;
  anoLetivo: string;
  status: string;
  dataInicio: string;
  totalAlunos: number;
  mediaGeral: number;
  frequenciaMedia: number;
  formacao: string;
  especialidade: string;
}

interface Aluno {
  id: number;
  nome: string;
  numero: string;
  media: number;
  frequencia: number;
  situacao: string;
}

interface Aula {
  id: number;
  data: string;
  topico: string;
  presentes: number;
  ausentes: number;
  conteudo: string;
  observacoes: string;
}

export default function DisciplineTeacherDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [assignment, setAssignment] = useState<DisciplineTeacher | null>(null);

  // Dados mockados da atribuição
  const assignmentsData: DisciplineTeacher[] = [
    {
      id: 1,
      professor: "Prof. Maria Silva Santos",
      email: "maria.santos@jomorais.edu.ao",
      telefone: "+244 923 456 789",
      disciplina: "Matemática",
      codigo: "MAT",
      turma: "IG-10A-2024",
      classe: "10ª Classe",
      curso: "Informática de Gestão",
      sala: "A1",
      periodo: "Manhã",
      cargaHoraria: 6,
      diasSemana: ["segunda", "terca", "quinta"],
      horarioInicio: "07:30",
      horarioFim: "09:00",
      anoLetivo: "2024/2025",
      status: "Ativo",
      dataInicio: "2024-02-15",
      totalAlunos: 35,
      mediaGeral: 14.2,
      frequenciaMedia: 92,
      formacao: "Licenciatura em Matemática",
      especialidade: "Análise Matemática"
    },
    {
      id: 2,
      professor: "Prof. João Manuel Costa",
      email: "joao.costa@jomorais.edu.ao",
      telefone: "+244 924 567 890",
      disciplina: "Português",
      codigo: "PORT",
      turma: "CG-11B-2024",
      classe: "11ª Classe",
      curso: "Contabilidade e Gestão",
      sala: "B2",
      periodo: "Tarde",
      cargaHoraria: 5,
      diasSemana: ["segunda", "quarta", "sexta"],
      horarioInicio: "13:30",
      horarioFim: "15:00",
      anoLetivo: "2024/2025",
      status: "Ativo",
      dataInicio: "2024-01-20",
      totalAlunos: 32,
      mediaGeral: 15.1,
      frequenciaMedia: 88,
      formacao: "Licenciatura em Língua Portuguesa",
      especialidade: "Literatura Angolana"
    }
  ];

  // Dados mockados dos alunos
  const alunosData: Aluno[] = [
    { id: 1, nome: "Ana Paula Francisco", numero: "2024001", media: 16.5, frequencia: 95, situacao: "Aprovado" },
    { id: 2, nome: "Carlos Alberto Neto", numero: "2024002", media: 15.8, frequencia: 92, situacao: "Aprovado" },
    { id: 3, nome: "Beatriz Santos Silva", numero: "2024003", media: 17.2, frequencia: 98, situacao: "Aprovado" },
    { id: 4, nome: "Daniel Costa Pereira", numero: "2024004", media: 12.5, frequencia: 85, situacao: "Recuperação" },
    { id: 5, nome: "Esperança Manuel", numero: "2024005", media: 14.8, frequencia: 90, situacao: "Aprovado" }
  ];

  // Dados mockados das aulas
  const aulasData: Aula[] = [
    { id: 1, data: "2024-09-30", topico: "Funções Quadráticas", presentes: 33, ausentes: 2, conteudo: "Introdução às funções quadráticas e suas propriedades", observacoes: "Boa participação da turma" },
    { id: 2, data: "2024-09-27", topico: "Equações do 2º Grau", presentes: 35, ausentes: 0, conteudo: "Resolução de equações do segundo grau", observacoes: "Todos os alunos presentes" },
    { id: 3, data: "2024-09-25", topico: "Sistemas de Equações", presentes: 32, ausentes: 3, conteudo: "Métodos de resolução de sistemas lineares", observacoes: "Alguns alunos com dificuldades" },
    { id: 4, data: "2024-09-23", topico: "Revisão Geral", presentes: 34, ausentes: 1, conteudo: "Revisão dos conteúdos do trimestre", observacoes: "Preparação para avaliação" }
  ];

  useEffect(() => {
    const loadAssignment = async () => {
      setLoading(true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assignmentId = parseInt(params.id as string);
      const foundAssignment = assignmentsData.find(a => a.id === assignmentId);
      
      if (foundAssignment) {
        setAssignment(foundAssignment);
      }
      
      setLoading(false);
    };

    loadAssignment();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin/teacher-management/discpline-teacher/edit/${params.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const getDiaSemanaNome = (dia: string) => {
    const dias = {
      'segunda': 'Segunda-feira',
      'terca': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira',
      'sabado': 'Sábado'
    };
    return dias[dia as keyof typeof dias] || dia;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes da atribuição...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!assignment) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Atribuição não encontrada</h2>
          <p className="text-gray-600 mb-6">A atribuição de disciplina solicitada não foi encontrada.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </Container>
    );
  }

  const aprovados = alunosData.filter(aluno => aluno.situacao === "Aprovado").length;
  const taxaAprovacao = Math.round((aprovados / alunosData.length) * 100);

  return (
    <Container>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Detalhes da Atribuição
              </h1>
              <p className="text-sm text-gray-600">
                {assignment.disciplina} - {assignment.turma}
              </p>
            </div>
          </div>
          <Button onClick={handleEdit} className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900">{assignment.totalAlunos}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-gray-900">{assignment.mediaGeral.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Frequência Média</p>
                <p className="text-2xl font-bold text-gray-900">{assignment.frequenciaMedia}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">{taxaAprovacao}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="professor">Professor</TabsTrigger>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="aulas">Aulas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Disciplina */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#F9CD1D]" />
                  <span>Informações da Disciplina</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disciplina</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.disciplina}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Código</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Turma</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.turma}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classe</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.classe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Curso</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.curso}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Carga Horária</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.cargaHoraria}h/semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Horário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#F9CD1D]" />
                  <span>Horário e Local</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sala</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.sala}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Período</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {assignment.periodo}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Horário</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {assignment.horarioInicio} - {assignment.horarioFim}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge 
                      variant={assignment.status === "Ativo" ? "default" : "secondary"}
                      className={assignment.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Dias da Semana</p>
                  <div className="flex flex-wrap gap-2">
                    {assignment.diasSemana.map((dia) => (
                      <Badge key={dia} variant="outline" className="bg-gray-50">
                        {getDiaSemanaNome(dia)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#F9CD1D]" />
                <span>Informações do Professor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.professor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Formação</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.formacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Especialidade</p>
                    <p className="text-lg font-semibold text-gray-900">{assignment.especialidade}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data de Início</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(assignment.dataInicio).toLocaleDateString('pt-AO')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{assignment.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Telefone</p>
                      <p className="text-lg font-semibold text-gray-900">{assignment.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ano Letivo</p>
                      <p className="text-lg font-semibold text-gray-900">{assignment.anoLetivo}</p>
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
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-[#F9CD1D]" />
                <span>Lista de Alunos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Média</TableHead>
                      <TableHead>Frequência</TableHead>
                      <TableHead>Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosData.map((aluno) => (
                      <TableRow key={aluno.id}>
                        <TableCell>
                          <p className="font-medium text-gray-900">{aluno.nome}</p>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{aluno.numero}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${
                            aluno.media >= 16 ? 'text-green-600' :
                            aluno.media >= 14 ? 'text-blue-600' :
                            aluno.media >= 10 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {aluno.media.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            aluno.frequencia >= 90 ? 'text-green-600' :
                            aluno.frequencia >= 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {aluno.frequencia}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={aluno.situacao === "Aprovado" ? "default" : "secondary"}
                            className={
                              aluno.situacao === "Aprovado" ? "bg-emerald-100 text-emerald-800" :
                              aluno.situacao === "Recuperação" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {aluno.situacao}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aulas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#F9CD1D]" />
                <span>Histórico de Aulas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tópico</TableHead>
                      <TableHead>Presentes</TableHead>
                      <TableHead>Ausentes</TableHead>
                      <TableHead>Conteúdo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aulasData.map((aula) => (
                      <TableRow key={aula.id}>
                        <TableCell>
                          <p className="font-medium text-gray-900">
                            {new Date(aula.data).toLocaleDateString('pt-AO')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{aula.topico}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">{aula.presentes}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            aula.ausentes === 0 ? 'text-green-600' :
                            aula.ausentes <= 2 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {aula.ausentes}
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {aula.conteudo}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
