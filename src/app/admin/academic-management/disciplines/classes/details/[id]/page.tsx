"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
  Users,
  GraduationCap,
  Building,
  Clock,
  Calendar,
  Edit,
  MapPin,
  UserCheck,
  BookOpen,
  Activity,
} from 'lucide-react';
import { Turma } from '@/types/academic-management.types';

// Dados mockados - normalmente viria da API baseado no ID
const mockTurma: Turma = {
  codigo: 1,
  designacao: "10ª A - Informática Manhã",
  codigo_Classe: 10,
  codigo_Curso: 1,
  codigo_Sala: 4,
  codigo_Periodo: 1,
  codigo_AnoLectivo: 1,
  status: "Activo",
  max_Alunos: 20,
  tb_classes: { codigo: 10, designacao: "10ª Classe" },
  tb_cursos: { codigo: 1, designacao: "Informática de Gestão", observacoes: "Curso técnico profissional" },
  tb_salas: { codigo: 4, designacao: "Laboratório Info", capacidade: 20 },
  tb_periodos: { codigo: 1, designacao: "Manhã" },
  tb_anos_lectivos: { codigo: 1, designacao: "2024/2025", mesInicial: 2, mesFinal: 11, anoInicial: 2024, anoFinal: 2025 }
};

// Dados mockados de estudantes matriculados
const mockEstudantes = [
  { id: 1, nome: "João Silva", numero: "2024001", status: "Activo" },
  { id: 2, nome: "Maria Santos", numero: "2024002", status: "Activo" },
  { id: 3, nome: "Pedro Costa", numero: "2024003", status: "Activo" },
  { id: 4, nome: "Ana Ferreira", numero: "2024004", status: "Activo" },
  { id: 5, nome: "Carlos Mendes", numero: "2024005", status: "Activo" },
];

// Dados mockados de disciplinas
const mockDisciplinas = [
  { id: 1, nome: "Programação I", cargaHoraria: 4, professor: "Prof. António" },
  { id: 2, nome: "Base de Dados", cargaHoraria: 3, professor: "Prof. Maria" },
  { id: 3, nome: "Sistemas Operativos", cargaHoraria: 3, professor: "Prof. João" },
  { id: 4, nome: "Redes de Computadores", cargaHoraria: 2, professor: "Prof. Pedro" },
];

interface ClassDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ClassDetailsPage({ params }: ClassDetailsPageProps) {
  const router = useRouter();
  const turma = mockTurma; // Em produção, buscar pela API usando params.id

  const handleEdit = () => {
    router.push(`/admin/academic-management/turmas/edit/${params.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{turma.designacao}</h1>
                <p className="text-sm text-gray-500">Detalhes da turma</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleEdit}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Turma
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudantes Matriculados</p>
                  <p className="text-3xl font-bold text-gray-900">{mockEstudantes.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Capacidade Máxima</p>
                  <p className="text-3xl font-bold text-gray-900">{turma.max_Alunos}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                  <p className="text-3xl font-bold text-gray-900">{mockDisciplinas.length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Ocupação</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round((mockEstudantes.length / (turma.max_Alunos || 1)) * 100)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações da Turma */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID da Turma</p>
                  <p className="text-lg font-semibold text-gray-900">{turma.codigo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge 
                    variant={turma.status === "Activo" ? "default" : "secondary"}
                    className={turma.status === "Activo" ? "bg-green-100 text-green-800" : ""}
                  >
                    {turma.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Nome da Turma</p>
                <p className="text-lg font-semibold text-gray-900">{turma.designacao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Capacidade</p>
                  <p className="text-lg font-semibold text-gray-900">{turma.max_Alunos} alunos</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Matriculados</p>
                  <p className="text-lg font-semibold text-gray-900">{mockEstudantes.length} alunos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração Acadêmica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-purple-500" />
                <span>Configuração Acadêmica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Classe</p>
                <p className="text-lg font-semibold text-gray-900">{turma.tb_classes?.designacao}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Curso</p>
                <p className="text-lg font-semibold text-gray-900">{turma.tb_cursos?.designacao}</p>
                {turma.tb_cursos?.observacoes && (
                  <p className="text-sm text-gray-500">{turma.tb_cursos.observacoes}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Ano Letivo</p>
                <p className="text-lg font-semibold text-gray-900">{turma.tb_anos_lectivos?.designacao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Espaço e Horário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-green-500" />
                <span>Espaço e Horário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Sala</p>
                  <p className="text-lg font-semibold text-gray-900">{turma.tb_salas?.designacao}</p>
                  {turma.tb_salas?.capacidade && (
                    <p className="text-sm text-gray-500">Capacidade: {turma.tb_salas.capacidade} lugares</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Período</p>
                  <p className="text-lg font-semibold text-gray-900">{turma.tb_periodos?.designacao}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disciplinas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                <span>Disciplinas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDisciplinas.map((disciplina) => (
                  <div key={disciplina.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{disciplina.nome}</p>
                      <p className="text-sm text-gray-500">{disciplina.professor}</p>
                    </div>
                    <Badge variant="outline">
                      {disciplina.cargaHoraria}h/semana
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Estudantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Estudantes Matriculados</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {mockEstudantes.length} estudantes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEstudantes.map((estudante) => (
                <div key={estudante.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#F9CD1D]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{estudante.nome}</p>
                      <p className="text-sm text-gray-500">Nº {estudante.numero}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={estudante.status === "Activo" ? "default" : "secondary"}
                    className={estudante.status === "Activo" ? "bg-green-100 text-green-800" : ""}
                  >
                    {estudante.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </Container>
  );
}
