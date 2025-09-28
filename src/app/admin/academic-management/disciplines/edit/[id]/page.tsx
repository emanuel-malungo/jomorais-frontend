"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  BookOpen,
  ArrowLeft,
  Save,
  GraduationCap,
  AlertCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { Disciplina, DisciplinaFormData, Curso } from '@/types/academic-management.types';

// Dados mockados
const mockCursos: Curso[] = [
  { codigo: 1, designacao: "Informática de Gestão", observacoes: "Curso técnico profissional" },
  { codigo: 2, designacao: "Contabilidade", observacoes: "Curso comercial" },
  { codigo: 3, designacao: "Administração", observacoes: "Curso de gestão" },
  { codigo: 4, designacao: "Secretariado", observacoes: "Curso administrativo" },
  { codigo: 5, designacao: "Marketing", observacoes: "Curso comercial" },
];

const mockDisciplinas: Disciplina[] = [
  {
    codigo: 1,
    designacao: "Programação I",
    codigo_Curso: 1,
    tb_cursos: {
      codigo: 1,
      designacao: "Informática de Gestão",
      observacoes: "Curso técnico profissional"
    }
  },
  {
    codigo: 2,
    designacao: "Base de Dados",
    codigo_Curso: 1,
    tb_cursos: {
      codigo: 1,
      designacao: "Informática de Gestão",
      observacoes: "Curso técnico profissional"
    }
  },
  {
    codigo: 3,
    designacao: "Contabilidade Geral",
    codigo_Curso: 2,
    tb_cursos: {
      codigo: 2,
      designacao: "Contabilidade",
      observacoes: "Curso comercial"
    }
  },
];

