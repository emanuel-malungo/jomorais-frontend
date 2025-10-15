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
  Save,
  X,
  Loader2,
  MapPin,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { useCreateTurma, useClasses, useSalas, usePeriodos, useValidateSala } from '@/hooks';
import { useAnosLectivos } from '@/hooks/useAnoLectivo';
import { useCourses } from '@/hooks/useCourse';
import { School, AlertTriangle } from 'lucide-react';
import { ITurmaInput } from '@/types/turma.types';

// Dados mockados removidos - agora usa dados reais da API

export default function AddTurmaPage() {
  const router = useRouter();
  const { createTurma, isLoading, error } = useCreateTurma();
  const { classes, fetchClasses, isLoading: classesLoading, error: classesError } = useClasses();
  const { salas, fetchSalas, isLoading: salasLoading, error: salasError } = useSalas();
  const { periodos, fetchPeriodos, isLoading: periodosLoading, error: periodosError } = usePeriodos();
  const { anosLectivos, fetchAnosLectivos, isLoading: anosLoading, error: anosError } = useAnosLectivos();
  const { courses, loading: coursesLoading, error: coursesError, refetch: fetchCourses } = useCourses();
  const { validateSalaDisponibilidade, isLoading: validatingRoom } = useValidateSala();

  const [formData, setFormData] = useState<ITurmaInput>({
    designacao: '',
    codigo_Classe: 0,
    codigo_Curso: 0,
    codigo_Sala: 0,
    codigo_Periodo: 0,
    codigo_AnoLectivo: 1,
    max_Alunos: 30,
    status: 'Ativo',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salaConflito, setSalaConflito] = useState<{
    hasConflict: boolean;
    message?: string;
    conflitos?: Array<{
      turma: string;
      periodo: string;
      anoLectivo: string;
    }>;
  }>({ hasConflict: false });

  useEffect(() => {
    fetchClasses(1, 100);
    fetchCourses();
    fetchSalas(1, 100);
    fetchPeriodos(1, 100);
    fetchAnosLectivos(1, 100);
  }, []);

  const handleCancel = () => {
    router.back();
  };

  // Função para validar disponibilidade da sala
  const checkSalaDisponibilidade = async (codigoSala: number, codigoPeriodo: number, codigoAnoLectivo: number) => {
    if (!codigoSala || !codigoPeriodo || !codigoAnoLectivo) {
      setSalaConflito({ hasConflict: false });
      return;
    }

    try {
      const result = await validateSalaDisponibilidade(codigoSala, codigoPeriodo, codigoAnoLectivo);
      
      if (!result.disponivel) {
        setSalaConflito({
          hasConflict: true,
          message: result.message || "Sala já atribuída para este período",
          conflitos: result.conflitos
        });
      } else {
        setSalaConflito({ hasConflict: false });
      }
    } catch (error) {
      // Se a API não existir ainda, apenas limpar o conflito
      setSalaConflito({ hasConflict: false });
      console.log('API de validação de sala ainda não implementada no backend');
    }
  };

  const handleInputChange = (field: keyof ITurmaInput, value: string | number) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(newFormData);
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Verificar disponibilidade da sala quando sala, período ou ano letivo mudarem
    if (field === 'codigo_Sala' || field === 'codigo_Periodo' || field === 'codigo_AnoLectivo') {
      const sala = field === 'codigo_Sala' ? Number(value) : newFormData.codigo_Sala;
      const periodo = field === 'codigo_Periodo' ? Number(value) : newFormData.codigo_Periodo;
      const anoLectivo = field === 'codigo_AnoLectivo' ? Number(value) : newFormData.codigo_AnoLectivo;
      
      if (sala && periodo && anoLectivo) {
        checkSalaDisponibilidade(sala, periodo, anoLectivo);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.designacao.trim()) {
      newErrors.designacao = "Designação da turma é obrigatória";
    }

    if (!formData.codigo_Classe || formData.codigo_Classe <= 0) {
      newErrors.codigo_Classe = "Classe é obrigatória";
    }

    if (!formData.codigo_Curso || formData.codigo_Curso <= 0) {
      newErrors.codigo_Curso = "Curso é obrigatório";
    }

    if (!formData.codigo_Sala || formData.codigo_Sala <= 0) {
      newErrors.codigo_Sala = "Sala é obrigatória";
    }

    if (!formData.codigo_Periodo || formData.codigo_Periodo <= 0) {
      newErrors.codigo_Periodo = "Período é obrigatório";
    }

    if (!formData.max_Alunos || formData.max_Alunos <= 0) {
      newErrors.max_Alunos = "Capacidade é obrigatória e deve ser maior que zero";
    }

    // Verificar conflito de sala
    if (salaConflito.hasConflict) {
      newErrors.codigo_Sala = "Sala já atribuída para este período. Escolha outra sala ou período.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createTurma(formData);
      // Redirecionar para lista de turmas
      router.push('/admin/academic-management/turmas');
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      // O erro já é tratado pelo hook
    }
  };

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
                <h1 className="text-2xl font-bold text-foreground">Nova Turma</h1>
                <p className="text-sm text-muted-foreground">
                  Adicione uma nova turma ao sistema acadêmico
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
                Salvar Turma
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
                    value={formData.codigo_Classe.toString()}
                    onValueChange={(value) => handleInputChange('codigo_Classe', parseInt(value))}
                    disabled={classesLoading}
                  >
                    <SelectTrigger className={`h-12 ${errors.codigo_Classe ? 'border-red-500' : ''}`}>
                      {classesLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <SelectValue placeholder={classesLoading ? "Carregando classes..." : "Selecione a classe"} />
                    </SelectTrigger>
                    <SelectContent>
                      {classesLoading ? (
                        <SelectItem value="loading" disabled>
                          Carregando classes...
                        </SelectItem>
                      ) : classesError ? (
                        <SelectItem value="error" disabled>
                          Erro ao carregar classes
                        </SelectItem>
                      ) : classes.length > 0 ? (
                        classes.map((classe) => (
                          <SelectItem key={classe.codigo} value={classe.codigo.toString()}>
                            {classe.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhuma classe encontrada
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Classe && (
                    <p className="text-sm text-red-500">{errors.codigo_Classe}</p>
                  )}
                  {classesError && (
                    <p className="text-sm text-red-500">Erro ao carregar classes: {classesError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curso" className="text-foreground font-semibold">
                    Curso *
                  </Label>
                  <Select
                    value={formData.codigo_Curso.toString()}
                    onValueChange={(value) => handleInputChange('codigo_Curso', parseInt(value))}
                    disabled={coursesLoading}
                  >
                    <SelectTrigger className={`h-12 ${errors.codigo_Curso ? 'border-red-500' : ''}`}>
                      {coursesLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <SelectValue placeholder={coursesLoading ? "Carregando cursos..." : "Selecione o curso"} />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesLoading ? (
                        <SelectItem value="loading" disabled>
                          Carregando cursos...
                        </SelectItem>
                      ) : coursesError ? (
                        <SelectItem value="error" disabled>
                          Erro ao carregar cursos
                        </SelectItem>
                      ) : courses.length > 0 ? (
                        courses.map((curso) => (
                          <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                            {curso.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhum curso encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Curso && (
                    <p className="text-sm text-red-500">{errors.codigo_Curso}</p>
                  )}
                  {coursesError && (
                    <p className="text-sm text-red-500">Erro ao carregar cursos: {coursesError}</p>
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
                    value={formData.max_Alunos?.toString() || ""}
                    onChange={(e) => handleInputChange('max_Alunos', parseInt(e.target.value) || 0)}
                    placeholder="Ex: 30"
                    className={`h-12 ${errors.max_Alunos ? 'border-red-500' : ''}`}
                  />
                  {errors.max_Alunos && (
                    <p className="text-sm text-red-500">{errors.max_Alunos}</p>
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
                    value={formData.codigo_Sala.toString()}
                    onValueChange={(value) => handleInputChange('codigo_Sala', parseInt(value))}
                    disabled={salasLoading}
                  >
                    <SelectTrigger className={`h-12 ${errors.codigo_Sala ? 'border-red-500' : ''}`}>
                      {salasLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <SelectValue placeholder={salasLoading ? "Carregando salas..." : "Selecione a sala"} />
                    </SelectTrigger>
                    <SelectContent>
                      {salasLoading ? (
                        <SelectItem value="loading" disabled>
                          Carregando salas...
                        </SelectItem>
                      ) : salasError ? (
                        <SelectItem value="error" disabled>
                          Erro ao carregar salas
                        </SelectItem>
                      ) : salas.length > 0 ? (
                        salas.map((sala) => (
                          <SelectItem key={sala.codigo} value={sala.codigo.toString()}>
                            {sala.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhuma sala encontrada
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Sala && (
                    <p className="text-sm text-red-500">{errors.codigo_Sala}</p>
                  )}
                  {salasError && (
                    <p className="text-sm text-red-500">Erro ao carregar salas: {salasError}</p>
                  )}
                  
                  {/* Aviso de validação de sala */}
                  {validatingRoom && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando disponibilidade da sala...
                    </div>
                  )}
                  
                  {/* Aviso de conflito de sala */}
                  {salaConflito.hasConflict && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-red-700 font-medium">
                            ⚠️ Sala já atribuída!
                          </p>
                          <p className="text-red-600 mt-1">
                            {salaConflito.message || "Esta sala já está sendo usada neste período."}
                          </p>
                          {salaConflito.conflitos && salaConflito.conflitos.length > 0 && (
                            <div className="mt-2">
                              <p className="text-red-600 font-medium">Conflitos encontrados:</p>
                              <ul className="mt-1 space-y-1">
                                {salaConflito.conflitos.map((conflito, index) => (
                                  <li key={index} className="text-red-600 text-xs">
                                    • Turma: {conflito.turma} - {conflito.periodo} ({conflito.anoLectivo})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-red-600 mt-2 text-xs">
                            💡 Sugestão: Escolha uma sala diferente ou altere o período.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo" className="text-foreground font-semibold">
                    Período *
                  </Label>
                  <Select
                    value={formData.codigo_Periodo.toString()}
                    onValueChange={(value) => handleInputChange('codigo_Periodo', parseInt(value))}
                    disabled={periodosLoading}
                  >
                    <SelectTrigger className={`h-12 ${errors.codigo_Periodo ? 'border-red-500' : ''}`}>
                      {periodosLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <SelectValue placeholder={periodosLoading ? "Carregando períodos..." : "Selecione o período"} />
                    </SelectTrigger>
                    <SelectContent>
                      {periodosLoading ? (
                        <SelectItem value="loading" disabled>
                          Carregando períodos...
                        </SelectItem>
                      ) : periodosError ? (
                        <SelectItem value="error" disabled>
                          Erro ao carregar períodos
                        </SelectItem>
                      ) : periodos.length > 0 ? (
                        periodos.map((periodo) => (
                          <SelectItem key={periodo.codigo} value={periodo.codigo.toString()}>
                            {periodo.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhum período encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Periodo && (
                    <p className="text-sm text-red-500">{errors.codigo_Periodo}</p>
                  )}
                  {periodosError && (
                    <p className="text-sm text-red-500">Erro ao carregar períodos: {periodosError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anoLetivo" className="text-foreground font-semibold">
                    Ano Letivo
                  </Label>
                  <Select
                    value={formData.codigo_AnoLectivo?.toString() || ""}
                    onValueChange={(value) => handleInputChange('codigo_AnoLectivo', parseInt(value))}
                    disabled={anosLoading}
                  >
                    <SelectTrigger className="h-12">
                      {anosLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <SelectValue placeholder={anosLoading ? "Carregando anos letivos..." : "Selecione o ano letivo"} />
                    </SelectTrigger>
                    <SelectContent>
                      {anosLoading ? (
                        <SelectItem value="loading" disabled>
                          Carregando anos letivos...
                        </SelectItem>
                      ) : anosError ? (
                        <SelectItem value="error" disabled>
                          Erro ao carregar anos letivos
                        </SelectItem>
                      ) : anosLectivos.length > 0 ? (
                        anosLectivos.map((ano) => (
                          <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                            {ano.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhum ano letivo encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {anosError && (
                    <p className="text-sm text-red-500">Erro ao carregar anos letivos: {anosError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-foreground font-semibold">
                    Status
                  </Label>
                  <Select
                    value={formData.status || "Ativo"}
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

          {/* Card de observações removido - não faz parte da interface ITurmaInput */}

        </form>
      </div>
    </Container>
  );
}
