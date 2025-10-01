"use client";

import React from 'react';
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
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { useDocente } from '@/hooks/useTeacher';

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);
  
  const { docente: teacher, loading, error } = useDocente(teacherId);

  const handleEdit = () => {
    router.push(`/admin/teacher-management/teacher/edit/${teacherId}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#182F59]" />
          <span className="ml-2 text-gray-600">Carregando dados do docente...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <span className="text-red-700 font-medium">Erro ao carregar docente:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!teacher) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-500">Docente não encontrado</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{teacher.nome}</h1>
            <p className="text-gray-600">
              {teacher.tb_especialidade?.designacao || 'Especialidade não informada'}
            </p>
          </div>
        </div>
        <Button onClick={handleEdit} className="bg-[#3B6C4D] hover:bg-[#2d5016]">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-[#182F59]">
                  {teacher.status === 1 ? 'Ativo' : 'Inativo'}
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
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {teacher.tb_disciplinas_docente?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Turmas</p>
                <p className="text-2xl font-bold text-amber-600">
                  {teacher.tb_directores_turmas?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-white to-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Código</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teacher.codigo}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Nome Completo</p>
                <p className="font-medium">{teacher.nome}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{teacher.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Contacto</p>
                <p className="font-medium">{teacher.contacto || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">ID Utilizador</p>
                <p className="font-medium">{teacher.user_id || 'N/A'}</p>
              </div>
            </div>

            <div className="pt-4">
              <Badge 
                variant={teacher.status === 1 ? "default" : "secondary"}
                className={teacher.status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
              >
                {teacher.status === 1 ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informações Acadêmicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Acadêmicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Especialidade</p>
                <p className="font-medium">{teacher.tb_especialidade?.designacao || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Disciplinas Lecionadas</p>
                <p className="font-medium">{teacher.tb_disciplinas_docente?.length || 0} disciplina(s)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Turmas Dirigidas</p>
                <p className="font-medium">{teacher.tb_directores_turmas?.length || 0} turma(s)</p>
              </div>
            </div>

            {teacher.codigo_disciplina && (
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Disciplina Principal</p>
                  <p className="font-medium">Código: {teacher.codigo_disciplina}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Disciplinas */}
      {teacher.tb_disciplinas_docente && teacher.tb_disciplinas_docente.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Disciplinas Lecionadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacher.tb_disciplinas_docente.map((disciplina, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium">Código da Disciplina: {disciplina.codigoDisciplina}</p>
                  <p className="text-sm text-gray-600">Curso: {disciplina.codigoCurso}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
