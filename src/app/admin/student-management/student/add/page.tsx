"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import useStudent from '@/hooks/useStudent';
import { useGeographic } from '@/hooks/useGeographic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  UserPlus,
  ArrowLeft,
  Save,
  User,
  FileText,
  Users,
  AlertCircle,
} from 'lucide-react';

// Hooks para dados que ainda não têm API
const useEncarregados = () => {
  // Mock - deve ser substituído por hook real
  return {
    encarregados: [
      { codigo: 1, nome: "João Silva" },
      { codigo: 2, nome: "Maria Santos" },
      { codigo: 3, nome: "Pedro Costa" },
    ],
    loading: false
  };
};

const useUtilizadores = () => {
  // Mock - deve ser substituído por hook real
  return {
    utilizadores: [
      { codigo: 1, nome: "Admin Sistema" },
      { codigo: 2, nome: "Secretário" },
    ],
    loading: false
  };
};

// Dados mockados para tipos de documento
const documentTypes = [
  { codigo: 1, designacao: "Bilhete de Identidade" },
  { codigo: 2, designacao: "Passaporte" },
  { codigo: 3, designacao: "Certidão de Nascimento" },
];

export default function AddStudentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const { createStudent, loading, error } = useStudent();
  
  // Hooks geográficos
  const { 
    nacionalidades, 
    provincias,
    municipios,
    comunas 
  } = useGeographic();

  // Hooks para dados relacionados
  const { encarregados } = useEncarregados();
  const { utilizadores } = useUtilizadores();

  // Estados para seleções hierárquicas
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | undefined>();
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<number | undefined>();

  // Estados do formulário baseado nos campos da API
  const [formData, setFormData] = useState({
    nome: "",
    pai: "",
    mae: "",
    codigo_Nacionalidade: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    codigo_Comuna: "",
    codigo_Encarregado: "",
    codigo_Utilizador: "",
    sexo: "",
    n_documento_identificacao: "",
    saldo: 0,
    morada: "",
    codigoTipoDocumento: "",
    
    // Campos auxiliares para hierarquia geográfica
    provincia: "",
    municipio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Lógica para hierarquia geográfica
    if (field === 'provincia') {
      const provinciaId = parseInt(value);
      setSelectedProvinciaId(provinciaId);
      setSelectedMunicipioId(undefined);
      setFormData(prev => ({
        ...prev,
        municipio: "",
        codigo_Comuna: ""
      }));
      // Buscar municípios da província selecionada
      municipios.getMunicipiosByProvincia(provinciaId);
    }
    
    if (field === 'municipio') {
      const municipioId = parseInt(value);
      setSelectedMunicipioId(municipioId);
      setFormData(prev => ({
        ...prev,
        codigo_Comuna: ""
      }));
      // Buscar comunas do município selecionado
      comunas.getComunasByMunicipio(municipioId);
    }
    
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
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.sexo) newErrors.sexo = "Sexo é obrigatório";
    if (!formData.codigo_Nacionalidade) newErrors.codigo_Nacionalidade = "Nacionalidade é obrigatória";
    if (!formData.codigo_Comuna) newErrors.codigo_Comuna = "Comuna é obrigatória";
    if (!formData.codigoTipoDocumento) newErrors.codigoTipoDocumento = "Tipo de documento é obrigatório";
    if (!formData.n_documento_identificacao.trim()) newErrors.n_documento_identificacao = "Número do documento é obrigatório";
    if (!formData.codigo_Encarregado) newErrors.codigo_Encarregado = "Encarregado é obrigatório";

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Criar objeto Student baseado nos campos esperados pela API
      const studentData = {
        nome: formData.nome,
        pai: formData.pai || undefined,
        mae: formData.mae || undefined,
        codigo_Nacionalidade: parseInt(formData.codigo_Nacionalidade),
        dataNascimento: formData.dataNascimento,
        email: formData.email || undefined,
        telefone: formData.telefone || undefined,
        codigo_Comuna: parseInt(formData.codigo_Comuna),
        codigo_Encarregado: parseInt(formData.codigo_Encarregado),
        codigo_Utilizador: parseInt(formData.codigo_Utilizador) || 1, // Temporário
        sexo: formData.sexo,
        n_documento_identificacao: formData.n_documento_identificacao,
        saldo: formData.saldo,
        morada: formData.morada || undefined,
        codigoTipoDocumento: parseInt(formData.codigoTipoDocumento)
      };
      
      await createStudent(studentData as any);
      
      if (!error) {
        // Redirecionar para lista após sucesso
        router.push('/admin/student-management/student');
      }
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
    }
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
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Adicionar Aluno
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Novo Estudante</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Preencha todas as informações necessárias para cadastrar um novo aluno no sistema.
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
                disabled={loading}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? "Salvando..." : "Salvar Aluno"}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 font-medium">Erro ao salvar aluno</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Formulário em Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <Input
                    placeholder="Digite o nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.nome}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sexo *
                  </label>
                  <Select value={formData.sexo} onValueChange={(value) => handleInputChange('sexo', value)}>
                    <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sexo && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.sexo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Data de Nascimento *
                  </label>
                  <Input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    className={errors.dataNascimento ? "border-red-500" : ""}
                  />
                  {errors.dataNascimento && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.dataNascimento}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <Input
                    placeholder="9XX XXX XXX"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.telefone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nome do Pai
                  </label>
                  <Input
                    placeholder="Nome do pai"
                    value={formData.pai}
                    onChange={(e) => handleInputChange('pai', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nome da Mãe
                  </label>
                  <Input
                    placeholder="Nome da mãe"
                    value={formData.mae}
                    onChange={(e) => handleInputChange('mae', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nacionalidade *
                  </label>
                  <Select value={formData.codigo_Nacionalidade} onValueChange={(value) => handleInputChange('codigo_Nacionalidade', value)}>
                    <SelectTrigger className={errors.codigo_Nacionalidade ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a nacionalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {nacionalidades.loading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : (
                        nacionalidades.nacionalidades?.filter(n => n.id).map((nacionalidade) => (
                          <SelectItem key={nacionalidade.id} value={nacionalidade.id.toString()}>
                            {nacionalidade.nome}
                          </SelectItem>
                        )) || []
                      )}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Nacionalidade && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Nacionalidade}
                    </p>
                  )}
                </div>



                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Província *
                  </label>
                  <Select value={formData.provincia} onValueChange={(value) => handleInputChange('provincia', value)}>
                    <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a província" />
                    </SelectTrigger>
                    <SelectContent>
                      {provincias.loading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : (
                        provincias.provincias?.filter(p => p.id).map((provincia) => (
                          <SelectItem key={provincia.id} value={provincia.id.toString()}>
                            {provincia.nome}
                          </SelectItem>
                        )) || []
                      )}
                    </SelectContent>
                  </Select>
                  {errors.provincia && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.provincia}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Município *
                  </label>
                  <Select 
                    value={formData.municipio} 
                    onValueChange={(value) => handleInputChange('municipio', value)}
                    disabled={!selectedProvinciaId}
                  >
                    <SelectTrigger className={errors.municipio ? "border-red-500" : ""}>
                      <SelectValue placeholder={!selectedProvinciaId ? "Selecione primeiro a província" : "Selecione o município"} />
                    </SelectTrigger>
                    <SelectContent>
                      {municipios.loading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : (
                        municipios.municipios
                          ?.filter(municipio => municipio.id && municipio.provincia_id === selectedProvinciaId)
                          ?.map((municipio) => (
                            <SelectItem key={municipio.id} value={municipio.id.toString()}>
                              {municipio.nome}
                            </SelectItem>
                          )) || []
                      )}
                    </SelectContent>
                  </Select>
                  {errors.municipio && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.municipio}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Comuna *
                  </label>
                  <Select 
                    value={formData.codigo_Comuna} 
                    onValueChange={(value) => handleInputChange('codigo_Comuna', value)}
                    disabled={!selectedMunicipioId}
                  >
                    <SelectTrigger className={errors.codigo_Comuna ? "border-red-500" : ""}>
                      <SelectValue placeholder={!selectedMunicipioId ? "Selecione primeiro o município" : "Selecione a comuna"} />
                    </SelectTrigger>
                    <SelectContent>
                      {comunas.loading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : (
                        comunas.comunas
                          ?.filter(comuna => comuna.id && comuna.municipio_id === selectedMunicipioId)
                          ?.map((comuna) => (
                            <SelectItem key={comuna.id} value={comuna.id.toString()}>
                              {comuna.nome}
                            </SelectItem>
                          )) || []
                      )}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Comuna && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Comuna}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <Input
                    placeholder="Endereço completo"
                    value={formData.morada}
                    onChange={(e) => handleInputChange('morada', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Documentos de Identificação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tipo de Documento *
                  </label>
                  <Select value={formData.codigoTipoDocumento} onValueChange={(value) => handleInputChange('codigoTipoDocumento', value)}>
                    <SelectTrigger className={errors.codigoTipoDocumento ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((doc) => (
                        <SelectItem key={doc.codigo} value={doc.codigo.toString()}>
                          {doc.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigoTipoDocumento && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigoTipoDocumento}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Número do Documento *
                  </label>
                  <Input
                    placeholder="Número do documento"
                    value={formData.n_documento_identificacao}
                    onChange={(e) => handleInputChange('n_documento_identificacao', e.target.value)}
                    className={errors.n_documento_identificacao ? "border-red-500" : ""}
                  />
                  {errors.n_documento_identificacao && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.n_documento_identificacao}
                    </p>
                  )}
                </div>


              </div>
            </CardContent>
          </Card>
        </TabsContent>

                {/* Tab Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Informações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Encarregado *
                  </label>
                  <Select value={formData.codigo_Encarregado} onValueChange={(value) => handleInputChange('codigo_Encarregado', value)}>
                    <SelectTrigger className={errors.codigo_Encarregado ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o encarregado" />
                    </SelectTrigger>
                    <SelectContent>
                      {encarregados.map((encarregado) => (
                        <SelectItem key={encarregado.codigo} value={encarregado.codigo.toString()}>
                          {encarregado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Encarregado && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Encarregado}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Utilizador Responsável *
                  </label>
                  <Select value={formData.codigo_Utilizador} onValueChange={(value) => handleInputChange('codigo_Utilizador', value)}>
                    <SelectTrigger className={errors.codigo_Utilizador ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o utilizador" />
                    </SelectTrigger>
                    <SelectContent>
                      {utilizadores.map((utilizador) => (
                        <SelectItem key={utilizador.codigo} value={utilizador.codigo.toString()}>
                          {utilizador.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.codigo_Utilizador && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.codigo_Utilizador}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Saldo Inicial
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.saldo}
                    onChange={(e) => handleInputChange('saldo', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      
      </Tabs>
    </Container>
  );
}
