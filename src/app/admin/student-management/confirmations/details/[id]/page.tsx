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
  UserCheck,
  ArrowLeft,
  Edit,
  User,
  Calendar,
  BookOpen,
  Users,
  School,
  CheckCircle,
  Clock,
  Download,
  Printer,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useConfirmation } from '@/hooks/useConfirmation';

export default function ConfirmationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const confirmationId = parseInt(params.id as string);
  const { confirmation, loading, error } = useConfirmation(confirmationId);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#F9CD1D]" />
            <span className="text-gray-600">Carregando detalhes da confirmação...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !confirmation) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Erro ao carregar confirmação</h3>
              <p className="text-gray-600">{error || 'Confirmação não encontrada'}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Detalhes da Confirmação
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">{confirmation.tb_matriculas.tb_alunos.nome}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Visualize todas as informações detalhadas da confirmação de turma, incluindo dados do aluno,
                turma e classificação.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => router.push(`/admin/student-management/confirmations/edit/${confirmationId}`)}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar Confirmação
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {formatDate(confirmation.data_Confirmacao)}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Data Confirmação</p>
            <p className="text-2xl font-bold text-gray-900">{formatDate(confirmation.data_Confirmacao)}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <Badge 
              variant={
                confirmation.classificacao === "Aprovado" ? "default" : 
                confirmation.classificacao === "Pendente" ? "secondary" : 
                "destructive"
              }
              className={
                confirmation.classificacao === "Aprovado" ? "text-xs bg-emerald-100 text-emerald-800" :
                confirmation.classificacao === "Pendente" ? "text-xs bg-yellow-100 text-yellow-800" :
                "text-xs bg-red-100 text-red-800"
              }
            >
              {confirmation.classificacao}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Classificação</p>
            <p className="text-2xl font-bold text-gray-900">{confirmation.classificacao}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <School className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {confirmation.tb_turmas.tb_classes.designacao}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Turma</p>
            <p className="text-lg font-bold text-gray-900">{confirmation.tb_turmas.designacao}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {confirmation.codigo_Ano_lectivo}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Ano Letivo</p>
            <p className="text-2xl font-bold text-gray-900">{confirmation.codigo_Ano_lectivo}</p>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="student">Dados do Aluno</TabsTrigger>
          <TabsTrigger value="class">Turma</TabsTrigger>
          <TabsTrigger value="enrollment">Matrícula</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Confirmação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Informações da Confirmação</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código da Confirmação</label>
                    <p className="text-sm font-semibold text-gray-900">#{confirmation.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Confirmação</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(confirmation.data_Confirmacao)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Classificação</label>
                    <Badge 
                      variant={
                        confirmation.classificacao === "Aprovado" ? "default" : 
                        confirmation.classificacao === "Pendente" ? "secondary" : 
                        "destructive"
                      }
                      className={
                        confirmation.classificacao === "Aprovado" ? "bg-emerald-100 text-emerald-800" :
                        confirmation.classificacao === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }
                    >
                      {confirmation.classificacao}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ano Letivo</label>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.codigo_Ano_lectivo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge 
                      variant={confirmation.codigo_Status === 1 ? "default" : "secondary"}
                      className={confirmation.codigo_Status === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                    >
                      {confirmation.codigo_Status === 1 ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsável pela Confirmação</label>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.tb_utilizadores.nome}</p>
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
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {calculateAge(confirmation.tb_matriculas.tb_alunos.dataNascimento)} anos • {confirmation.tb_matriculas.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {confirmation.tb_matriculas.tb_alunos.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{confirmation.tb_matriculas.tb_alunos.email}</span>
                    </div>
                  )}
                  {confirmation.tb_matriculas.tb_alunos.telefone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{confirmation.tb_matriculas.tb_alunos.telefone}</span>
                    </div>
                  )}
                  {confirmation.tb_matriculas.tb_alunos.morada && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{confirmation.tb_matriculas.tb_alunos.morada}</span>
                    </div>
                  )}
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
                    <p className="text-sm font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexo</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {confirmation.tb_matriculas.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(confirmation.tb_matriculas.tb_alunos.dataNascimento)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Idade</label>
                    <p className="text-sm font-semibold text-gray-900">{calculateAge(confirmation.tb_matriculas.tb_alunos.dataNascimento)} anos</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome do Pai</label>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.pai || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome da Mãe</label>
                    <p className="text-sm font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.mae || 'N/A'}</p>
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
              <CardContent className="space-y-4">
                {confirmation.tb_matriculas.tb_alunos.tb_encarregados ? (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nome</label>
                        <p className="text-sm font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.tb_encarregados.nome}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Profissão</label>
                        <p className="text-sm font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.tb_encarregados.tb_profissao.designacao}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Local de Trabalho</label>
                        <p className="text-sm font-semibold text-gray-900">{confirmation.tb_matriculas.tb_alunos.tb_encarregados.local_Trabalho}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="space-y-3">
                        {confirmation.tb_matriculas.tb_alunos.tb_encarregados.email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{confirmation.tb_matriculas.tb_alunos.tb_encarregados.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{confirmation.tb_matriculas.tb_alunos.tb_encarregados.telefone}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Dados do encarregado não disponíveis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="class" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="h-5 w-5" />
                <span>Informações da Turma</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Designação da Turma</label>
                  <p className="text-lg font-semibold text-gray-900">{confirmation.tb_turmas.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Classe</label>
                  <p className="text-sm font-semibold text-gray-900">{confirmation.tb_turmas.tb_classes.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sala</label>
                  <p className="text-sm font-semibold text-gray-900">{confirmation.tb_turmas.tb_salas.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Período</label>
                  <p className="text-sm font-semibold text-gray-900">{confirmation.tb_turmas.tb_periodos.designacao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Informações da Matrícula</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Código da Matrícula</label>
                  <p className="text-sm font-semibold text-gray-900">#{confirmation.tb_matriculas.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Matrícula</label>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(confirmation.tb_matriculas.data_Matricula)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Curso</label>
                  <p className="text-lg font-semibold text-gray-900">{confirmation.tb_matriculas.tb_cursos.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status do Curso</label>
                  <Badge 
                    variant={confirmation.tb_matriculas.tb_cursos.codigo_Status === 1 ? "default" : "secondary"}
                    className={confirmation.tb_matriculas.tb_cursos.codigo_Status === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {confirmation.tb_matriculas.tb_cursos.codigo_Status === 1 ? "Ativo" : "Inativo"}
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
