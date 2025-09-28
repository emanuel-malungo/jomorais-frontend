"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  GraduationCap,
  ArrowLeft,
  Save,
  User,
  BookOpen,
  AlertCircle,
  Search,
  Edit,
} from 'lucide-react';

// Dados mockados
const mockStudents = [
  { codigo: 1, nome: "Ana Silva Santos", email: "ana.santos@email.com" },
  { codigo: 2, nome: "Carlos Manuel Pereira", email: "carlos.pereira@email.com" },
  { codigo: 3, nome: "Maria João Francisco", email: "maria.francisco@email.com" },
  { codigo: 4, nome: "Pedro António Silva", email: "pedro.silva@email.com" },
  { codigo: 5, nome: "Joana Cristina Lopes", email: "joana.lopes@email.com" },
];

const mockCourses = [
  { codigo: 1, designacao: "Informática de Gestão", duracao: "3 anos" },
  { codigo: 2, designacao: "Contabilidade", duracao: "3 anos" },
  { codigo: 3, designacao: "Administração", duracao: "3 anos" },
  { codigo: 4, designacao: "Marketing", duracao: "2 anos" },
  { codigo: 5, designacao: "Recursos Humanos", duracao: "2 anos" },
];

// Dados mockados da matrícula para edição
const mockEnrollmentData = {
  codigo: 1,
  codigo_Aluno: "1",
  codigo_Curso: "1",
  data_Matricula: "2024-02-01",
  codigoStatus: "1",
  tb_alunos: {
    codigo: 1,
    nome: "Ana Silva Santos",
    email: "ana.santos@email.com"
  },
  tb_cursos: {
    codigo: 1,
    designacao: "Informática de Gestão",
    duracao: "3 anos"
  }
};

