"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowRightLeft,
  ArrowLeft,
  Save,
  User,
  Building,
  AlertCircle,
  Search,
  GraduationCap,
} from 'lucide-react';

// Dados mockados para selects
const mockStudents = [
  { 
    codigo: 1, 
    nome: "Ana Silva Santos", 
    email: "ana.santos@email.com",
    tb_matriculas: {
      tb_cursos: { designacao: "Informática de Gestão" }
    },
    dataNascimento: "2005-03-15"
  },
  { 
    codigo: 2, 
    nome: "Carlos Manuel Pereira", 
    email: "carlos.pereira@email.com",
    tb_matriculas: {
      tb_cursos: { designacao: "Contabilidade" }
    },
    dataNascimento: "2004-07-22"
  },
  { 
    codigo: 3, 
    nome: "Maria João Francisco", 
    email: "maria.francisco@email.com",
    tb_matriculas: {
      tb_cursos: { designacao: "Informática de Gestão" }
    },
    dataNascimento: "2005-11-10"
  },
];

const transferReasons = [
  "Mudança de residência",
  "Mudança de curso",
  "Problemas disciplinares",
  "Motivos familiares",
  "Transferência por trabalho dos pais",
  "Problemas de saúde",
  "Outros motivos"
];

export default function AddTransferPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);

  // Estados do formulário
  const [formData, setFormData] = useState({
    codigoAluno: "",
    dataTransferencia: new Date().toISOString().split('T')[0],
    escolaDestino: "",
    motivoTransferencia: "",
    obs: "",
    status: "Pendente",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar alunos baseado na busca
  React.useEffect(() => {
    if (studentSearch) {
      const filtered = mockStudents.filter(student =>
        student.nome.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.tb_matriculas.tb_cursos.designacao.toLowerCase().includes(studentSearch.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(mockStudents);
    }
  }, [studentSearch]);

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
    if (!formData.codigoAluno) newErrors.codigoAluno = "Aluno é obrigatório";
    if (!formData.dataTransferencia) newErrors.dataTransferencia = "Data de transferência é obrigatória";
    if (!formData.escolaDestino) newErrors.escolaDestino = "Escola destino é obrigatória";
    if (!formData.motivoTransferencia) newErrors.motivoTransferencia = "Motivo da transferência é obrigatório";

    // Validar se a data não é futura
    const today = new Date();
    const transferDate = new Date(formData.dataTransferencia);
    if (transferDate > today) {
      newErrors.dataTransferencia = "Data de transferência não pode ser futura";
    }

    // Validar escola destino
    if (formData.escolaDestino && formData.escolaDestino.trim().length < 5) {
      newErrors.escolaDestino = "Nome da escola deve ter pelo menos 5 caracteres";
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
      
      console.log("Dados da transferência:", formData);
      
      // Redirecionar para lista após sucesso
      router.push('/admin/student-management/transfers');
    } catch (error) {
      console.error("Erro ao salvar transferência:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStudent = mockStudents.find(s => s.codigo.toString() === formData.codigoAluno);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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
                  <ArrowRightLeft className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Nova Transferência
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Transferir Aluno</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Preencha as informações necessárias para processar a transferência de um aluno.
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
                {isLoading ? "Salvando..." : "Salvar Transferência"}
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
          {/* Seleção do Aluno */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Selecionar Aluno</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Buscar Aluno *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Digite o nome do aluno ou curso..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Aluno *
                </label>
                <Select 
                  value={formData.codigoAluno} 
                  onValueChange={(value) => handleInputChange('codigoAluno', value)}
                >
                  <SelectTrigger className={errors.codigoAluno ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((student) => (
                      <SelectItem key={student.codigo} value={student.codigo.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{student.nome}</span>
                          <span className="text-xs text-gray-500">
                            {student.tb_matriculas.tb_cursos.designacao} • {calculateAge(student.dataNascimento)} anos
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.codigoAluno && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.codigoAluno}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações da Transferência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRightLeft className="h-5 w-5" />
                <span>Informações da Transferência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data de Transferência *
                  </label>
                  <Input
                    type="date"
                    value={formData.dataTransferencia}
                    onChange={(e) => handleInputChange('dataTransferencia', e.target.value)}
                    className={errors.dataTransferencia ? "border-red-500" : ""}
                  />
                  {errors.dataTransferencia && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.dataTransferencia}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status da Transferência
                  </label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Aprovada">Aprovada</SelectItem>
                      <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Escola Destino *
                  </label>
                  <Input
                    placeholder="Digite o nome da escola destino..."
                    value={formData.escolaDestino}
                    onChange={(e) => handleInputChange('escolaDestino', e.target.value)}
                    className={errors.escolaDestino ? "border-red-500" : ""}
                  />
                  {errors.escolaDestino && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.escolaDestino}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Motivo da Transferência *
                  </label>
                  <Select 
                    value={formData.motivoTransferencia} 
                    onValueChange={(value) => handleInputChange('motivoTransferencia', value)}
                  >
                    <SelectTrigger className={errors.motivoTransferencia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o motivo da transferência" />
                    </SelectTrigger>
                    <SelectContent>
                      {transferReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.motivoTransferencia && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.motivoTransferencia}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <Textarea
                    placeholder="Digite observações adicionais sobre a transferência..."
                    value={formData.obs}
                    onChange={(e) => handleInputChange('obs', e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Adicione informações complementares que possam ser relevantes para a transferência.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Transferência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStudent ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Aluno Selecionado</h4>
                  <p className="text-sm font-semibold text-blue-800">{selectedStudent.nome}</p>
                  <p className="text-xs text-blue-600">{selectedStudent.tb_matriculas.tb_cursos.designacao}</p>
                  <p className="text-xs text-blue-600">{calculateAge(selectedStudent.dataNascimento)} anos</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhum aluno selecionado</p>
                </div>
              )}

              {formData.escolaDestino && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Escola Destino</h4>
                  <p className="text-sm font-semibold text-green-800">{formData.escolaDestino}</p>
                </div>
              )}

              {formData.dataTransferencia && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Data de Transferência</h4>
                  <p className="text-sm font-semibold text-yellow-800">
                    {new Date(formData.dataTransferencia).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              )}

              {formData.motivoTransferencia && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Motivo</h4>
                  <p className="text-sm font-semibold text-purple-800">{formData.motivoTransferencia}</p>
                </div>
              )}

              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Status</h4>
                <Badge 
                  variant={
                    formData.status === "Aprovada" ? "default" : 
                    formData.status === "Pendente" ? "secondary" : 
                    "destructive"
                  }
                  className={
                    formData.status === "Aprovada" ? "bg-green-100 text-green-800" :
                    formData.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }
                >
                  {formData.status}
                </Badge>
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
                <p>• Verifique se todos os dados estão corretos antes de salvar</p>
                <p>• A data de transferência não pode ser futura</p>
                <p>• O status pode ser alterado posteriormente se necessário</p>
                <p>• Transferências aprovadas requerem documentação adicional</p>
                <p>• Mantenha as observações claras e objetivas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
