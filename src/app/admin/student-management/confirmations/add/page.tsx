"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  UserCheck,
  ArrowLeft,
  Save,
  User,
  School,
  AlertCircle,
  Search,
  GraduationCap,
} from 'lucide-react';

// Dados mockados para selects
const mockEnrollments = [
  { 
    codigo: 1, 
    tb_alunos: { nome: "Ana Silva Santos", email: "ana.santos@email.com" },
    tb_cursos: { designacao: "Informática de Gestão" },
    data_Matricula: "2024-02-01"
  },
  { 
    codigo: 2, 
    tb_alunos: { nome: "Carlos Manuel Pereira", email: "carlos.pereira@email.com" },
    tb_cursos: { designacao: "Contabilidade" },
    data_Matricula: "2024-02-03"
  },
  { 
    codigo: 3, 
    tb_alunos: { nome: "Maria João Francisco", email: "maria.francisco@email.com" },
    tb_cursos: { designacao: "Informática de Gestão" },
    data_Matricula: "2024-01-28"
  },
];

const mockClasses = [
  { 
    codigo: 1, 
    designacao: "IG-2024-M",
    tb_classes: { designacao: "10ª Classe" },
    tb_salas: { designacao: "Sala 101" },
    tb_periodos: { designacao: "Manhã" }
  },
  { 
    codigo: 2, 
    designacao: "IG-2024-T",
    tb_classes: { designacao: "10ª Classe" },
    tb_salas: { designacao: "Sala 102" },
    tb_periodos: { designacao: "Tarde" }
  },
  { 
    codigo: 3, 
    designacao: "CONT-2024-M",
    tb_classes: { designacao: "11ª Classe" },
    tb_salas: { designacao: "Sala 201" },
    tb_periodos: { designacao: "Manhã" }
  },
];

const academicYears = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