export default function EditEnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);

  const enrollmentId = params.id;

  // Estados do formulário
  const [formData, setFormData] = useState({
    codigo_Aluno: mockEnrollmentData.codigo_Aluno,
    codigo_Curso: mockEnrollmentData.codigo_Curso,
    data_Matricula: mockEnrollmentData.data_Matricula,
    codigoStatus: mockEnrollmentData.codigoStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Em produção, buscar dados da matrícula pela API
    console.log("Carregando dados da matrícula:", enrollmentId);
  }, [enrollmentId]);

  // Filtrar alunos baseado na busca
  useEffect(() => {
    if (studentSearch) {
      const filtered = mockStudents.filter(student =>
        student.nome.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase())
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
    if (!formData.codigo_Aluno) newErrors.codigo_Aluno = "Aluno é obrigatório";
    if (!formData.codigo_Curso) newErrors.codigo_Curso = "Curso é obrigatório";
    if (!formData.data_Matricula) newErrors.data_Matricula = "Data de matrícula é obrigatória";

    // Validar se a data não é futura
    const today = new Date();
    const matriculaDate = new Date(formData.data_Matricula);
    if (matriculaDate > today) {
      newErrors.data_Matricula = "Data de matrícula não pode ser futura";
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
      
      console.log("Dados atualizados da matrícula:", formData);
      
      // Redirecionar para lista após sucesso
      router.push('/admin/student-management/enrolls');
    } catch (error) {
      console.error("Erro ao atualizar matrícula:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStudent = mockStudents.find(s => s.codigo.toString() === formData.codigo_Aluno);
  const selectedCourse = mockCourses.find(c => c.codigo.toString() === formData.codigo_Curso);

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
                  <Edit className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Editar Matrícula
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">#{mockEnrollmentData.codigo}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Atualize as informações da matrícula. Todos os campos marcados com * são obrigatórios.
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
                {isLoading ? "Salvando..." : "Salvar Alterações"}
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
          {/* Informações Atuais */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <GraduationCap className="h-5 w-5" />
                <span>Matrícula Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-700">Aluno Atual</label>
                  <p className="text-sm font-semibold text-blue-900">{mockEnrollmentData.tb_alunos.nome}</p>
                  <p className="text-xs text-blue-600">{mockEnrollmentData.tb_alunos.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">Curso Atual</label>
                  <p className="text-sm font-semibold text-blue-900">{mockEnrollmentData.tb_cursos.designacao}</p>
                  <p className="text-xs text-blue-600">{mockEnrollmentData.tb_cursos.duracao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">Data de Matrícula</label>
                  <p className="text-sm font-semibold text-blue-900">
                    {new Date(mockEnrollmentData.data_Matricula).toLocaleDateString('pt-AO')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">Status</label>
                  <Badge 
                    variant="default"
                    className="bg-blue-100 text-blue-800"
                  >
                    {mockEnrollmentData.codigoStatus === "1" ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção do Aluno */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Alterar Aluno</span>
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
                    placeholder="Digite o nome ou email do aluno..."
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
                  value={formData.codigo_Aluno} 
                  onValueChange={(value) => handleInputChange('codigo_Aluno', value)}
                >
                  <SelectTrigger className={errors.codigo_Aluno ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((student) => (
                      <SelectItem key={student.codigo} value={student.codigo.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{student.nome}</span>
                          <span className="text-xs text-gray-500">{student.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.codigo_Aluno && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.codigo_Aluno}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações da Matrícula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Alterar Informações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Curso *
                  </label>
                  <Select 
                    value={formData.codigo_Curso} 
                    onValueChange={(value) => handleInputChange('codigo_Curso', value)}
                  >
                    <SelectTrigger className={errors.codigo_Curso ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.codigo} value={course.codigo.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{course.designacao}</span>
                            <span className="text-xs text-gray-500">{course.duracao}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Curso && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Curso}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data de Matrícula *
                  </label>
                  <Input
                    type="date"
                    value={formData.data_Matricula}
                    onChange={(e) => handleInputChange('data_Matricula', e.target.value)}
                    className={errors.data_Matricula ? "border-red-500" : ""}
                  />
                  {errors.data_Matricula && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.data_Matricula}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status da Matrícula
                  </label>
                  <Select 
                    value={formData.codigoStatus} 
                    onValueChange={(value) => handleInputChange('codigoStatus', value)}
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

        {/* Resumo das Alterações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo das Alterações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStudent ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Novo Aluno</h4>
                  <p className="text-sm font-semibold text-blue-800">{selectedStudent.nome}</p>
                  <p className="text-xs text-blue-600">{selectedStudent.email}</p>
                  {selectedStudent.codigo.toString() !== mockEnrollmentData.codigo_Aluno && (
                    <Badge variant="outline" className="mt-2 text-xs border-orange-300 text-orange-700">
                      Alterado
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhum aluno selecionado</p>
                </div>
              )}

              {selectedCourse ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Novo Curso</h4>
                  <p className="text-sm font-semibold text-green-800">{selectedCourse.designacao}</p>
                  <p className="text-xs text-green-600">Duração: {selectedCourse.duracao}</p>
                  {selectedCourse.codigo.toString() !== mockEnrollmentData.codigo_Curso && (
                    <Badge variant="outline" className="mt-2 text-xs border-orange-300 text-orange-700">
                      Alterado
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhum curso selecionado</p>
                </div>
              )}

              {formData.data_Matricula && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Nova Data</h4>
                  <p className="text-sm font-semibold text-yellow-800">
                    {new Date(formData.data_Matricula).toLocaleDateString('pt-AO')}
                  </p>
                  {formData.data_Matricula !== mockEnrollmentData.data_Matricula && (
                    <Badge variant="outline" className="mt-2 text-xs border-orange-300 text-orange-700">
                      Alterado
                    </Badge>
                  )}
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Novo Status</h4>
                <Badge 
                  variant={formData.codigoStatus === "1" ? "default" : "secondary"}
                  className={formData.codigoStatus === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {formData.codigoStatus === "1" ? "Ativa" : "Inativa"}
                </Badge>
                {formData.codigoStatus !== mockEnrollmentData.codigoStatus && (
                  <Badge variant="outline" className="mt-2 ml-2 text-xs border-orange-300 text-orange-700">
                    Alterado
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Avisos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span>Avisos Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Alterar o aluno pode afetar confirmações existentes</p>
                <p>• Mudança de curso pode requerer nova confirmação de turma</p>
                <p>• Inativar a matrícula suspende o acesso do aluno</p>
                <p>• Todas as alterações são registradas no histórico</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
