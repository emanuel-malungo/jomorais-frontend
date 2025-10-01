"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Dados mockados para selects
const mockClasses = [
  { id: "1", nome: "10ª Classe", nivel: "2º Ciclo Secundário" },
  { id: "2", nome: "11ª Classe", nivel: "2º Ciclo Secundário" },
  { id: "3", nome: "12ª Classe", nivel: "2º Ciclo Secundário" },
  { id: "4", nome: "13ª Classe", nivel: "Pré-Universitário" },
];

const mockCursos = [
  { id: "1", nome: "Informática de Gestão", codigo: "IG" },
  { id: "2", nome: "Contabilidade e Gestão", codigo: "CG" },
  { id: "3", nome: "Administração", codigo: "AD" },
  { id: "4", nome: "Economia", codigo: "EC" },
];

const mockSalas = [
  { id: "1", nome: "Sala A1", capacidade: 30, localizacao: "Bloco A" },
  { id: "2", nome: "Sala A2", capacidade: 25, localizacao: "Bloco A" },
  { id: "3", nome: "Sala B1", capacidade: 35, localizacao: "Bloco B" },
  { id: "4", nome: "Sala B2", capacidade: 28, localizacao: "Bloco B" },
];

const mockProfessores = [
  { id: "1", nome: "Prof. João Silva Santos", especialidade: "Informática" },
  { id: "2", nome: "Prof. Maria Santos Costa", especialidade: "Contabilidade" },
  { id: "3", nome: "Prof. Carlos Mendes Lima", especialidade: "Administração" },
  { id: "4", nome: "Prof. Ana Paula Francisco", especialidade: "Economia" },
];

const mockAnosLetivos = [
  { id: "1", ano: "2024/2025", status: "Ativo" },
  { id: "2", ano: "2023/2024", status: "Concluído" },
  { id: "3", ano: "2025/2026", status: "Planejado" },
];

export default function AddTurmaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    designacao: "",
    classe: "",
    curso: "",
    sala: "",
    periodo: "",
    anoLetivo: "1", // Default para ano ativo
    capacidade: "",
    diretor: "",
    observacoes: "",
    status: "Ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados da turma:', formData);
      
      // Redirecionar para lista de turmas
      router.push('/admin/academic-management/turmas');
      
    } catch (error) {
      console.error('Erro ao criar turma:', error);
    } finally {
      setIsLoading(false);
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
                    value={formData.classe}
                    onValueChange={(value) => handleInputChange('classe', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.classe ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione a classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClasses.map((classe) => (
                        <SelectItem key={classe.id} value={classe.id}>
                          {classe.nome} - {classe.nivel}
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
                      {mockCursos.map((curso) => (
                        <SelectItem key={curso.id} value={curso.id}>
                          {curso.nome} ({curso.codigo})
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
                      {mockSalas.map((sala) => (
                        <SelectItem key={sala.id} value={sala.id}>
                          {sala.nome} - Cap: {sala.capacidade} ({sala.localizacao})
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
                      <SelectItem value="Manhã">Manhã (07:30 - 12:00)</SelectItem>
                      <SelectItem value="Tarde">Tarde (13:30 - 18:00)</SelectItem>
                      <SelectItem value="Noite">Noite (19:00 - 22:30)</SelectItem>
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
                      {mockAnosLetivos.map((ano) => (
                        <SelectItem key={ano.id} value={ano.id}>
                          {ano.ano} - {ano.status}
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
                      {mockProfessores.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          {professor.nome} - {professor.especialidade}
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

          {/* Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-6 h-6 mr-3 text-orange-500" />
                Observações
              </CardTitle>
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
                  placeholder="Informações adicionais sobre a turma, metodologia específica, etc..."
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
