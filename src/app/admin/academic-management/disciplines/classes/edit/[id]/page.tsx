"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Users,
  GraduationCap,
  Building,
  Save,
  X,
} from 'lucide-react';
import { Classe, Curso, Sala, Periodo, AnoLectivo, Turma } from '@/types/academic-management.types';

// Dados mockados
const mockClasses: Classe[] = [
  { codigo: 1, designacao: "1ª Classe" },
  { codigo: 2, designacao: "2ª Classe" },
  { codigo: 3, designacao: "3ª Classe" },
  { codigo: 7, designacao: "7ª Classe" },
  { codigo: 8, designacao: "8ª Classe" },
  { codigo: 9, designacao: "9ª Classe" },
  { codigo: 10, designacao: "10ª Classe" },
  { codigo: 11, designacao: "11ª Classe" },
  { codigo: 12, designacao: "12ª Classe" },
];

const mockCursos: Curso[] = [
  { codigo: 1, designacao: "Informática de Gestão" },
  { codigo: 2, designacao: "Contabilidade" },
  { codigo: 3, designacao: "Administração" },
];

const mockSalas: Sala[] = [
  { codigo: 1, designacao: "Sala A1", capacidade: 30 },
  { codigo: 2, designacao: "Sala A2", capacidade: 25 },
  { codigo: 3, designacao: "Sala B1", capacidade: 35 },
  { codigo: 4, designacao: "Laboratório Info", capacidade: 20 },
];

const mockPeriodos: Periodo[] = [
  { codigo: 1, designacao: "Manhã" },
  { codigo: 2, designacao: "Tarde" },
  { codigo: 3, designacao: "Noite" },
];

const mockAnosLectivos: AnoLectivo[] = [
  { codigo: 1, designacao: "2024/2025", mesInicial: 2, mesFinal: 11, anoInicial: 2024, anoFinal: 2025 },
];

// Dados mockados da turma existente
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
};

interface EditClassPageProps {
  params: {
    id: string;
  };
}

export default function EditClassPage({ params }: EditClassPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    designacao: '',
    codigo_Classe: '',
    codigo_Curso: '',
    codigo_Sala: '',
    codigo_Periodo: '',
    codigo_AnoLectivo: '',
    status: 'Activo',
    max_Alunos: ''
  });

  // Carregar dados da turma existente
  useEffect(() => {
    // Em produção, buscar dados da API usando params.id
    const turma = mockTurma;
    setFormData({
      designacao: turma.designacao,
      codigo_Classe: turma.codigo_Classe.toString(),
      codigo_Curso: turma.codigo_Curso.toString(),
      codigo_Sala: turma.codigo_Sala.toString(),
      codigo_Periodo: turma.codigo_Periodo.toString(),
      codigo_AnoLectivo: turma.codigo_AnoLectivo.toString(),
      status: turma.status || 'Activo',
      max_Alunos: turma.max_Alunos?.toString() || ''
    });
  }, [params.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados atualizados da turma:', formData);
      
      // Redirecionar para lista de turmas
      router.push('/admin/academic-management/turmas');
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container>
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editar Turma</h1>
                <p className="text-sm text-gray-500">Atualizar informações da turma</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              <Button
                form="turma-form"
                type="submit"
                disabled={isLoading}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-6xl mx-auto space-y-8">
        <form id="turma-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Users className="h-6 w-6 text-blue-500" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="designacao" className="text-sm font-semibold">
                    Nome da Turma *
                  </Label>
                  <Input
                    id="designacao"
                    value={formData.designacao}
                    onChange={(e) => handleInputChange('designacao', e.target.value)}
                    placeholder="Ex: 10ª A - Informática Manhã"
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_Alunos" className="text-sm font-semibold">
                    Capacidade Máxima *
                  </Label>
                  <Input
                    id="max_Alunos"
                    type="number"
                    value={formData.max_Alunos}
                    onChange={(e) => handleInputChange('max_Alunos', e.target.value)}
                    placeholder="30"
                    className="h-12"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuração Acadêmica */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <GraduationCap className="h-6 w-6 text-purple-500" />
                <span>Configuração Acadêmica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo_Classe" className="text-sm font-semibold">
                    Classe *
                  </Label>
                  <Select value={formData.codigo_Classe} onValueChange={(value) => handleInputChange('codigo_Classe', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione a classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClasses.map((classe) => (
                        <SelectItem key={classe.codigo} value={classe.codigo.toString()}>
                          {classe.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_Curso" className="text-sm font-semibold">
                    Curso *
                  </Label>
                  <Select value={formData.codigo_Curso} onValueChange={(value) => handleInputChange('codigo_Curso', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCursos.map((curso) => (
                        <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                          {curso.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo_AnoLectivo" className="text-sm font-semibold">
                  Ano Letivo *
                </Label>
                <Select value={formData.codigo_AnoLectivo} onValueChange={(value) => handleInputChange('codigo_AnoLectivo', value)} required>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAnosLectivos.map((ano) => (
                      <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                        {ano.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Espaço e Horário */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Building className="h-6 w-6 text-green-500" />
                <span>Espaço e Horário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo_Sala" className="text-sm font-semibold">
                    Sala *
                  </Label>
                  <Select value={formData.codigo_Sala} onValueChange={(value) => handleInputChange('codigo_Sala', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione a sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSalas.map((sala) => (
                        <SelectItem key={sala.codigo} value={sala.codigo.toString()}>
                          {sala.designacao} {sala.capacidade && `(${sala.capacidade} lugares)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_Periodo" className="text-sm font-semibold">
                    Período *
                  </Label>
                  <Select value={formData.codigo_Periodo} onValueChange={(value) => handleInputChange('codigo_Periodo', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPeriodos.map((periodo) => (
                        <SelectItem key={periodo.codigo} value={periodo.codigo.toString()}>
                          {periodo.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

        </form>
      </div>
    </Container>
  );
}
