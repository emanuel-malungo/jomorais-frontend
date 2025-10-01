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
  GraduationCap,
  ArrowLeft,
  Save,
  User,
  BookOpen,
  AlertCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { useCreateMatricula } from '@/hooks/useMatricula';
import { useStudent } from '@/hooks/useStudent';
import { useCourses } from '@/hooks/useCourse';
import { IMatriculaInput } from '@/types/matricula.types';


export default function AddEnrollmentPage() {
  const router = useRouter();
  const [studentSearch, setStudentSearch] = useState("");
  
  // Hooks da API
  const { createMatricula, loading: createLoading } = useCreateMatricula();
  const { students, loading: studentsLoading, getAllStudents } = useStudent();
  const { courses, loading: coursesLoading } = useCourses(1, 100); // Carregar mais cursos para o select
  
  // Carregar dados iniciais
  React.useEffect(() => {
    getAllStudents(1, 100); // Carregar mais estudantes para o select
  }, [getAllStudents]);
  
  // Filtrar alunos baseado na busca
  const filteredStudents = studentSearch 
    ? students?.filter((student: any) =>
        student.nome.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email?.toLowerCase().includes(studentSearch.toLowerCase())
      ) || []
    : students || [];

  // Estados do formulário
  const [formData, setFormData] = useState({
    codigo_Aluno: "",
    codigo_Curso: "",
    data_Matricula: new Date().toISOString().split('T')[0],
    codigoStatus: "1",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


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

    try {
      const matriculaData: IMatriculaInput = {
        codigo_Aluno: parseInt(formData.codigo_Aluno),
        codigo_Curso: parseInt(formData.codigo_Curso),
        data_Matricula: formData.data_Matricula,
        codigoStatus: parseInt(formData.codigoStatus),
        codigo_Utilizador: 1 // TODO: Pegar do contexto de autenticação
      };
      
      await createMatricula(matriculaData);
      
      // Redirecionar para lista após sucesso
      router.push('/admin/student-management/enrolls');
    } catch (error) {
      console.error("Erro ao salvar matrícula:", error);
    }
  };

  const selectedStudent = students?.find((s: any) => s.codigo.toString() === formData.codigo_Aluno);
  const selectedCourse = courses?.find((c: any) => c.codigo.toString() === formData.codigo_Curso);

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
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Nova Matrícula
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Cadastrar Matrícula</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Preencha as informações necessárias para cadastrar uma nova matrícula no sistema.
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
                disabled={createLoading || studentsLoading || coursesLoading}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                {createLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Matrícula
                  </>
                )}
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
                <User className="h-5 w-5" />
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
                <GraduationCap className="h-5 w-5" />
                <span>Informações da Matrícula</span>
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
                      {coursesLoading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Carregando cursos...
                          </div>
                        </SelectItem>
                      ) : courses?.map((course: any) => (
                        <SelectItem key={course.codigo} value={course.codigo.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{course.designacao}</span>
                            <span className="text-xs text-gray-500">{course.duracao || 'Duração não informada'}</span>
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

        {/* Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Matrícula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStudent ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Aluno Selecionado</h4>
                  <p className="text-sm font-semibold text-blue-800">{selectedStudent.nome}</p>
                  <p className="text-xs text-blue-600">{selectedStudent.email}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhum aluno selecionado</p>
                </div>
              )}

              {selectedCourse ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Curso Selecionado</h4>
                  <p className="text-sm font-semibold text-green-800">{selectedCourse.designacao}</p>
                  <p className="text-xs text-green-600">Duração: {selectedCourse.duracao}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Nenhum curso selecionado</p>
                </div>
              )}

              {formData.data_Matricula && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Data de Matrícula</h4>
                  <p className="text-sm font-semibold text-yellow-800">
                    {new Date(formData.data_Matricula).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Status</h4>
                <Badge 
                  variant={formData.codigoStatus === "1" ? "default" : "secondary"}
                  className={formData.codigoStatus === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {formData.codigoStatus === "1" ? "Ativa" : "Inativa"}
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
                <p>• Verifique se o aluno não possui matrícula ativa em outro curso</p>
                <p>• A data de matrícula não pode ser futura</p>
                <p>• Após criar a matrícula, será necessário fazer a confirmação em uma turma</p>
                <p>• O status pode ser alterado posteriormente se necessário</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
