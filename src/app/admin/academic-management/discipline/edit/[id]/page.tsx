"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  X,
  Loader2,
  GraduationCap,
  Clock,
  FileText,
  Edit,
} from 'lucide-react';

// Dados mockados para selects
const mockCourses = [
  { codigo: 1, designacao: "Informática de Gestão" },
  { codigo: 2, designacao: "Contabilidade" },
  { codigo: 3, designacao: "Administração" },
  { codigo: 4, designacao: "Economia" },
];

const mockClasses = [
  { codigo: 1, designacao: "10ª Classe" },
  { codigo: 2, designacao: "11ª Classe" },
  { codigo: 3, designacao: "12ª Classe" },
  { codigo: 4, designacao: "13ª Classe" },
];

const mockTeachers = [
  { codigo: 1, nome: "Prof. João Manuel Silva", especialidade: "Matemática" },
  { codigo: 2, nome: "Prof. Maria Santos Costa", especialidade: "Física" },
  { codigo: 3, nome: "Prof. Carlos Alberto Pereira", especialidade: "Química" },
  { codigo: 4, nome: "Prof. Ana Paula Francisco", especialidade: "Biologia" },
];

// Dados mockados da disciplina para edição
const mockDisciplineData = {
  codigo: 1,
  designacao: "Matemática",
  codigo_disciplina: "MAT",
  carga_horaria: 4,
  creditos: 3,
  codigo_Curso: "1",
  codigo_Classe: "1",
  codigo_Professor: "1",
  descricao: "Disciplina fundamental que aborda conceitos de álgebra, geometria, trigonometria e cálculo básico para o ensino secundário.",
  status: "Ativo",
};

export default function EditDisciplinePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const disciplineId = params.id;

  // Estados do formulário
  const [formData, setFormData] = useState({
    designacao: "",
    codigo: "",
    carga_horaria: "",
    creditos: "",
    codigo_Curso: "",
    codigo_Classe: "",
    codigo_Professor: "",
    descricao: "",
    status: "Ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simular carregamento de dados da disciplina
    const loadDisciplineData = async () => {
      setDataLoading(true);
      
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar dados mockados
        setFormData({
          designacao: mockDisciplineData.designacao,
          codigo: mockDisciplineData.codigo_disciplina,
          carga_horaria: mockDisciplineData.carga_horaria.toString(),
          creditos: mockDisciplineData.creditos.toString(),
          codigo_Curso: mockDisciplineData.codigo_Curso,
          codigo_Classe: mockDisciplineData.codigo_Classe,
          codigo_Professor: mockDisciplineData.codigo_Professor,
          descricao: mockDisciplineData.descricao,
          status: mockDisciplineData.status,
        });
        
        console.log("Dados da disciplina carregados:", disciplineId);
      } catch (error) {
        console.error("Erro ao carregar disciplina:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadDisciplineData();
  }, [disciplineId]);

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
      newErrors.designacao = "Nome da disciplina é obrigatório";
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = "Código da disciplina é obrigatório";
    }

    if (!formData.carga_horaria.trim()) {
      newErrors.carga_horaria = "Carga horária é obrigatória";
    }

    if (!formData.codigo_Curso) {
      newErrors.codigo_Curso = "Curso é obrigatório";
    }

    if (!formData.codigo_Classe) {
      newErrors.codigo_Classe = "Classe é obrigatória";
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
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados atualizados da disciplina:', formData);
      
      // Redirecionar para detalhes da disciplina
      router.push(`/admin/academic-management/discipline/details/${disciplineId}`);
      
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3B6C4D]" />
            <p className="text-muted-foreground">Carregando dados da disciplina...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Editar Disciplina</h1>
                <p className="text-sm text-muted-foreground">
                  Atualize as informações da disciplina {formData.designacao}
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
                form="discipline-form"
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
        <form id="discipline-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="designacao" className="text-foreground font-semibold">
                    Nome da Disciplina *
                  </Label>
                  <Input
                    id="designacao"
                    value={formData.designacao}
                    onChange={(e) => handleInputChange('designacao', e.target.value)}
                    placeholder="Ex: Matemática, Física, Química..."
                    className={`h-12 ${errors.designacao ? 'border-red-500' : ''}`}
                  />
                  {errors.designacao && (
                    <p className="text-sm text-red-500">{errors.designacao}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-foreground font-semibold">
                    Código da Disciplina *
                  </Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    placeholder="Ex: MAT, FIS, QUI..."
                    className={`h-12 ${errors.codigo ? 'border-red-500' : ''}`}
                  />
                  {errors.codigo && (
                    <p className="text-sm text-red-500">{errors.codigo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carga_horaria" className="text-foreground font-semibold">
                    Carga Horária (horas/semana) *
                  </Label>
                  <Input
                    id="carga_horaria"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.carga_horaria}
                    onChange={(e) => handleInputChange('carga_horaria', e.target.value)}
                    placeholder="Ex: 4"
                    className={`h-12 ${errors.carga_horaria ? 'border-red-500' : ''}`}
                  />
                  {errors.carga_horaria && (
                    <p className="text-sm text-red-500">{errors.carga_horaria}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditos" className="text-foreground font-semibold">
                    Créditos
                  </Label>
                  <Input
                    id="creditos"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.creditos}
                    onChange={(e) => handleInputChange('creditos', e.target.value)}
                    placeholder="Ex: 3"
                    className="h-12"
                  />
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
                  <Label htmlFor="codigo_Curso" className="text-foreground font-semibold">
                    Curso *
                  </Label>
                  <Select
                    value={formData.codigo_Curso}
                    onValueChange={(value) => handleInputChange('codigo_Curso', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.codigo_Curso ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.codigo} value={course.codigo.toString()}>
                          {course.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Curso && (
                    <p className="text-sm text-red-500">{errors.codigo_Curso}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_Classe" className="text-foreground font-semibold">
                    Classe *
                  </Label>
                  <Select
                    value={formData.codigo_Classe}
                    onValueChange={(value) => handleInputChange('codigo_Classe', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.codigo_Classe ? 'border-red-500' : ''}`}>
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
                  {errors.codigo_Classe && (
                    <p className="text-sm text-red-500">{errors.codigo_Classe}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_Professor" className="text-foreground font-semibold">
                    Professor Responsável
                  </Label>
                  <Select
                    value={formData.codigo_Professor}
                    onValueChange={(value) => handleInputChange('codigo_Professor', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.map((teacher) => (
                        <SelectItem key={teacher.codigo} value={teacher.codigo.toString()}>
                          {teacher.nome} - {teacher.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileText className="w-6 h-6 mr-3 text-orange-500" />
                Descrição e Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-foreground font-semibold">
                  Descrição da Disciplina
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva os objetivos, conteúdo programático e metodologia da disciplina..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

        </form>
      </div>
    </Container>
  );
}
