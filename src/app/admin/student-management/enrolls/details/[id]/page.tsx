"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  User,
  Calendar,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

import { useEnrollment } from '@/hooks';

// Tipo estendido para lidar com dados adicionais da API
interface ExtendedStudent {
  codigo: number;
  nome: string;
  dataNascimento: string | null;
  sexo: string;
  url_Foto?: string | null;
  email?: string;
  telefone?: string;
  morada?: string;
  pai?: string;
  mae?: string;
}

export default function EnrollmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const enrollmentId = parseInt(params.id as string);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Hook para buscar dados da matrícula
  const { enrollment, loading, error, refetch } = useEnrollment(enrollmentId);

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#F9CD1D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados da matrícula...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar matrícula</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => refetch()} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Mostrar mensagem se não encontrou a matrícula
  if (!enrollment) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Matrícula não encontrada</h3>
            <p className="text-gray-600 mb-4">A matrícula solicitada não foi encontrada.</p>
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Detalhes da Matrícula
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">{enrollment.tb_alunos?.nome || 'Nome não disponível'}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Visualize todas as informações detalhadas da matrícula, incluindo dados do aluno,
                curso e confirmações de turma.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => router.push(`/admin/student-management/enrolls/edit/${enrollmentId}`)}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar Matrícula
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {formatDate(enrollment.data_Matricula)}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Data Matrícula</p>
            <p className="text-2xl font-bold text-gray-900">{formatDate(enrollment.data_Matricula)}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <Badge 
              variant={enrollment.codigoStatus === 1 ? "default" : "secondary"}
              className={enrollment.codigoStatus === 1 ? "text-xs bg-emerald-100 text-emerald-800" : "text-xs bg-red-100 text-red-800"}
            >
              {enrollment.codigoStatus === 1 ? "Ativa" : "Inativa"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Status</p>
            <p className="text-2xl font-bold text-gray-900">
              {enrollment.codigoStatus === 1 ? "Ativa" : "Inativa"}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              Curso
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Curso</p>
            <p className="text-lg font-bold text-gray-900">{enrollment.tb_cursos?.designacao || 'Curso não informado'}</p>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="student">Dados do Aluno</TabsTrigger>
          <TabsTrigger value="course">Curso</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Matrícula */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Informações da Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Matrícula</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(enrollment.data_Matricula)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge 
                      variant={enrollment.codigoStatus === 1 ? "default" : "secondary"}
                      className={enrollment.codigoStatus === 1 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}
                    >
                      {enrollment.codigoStatus === 1 ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsável pela Matrícula</label>
                    <p className="text-sm font-semibold text-gray-900">{enrollment.tb_utilizadores.nome}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo do Aluno */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Resumo do Aluno</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {enrollment.tb_alunos?.url_Foto && enrollment.tb_alunos.url_Foto !== "null" ? (
                      <Image 
                        src={enrollment.tb_alunos.url_Foto} 
                        alt="Foto do aluno"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{enrollment.tb_alunos?.nome || 'Nome não disponível'}</h3>
                    <p className="text-sm text-gray-500">
                      {enrollment.tb_alunos?.dataNascimento ? (
                        <>
                          {calculateAge(enrollment.tb_alunos.dataNascimento.toString())} anos • {enrollment.tb_alunos?.sexo || 'Sexo não informado'}
                        </>
                      ) : (
                        'Dados não disponíveis'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{(enrollment.tb_alunos as ExtendedStudent)?.email || 'Email não informado'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{(enrollment.tb_alunos as ExtendedStudent)?.telefone || 'Telefone não informado'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{(enrollment.tb_alunos as ExtendedStudent)?.morada || 'Morada não informada'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Dados Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-sm font-semibold text-gray-900">{enrollment.tb_alunos?.nome || 'Nome não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexo</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {enrollment.tb_alunos?.sexo || 'Sexo não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {enrollment.tb_alunos?.dataNascimento ? formatDate(enrollment.tb_alunos.dataNascimento) : 'Data não informada'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Idade</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {enrollment.tb_alunos?.dataNascimento ? `${calculateAge(enrollment.tb_alunos.dataNascimento)} anos` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome do Pai</label>
                    <p className="text-sm font-semibold text-gray-900">{(enrollment.tb_alunos as ExtendedStudent)?.pai || 'Nome do pai não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome da Mãe</label>
                    <p className="text-sm font-semibold text-gray-900">{(enrollment.tb_alunos as ExtendedStudent)?.mae || 'Nome da mãe não informado'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{(enrollment.tb_alunos as ExtendedStudent)?.email || 'Email não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{(enrollment.tb_alunos as ExtendedStudent)?.telefone || 'Telefone não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{(enrollment.tb_alunos as ExtendedStudent)?.morada || 'Morada não informada'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encarregado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Encarregado de Educação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Dados em Desenvolvimento</h3>
                  <p className="text-gray-500">A funcionalidade de dados do encarregado será implementada em breve.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="course" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Informações do Curso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome do Curso</label>
                  <p className="text-lg font-semibold text-gray-900">{enrollment.tb_cursos?.designacao || 'Curso não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Código do Curso</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {enrollment.tb_cursos?.codigo || 'Código não informado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge 
                    variant={enrollment.tb_cursos?.codigo_Status === 1 ? "default" : "secondary"}
                    className={enrollment.tb_cursos?.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}
                  >
                    {enrollment.tb_cursos?.codigo_Status === 1 ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
