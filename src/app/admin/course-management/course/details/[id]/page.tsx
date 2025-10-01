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
  ArrowLeft,
  Edit,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Settings,
  User,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useCourse } from '@/hooks';
import { Course } from '@/types';

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const { getCourseById } = useCourse();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const courseId = parseInt(params.id as string);
      const foundCourse = await getCourseById(courseId);
      setCourse(foundCourse);
      setLoading(false);
    };

    loadCourse();
  }, [params.id, getCourseById]);

  const handleEdit = () => {
    router.push(`/admin/course-management/course/edit/${params.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados do curso...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Curso não encontrado</p>
          </div>
        </div>
      </Container>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: GraduationCap },
    { id: 'disciplines', label: 'Disciplinas', icon: BookOpen },
    { id: 'students', label: 'Estudantes', icon: Users },
    { id: 'statistics', label: 'Estatísticas', icon: TrendingUp },
  ];

  return (
    <Container>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#182F59] to-[#1a3260] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-3xl font-bold">{course.designacao}</h1>
              <p className="text-blue-100 mt-1">{course.nivel} • {course.modalidade}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleEdit}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Curso
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Disciplinas</p>
                <p className="text-2xl font-bold">{course.tb_disciplinas?.length || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Duração</p>
                <p className="text-2xl font-bold">{course.duracao}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Estudantes</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Status</p>
                <Badge className={course.codigo_Status === 1 ? "bg-green-500" : "bg-red-500"}>
                  {course.codigo_Status === 1 ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#F9CD1D] text-[#F9CD1D]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Informações Gerais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome do Curso</label>
                  <p className="text-foreground font-medium">{course.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nível de Ensino</label>
                  <p className="text-foreground font-medium">{course.nivel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modalidade</label>
                  <p className="text-foreground font-medium">{course.modalidade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duração</label>
                  <p className="text-foreground font-medium">{course.duracao}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={course.codigo_Status === 1 ? "default" : "secondary"}>
                      {course.codigo_Status === 1 ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Código</label>
                  <p className="text-foreground font-medium">{course.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <p className="text-foreground">{course.observacoes || 'Nenhuma observação'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'disciplines' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Disciplinas do Curso</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.tb_disciplinas && course.tb_disciplinas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome da Disciplina</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.tb_disciplinas.map((disciplina) => (
                      <TableRow key={disciplina.codigo}>
                        <TableCell className="font-medium">{disciplina.codigo}</TableCell>
                        <TableCell>{disciplina.designacao}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Ativa
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma disciplina cadastrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Estudantes Matriculados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
                <p className="text-sm text-gray-400">Lista de estudantes será implementada em breve</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Estatísticas Acadêmicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taxa de Aprovação</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taxa de Frequência</span>
                  <span className="font-medium text-blue-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Média Geral</span>
                  <span className="font-medium text-yellow-600">14.2</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Estatísticas de Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de Estudantes</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Novas Matrículas (2024)</span>
                  <span className="font-medium text-green-600">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transferências</span>
                  <span className="font-medium text-orange-600">8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
}
