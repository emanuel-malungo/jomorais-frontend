"use client";

import React, { useState, useEffect } from 'react';
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
import { useCourses } from '@/hooks/useCourse';
import { IMatriculaInput } from '@/types/matricula.types';
import api from '@/utils/api.utils';

export default function AddEnrollmentPage() {
  const router = useRouter();
  const [studentSearch, setStudentSearch] = useState("");
  
  // Estados para busca de alunos
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Hooks da API
  const { createMatricula, loading: createLoading } = useCreateMatricula();
  const { courses, loading: coursesLoading } = useCourses(1, 100);
  
  // Estado para cache de alunos
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');

  // Estados do formulário (simplificado - apenas campos necessários para matrícula)
  const [formData, setFormData] = useState({
    codigo_Aluno: "",
    codigo_Curso: "",
    data_Matricula: new Date().toISOString().split('T')[0],
    codigoStatus: "1",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para carregar alunos (múltiplas páginas)
  const loadStudents = async () => {
    if (studentsLoaded) return;
    
    try {
      setLoadingSearch(true);
      console.log('Carregando alunos para busca...');
      
      let allLoadedStudents: any[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      // Carregar múltiplas páginas para ter mais alunos
      while (hasMorePages && currentPage <= 20) { // Máximo 20 páginas (10000 alunos)
        setLoadingProgress(`Carregando página ${currentPage}...`);
        
        const response = await api.get('/api/student-management/alunos', {
          params: { page: currentPage, limit: 500 }
        });
        
        const data = response.data;
        if (data.success && data.data && data.data.length > 0) {
          allLoadedStudents = [...allLoadedStudents, ...data.data];
          
          // Verificar se há mais páginas
          if (data.pagination && currentPage < data.pagination.totalPages) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      }
      
      setAllStudents(allLoadedStudents);
      setStudentsLoaded(true);
      console.log(`${allLoadedStudents.length} alunos carregados para busca (${currentPage - 1} páginas)`);
      
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Função para filtrar alunos localmente
  const filterStudents = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = allStudents.filter((student: any) => {
      const nome = student.nome?.toLowerCase() || '';
      const email = student.email?.toLowerCase() || '';
      const telefone = student.telefone || '';
      const pai = student.pai?.toLowerCase() || '';
      const mae = student.mae?.toLowerCase() || '';
      const documento = student.n_documento_identificacao || '';
      
      return nome.includes(searchLower) ||
             email.includes(searchLower) ||
             telefone.includes(searchTerm) ||
             pai.includes(searchLower) ||
             mae.includes(searchLower) ||
             documento.includes(searchTerm);
    });
    
    console.log(`${filtered.length} resultados encontrados para "${searchTerm}"`);
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  // Carregar dados quando o componente monta
  useEffect(() => {
    loadStudents();
  }, []);

  // Debounce para busca de alunos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (studentSearch) {
        filterStudents(studentSearch);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [studentSearch, allStudents]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Formulário inválido:', errors);
      return;
    }

    try {
      // Validações adicionais antes do envio
      const alunoId = parseInt(formData.codigo_Aluno);
      const cursoId = parseInt(formData.codigo_Curso);
      const statusId = parseInt(formData.codigoStatus);
      
      if (isNaN(alunoId) || alunoId <= 0) {
        throw new Error('ID do aluno inválido');
      }
      if (isNaN(cursoId) || cursoId <= 0) {
        throw new Error('ID do curso inválido');
      }
      if (isNaN(statusId)) {
        throw new Error('Status inválido');
      }
      if (!formData.data_Matricula) {
        throw new Error('Data de matrícula é obrigatória');
      }
      
      // Verificar se o aluno selecionado existe
      if (!selectedStudent) {
        throw new Error('Nenhum aluno foi selecionado');
      }
      
      // Converter data para formato ISO datetime
      const dataMatricula = new Date(formData.data_Matricula + 'T00:00:00.000Z').toISOString();
      
      const matriculaData: IMatriculaInput = {
        codigo_Aluno: alunoId,
        codigo_Curso: cursoId,
        data_Matricula: dataMatricula,
        codigo_Utilizador: 49, // Usando usuário existente (Emanuel Malungo224)
        codigoStatus: statusId
      };
      
      console.log('=== DADOS PARA CRIAR MATRÍCULA ===');
      console.log('Dados que serão enviados para a API:', matriculaData);
      console.log('FormData original:', formData);
      console.log('Aluno selecionado:', selectedStudent);
      console.log('Conversão de data:', {
        dataOriginal: formData.data_Matricula,
        dataConvertida: dataMatricula,
        tipoDataConvertida: typeof dataMatricula
      });
      console.log('Validações:', {
        alunoValido: !isNaN(alunoId) && alunoId > 0,
        cursoValido: !isNaN(cursoId) && cursoId > 0,
        statusValido: !isNaN(statusId),
        dataValida: !!formData.data_Matricula
      });
      console.log('====================================');
      
      const result = await createMatricula(matriculaData);
      
      if (result) {
        console.log('Matrícula criada com sucesso:', result);
        // Redirecionar para a lista de matrículas
        router.push('/admin/student-management/enrolls');
      }
      
    } catch (error: any) {
      console.error('Erro ao criar matrícula:', error);
      
      // Tratar erros específicos
      if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Erro interno do servidor. Tente novamente.' });
      }
    }
  };

  const selectedCourse = courses?.find((c: any) => c.codigo.toString() === formData.codigo_Curso);

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Nova Matrícula</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Dados da Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Busca de Aluno */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Buscar Aluno *
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        {loadingSearch && !studentsLoaded && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
                        )}
                        <Input
                          placeholder={
                            studentsLoaded 
                              ? "Digite o nome, email ou documento do aluno..." 
                              : loadingProgress || "Carregando alunos..."
                          }
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="pl-10 pr-10"
                          disabled={!studentsLoaded}
                        />
                      </div>
                    </div>

                    {/* Resultados da busca */}
                    {showSearchResults && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Resultados da Busca {searchResults.length > 0 && `(${searchResults.length} encontrado${searchResults.length !== 1 ? 's' : ''})`}
                        </label>
                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                          {loadingSearch ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Buscando alunos...</span>
                              </div>
                            </div>
                          ) : searchResults.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="flex items-center justify-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Nenhum aluno encontrado</span>
                              </div>
                            </div>
                          ) : (
                            searchResults.map((student: any) => (
                              <div
                                key={student.codigo}
                                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  handleInputChange('codigo_Aluno', student.codigo.toString());
                                  setShowSearchResults(false);
                                  setStudentSearch(student.nome || '');
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">{student.nome}</span>
                                  <span className="text-sm text-gray-500">
                                    {student.email && `${student.email} • `}
                                    {student.telefone && `${student.telefone} • `}
                                    Doc: {student.n_documento_identificacao || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Aluno selecionado */}
                    {selectedStudent && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">Aluno Selecionado</h4>
                        <p className="text-sm font-semibold text-green-800">{selectedStudent.nome}</p>
                        <p className="text-xs text-green-600">
                          {selectedStudent.email && `${selectedStudent.email} • `}
                          {selectedStudent.telefone && `${selectedStudent.telefone} • `}
                          Doc: {selectedStudent.n_documento_identificacao || 'N/A'}
                        </p>
                      </div>
                    )}
                    
                    {errors.codigo_Aluno && (
                      <p className="text-sm text-red-600">{errors.codigo_Aluno}</p>
                    )}
                  </div>

                  {/* Curso */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Curso *
                    </label>
                    <Select 
                      value={formData.codigo_Curso} 
                      onValueChange={(value) => handleInputChange('codigo_Curso', value)}
                    >
                      <SelectTrigger className={errors.codigo_Curso ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {coursesLoading ? (
                          <div className="p-2 text-center text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Carregando cursos...
                          </div>
                        ) : courses && courses.length > 0 ? (
                          courses.map((course: any) => (
                            <SelectItem key={course.codigo} value={course.codigo.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{course.designacao}</span>
                                <span className="text-xs text-gray-500">
                                  {course.duracao_anos} ano{course.duracao_anos !== 1 ? 's' : ''} • 
                                  {course.tb_niveis_academicos?.designacao || 'N/A'}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">Nenhum curso disponível</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.codigo_Curso && (
                      <p className="text-sm text-red-600">{errors.codigo_Curso}</p>
                    )}
                  </div>

                  {/* Data de Matrícula */}
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
                      <p className="text-sm text-red-600">{errors.data_Matricula}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Status da Matrícula
                    </label>
                    <Select 
                      value={formData.codigoStatus} 
                      onValueChange={(value) => handleInputChange('codigoStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ativa</SelectItem>
                        <SelectItem value="0">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Erro de submissão */}
                  {errors.submit && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-600">{errors.submit}</p>
                      </div>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createLoading}
                      className="flex items-center space-x-2"
                    >
                      {createLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>{createLoading ? 'Criando...' : 'Criar Matrícula'}</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Resumo da Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedStudent && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Aluno</h4>
                    <p className="text-sm font-semibold text-green-800">{selectedStudent.nome}</p>
                    <p className="text-xs text-green-600">
                      {selectedStudent.email && `${selectedStudent.email}`}
                    </p>
                  </div>
                )}

                {selectedCourse && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Curso</h4>
                    <p className="text-sm font-semibold text-blue-800">{selectedCourse.designacao}</p>
                    <p className="text-xs text-blue-600">
                      {selectedCourse.duracao_anos} ano{selectedCourse.duracao_anos !== 1 ? 's' : ''} • 
                      {selectedCourse.tb_niveis_academicos?.designacao || 'N/A'}
                    </p>
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
          </div>
        </div>
      </div>
    </Container>
  );
}