export default function AddConfirmationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [filteredEnrollments, setFilteredEnrollments] = useState(mockEnrollments);

  // Estados do formulário
  const [formData, setFormData] = useState({
    codigo_Matricula: "",
    codigo_Turma: "",
    data_Confirmacao: new Date().toISOString().split('T')[0],
    classificacao: "Aprovado",
    codigo_Ano_lectivo: "2024",
    codigo_Status: "1",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar matrículas baseado na busca
  React.useEffect(() => {
    if (enrollmentSearch) {
      const filtered = mockEnrollments.filter(enrollment =>
        enrollment.tb_alunos.nome.toLowerCase().includes(enrollmentSearch.toLowerCase()) ||
        enrollment.tb_alunos.email.toLowerCase().includes(enrollmentSearch.toLowerCase()) ||
        enrollment.tb_cursos.designacao.toLowerCase().includes(enrollmentSearch.toLowerCase())
      );
      setFilteredEnrollments(filtered);
    } else {
      setFilteredEnrollments(mockEnrollments);
    }
  }, [enrollmentSearch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validações obrigatórias
    if (!formData.codigo_Matricula) newErrors.codigo_Matricula = "Matrícula é obrigatória";
    if (!formData.codigo_Turma) newErrors.codigo_Turma = "Turma é obrigatória";
    if (!formData.data_Confirmacao) newErrors.data_Confirmacao = "Data de confirmação é obrigatória";
    if (!formData.classificacao) newErrors.classificacao = "Classificação é obrigatória";
    if (!formData.codigo_Ano_lectivo) newErrors.codigo_Ano_lectivo = "Ano letivo é obrigatório";

    // Validar se a data não é futura
    const today = new Date();
    const confirmationDate = new Date(formData.data_Confirmacao);
    if (confirmationDate > today) {
      newErrors.data_Confirmacao = "Data de confirmação não pode ser futura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Dados da confirmação:", formData);
      
      // Redirecionar para lista após sucesso
      router.push('/admin/student-management/confirmations');
    } catch (error) {
      console.error("Erro ao salvar confirmação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedEnrollment = mockEnrollments.find(e => e.codigo.toString() === formData.codigo_Matricula);
  const selectedClass = mockClasses.find(c => c.codigo.toString() === formData.codigo_Turma);

  return (
    <Container>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Nova Confirmação
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Confirmar Aluno em Turma</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Preencha as informações necessárias para confirmar um aluno em uma turma.
                Todos os campos marcados com * são obrigatórios.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? "Salvando..." : "Salvar Confirmação"}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção da Matrícula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Selecionar Matrícula</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Buscar Matrícula *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Digite o nome do aluno ou curso..."
                    value={enrollmentSearch}
                    onChange={(e) => setEnrollmentSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Matrícula *
                </label>
                <Select 
                  value={formData.codigo_Matricula} 
                  onValueChange={(value) => handleInputChange('codigo_Matricula', value)}
                >
                  <SelectTrigger className={errors.codigo_Matricula ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a matrícula" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEnrollments.map((enrollment) => (
                      <SelectItem key={enrollment.codigo} value={enrollment.codigo.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{enrollment.tb_alunos.nome}</span>
                          <span className="text-xs text-gray-500">
                            {enrollment.tb_cursos.designacao} • Matrícula: {new Date(enrollment.data_Matricula).toLocaleDateString('pt-AO')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.codigo_Matricula && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.codigo_Matricula}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações da Confirmação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Informações da Confirmação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Turma *
                  </label>
                  <Select 
                    value={formData.codigo_Turma} 
                    onValueChange={(value) => handleInputChange('codigo_Turma', value)}
                  >
                    <SelectTrigger className={errors.codigo_Turma ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClasses.map((turma) => (
                        <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{turma.designacao}</span>
                            <span className="text-xs text-gray-500">
                              {turma.tb_classes.designacao} • {turma.tb_salas.designacao} • {turma.tb_periodos.designacao}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Turma && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Turma}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data de Confirmação *
                  </label>
                  <Input
                    type="date"
                    value={formData.data_Confirmacao}
                    onChange={(e) => handleInputChange('data_Confirmacao', e.target.value)}
                    className={errors.data_Confirmacao ? "border-red-500" : ""}
                  />
                  {errors.data_Confirmacao && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.data_Confirmacao}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Classificação *
                  </label>
                  <Select 
                    value={formData.classificacao} 
                    onValueChange={(value) => handleInputChange('classificacao', value)}
                  >
                    <SelectTrigger className={errors.classificacao ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a classificação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Reprovado">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.classificacao && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.classificacao}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ano Letivo *
                  </label>
                  <Select 
                    value={formData.codigo_Ano_lectivo} 
                    onValueChange={(value) => handleInputChange('codigo_Ano_lectivo', value)}
                  >
                    <SelectTrigger className={errors.codigo_Ano_lectivo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o ano letivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Ano_lectivo && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Ano_lectivo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status da Confirmação
                  </label>
                  <Select 
                    value={formData.codigo_Status} 
                    onValueChange={(value) => handleInputChange('codigo_Status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativa</SelectItem>
                      <SelectItem value="0">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Confirmação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEnrollment ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Matrícula Selecionada</h4>
                  <p className="text-sm font-semibold text-blue-800">{selectedEnrollment.tb_alunos.nome}</p>
                  <p className="text-xs text-blue-600">{selectedEnrollment.tb_cursos.designacao}</p>
                  <p className="text-xs text-blue-600">Matrícula: {new Date(selectedEnrollment.data_Matricula).toLocaleDateString('pt-AO')}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhuma matrícula selecionada</p>
                </div>
              )}

              {selectedClass ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Turma Selecionada</h4>
                  <p className="text-sm font-semibold text-green-800">{selectedClass.designacao}</p>
                  <p className="text-xs text-green-600">{selectedClass.tb_classes.designacao}</p>
                  <p className="text-xs text-green-600">{selectedClass.tb_salas.designacao} • {selectedClass.tb_periodos.designacao}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhuma turma selecionada</p>
                </div>
              )}

              {formData.data_Confirmacao && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Data de Confirmação</h4>
                  <p className="text-sm font-semibold text-yellow-800">
                    {new Date(formData.data_Confirmacao).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Classificação</h4>
                <Badge 
                  variant={
                    formData.classificacao === "Aprovado" ? "default" : 
                    formData.classificacao === "Pendente" ? "secondary" : 
                    "destructive"
                  }
                  className={
                    formData.classificacao === "Aprovado" ? "bg-green-100 text-green-800" :
                    formData.classificacao === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }
                >
                  {formData.classificacao || "Não selecionada"}
                </Badge>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Ano Letivo</h4>
                <p className="text-sm font-semibold text-indigo-800">{formData.codigo_Ano_lectivo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <span>Informações Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Verifique se o aluno não possui confirmação ativa para o mesmo ano letivo</p>
                <p>• A data de confirmação não pode ser futura</p>
                <p>• Apenas uma confirmação ativa por matrícula/ano letivo é permitida</p>
                <p>• A classificação pode ser alterada posteriormente se necessário</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
