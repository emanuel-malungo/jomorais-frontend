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
  UserCheck,
  ArrowLeft,
  Save,
  User,
  School,
  AlertCircle,
  Search,
  GraduationCap,
} from 'lucide-react';
import { useCreateConfirmation } from '@/hooks/useConfirmation';
import { useTurmas } from '@/hooks/useTurma';
import { IConfirmationInput } from '@/types/confirmation.types';
import api from '@/utils/api.utils';
export default function AddConfirmationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  
  // Hooks para dados do backend
  const { createConfirmation, loading: creatingConfirmation, error: confirmationError } = useCreateConfirmation();
  const { turmas, isLoading: loadingTurmas, fetchTurmas } = useTurmas();
  
  // Estados para dados carregados
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Estados para busca de turmas
  const [turmaSearch, setTurmaSearch] = useState("");
  const [turmaSearchResults, setTurmaSearchResults] = useState<any[]>([]);
  const [loadingTurmaSearch, setLoadingTurmaSearch] = useState(false);
  const [showTurmaSearchResults, setShowTurmaSearchResults] = useState(false);
  
  const [formData, setFormData] = useState<IConfirmationInput>({
    codigo_Matricula: 0,
    codigo_Turma: 0,
    data_Confirmacao: "",
    codigo_Ano_lectivo: 0,
    codigo_Utilizador: 1, // Temporário - deve ser o ID do usuário logado
    codigo_Status: 1,
    classificacao: "",
    mes_Comecar: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      console.log('Iniciando carregamento de dados...');
      
      // Testar conectividade com o backend
      try {
        console.log('Testando conectividade com backend...');
        console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
        const testResponse = await api.get('/api/student-management/test-data');
        console.log('Backend está respondendo:', testResponse.data);
        
        // Testar uma requisição POST simples
        console.log('Testando POST simples...');
        try {
          const testPost = await api.post('/api/student-management/confirmacoes', {
            codigo_Matricula: 2,
            codigo_Turma: 185,
            data_Confirmacao: "2025-10-01T00:00:00.000Z",
            codigo_Ano_lectivo: 4,
            codigo_Utilizador: 1,
            codigo_Status: 1,
            classificacao: "Teste"
          });
          console.log('POST teste funcionou:', testPost.data);
        } catch (postError: any) {
          console.log('POST teste falhou:', postError.response?.data);
        }
      } catch (error) {
        console.error('Erro ao conectar com backend:', error);
      }
      
      await loadAcademicYears();
      console.log('Dados carregados!');
    };
    loadData();
  }, []);

  // Função para buscar alunos matriculados
  const searchEnrollments = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setLoadingSearch(true);
      console.log('Buscando alunos:', searchTerm);
      
      const response = await api.get('/api/student-management/alunos-matriculados', {
        params: { search: searchTerm }
      });
      
      const data = response.data;
      if (data.success && data.data) {
        // Filtrar localmente por nome do aluno ou curso
        const filtered = data.data.filter((enrollment: any) =>
          enrollment.tb_alunos?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.tb_cursos?.designacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.tb_alunos?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        console.log(`${filtered.length} resultados encontrados para "${searchTerm}"`);
        setSearchResults(filtered.slice(0, 10)); // Limitar a 10 resultados
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Função para buscar turmas usando a API paginada
  const searchTurmas = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setTurmaSearchResults([]);
      setShowTurmaSearchResults(false);
      return;
    }

    try {
      setLoadingTurmaSearch(true);
      console.log('Buscando turmas:', searchTerm);
      
      // Tentar primeiro com parâmetro de busca
      let response;
      try {
        response = await api.get('/api/academic-management/turmas', {
          params: { search: searchTerm }
        });
      } catch (searchError) {
        console.log('Erro na busca com parâmetros, tentando buscar mais turmas:', searchError);
        // Fallback: carregar TODAS as turmas para busca completa
        try {
          // Primeiro, descobrir o total de turmas
          const firstPage = await api.get('/api/academic-management/turmas', { params: { page: 1, limit: 1 } });
          const totalItems = firstPage.data.pagination?.totalItems || 0;
          
          console.log(`Total de turmas no sistema: ${totalItems}`);
          
          // Carregar todas as turmas de uma vez com limit alto
          response = await api.get('/api/academic-management/turmas', { 
            params: { 
              page: 1, 
              limit: Math.max(totalItems, 500) // Garantir que pegue todas
            } 
          });
          
          console.log(`Carregadas ${response.data.data?.length || 0} turmas de uma vez`);
          
          // Mostrar estatísticas das classes
          if (response.data.success && response.data.data) {
            const uniqueClasses = [...new Set(response.data.data.map((t: any) => {
              const match = t.designacao?.match(/(\d+)ª/);
              return match ? match[1] : 'N/A';
            }))].filter(cls => cls !== 'N/A') as string[];
            console.log('Classes disponíveis:', uniqueClasses.sort((a, b) => parseInt(a) - parseInt(b)));
            
            // Contar turmas por classe
            const classCounts: Record<string, number> = {};
            uniqueClasses.forEach((cls: string) => {
              classCounts[cls] = response.data.data.filter((t: any) => t.designacao?.includes(`${cls}ª`)).length;
            });
            console.log('Turmas por classe:', classCounts);
          }
          
        } catch (fallbackError) {
          console.log('Erro no fallback completo, tentando com limite fixo:', fallbackError);
          response = await api.get('/api/academic-management/turmas', { params: { limit: 1000 } });
        }
      }
      
      const data = response.data;
      if (data.success && data.data) {
        // Se não conseguiu buscar com parâmetros, filtrar localmente
        let filteredTurmas = data.data;
        const hasSearchParam = response.config?.params?.search;
        if (!hasSearchParam) {
          console.log('Filtrando localmente. Primeiras 5 turmas:', data.data.slice(0, 5).map((t: any) => t.designacao));
          filteredTurmas = data.data.filter((turma: any) => {
            const match = turma.designacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turma.tb_classes?.designacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         turma.tb_cursos?.designacao?.toLowerCase().includes(searchTerm.toLowerCase());
            return match;
          });
          console.log('Turmas que passaram no filtro:', filteredTurmas.map((t: any) => t.designacao));
        }
        
        console.log(`${filteredTurmas.length} turmas encontradas para "${searchTerm}"`);
        setTurmaSearchResults(filteredTurmas.slice(0, 15)); // Limitar a 15 resultados
        setShowTurmaSearchResults(true);
      }
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setTurmaSearchResults([]);
    } finally {
      setLoadingTurmaSearch(false);
    }
  };

  const loadAcademicYears = async () => {
    try {
      setLoadingAcademicYears(true);
      console.log('Carregando anos letivos...');
      // Usar a API de anos letivos
      const response = await api.get('/api/academic-management/anos-lectivos');
      const data = response.data;
      console.log('Resposta da API de anos letivos:', data);
      if (data.success) {
        console.log('Anos letivos carregados:', data.data);
        setAcademicYears(data.data);
      } else {
        console.log('API retornou erro:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar anos letivos:', error);
    } finally {
      setLoadingAcademicYears(false);
    }
  };

  // Debounce para busca de matrículas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (enrollmentSearch) {
        searchEnrollments(enrollmentSearch);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [enrollmentSearch]);

  // Debounce para busca de turmas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (turmaSearch) {
        searchTurmas(turmaSearch);
      } else {
        setTurmaSearchResults([]);
        setShowTurmaSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [turmaSearch]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field.includes('codigo') ? parseInt(value.toString()) : value
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
    console.log('=== VALIDANDO FORMULÁRIO ===');
    console.log('Dados atuais:', formData);
    const newErrors: Record<string, string> = {};

    // Validações obrigatórias
    if (!formData.codigo_Matricula) {
      newErrors.codigo_Matricula = "Matrícula é obrigatória";
      console.log('❌ Matrícula não selecionada');
    } else {
      console.log('✅ Matrícula:', formData.codigo_Matricula);
    }
    
    if (!formData.codigo_Turma) {
      newErrors.codigo_Turma = "Turma é obrigatória";
      console.log('❌ Turma não selecionada');
    } else {
      console.log('✅ Turma:', formData.codigo_Turma);
    }
    
    if (!formData.data_Confirmacao) {
      newErrors.data_Confirmacao = "Data de confirmação é obrigatória";
      console.log('❌ Data não preenchida');
    } else {
      console.log('✅ Data:', formData.data_Confirmacao);
    }
    
    if (!formData.classificacao || formData.classificacao.trim() === '') {
      newErrors.classificacao = "Classificação é obrigatória";
      console.log('❌ Classificação não preenchida');
    } else {
      console.log('✅ Classificação:', formData.classificacao);
    }
    
    if (!formData.codigo_Ano_lectivo) {
      newErrors.codigo_Ano_lectivo = "Ano letivo é obrigatório";
      console.log('❌ Ano letivo não selecionado');
    } else {
      console.log('✅ Ano letivo:', formData.codigo_Ano_lectivo);
    }

    // Validar se a data não é futura
    if (formData.data_Confirmacao) {
      const today = new Date();
      const confirmationDate = new Date(formData.data_Confirmacao);
      if (confirmationDate > today) {
        newErrors.data_Confirmacao = "Data de confirmação não pode ser futura";
        console.log('❌ Data é futura');
      }
    }

    // Verificar se já existe confirmação para esta matrícula no ano letivo selecionado
    if (selectedEnrollment && selectedEnrollment.tb_confirmacoes) {
      const existingConfirmation = selectedEnrollment.tb_confirmacoes.find(
        (conf: any) => conf.codigo_Ano_lectivo === formData.codigo_Ano_lectivo
      );
      if (existingConfirmation) {
        newErrors.codigo_Ano_lectivo = "Já existe confirmação para esta matrícula neste ano letivo";
        console.log('❌ Confirmação já existe para este ano letivo');
      }
    }

    console.log('Erros de validação:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Formulário válido:', isValid);
    return isValid;
  };

  const handleSubmit = async () => {
    console.log('=== INICIANDO SUBMIT ===');
    console.log('Dados do formulário:', formData);
    
    if (!validateForm()) {
      console.log('Validação falhou, parando submit');
      return;
    }

    console.log('Validação passou, enviando para API...');

    try {
      // Preparar dados para envio
      const dataToSend: any = {
        codigo_Matricula: formData.codigo_Matricula,
        codigo_Turma: formData.codigo_Turma,
        data_Confirmacao: new Date(formData.data_Confirmacao).toISOString(),
        codigo_Ano_lectivo: formData.codigo_Ano_lectivo,
        codigo_Utilizador: formData.codigo_Utilizador,
        codigo_Status: formData.codigo_Status,
        classificacao: formData.classificacao
      };
      
      // Só adicionar mes_Comecar se tiver valor
      if (formData.mes_Comecar && formData.mes_Comecar.trim() !== '') {
        dataToSend.mes_Comecar = new Date(formData.mes_Comecar).toISOString();
      }
      
      console.log('Dados originais:', formData);
      console.log('Dados convertidos para envio:', dataToSend);
      
      // Usar o hook real para criar confirmação
      console.log('Chamando createConfirmation com:', dataToSend);
      const result = await createConfirmation(dataToSend);
      console.log('Confirmação criada com sucesso:', result);
      
      // Redirecionar para lista após sucesso
      router.push('/admin/student-management/confirmations');
    } catch (error) {
      console.error("Erro ao salvar confirmação:", error);
      // Mostrar erro para o usuário
      alert(`Erro ao salvar confirmação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // selectedClass removido - agora usamos selectedTurma

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
              
              <Button
                onClick={async () => {
                  console.log('=== TESTE DIRETO ===');
                  try {
                    const testData = {
                      codigo_Matricula: 2,
                      codigo_Turma: 185,
                      data_Confirmacao: "2025-10-01T00:00:00.000Z",
                      codigo_Ano_lectivo: 4,
                      codigo_Utilizador: 1,
                      codigo_Status: 1,
                      classificacao: "Teste Direto"
                    };
                    console.log('Testando com dados fixos:', testData);
                    const result = await createConfirmation(testData);
                    console.log('Teste direto funcionou:', result);
                    alert('Teste direto funcionou!');
                  } catch (error) {
                    console.error('Teste direto falhou:', error);
                    alert(`Teste direto falhou: ${error}`);
                  }
                }}
                variant="outline"
                className="px-6 py-3 rounded-xl font-semibold"
              >
                Teste Direto
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
              {/* Resultados da busca */}
              {showSearchResults && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Resultados da Busca
                  </label>
                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {loadingSearch ? (
                      <div className="p-4 text-center text-gray-500">
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((enrollment) => (
                        <div
                          key={enrollment.codigo}
                          className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedEnrollment(enrollment);
                            handleInputChange('codigo_Matricula', enrollment.codigo);
                            setShowSearchResults(false);
                            setEnrollmentSearch(enrollment.tb_alunos?.nome || '');
                          }}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{enrollment.tb_alunos?.nome}</span>
                              {enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {enrollment.tb_confirmacoes.length} confirmação(ões)
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {enrollment.tb_cursos?.designacao} • Matrícula: {new Date(enrollment.data_Matricula).toLocaleDateString('pt-AO')}
                            </span>
                            {enrollment.tb_alunos?.email && (
                              <span className="text-xs text-gray-400">
                                {enrollment.tb_alunos.email}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Nenhum resultado encontrado
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Matrícula selecionada */}
              {selectedEnrollment && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Matrícula Selecionada</h4>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-green-800">{selectedEnrollment.tb_alunos?.nome}</p>
                    <p className="text-xs text-green-600">{selectedEnrollment.tb_cursos?.designacao}</p>
                    <p className="text-xs text-green-600">
                      Matrícula: {new Date(selectedEnrollment.data_Matricula).toLocaleDateString('pt-AO')}
                    </p>
                    {selectedEnrollment.tb_alunos?.email && (
                      <p className="text-xs text-green-600">{selectedEnrollment.tb_alunos.email}</p>
                    )}
                  </div>
                </div>
              )}

              {errors.codigo_Matricula && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.codigo_Matricula}
                </p>
              )}
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
                    Buscar Turma *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Digite o nome da turma..."
                      value={turmaSearch}
                      onChange={(e) => setTurmaSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Resultados da busca de turmas */}
                  {showTurmaSearchResults && (
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                      {loadingTurmaSearch ? (
                        <div className="p-4 text-center text-gray-500">
                          Buscando turmas...
                        </div>
                      ) : turmaSearchResults.length > 0 ? (
                        turmaSearchResults.map((turma) => (
                          <div
                            key={turma.codigo}
                            className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              handleInputChange('codigo_Turma', turma.codigo);
                              setShowTurmaSearchResults(false);
                              setTurmaSearch(turma.designacao || '');
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{turma.designacao}</span>
                              <span className="text-xs text-gray-500">
                                {turma.tb_classes?.designacao} • {turma.tb_salas?.designacao} • {turma.tb_periodos?.designacao}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma turma encontrada
                        </div>
                      )}
                    </div>
                  )}
                  
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
                    value={formData.classificacao || undefined} 
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
                    value={formData.codigo_Ano_lectivo && formData.codigo_Ano_lectivo > 0 ? formData.codigo_Ano_lectivo.toString() : undefined} 
                    onValueChange={(value) => handleInputChange('codigo_Ano_lectivo', value)}
                  >
                    <SelectTrigger className={errors.codigo_Ano_lectivo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o ano letivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingAcademicYears ? (
                        <SelectItem value="loading" disabled>Carregando anos letivos...</SelectItem>
                      ) : academicYears && academicYears.length > 0 ? (
                        academicYears.map((year: any) => (
                          <SelectItem key={year.codigo} value={year.codigo.toString()}>
                            {year.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-years" disabled>Nenhum ano letivo disponível</SelectItem>
                      )}
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

              {/* Informação da turma selecionada já é mostrada na seção de busca */}

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
