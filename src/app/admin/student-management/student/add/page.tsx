"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Container from '@/components/layout/Container';
import useStudent from '@/hooks/useStudent';
import { useGeographic } from '@/hooks/useGeographic';
import { useDocumentTypes } from '@/hooks/useDocument';
import { addStudentSchema } from '@/validations/student-management.validatios';
import * as yup from 'yup';
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

type AddStudentFormData = yup.InferType<typeof addStudentSchema>;

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



export default function AddStudentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const { createStudent, loading, error } = useStudent();
  
  // Configuração do react-hook-form com yupResolver
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(addStudentSchema),
    mode: 'onChange',
    defaultValues: {
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
      provincia: "",
      municipio: "",
    }
  });
  
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
  const { documentTypes, loading: loadingDocumentTypes } = useDocumentTypes();

  // Estados para seleções hierárquicas
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | undefined>();
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<number | undefined>();

  // Observar mudanças nos campos de hierarquia geográfica
  const watchProvincia = watch("provincia");
  const watchMunicipio = watch("municipio");

  // Lógica para hierarquia geográfica
  useEffect(() => {
    if (watchProvincia) {
      const provinciaId = parseInt(watchProvincia);
      setSelectedProvinciaId(provinciaId);
      setSelectedMunicipioId(undefined);
      setValue("municipio", "");
      setValue("codigo_Comuna", "");
      // Buscar municípios da província selecionada
      municipios.getMunicipiosByProvincia(provinciaId);
    }
  }, [watchProvincia, municipios, setValue]);

  useEffect(() => {
    if (watchMunicipio) {
      const municipioId = parseInt(watchMunicipio);
      setSelectedMunicipioId(municipioId);
      setValue("codigo_Comuna", "");
      // Buscar comunas do município selecionado
      comunas.getComunasByMunicipio(municipioId);
    }
  }, [watchMunicipio, comunas, setValue]);

  const onSubmit = async (data: any) => {
    try {
      // Criar objeto Student baseado nos campos esperados pela API
      const studentData = {
        nome: data.nome,
        pai: data.pai || undefined,
        mae: data.mae || undefined,
        codigo_Nacionalidade: parseInt(data.codigo_Nacionalidade),
        dataNascimento: data.dataNascimento,
        email: data.email || undefined,
        telefone: data.telefone || undefined,
        codigo_Comuna: parseInt(data.codigo_Comuna),
        codigo_Encarregado: parseInt(data.codigo_Encarregado),
        codigo_Utilizador: parseInt(data.codigo_Utilizador || "1"), // Temporário
        sexo: data.sexo,
        n_documento_identificacao: data.n_documento_identificacao,
        saldo: data.saldo || 0,
        morada: data.morada || undefined,
        codigoTipoDocumento: parseInt(data.codigoTipoDocumento)
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
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading || isSubmitting}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading || isSubmitting ? "Salvando..." : "Salvar Aluno"}
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nome Completo *
                    </label>
                    <Controller
                      name="nome"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Digite o nome completo"
                          {...field}
                          className={errors.nome ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.nome?.message}
                      </p>
                    )}
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Sexo *
                    </label>
                    <Controller
                      name="sexo"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione o sexo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.sexo && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.sexo?.message}
                      </p>
                    )}
                  </div>

                  {/* Data de Nascimento */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Data de Nascimento *
                    </label>
                    <Controller
                      name="dataNascimento"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          {...field}
                          className={errors.dataNascimento ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.dataNascimento && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.dataNascimento?.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="email"
                          placeholder="exemplo@email.com"
                          {...field}
                          className={errors.email ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email?.message}
                      </p>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Telefone *
                    </label>
                    <Controller
                      name="telefone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="9XX XXX XXX"
                          {...field}
                          className={errors.telefone ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.telefone?.message}
                      </p>
                    )}
                  </div>

                  {/* Nome do Pai */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nome do Pai
                    </label>
                    <Controller
                      name="pai"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Nome do pai"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  {/* Nome da Mãe */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nome da Mãe
                    </label>
                    <Controller
                      name="mae"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Nome da mãe"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  {/* Nacionalidade */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nacionalidade *
                    </label>
                    <Controller
                      name="codigo_Nacionalidade"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={errors.codigo_Nacionalidade ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a nacionalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {nacionalidades.loading ? (
                              <SelectItem value="loading-nacionalidades" disabled>Carregando...</SelectItem>
                            ) : nacionalidades.nacionalidades && nacionalidades.nacionalidades.length > 0 ? (
                              nacionalidades.nacionalidades.filter(n => n.codigo || n.id).map((nacionalidade) => {
                                const key = nacionalidade.codigo || nacionalidade.id;
                                const value = nacionalidade.codigo || nacionalidade.id;
                                const label = nacionalidade.designacao || nacionalidade.nome;
                                return (
                                  <SelectItem key={key} value={value?.toString() || ''}>
                                    {label}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <SelectItem value="no-nacionalidades" disabled>Nenhuma nacionalidade disponível</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.codigo_Nacionalidade && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.codigo_Nacionalidade?.message}
                      </p>
                    )}
                  </div>

                  {/* Província */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Província *
                    </label>
                    <Controller
                      name="provincia"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a província" />
                          </SelectTrigger>
                          <SelectContent>
                            {provincias.loading ? (
                              <SelectItem value="loading-provincias" disabled>Carregando...</SelectItem>
                            ) : provincias.provincias && provincias.provincias.length > 0 ? (
                              provincias.provincias.filter(p => p.codigo || p.id).map((provincia) => {
                                const key = provincia.codigo || provincia.id;
                                const value = provincia.codigo || provincia.id;
                                const label = provincia.designacao || provincia.nome;
                                return (
                                  <SelectItem key={key} value={value?.toString() || ''}>
                                    {label}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <SelectItem value="no-provincias" disabled>Nenhuma província disponível</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.provincia && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.provincia?.message}
                      </p>
                    )}
                  </div>

                  {/* Município */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Município *
                    </label>
                    <Controller
                      name="municipio"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          disabled={!selectedProvinciaId}
                        >
                          <SelectTrigger className={errors.municipio ? "border-red-500" : ""}>
                            <SelectValue placeholder={!selectedProvinciaId ? "Selecione primeiro a província" : "Selecione o município"} />
                          </SelectTrigger>
                          <SelectContent>
                            {municipios.loading ? (
                              <SelectItem value="loading-municipios" disabled>Carregando...</SelectItem>
                            ) : municipios.municipios && municipios.municipios.length > 0 ? (
                              municipios.municipios
                                .filter(municipio => (municipio.codigo || municipio.id) && municipio.provincia_id === selectedProvinciaId)
                                .map((municipio) => {
                                  const key = municipio.codigo || municipio.id;
                                  const value = municipio.codigo || municipio.id;
                                  const label = municipio.designacao || municipio.nome;
                                  return (
                                    <SelectItem key={key} value={value?.toString() || ''}>
                                      {label}
                                    </SelectItem>
                                  );
                                })
                            ) : (
                              <SelectItem value="no-municipios" disabled>
                                {!selectedProvinciaId ? "Selecione primeiro uma província" : "Nenhum município disponível"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.municipio && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.municipio?.message}
                      </p>
                    )}
                  </div>

                  {/* Comuna */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Comuna *
                    </label>
                    <Controller
                      name="codigo_Comuna"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          disabled={!selectedMunicipioId}
                        >
                          <SelectTrigger className={errors.codigo_Comuna ? "border-red-500" : ""}>
                            <SelectValue placeholder={!selectedMunicipioId ? "Selecione primeiro o município" : "Selecione a comuna"} />
                          </SelectTrigger>
                          <SelectContent>
                            {comunas.loading ? (
                              <SelectItem value="loading-comunas" disabled>Carregando...</SelectItem>
                            ) : comunas.comunas && comunas.comunas.length > 0 ? (
                              comunas.comunas
                                .filter(comuna => (comuna.codigo || comuna.id) && comuna.municipio_id === selectedMunicipioId)
                                .map((comuna) => {
                                  const key = comuna.codigo || comuna.id;
                                  const value = comuna.codigo || comuna.id;
                                  const label = comuna.designacao || comuna.nome;
                                  return (
                                    <SelectItem key={key} value={value?.toString() || ''}>
                                      {label}
                                    </SelectItem>
                                  );
                                })
                            ) : (
                              <SelectItem value="no-comunas" disabled>
                                {!selectedMunicipioId ? "Selecione primeiro um município" : "Nenhuma comuna disponível"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.codigo_Comuna && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.codigo_Comuna?.message}
                      </p>
                    )}
                  </div>

                  {/* Endereço */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <Controller
                      name="morada"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Endereço completo"
                          {...field}
                        />
                      )}
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
                  {/* Tipo de Documento */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tipo de Documento *
                    </label>
                    <Controller
                      name="codigoTipoDocumento"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={errors.codigoTipoDocumento ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione o tipo de documento" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingDocumentTypes ? (
                              <SelectItem value="loading-documentos" disabled>Carregando...</SelectItem>
                            ) : documentTypes.length > 0 ? (
                              documentTypes.map((doc) => (
                                <SelectItem key={doc.codigo} value={doc.codigo.toString()}>
                                  {doc.designacao}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-documentos" disabled>Nenhum tipo de documento disponível</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.codigoTipoDocumento && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.codigoTipoDocumento?.message}
                      </p>
                    )}
                  </div>

                  {/* Número do Documento */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Número do Documento *
                    </label>
                    <Controller
                      name="n_documento_identificacao"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="Número do documento"
                          {...field}
                          className={errors.n_documento_identificacao ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.n_documento_identificacao && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.n_documento_identificacao?.message}
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
                  {/* Encarregado */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Encarregado *
                    </label>
                    <Controller
                      name="codigo_Encarregado"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      )}
                    />
                    {errors.codigo_Encarregado && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.codigo_Encarregado?.message}
                      </p>
                    )}
                  </div>

                  {/* Utilizador Responsável */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Utilizador Responsável
                    </label>
                    <Controller
                      name="codigo_Utilizador"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
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
                      )}
                    />
                  </div>

                  {/* Saldo Inicial */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Saldo Inicial
                    </label>
                    <Controller
                      name="saldo"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          min="0"
                          step="0.01"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Container>
  );
}