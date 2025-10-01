"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Save,
  X,
  User,
  GraduationCap,
  MapPin,
  FileText,
  Loader2,
  BookOpen,
  Search,
  Check,
} from 'lucide-react';

import useTeacher from '@/hooks/useTeacher';
import { TeacherFormData } from '@/types/teacher.types';

// Dados mockados de disciplinas
const mockDisciplinas = [
  { id: "1", nome: "Matemática", codigo: "MAT", carga_horaria: 4 },
  { id: "2", nome: "Física", codigo: "FIS", carga_horaria: 3 },
  { id: "3", nome: "Química", codigo: "QUI", carga_horaria: 3 },
  { id: "4", nome: "Biologia", codigo: "BIO", carga_horaria: 3 },
  { id: "5", nome: "Língua Portuguesa", codigo: "LP", carga_horaria: 5 },
  { id: "6", nome: "Inglês", codigo: "ING", carga_horaria: 3 },
  { id: "7", nome: "História", codigo: "HIS", carga_horaria: 3 },
  { id: "8", nome: "Geografia", codigo: "GEO", carga_horaria: 3 },
  { id: "9", nome: "Filosofia", codigo: "FIL", carga_horaria: 2 },
  { id: "10", nome: "Educação Física", codigo: "EF", carga_horaria: 2 },
  { id: "11", nome: "Informática", codigo: "INF", carga_horaria: 3 },
  { id: "12", nome: "Contabilidade", codigo: "CONT", carga_horaria: 4 },
  { id: "13", nome: "Economia", codigo: "ECO", carga_horaria: 3 },
  { id: "14", nome: "Administração", codigo: "ADM", carga_horaria: 3 },
  { id: "15", nome: "Desenho", codigo: "DES", carga_horaria: 2 },
];

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);
  
  const { teacher, loading, updateTeacher, getTeacherById } = useTeacher();

  const [formData, setFormData] = useState<TeacherFormData>({
    nome: '',
    email: '',
    telefone: '',
    sexo: 'M',
    dataNascimento: '',
    n_documento_identificacao: '',
    codigo_Nacionalidade: 1,
    codigo_Comuna: 1,
    morada: '',
    especialidade: '',
    grau_academico: '',
    experiencia_anos: 0,
    salario: 0,
    observacoes: '',
    disciplinas: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para combobox de disciplinas
  const [disciplinasDropdownOpen, setDisciplinasDropdownOpen] = useState(false);
  const [disciplinasSearch, setDisciplinasSearch] = useState("");
  const disciplinasDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (teacherId) {
      getTeacherById(teacherId);
    }
  }, [teacherId, getTeacherById]);

  useEffect(() => {
    if (teacher) {
      setFormData({
        nome: teacher.nome || '',
        email: teacher.email || '',
        telefone: teacher.telefone || '',
        sexo: teacher.sexo || 'M',
        dataNascimento: teacher.dataNascimento || '',
        n_documento_identificacao: teacher.n_documento_identificacao || '',
        codigo_Nacionalidade: teacher.codigo_Nacionalidade || 1,
        codigo_Comuna: teacher.codigo_Comuna || 1,
        morada: teacher.morada || '',
        especialidade: teacher.especialidade || '',
        grau_academico: teacher.grau_academico || '',
        experiencia_anos: teacher.experiencia_anos || 0,
        salario: teacher.salario || 0,
        observacoes: teacher.observacoes || '',
        disciplinas: teacher.tb_disciplinas_professores?.map(dp => dp.tb_disciplinas.codigo) || [],
      });
    }
  }, [teacher]);

  const handleInputChange = (field: keyof TeacherFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await updateTeacher(teacherId, formData);
      router.push('/admin/teacher-management/teacher');
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Funções para combobox de disciplinas
  const filteredDisciplinas = mockDisciplinas.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(disciplinasSearch.toLowerCase()) ||
    disciplina.codigo.toLowerCase().includes(disciplinasSearch.toLowerCase())
  );

  const getSelectedDisciplinas = () => {
    return formData.disciplinas?.map(id => 
      mockDisciplinas.find(d => d.id === id.toString())
    ).filter(Boolean) || [];
  };

  const handleDisciplinaAdd = (disciplina: typeof mockDisciplinas[0]) => {
    if (!formData.disciplinas?.includes(parseInt(disciplina.id))) {
      handleInputChange('disciplinas', [...(formData.disciplinas || []), parseInt(disciplina.id)]);
    }
    setDisciplinasDropdownOpen(false);
    setDisciplinasSearch("");
  };

  const handleDisciplinaRemove = (disciplinaId: string) => {
    const updatedDisciplinas = formData.disciplinas?.filter(id => id !== parseInt(disciplinaId)) || [];
    handleInputChange('disciplinas', updatedDisciplinas);
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (disciplinasDropdownRef.current && !disciplinasDropdownRef.current.contains(event.target as Node)) {
        setDisciplinasDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading && !teacher) {
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
                <h1 className="text-2xl font-bold text-foreground">Editar Professor</h1>
                <p className="text-sm text-muted-foreground">
                  Atualize as informações do professor
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="teacher-form"
                disabled={isSubmitting}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                {isSubmitting ? (
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
        <form id="teacher-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Pessoais */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="w-6 h-6 mr-3 text-blue-500" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Dados pessoais básicos do professor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-foreground font-semibold">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo" className="text-foreground font-semibold">
                    Sexo *
                  </Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value: 'M' | 'F') => handleInputChange('sexo', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento" className="text-foreground font-semibold">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="n_documento_identificacao" className="text-foreground font-semibold">
                    Número do BI
                  </Label>
                  <Input
                    id="n_documento_identificacao"
                    value={formData.n_documento_identificacao}
                    onChange={(e) => handleInputChange('n_documento_identificacao', e.target.value)}
                    placeholder="000000000LA000"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="professor@jomorais.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-foreground font-semibold">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="+244 900 000 000"
                    className="h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Acadêmicas */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <GraduationCap className="w-6 h-6 mr-3 text-purple-500" />
                Informações Acadêmicas
              </CardTitle>
              <CardDescription>
                Especialidade e qualificações do professor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="especialidade" className="text-foreground font-semibold">
                    Especialidade *
                  </Label>
                  <Input
                    id="especialidade"
                    value={formData.especialidade}
                    onChange={(e) => handleInputChange('especialidade', e.target.value)}
                    placeholder="Ex: Matemática, Física, etc."
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grau_academico" className="text-foreground font-semibold">
                    Grau Acadêmico
                  </Label>
                  <Select
                    value={formData.grau_academico}
                    onValueChange={(value) => handleInputChange('grau_academico', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o grau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                      <SelectItem value="Bacharelado">Bacharelado</SelectItem>
                      <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                      <SelectItem value="Mestrado">Mestrado</SelectItem>
                      <SelectItem value="Doutorado">Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experiencia_anos" className="text-foreground font-semibold">
                    Anos de Experiência
                  </Label>
                  <Input
                    id="experiencia_anos"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experiencia_anos}
                    onChange={(e) => handleInputChange('experiencia_anos', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salario" className="text-foreground font-semibold">
                    Salário (AOA)
                  </Label>
                  <Input
                    id="salario"
                    type="number"
                    min="0"
                    value={formData.salario}
                    onChange={(e) => handleInputChange('salario', parseInt(e.target.value) || 0)}
                    placeholder="150000"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Combobox de Disciplinas */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">
                  Disciplinas que Leciona
                </Label>
                <div className="space-y-3">
                  {/* Tags das disciplinas selecionadas */}
                  {getSelectedDisciplinas().length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedDisciplinas().map((disciplina) => (
                        <div
                          key={disciplina?.id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#3B6C4D] text-white text-sm rounded-full"
                        >
                          <span>{disciplina?.nome} ({disciplina?.codigo})</span>
                          <button
                            type="button"
                            onClick={() => handleDisciplinaRemove(disciplina?.id || "")}
                            className="ml-1 hover:bg-[#2d5016] rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropdown de seleção */}
                  <div className="relative" ref={disciplinasDropdownRef}>
                    <div
                      className="min-h-[48px] w-full border border-border rounded-md px-3 py-2 bg-background cursor-pointer flex items-center justify-between"
                      onClick={() => setDisciplinasDropdownOpen(!disciplinasDropdownOpen)}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {getSelectedDisciplinas().length > 0 
                            ? `${getSelectedDisciplinas().length} disciplina(s) selecionada(s)`
                            : "Selecione as disciplinas"
                          }
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {disciplinasDropdownOpen ? "▲" : "▼"}
                      </div>
                    </div>

                    {disciplinasDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-hidden">
                        {/* Campo de busca */}
                        <div className="p-3 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar disciplina..."
                              value={disciplinasSearch}
                              onChange={(e) => setDisciplinasSearch(e.target.value)}
                              className="pl-10 h-9"
                            />
                          </div>
                        </div>

                        {/* Lista de disciplinas */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredDisciplinas.length > 0 ? (
                            filteredDisciplinas.map((disciplina) => {
                              const isSelected = formData.disciplinas?.includes(parseInt(disciplina.id));
                              return (
                                <div
                                  key={disciplina.id}
                                  className={`px-3 py-2 cursor-pointer hover:bg-muted/50 flex items-center justify-between ${
                                    isSelected ? 'bg-muted text-muted-foreground' : ''
                                  }`}
                                  onClick={() => !isSelected && handleDisciplinaAdd(disciplina)}
                                >
                                  <div>
                                    <div className="font-medium">{disciplina.nome}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {disciplina.codigo} • {disciplina.carga_horaria}h/semana
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-[#3B6C4D]" />
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="px-3 py-4 text-center text-muted-foreground">
                              Nenhuma disciplina encontrada
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MapPin className="w-6 h-6 mr-3 text-green-500" />
                Localização
              </CardTitle>
              <CardDescription>
                Endereço e localização do professor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="morada" className="text-foreground font-semibold">
                  Morada/Endereço
                </Label>
                <Input
                  id="morada"
                  value={formData.morada}
                  onChange={(e) => handleInputChange('morada', e.target.value)}
                  placeholder="Rua, Bairro, Município"
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileText className="w-6 h-6 mr-3 text-orange-500" />
                Observações
              </CardTitle>
              <CardDescription>
                Informações adicionais sobre o professor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-foreground font-semibold">
                  Observações Gerais
                </Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre o professor..."
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
