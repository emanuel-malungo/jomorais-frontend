"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { Save, BookOpen, Clock, Target, FileText, Users, CheckSquare, X, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { disciplinaSchema, DisciplinaFormData } from "@/validations/disciplina.validations";

export default function DisciplinasNovaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(disciplinaSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      carga_horaria_semanal: 0,
      carga_horaria_total: 0,
      area_conhecimento: "",
      nivel_ensino: [],
      classes_aplicaveis: [],
      pre_requisitos: [],
      objetivos: "",
      ementa: "",
      metodologia: "",
      criterios_avaliacao: "",
      bibliografia: "",
      status: "ativa",
      observacoes: "",
    },
  });

  // Disciplinas mock para pré-requisitos
  const disciplinasDisponiveis = [
    { id: "1", nome: "Matemática", codigo: "MAT" },
    { id: "2", nome: "Português", codigo: "POR" },
    { id: "3", nome: "Física", codigo: "FIS" },
    { id: "4", nome: "Química", codigo: "QUI" },
    { id: "5", nome: "Biologia", codigo: "BIO" },
    { id: "6", nome: "História", codigo: "HIS" },
    { id: "7", nome: "Geografia", codigo: "GEO" },
    { id: "8", nome: "Inglês", codigo: "ING" },
  ];

  const [preRequisitoSearch, setPreRequisitoSearch] = useState("");
  const [showPreRequisitos, setShowPreRequisitos] = useState(false);
  const [classeSearch, setClasseSearch] = useState("");
  const [showClasses, setShowClasses] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const classeDropdownRef = useRef<HTMLDivElement>(null);

  const filteredPreRequisitos = disciplinasDisponiveis.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(preRequisitoSearch.toLowerCase()) ||
    disciplina.codigo.toLowerCase().includes(preRequisitoSearch.toLowerCase())
  );

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPreRequisitos(false);
      }
      if (classeDropdownRef.current && !classeDropdownRef.current.contains(event.target as Node)) {
        setShowClasses(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePreRequisitoAdd = (disciplinaId: string) => {
    const currentPreRequisitos = watch("pre_requisitos") || [];
    if (!currentPreRequisitos.includes(disciplinaId)) {
      setValue("pre_requisitos", [...currentPreRequisitos, disciplinaId]);
    }
    setPreRequisitoSearch("");
    setShowPreRequisitos(false);
  };

  const handlePreRequisitoRemove = (disciplinaId: string) => {
    const currentPreRequisitos = watch("pre_requisitos") || [];
    setValue("pre_requisitos", currentPreRequisitos.filter(id => id !== disciplinaId));
  };

  const getSelectedPreRequisitos = () => {
    const selectedIds = watch("pre_requisitos") || [];
    return disciplinasDisponiveis.filter(d => selectedIds.includes(d.id));
  };

  const handleNivelEnsinoChange = (nivel: string, checked: boolean) => {
    const currentNiveis = watch("nivel_ensino") || [];
    if (checked) {
      setValue("nivel_ensino", [...currentNiveis, nivel]);
    } else {
      setValue("nivel_ensino", currentNiveis.filter(n => n !== nivel));
    }
  };

  const handleClasseAdd = (classeId: string) => {
    const currentClasses = watch("classes_aplicaveis") || [];
    if (!currentClasses.includes(classeId)) {
      setValue("classes_aplicaveis", [...currentClasses, classeId]);
    }
    setClasseSearch("");
    setShowClasses(false);
  };

  const handleClasseRemove = (classeId: string) => {
    const currentClasses = watch("classes_aplicaveis") || [];
    setValue("classes_aplicaveis", currentClasses.filter(id => id !== classeId));
  };

  const getSelectedClasses = () => {
    const selectedIds = watch("classes_aplicaveis") || [];
    return classes.filter(c => selectedIds.includes(c.id));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Aqui seria feita a chamada à API para criar a disciplina
      console.log("Dados da nova disciplina:", data);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      success("Sucesso!", "Disciplina criada com sucesso");
      
      // Aguardar um pouco para mostrar o toast antes de redirecionar
      setTimeout(() => {
        router.push("/disciplinas");
      }, 1000);
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
      error("Erro", "Não foi possível criar a disciplina. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const niveisEnsino = [
    { value: "ensino_primario", label: "Ensino Primário" },
    { value: "ensino_secundario_1", label: "1º Ciclo do Ensino Secundário" },
    { value: "ensino_secundario_2", label: "2º Ciclo do Ensino Secundário" },
    { value: "ensino_pre_universitario", label: "Ensino Pré-Universitário" }
  ];

  const classes = [
    { id: "1", nome: "1ª Classe", nivel: "Ensino Primário" },
    { id: "2", nome: "2ª Classe", nivel: "Ensino Primário" },
    { id: "3", nome: "3ª Classe", nivel: "Ensino Primário" },
    { id: "4", nome: "4ª Classe", nivel: "Ensino Primário" },
    { id: "5", nome: "5ª Classe", nivel: "Ensino Primário" },
    { id: "6", nome: "6ª Classe", nivel: "Ensino Primário" },
    { id: "7", nome: "7ª Classe", nivel: "1º Ciclo Secundário" },
    { id: "8", nome: "8ª Classe", nivel: "1º Ciclo Secundário" },
    { id: "9", nome: "9ª Classe", nivel: "1º Ciclo Secundário" },
    { id: "10", nome: "10ª Classe", nivel: "2º Ciclo Secundário" },
    { id: "11", nome: "11ª Classe", nivel: "2º Ciclo Secundário" },
    { id: "12", nome: "12ª Classe", nivel: "2º Ciclo Secundário" },
    { id: "13", nome: "13ª Classe", nivel: "Pré-Universitário" }
  ];

  const filteredClasses = classes.filter(classe =>
    classe.nome.toLowerCase().includes(classeSearch.toLowerCase()) ||
    classe.nivel.toLowerCase().includes(classeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-9xl mx-auto p-1">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-8">
            
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Nome da Disciplina - Ocupa 2 colunas */}
              <div className="md:col-span-2 lg:col-span-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome da Disciplina *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Digite o nome da disciplina"
                  className={`mt-1 ${errors.nome ? "border-red-500" : ""}`}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                )}
              </div>
              
              {/* Código */}
              <div>
                <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">Código *</Label>
                <Input
                  id="codigo"
                  {...register("codigo")}
                  placeholder="Ex: MAT, POR, FIS"
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setValue("codigo", value);
                  }}
                  className={`mt-1 ${errors.codigo ? "border-red-500" : ""}`}
                />
                {errors.codigo && (
                  <p className="text-sm text-red-500 mt-1">{errors.codigo.message}</p>
                )}
              </div>
              
              {/* Carga Horária Semanal */}
              <div>
                <Label htmlFor="carga_horaria_semanal" className="text-sm font-medium text-gray-700">Carga Horária Semanal *</Label>
                <Input
                  id="carga_horaria_semanal"
                  type="number"
                  min="1"
                  max="10"
                  {...register("carga_horaria_semanal")}
                  placeholder="Horas por semana"
                  className={`mt-1 ${errors.carga_horaria_semanal ? "border-red-500" : ""}`}
                />
                {errors.carga_horaria_semanal && (
                  <p className="text-sm text-red-500 mt-1">{errors.carga_horaria_semanal.message}</p>
                )}
              </div>
              
              {/* Carga Horária Total */}
              <div>
                <Label htmlFor="carga_horaria_total" className="text-sm font-medium text-gray-700">Carga Horária Total *</Label>
                <Input
                  id="carga_horaria_total"
                  type="number"
                  min="10"
                  max="500"
                  {...register("carga_horaria_total")}
                  placeholder="Total de horas"
                  className={`mt-1 ${errors.carga_horaria_total ? "border-red-500" : ""}`}
                />
                {errors.carga_horaria_total && (
                  <p className="text-sm text-red-500 mt-1">{errors.carga_horaria_total.message}</p>
                )}
              </div>
              
              {/* Área de Conhecimento */}
              <div>
                <Label htmlFor="area_conhecimento" className="text-sm font-medium text-gray-700">Área de Conhecimento *</Label>
                <Select 
                  value={watch("area_conhecimento")} 
                  onValueChange={(value) => setValue("area_conhecimento", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.area_conhecimento ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linguagens">Linguagens</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="ciencias_natureza">Ciências da Natureza</SelectItem>
                    <SelectItem value="ciencias_humanas">Ciências Humanas</SelectItem>
                    <SelectItem value="ensino_religioso">Ensino Religioso</SelectItem>
                    <SelectItem value="educacao_fisica">Educação Física</SelectItem>
                    <SelectItem value="artes">Artes</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
                {errors.area_conhecimento && (
                  <p className="text-sm text-red-500 mt-1">{errors.area_conhecimento.message}</p>
                )}
              </div>
            </div>

            {/* Separador - Aplicabilidade */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aplicabilidade</h3>
              
              {/* Nível de Ensino */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700">Nível de Ensino *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {niveisEnsino.map((nivel) => {
                    const isSelected = (watch("nivel_ensino") || []).includes(nivel.value);
                    return (
                      <label key={nivel.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleNivelEnsinoChange(nivel.value, e.target.checked)}
                          className="rounded border-gray-300 text-[#3B6C4D] focus:ring-[#3B6C4D]"
                        />
                        <span className="text-sm text-gray-700">{nivel.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.nivel_ensino && (
                  <p className="text-sm text-red-500 mt-1">{errors.nivel_ensino.message}</p>
                )}
              </div>
              
              {/* Classes Aplicáveis */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700">Classes Aplicáveis *</Label>
                
                {/* Classes selecionadas */}
                <div className="mt-2 mb-3">
                  {getSelectedClasses().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedClasses().map((classe) => (
                        <div key={classe.id} className="inline-flex items-center gap-1 bg-[#3B6C4D] text-white px-3 py-1 rounded-full text-sm">
                          <span>{classe.nome}</span>
                          <button
                            type="button"
                            onClick={() => handleClasseRemove(classe.id)}
                            className="ml-1 hover:bg-[#2d5016] rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhuma classe selecionada</p>
                  )}
                </div>

                {/* Combobox para adicionar classes */}
                <div className="relative" ref={classeDropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar classes..."
                      value={classeSearch}
                      onChange={(e) => {
                        setClasseSearch(e.target.value);
                        setShowClasses(true);
                      }}
                      onFocus={() => setShowClasses(true)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClasses(!showClasses)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Dropdown de classes */}
                  {showClasses && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredClasses.length > 0 ? (
                        filteredClasses.map((classe) => {
                          const isSelected = (watch("classes_aplicaveis") || []).includes(classe.id);
                          return (
                            <button
                              key={classe.id}
                              type="button"
                              onClick={() => handleClasseAdd(classe.id)}
                              disabled={isSelected}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                                isSelected ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <div>
                                <div className="font-medium text-sm">{classe.nome}</div>
                                <div className="text-xs text-gray-500">Nível: {classe.nivel}</div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-[#3B6C4D]" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Nenhuma classe encontrada
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {errors.classes_aplicaveis && (
                  <p className="text-sm text-red-500 mt-1">{errors.classes_aplicaveis.message}</p>
                )}
              </div>
              
              {/* Pré-requisitos */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Pré-requisitos</Label>
                
                {/* Pré-requisitos selecionados */}
                <div className="mt-2 mb-3">
                  {getSelectedPreRequisitos().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedPreRequisitos().map((disciplina) => (
                        <div key={disciplina.id} className="inline-flex items-center gap-1 bg-[#3B6C4D] text-white px-3 py-1 rounded-full text-sm">
                          <span>{disciplina.nome}</span>
                          <button
                            type="button"
                            onClick={() => handlePreRequisitoRemove(disciplina.id)}
                            className="ml-1 hover:bg-[#2d5016] rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhum pré-requisito selecionado</p>
                  )}
                </div>

                {/* Combobox para adicionar pré-requisitos */}
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar disciplinas..."
                      value={preRequisitoSearch}
                      onChange={(e) => {
                        setPreRequisitoSearch(e.target.value);
                        setShowPreRequisitos(true);
                      }}
                      onFocus={() => setShowPreRequisitos(true)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPreRequisitos(!showPreRequisitos)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Dropdown de pré-requisitos */}
                  {showPreRequisitos && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredPreRequisitos.length > 0 ? (
                        filteredPreRequisitos.map((disciplina) => {
                          const isSelected = (watch("pre_requisitos") || []).includes(disciplina.id);
                          return (
                            <button
                              key={disciplina.id}
                              type="button"
                              onClick={() => handlePreRequisitoAdd(disciplina.id)}
                              disabled={isSelected}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                                isSelected ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <div>
                                <div className="font-medium text-sm">{disciplina.nome}</div>
                                <div className="text-xs text-gray-500">Código: {disciplina.codigo}</div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-[#3B6C4D]" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Nenhuma disciplina encontrada
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Separador - Conteúdo Programático */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo Programático</h3>
              
              <div className="space-y-6">
                {/* Objetivos */}
                <div>
                  <Label htmlFor="objetivos" className="text-sm font-medium text-gray-700">Objetivos *</Label>
                  <textarea
                    id="objetivos"
                    {...register("objetivos")}
                    placeholder="Descreva os objetivos da disciplina..."
                    rows={4}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.objetivos ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.objetivos && (
                    <p className="text-sm text-red-500 mt-1">{errors.objetivos.message}</p>
                  )}
                </div>
                
                {/* Ementa */}
                <div>
                  <Label htmlFor="ementa" className="text-sm font-medium text-gray-700">Ementa *</Label>
                  <textarea
                    id="ementa"
                    {...register("ementa")}
                    placeholder="Descreva a ementa da disciplina..."
                    rows={6}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.ementa ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.ementa && (
                    <p className="text-sm text-red-500 mt-1">{errors.ementa.message}</p>
                  )}
                </div>
                
                {/* Metodologia */}
                <div>
                  <Label htmlFor="metodologia" className="text-sm font-medium text-gray-700">Metodologia</Label>
                  <textarea
                    id="metodologia"
                    {...register("metodologia")}
                    placeholder="Descreva a metodologia de ensino..."
                    rows={4}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.metodologia ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.metodologia && (
                    <p className="text-sm text-red-500 mt-1">{errors.metodologia.message}</p>
                  )}
                </div>
                
                {/* Critérios de Avaliação */}
                <div>
                  <Label htmlFor="criterios_avaliacao" className="text-sm font-medium text-gray-700">Critérios de Avaliação</Label>
                  <textarea
                    id="criterios_avaliacao"
                    {...register("criterios_avaliacao")}
                    placeholder="Descreva os critérios de avaliação..."
                    rows={4}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.criterios_avaliacao ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.criterios_avaliacao && (
                    <p className="text-sm text-red-500 mt-1">{errors.criterios_avaliacao.message}</p>
                  )}
                </div>
                
                {/* Bibliografia */}
                <div>
                  <Label htmlFor="bibliografia" className="text-sm font-medium text-gray-700">Bibliografia</Label>
                  <textarea
                    id="bibliografia"
                    {...register("bibliografia")}
                    placeholder="Liste as referências bibliográficas..."
                    rows={4}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.bibliografia ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.bibliografia && (
                    <p className="text-sm text-red-500 mt-1">{errors.bibliografia.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Separador - Status e Observações */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status e Observações</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status *</Label>
                  <Select 
                    value={watch("status")} 
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger className={`mt-1 ${errors.status ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="inativa">Inativa</SelectItem>
                      <SelectItem value="em_revisao">Em Revisão</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                  )}
                </div>
              </div>
              
              {/* Observações */}
              <div className="mt-6">
                <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</Label>
                <textarea
                  id="observacoes"
                  {...register("observacoes")}
                  placeholder="Digite observações adicionais sobre a disciplina..."
                  rows={4}
                  className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                    errors.observacoes ? "border-red-500" : "border-input"
                  }`}
                />
                {errors.observacoes && (
                  <p className="text-sm text-red-500 mt-1">{errors.observacoes.message}</p>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-[#2d5016] hover:bg-[#2d5016]/90 px-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Disciplina
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}