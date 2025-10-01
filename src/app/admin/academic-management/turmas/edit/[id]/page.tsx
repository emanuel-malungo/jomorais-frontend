"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  School,
  ArrowLeft,
  Save,
  X,
  Loader2,
  Users,
  MapPin,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { useTurma, useUpdateTurma } from '@/hooks/useTurma';
import { useClasses } from '@/hooks/useClass';
import { useCourses } from '@/hooks/useCourse';
import { useSalas } from '@/hooks/useSala';
import { usePeriodos } from '@/hooks/usePeriodo';
import { useAnosLectivos } from '@/hooks/useAnoLectivo';
import { useTeacher } from '@/hooks/useTeacher';

// Dados vêm da API real através dos hooks

export default function EditTurmaPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const turmaId = parseInt(params.id as string);

  // Hooks da API
  const { turma, isLoading: turmaLoading, error: turmaError } = useTurma(turmaId);
  const { updateTurma } = useUpdateTurma();
  const { classes, isLoading: classesLoading, fetchClasses } = useClasses();
  const { courses, loading: coursesLoading, refetch: fetchCourses } = useCourses();
  const { salas, isLoading: salasLoading, fetchSalas } = useSalas();
  const { periodos, isLoading: periodosLoading, fetchPeriodos } = usePeriodos();
  const { anosLectivos, isLoading: anosLoading, fetchAnosLectivos } = useAnosLectivos();
  const { teachers, loading: teachersLoading, getAllTeachers } = useTeacher();

  // Estados do formulário
  const [formData, setFormData] = useState({
    designacao: "",
    classe: "",
    curso: "",
    sala: "",
    periodo: "",
    anoLetivo: "",
    capacidade: "",
    diretor: "",
    status: "Ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar dados iniciais dos selects
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchClasses(),
          fetchCourses(),
          fetchSalas(),
          fetchPeriodos(),
          fetchAnosLectivos(),
          getAllTeachers()
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    };

    loadInitialData();
  }, []);

  // Carregar dados da turma quando disponível
  useEffect(() => {
    if (turma) {
      setFormData({
        designacao: turma.designacao || "",
        classe: turma.codigo_Classe?.toString() || "",
        curso: turma.codigo_Curso?.toString() || "",
        sala: turma.codigo_Sala?.toString() || "",
        periodo: turma.codigo_Periodo?.toString() || "",
        anoLetivo: turma.codigo_AnoLectivo?.toString() || "",
        capacidade: turma.max_Alunos?.toString() || "",
        diretor: "", // Diretor não está na tabela tb_turmas
        status: turma.status || "Ativo",
      });
    }
  }, [turma]);

  const handleCancel = () => {
    router.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.designacao.trim()) {
      newErrors.designacao = "Designação da turma é obrigatória";
    }

    if (!formData.classe) {
      newErrors.classe = "Classe é obrigatória";
    }

    if (!formData.curso) {
      newErrors.curso = "Curso é obrigatório";
    }

    if (!formData.sala) {
      newErrors.sala = "Sala é obrigatória";
    }

    if (!formData.periodo) {
      newErrors.periodo = "Período é obrigatório";
    }

    if (!formData.capacidade.trim()) {
      newErrors.capacidade = "Capacidade é obrigatória";
    } else if (parseInt(formData.capacidade) <= 0) {
      newErrors.capacidade = "Capacidade deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar dados para API
      const updateData = {
        designacao: formData.designacao,
        codigo_Classe: parseInt(formData.classe),
        codigo_Curso: parseInt(formData.curso),
        codigo_Sala: parseInt(formData.sala),
        codigo_Periodo: parseInt(formData.periodo),
        codigo_AnoLectivo: formData.anoLetivo ? parseInt(formData.anoLetivo) : undefined,
        max_Alunos: parseInt(formData.capacidade),
        status: formData.status,
      };
      
      await updateTurma(turmaId, updateData);
      
      // Redirecionar para lista de turmas
      router.push('/admin/academic-management/turmas');
      
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Estados de loading
  const isDataLoading = turmaLoading || classesLoading || coursesLoading || salasLoading || periodosLoading || anosLoading || teachersLoading;

  if (isDataLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3B6C4D]" />
            <p className="text-muted-foreground">Carregando dados da turma...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (turmaError) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar turma</h3>
            <p className="text-muted-foreground mb-4">{turmaError}</p>
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
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Turma</h1>
                <p className="text-sm text-muted-foreground">
                  Atualize as informações da turma {formData.designacao}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="turma-form"
                disabled={isLoading}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
              <CardTitle className="flex items-center text-xl">
                <School className="w-6 h-6 mr-3 text-blue-500" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="designacao" className="text-foreground font-semibold">
                    Designação da Turma *
                  </Label>
                  <Input
                    id="designacao"
                    value={formData.designacao}
                    onChange={(e) => handleInputChange('designacao', e.target.value)}
                    placeholder="Ex: IG-10A-2024, CG-11B-2024..."
                    className={`h-12 ${errors.designacao ? 'border-red-500' : ''}`}
                  />
                  {errors.designacao && (
                    <p className="text-sm text-red-500">{errors.designacao}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classe" className="text-foreground font-semibold">
                    Classe *
                  </Label>
                  <Select
                    value={formData.classe}
                    onValueChange={(value) => handleInputChange('classe', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.classe ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione a classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((classe: any) => (
                        <SelectItem key={classe.codigo} value={classe.codigo.toString()}>
                          {classe.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classe && (
                    <p className="text-sm text-red-500">{errors.classe}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curso" className="text-foreground font-semibold">
                    Curso *
                  </Label>
                  <Select
                    value={formData.curso}
                    onValueChange={(value) => handleInputChange('curso', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.curso ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((curso: any) => (
                        <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                          {curso.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.curso && (
                    <p className="text-sm text-red-500">{errors.curso}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidade" className="text-foreground font-semibold">
                    Capacidade Máxima *
                  </Label>
                  <Input
                    id="capacidade"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.capacidade}
                    onChange={(e) => handleInputChange('capacidade', e.target.value)}
                    placeholder="Ex: 30"
                    className={`h-12 ${errors.capacidade ? 'border-red-500' : ''}`}
                  />
                  {errors.capacidade && (
                    <p className="text-sm text-red-500">{errors.capacidade}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração Acadêmica */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <GraduationCap className="w-6 h-6 mr-3 text-purple-500" />
                Configuração Acadêmica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sala" className="text-foreground font-semibold">
                    Sala *
                  </Label>
                  <Select
                    value={formData.sala}
                    onValueChange={(value) => handleInputChange('sala', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.sala ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione a sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {salas?.map((sala: any) => (
                        <SelectItem key={sala.codigo} value={sala.codigo.toString()}>
                          {sala.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sala && (
                    <p className="text-sm text-red-500">{errors.sala}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo" className="text-foreground font-semibold">
                    Período *
                  </Label>
                  <Select
                    value={formData.periodo}
                    onValueChange={(value) => handleInputChange('periodo', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.periodo ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodos?.map((periodo: any) => (
                        <SelectItem key={periodo.codigo} value={periodo.codigo.toString()}>
                          {periodo.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.periodo && (
                    <p className="text-sm text-red-500">{errors.periodo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anoLetivo" className="text-foreground font-semibold">
                    Ano Letivo
                  </Label>
                  <Select
                    value={formData.anoLetivo}
                    onValueChange={(value) => handleInputChange('anoLetivo', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o ano letivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {anosLectivos?.map((ano: any) => (
                        <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                          {ano.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="diretor" className="text-foreground font-semibold">
                    Diretor de Turma
                  </Label>
                  <Select
                    value={formData.diretor}
                    onValueChange={(value) => handleInputChange('diretor', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o diretor de turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers?.map((professor: any) => (
                        <SelectItem key={professor.codigo} value={professor.codigo.toString()}>
                          {professor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-foreground font-semibold">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Planejado">Planejado</SelectItem>
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
