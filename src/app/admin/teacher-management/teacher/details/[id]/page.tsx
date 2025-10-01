"use client";

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  DollarSign,
  FileText,
  Loader2,
} from 'lucide-react';

import useTeacher from '@/hooks/useTeacher';

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);
  
  const { teacher, loading, error, getTeacherById } = useTeacher();

  useEffect(() => {
    if (teacherId) {
      getTeacherById(teacherId);
    }
  }, [teacherId, getTeacherById]);

  const handleEdit = () => {
    router.push(`/admin/teacher-management/teacher/edit/${teacherId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string | undefined) => {
    if (!birthDate) return "N/A";
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) return "N/A";
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return `${age} anos`;
    } catch (error) {
      return "N/A";
    }
  };

  const formatSalary = (salary: number | undefined) => {
    if (!salary) return "N/A";
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-[#182F59]" />
            <span>Carregando dados do professor...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !teacher) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">Erro ao carregar professor</p>
            <p className="text-sm">{error || "Professor não encontrado"}</p>
          </div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="h-6 w-px bg-border"></div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Detalhes do Professor</h1>
            <p className="text-sm text-muted-foreground">
              Informações completas do professor
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="bg-[#3B6C4D] hover:bg-[#2d5016]">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-[#182F59]">
                  {teacher.codigo_Status === 1 ? "Ativo" : "Inativo"}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#182F59] to-[#1a3260] rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Experiência</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {teacher.experiencia_anos || 0} anos
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold text-[#FFD002]">
                  {teacher.tb_disciplinas_professores?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD002] to-[#FFC107] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-white to-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salário</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatSalary(teacher.salario)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                <p className="text-base font-semibold">{teacher.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sexo</p>
                <p className="text-base">{teacher.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Data de Nascimento</p>
                <p className="text-base">{formatDate(teacher.dataNascimento)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Idade</p>
                <p className="text-base">{calculateAge(teacher.dataNascimento)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Documento</p>
                <p className="text-base">{teacher.n_documento_identificacao || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Nacionalidade</p>
                <p className="text-base">{teacher.tb_nacionalidades?.designacao || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-500" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-base">{teacher.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Telefone</p>
                  <p className="text-base">{teacher.telefone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Morada</p>
                  <p className="text-base">{teacher.morada || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Acadêmicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-purple-500" />
              Informações Acadêmicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Especialidade</p>
                <p className="text-base font-semibold">{teacher.especialidade || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Grau Acadêmico</p>
                <p className="text-base">{teacher.grau_academico || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Experiência</p>
                <p className="text-base">{teacher.experiencia_anos ? `${teacher.experiencia_anos} anos` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Data de Contratação</p>
                <p className="text-base">{formatDate(teacher.data_contratacao)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disciplinas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
              Disciplinas Lecionadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teacher.tb_disciplinas_professores && teacher.tb_disciplinas_professores.length > 0 ? (
              <div className="space-y-3">
                {teacher.tb_disciplinas_professores.map((disciplinaProfessor) => (
                  <div key={disciplinaProfessor.codigo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{disciplinaProfessor.tb_disciplinas.designacao}</p>
                      <p className="text-sm text-gray-600">
                        Código: {disciplinaProfessor.tb_disciplinas.codigo_disciplina} | 
                        Carga Horária: {disciplinaProfessor.tb_disciplinas.carga_horaria}h
                      </p>
                    </div>
                    <Badge variant="outline">Ativa</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma disciplina atribuída</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {teacher.observacoes && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-500" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{teacher.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