export default function EditDisciplinePage() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = parseInt(params.id as string);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [cursoSearch, setCursoSearch] = useState("");
  const [filteredCursos, setFilteredCursos] = useState(mockCursos);
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);

  // Estados do formulário
  const [formData, setFormData] = useState<DisciplinaFormData>({
    designacao: "",
    codigo_Curso: 0,
  });

  const [originalData, setOriginalData] = useState<DisciplinaFormData>({
    designacao: "",
    codigo_Curso: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar dados da disciplina
  useEffect(() => {
    const loadDisciplina = async () => {
      setIsLoadingData(true);
      try {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundDisciplina = mockDisciplinas.find(d => d.codigo === disciplinaId);
        if (foundDisciplina) {
          setDisciplina(foundDisciplina);
          const initialData = {
            designacao: foundDisciplina.designacao,
            codigo_Curso: foundDisciplina.codigo_Curso,
          };
          setFormData(initialData);
          setOriginalData(initialData);
        } else {
          setErrors({ load: "Disciplina não encontrada" });
        }
      } catch (error) {
        console.error("Erro ao carregar disciplina:", error);
        setErrors({ load: "Erro ao carregar dados da disciplina" });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (disciplinaId) {
      loadDisciplina();
    }
  }, [disciplinaId]);

  // Filtrar cursos baseado na busca
  useEffect(() => {
    if (cursoSearch) {
      const filtered = mockCursos.filter(curso =>
        curso.designacao.toLowerCase().includes(cursoSearch.toLowerCase())
      );
      setFilteredCursos(filtered);
    } else {
      setFilteredCursos(mockCursos);
    }
  }, [cursoSearch]);

  // Verificar se houve mudanças
  const hasChanges = () => {
    return formData.designacao !== originalData.designacao ||
           formData.codigo_Curso !== originalData.codigo_Curso;
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.designacao.trim()) {
      newErrors.designacao = "Nome da disciplina é obrigatório";
    } else if (formData.designacao.length < 2) {
      newErrors.designacao = "Nome deve ter pelo menos 2 caracteres";
    } else if (formData.designacao.length > 100) {
      newErrors.designacao = "Nome não pode exceder 100 caracteres";
    }

    if (!formData.codigo_Curso || formData.codigo_Curso === 0) {
      newErrors.codigo_Curso = "Selecione um curso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      router.push('/admin/academic-management/disciplines');
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Dados atualizados da disciplina:", { id: disciplinaId, ...formData });
      
      // Redirecionar para lista de disciplinas
      router.push('/admin/academic-management/disciplines');
    } catch (error) {
      console.error("Erro ao atualizar disciplina:", error);
      setErrors({ submit: "Erro ao atualizar disciplina. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar campos do formulário
  const handleInputChange = (field: keyof DisciplinaFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const selectedCurso = mockCursos.find(curso => curso.codigo === formData.codigo_Curso);

  if (isLoadingData) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#F9CD1D]" />
            <p className="text-gray-600">Carregando dados da disciplina...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (errors.load) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao Carregar</h2>
              <p className="text-gray-600 mb-4">{errors.load}</p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
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
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Editar Disciplina
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">
                    {disciplina?.designacao} - ID: {disciplinaId}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Atualize as informações da disciplina. Certifique-se de que os dados estão corretos
                antes de salvar as alterações.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Formulário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Informações da Disciplina</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome da Disciplina */}
                <div className="space-y-2">
                  <label htmlFor="designacao" className="text-sm font-medium text-gray-700">
                    Nome da Disciplina *
                  </label>
                  <Input
                    id="designacao"
                    type="text"
                    placeholder="Ex: Programação I, Matemática Financeira..."
                    value={formData.designacao}
                    onChange={(e) => handleInputChange('designacao', e.target.value)}
                    className={errors.designacao ? "border-red-500" : ""}
                  />
                  {errors.designacao && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.designacao}</span>
                    </div>
                  )}
                </div>

                {/* Seleção de Curso */}
                <div className="space-y-2">
                  <label htmlFor="curso" className="text-sm font-medium text-gray-700">
                    Curso *
                  </label>
                  <div className="space-y-3">
                    {/* Campo de busca para cursos */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar curso..."
                        value={cursoSearch}
                        onChange={(e) => setCursoSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Select de curso */}
                    <Select
                      value={formData.codigo_Curso.toString()}
                      onValueChange={(value) => handleInputChange('codigo_Curso', parseInt(value))}
                    >
                      <SelectTrigger className={errors.codigo_Curso ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCursos.map((curso) => (
                          <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-gray-400" />
                              <span>{curso.designacao}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.codigo_Curso && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.codigo_Curso}</span>
                    </div>
                  )}
                </div>

                {/* Erro geral */}
                {errors.submit && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || !hasChanges()}
                    className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white flex-1 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {hasChanges() ? "Salvar Alterações" : "Sem Alterações"}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral - Resumo */}
        <div className="space-y-6">
          {/* Resumo da Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Resumo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">ID da Disciplina</p>
                <Badge variant="outline" className="bg-gray-50">
                  {disciplinaId}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</p>
                <p className="text-gray-900">{formData.designacao || "Não informado"}</p>
                {originalData.designacao !== formData.designacao && (
                  <p className="text-sm text-gray-500 line-through">Anterior: {originalData.designacao}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Curso</p>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{selectedCurso?.designacao || "Não selecionado"}</p>
                </div>
                {selectedCurso?.observacoes && (
                  <p className="text-sm text-gray-500 mt-1">{selectedCurso.observacoes}</p>
                )}
                {originalData.codigo_Curso !== formData.codigo_Curso && (
                  <p className="text-sm text-gray-500">
                    Anterior: {mockCursos.find(c => c.codigo === originalData.codigo_Curso)?.designacao}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <Badge 
                  variant="outline" 
                  className={hasChanges() ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}
                >
                  {hasChanges() ? "Alterações Pendentes" : "Sem Alterações"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span>Informações Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Alterações no nome da disciplina afetarão todas as referências</p>
                <p>• Mudança de curso pode impactar grades curriculares existentes</p>
                <p>• Verifique se não há conflitos com outras disciplinas</p>
                <p>• As alterações serão aplicadas imediatamente após salvar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
