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
  GraduationCap,
  ArrowLeft,
  Save,
  X,
  Loader2,
  School,
  Users,
  Calendar,
} from 'lucide-react';

// Dados mockados para selects
const mockNiveis = [
  { id: "1", nome: "Ensino Primário", descricao: "1ª a 6ª Classe" },
  { id: "2", nome: "1º Ciclo Secundário", descricao: "7ª a 9ª Classe" },
  { id: "3", nome: "2º Ciclo Secundário", descricao: "10ª a 12ª Classe" },
  { id: "4", nome: "Pré-Universitário", descricao: "13ª Classe" },
];

const mockCoordenadores = [
  { id: "1", nome: "Prof. Maria Silva Santos", especialidade: "Pedagogia" },
  { id: "2", nome: "Prof. João Manuel Costa", especialidade: "Matemática" },
  { id: "3", nome: "Prof. Ana Paula Francisco", especialidade: "Língua Portuguesa" },
  { id: "4", nome: "Prof. Carlos Alberto Neto", especialidade: "Ciências" },
];

const mockAnosLetivos = [
  { id: "1", ano: "2024/2025", status: "Ativo" },
  { id: "2", ano: "2023/2024", status: "Concluído" },
  { id: "3", ano: "2025/2026", status: "Planejado" },
];

// Dados mockados da classe para edição
const mockClassData = {
  id: 1,
  nome: "10ª Classe",
  nivel: "3", // 2º Ciclo Secundário
  coordenador: "1", // Prof. Maria Silva Santos
  anoLetivo: "1", // 2024/2025
  capacidadeMaxima: "120",
  descricao: "Classe do 2º Ciclo do Ensino Secundário focada na preparação dos alunos para o ensino superior, com ênfase em disciplinas científicas e humanísticas.",
  status: "Ativo",
};

export default function EditClassePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const classId = params.id;

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    nivel: "",
    coordenador: "",
    anoLetivo: "",
    capacidadeMaxima: "",
    descricao: "",
    status: "Ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simular carregamento de dados da classe
    const loadClassData = async () => {
      setDataLoading(true);
      
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar dados mockados
        setFormData({
          nome: mockClassData.nome,
          nivel: mockClassData.nivel,
          coordenador: mockClassData.coordenador,
          anoLetivo: mockClassData.anoLetivo,
          capacidadeMaxima: mockClassData.capacidadeMaxima,
          descricao: mockClassData.descricao,
          status: mockClassData.status,
        });
        
        console.log("Dados da classe carregados:", classId);
      } catch (error) {
        console.error("Erro ao carregar classe:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadClassData();
  }, [classId]);

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

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da classe é obrigatório";
    }

    if (!formData.nivel) {
      newErrors.nivel = "Nível de ensino é obrigatório";
    }

    if (!formData.coordenador) {
      newErrors.coordenador = "Coordenador é obrigatório";
    }

    if (!formData.capacidadeMaxima.trim()) {
      newErrors.capacidadeMaxima = "Capacidade máxima é obrigatória";
    } else if (parseInt(formData.capacidadeMaxima) <= 0) {
      newErrors.capacidadeMaxima = "Capacidade deve ser maior que zero";
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
      
      console.log('Dados atualizados da classe:', formData);
      
      // Redirecionar para detalhes da classe
      router.push(`/admin/academic-management/classes/details/${classId}`);
      
    } catch (error) {
      console.error('Erro ao atualizar classe:', error);
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
            <p className="text-muted-foreground">Carregando dados da classe...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Editar Classe</h1>
                <p className="text-sm text-muted-foreground">
                  Atualize as informações da classe {formData.nome}
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
                form="class-form"
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
        <form id="class-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-500" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-foreground font-semibold">
                    Nome da Classe *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Ex: 1ª Classe, 10ª Classe..."
                    className={`h-12 ${errors.nome ? 'border-red-500' : ''}`}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">{errors.nome}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivel" className="text-foreground font-semibold">
                    Nível de Ensino *
                  </Label>
                  <Select
                    value={formData.nivel}
                    onValueChange={(value) => handleInputChange('nivel', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.nivel ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockNiveis.map((nivel) => (
                        <SelectItem key={nivel.id} value={nivel.id}>
                          {nivel.nome} - {nivel.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nivel && (
                    <p className="text-sm text-red-500">{errors.nivel}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidadeMaxima" className="text-foreground font-semibold">
                    Capacidade Máxima de Alunos *
                  </Label>
                  <Input
                    id="capacidadeMaxima"
                    type="number"
                    min="1"
                    max="200"
                    value={formData.capacidadeMaxima}
                    onChange={(e) => handleInputChange('capacidadeMaxima', e.target.value)}
                    placeholder="Ex: 120"
                    className={`h-12 ${errors.capacidadeMaxima ? 'border-red-500' : ''}`}
                  />
                  {errors.capacidadeMaxima && (
                    <p className="text-sm text-red-500">{errors.capacidadeMaxima}</p>
                  )}
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

          {/* Configuração Acadêmica */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <School className="w-6 h-6 mr-3 text-purple-500" />
                Configuração Acadêmica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coordenador" className="text-foreground font-semibold">
                    Coordenador da Classe *
                  </Label>
                  <Select
                    value={formData.coordenador}
                    onValueChange={(value) => handleInputChange('coordenador', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.coordenador ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o coordenador" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCoordenadores.map((coordenador) => (
                        <SelectItem key={coordenador.id} value={coordenador.id}>
                          {coordenador.nome} - {coordenador.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.coordenador && (
                    <p className="text-sm text-red-500">{errors.coordenador}</p>
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
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-6 h-6 mr-3 text-orange-500" />
                Descrição e Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-foreground font-semibold">
                  Descrição da Classe
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva os objetivos, características e metodologia específica desta classe..."
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
