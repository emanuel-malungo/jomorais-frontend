"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { Save, BookOpen, X, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cursoSchema, CursoFormData } from "@/validations/curso.validations";

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(cursoSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      area_conhecimento: "",
      nivel_ensino: "",
      duracao_anos: 3,
      disciplinas_obrigatorias: [],
      disciplinas_optativas: [],
      carga_horaria_total: 2400,
      coordenador: "",
      requisitos_ingresso: "",
      objetivos_curso: "",
      perfil_egresso: "",
      metodologia_ensino: "",
      sistema_avaliacao: "",
      recursos_necessarios: "",
      certificacao: "",
      status: "ativo",
      observacoes: "",
    },
  });

  // Mock data
  const disciplinasDisponiveis = [
    { id: "1", nome: "Matemática", codigo: "MAT" },
    { id: "2", nome: "Português", codigo: "POR" },
    { id: "3", nome: "História", codigo: "HIS" },
    { id: "4", nome: "Geografia", codigo: "GEO" },
    { id: "5", nome: "Ciências", codigo: "CIE" },
    { id: "6", nome: "Física", codigo: "FIS" },
    { id: "7", nome: "Química", codigo: "QUI" },
    { id: "8", nome: "Biologia", codigo: "BIO" },
    { id: "9", nome: "Inglês", codigo: "ING" },
    { id: "10", nome: "Educação Física", codigo: "EDF" },
  ];

  const professoresDisponiveis = [
    { id: "1", nome: "Prof. João Silva", especialidade: "Matemática" },
    { id: "2", nome: "Prof. Maria Santos", especialidade: "Português" },
    { id: "3", nome: "Prof. Carlos Oliveira", especialidade: "História" },
    { id: "4", nome: "Prof. Ana Costa", especialidade: "Ciências" },
    { id: "5", nome: "Prof. Pedro Almeida", especialidade: "Geografia" },
  ];

  const [disciplinaObrigatoriaSearch, setDisciplinaObrigatoriaSearch] = useState("");
  const [showDisciplinasObrigatorias, setShowDisciplinasObrigatorias] = useState(false);
  const [disciplinaOptativaSearch, setDisciplinaOptativaSearch] = useState("");
  const [showDisciplinasOptativas, setShowDisciplinasOptativas] = useState(false);
  const obrigatoriaDropdownRef = useRef<HTMLDivElement>(null);
  const optativaDropdownRef = useRef<HTMLDivElement>(null);

  const filteredDisciplinasObrigatorias = disciplinasDisponiveis.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(disciplinaObrigatoriaSearch.toLowerCase()) ||
    disciplina.codigo.toLowerCase().includes(disciplinaObrigatoriaSearch.toLowerCase())
  );

  const filteredDisciplinasOptativas = disciplinasDisponiveis.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(disciplinaOptativaSearch.toLowerCase()) ||
    disciplina.codigo.toLowerCase().includes(disciplinaOptativaSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (obrigatoriaDropdownRef.current && !obrigatoriaDropdownRef.current.contains(event.target as Node)) {
        setShowDisciplinasObrigatorias(false);
      }
      if (optativaDropdownRef.current && !optativaDropdownRef.current.contains(event.target as Node)) {
        setShowDisciplinasOptativas(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDisciplinaObrigatoriaAdd = (disciplinaId: string) => {
    const currentDisciplinas = watch("disciplinas_obrigatorias") || [];
    if (!currentDisciplinas.includes(disciplinaId)) {
      setValue("disciplinas_obrigatorias", [...currentDisciplinas, disciplinaId]);
    }
    setDisciplinaObrigatoriaSearch("");
    setShowDisciplinasObrigatorias(false);
  };

  const handleDisciplinaObrigatoriaRemove = (disciplinaId: string) => {
    const currentDisciplinas = watch("disciplinas_obrigatorias") || [];
    setValue("disciplinas_obrigatorias", currentDisciplinas.filter(id => id !== disciplinaId));
  };

  const handleDisciplinaOptativaAdd = (disciplinaId: string) => {
    const currentDisciplinas = watch("disciplinas_optativas") || [];
    if (!currentDisciplinas.includes(disciplinaId)) {
      setValue("disciplinas_optativas", [...currentDisciplinas, disciplinaId]);
    }
    setDisciplinaOptativaSearch("");
    setShowDisciplinasOptativas(false);
  };

  const handleDisciplinaOptativaRemove = (disciplinaId: string) => {
    const currentDisciplinas = watch("disciplinas_optativas") || [];
    setValue("disciplinas_optativas", currentDisciplinas.filter(id => id !== disciplinaId));
  };

  const getSelectedDisciplinasObrigatorias = () => {
    const selectedIds = watch("disciplinas_obrigatorias") || [];
    return disciplinasDisponiveis.filter(d => selectedIds.includes(d.id));
  };

  const getSelectedDisciplinasOptativas = () => {
    const selectedIds = watch("disciplinas_optativas") || [];
    return disciplinasDisponiveis.filter(d => selectedIds.includes(d.id));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      console.log("Dados do novo curso:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      success("Sucesso!", "Curso criado com sucesso");
      setTimeout(() => {
        router.push("/disciplinas/cursos");
      }, 1000);
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      error("Erro", "Não foi possível criar o curso. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-9xl mx-auto p-1">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-8">
            
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="md:col-span-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome do Curso *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Ex: Ciências Exatas, Ensino Primário Completo"
                  className={`mt-1 ${errors.nome ? "border-red-500" : ""}`}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">Código *</Label>
                <Input
                  id="codigo"
                  {...register("codigo")}
                  placeholder="Ex: CEX, EPC"
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
                    <SelectItem value="educacao_geral">Educação Geral</SelectItem>
                    <SelectItem value="ciencias_exatas">Ciências Exatas</SelectItem>
                    <SelectItem value="ciencias_humanas">Ciências Humanas</SelectItem>
                    <SelectItem value="ciencias_natureza">Ciências da Natureza</SelectItem>
                    <SelectItem value="artes">Artes</SelectItem>
                    <SelectItem value="preparacao_universitaria">Preparação Universitária</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
                {errors.area_conhecimento && (
                  <p className="text-sm text-red-500 mt-1">{errors.area_conhecimento.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="nivel_ensino" className="text-sm font-medium text-gray-700">Nível de Ensino *</Label>
                <Select 
                  value={watch("nivel_ensino")} 
                  onValueChange={(value) => setValue("nivel_ensino", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.nivel_ensino ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ensino_primario">Ensino Primário</SelectItem>
                    <SelectItem value="ensino_secundario_1">1º Ciclo do Ensino Secundário</SelectItem>
                    <SelectItem value="ensino_secundario_2">2º Ciclo do Ensino Secundário</SelectItem>
                    <SelectItem value="ensino_pre_universitario">Ensino Pré-Universitário</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nivel_ensino && (
                  <p className="text-sm text-red-500 mt-1">{errors.nivel_ensino.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="duracao_anos" className="text-sm font-medium text-gray-700">Duração (anos) *</Label>
                <Input
                  id="duracao_anos"
                  type="number"
                  min="1"
                  max="6"
                  {...register("duracao_anos")}
                  className={`mt-1 ${errors.duracao_anos ? "border-red-500" : ""}`}
                />
                {errors.duracao_anos && (
                  <p className="text-sm text-red-500 mt-1">{errors.duracao_anos.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="carga_horaria_total" className="text-sm font-medium text-gray-700">Carga Horária Total *</Label>
                <Input
                  id="carga_horaria_total"
                  type="number"
                  min="500"
                  max="10000"
                  {...register("carga_horaria_total")}
                  placeholder="Horas totais"
                  className={`mt-1 ${errors.carga_horaria_total ? "border-red-500" : ""}`}
                />
                {errors.carga_horaria_total && (
                  <p className="text-sm text-red-500 mt-1">{errors.carga_horaria_total.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="coordenador" className="text-sm font-medium text-gray-700">Coordenador</Label>
                <Select 
                  value={watch("coordenador") || ""} 
                  onValueChange={(value) => setValue("coordenador", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.coordenador ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione um coordenador" />
                  </SelectTrigger>
                  <SelectContent>
                    {professoresDisponiveis.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id}>
                        {professor.nome} - {professor.especialidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.coordenador && (
                  <p className="text-sm text-red-500 mt-1">{errors.coordenador.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="certificacao" className="text-sm font-medium text-gray-700">Tipo de Certificação *</Label>
                <Select 
                  value={watch("certificacao")} 
                  onValueChange={(value) => setValue("certificacao", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.certificacao ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificado_conclusao">Certificado de Conclusão</SelectItem>
                    <SelectItem value="diploma_ensino_primario">Diploma do Ensino Primário</SelectItem>
                    <SelectItem value="diploma_ensino_secundario">Diploma do Ensino Secundário</SelectItem>
                    <SelectItem value="certificado_pre_universitario">Certificado Pré-Universitário</SelectItem>
                  </SelectContent>
                </Select>
                {errors.certificacao && (
                  <p className="text-sm text-red-500 mt-1">{errors.certificacao.message}</p>
                )}
              </div>
            </div>

            {/* Disciplinas */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disciplinas</h3>
              
              {/* Disciplinas Obrigatórias */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700">Disciplinas Obrigatórias *</Label>
                
                <div className="mt-2 mb-3">
                  {getSelectedDisciplinasObrigatorias().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedDisciplinasObrigatorias().map((disciplina) => (
                        <div key={disciplina.id} className="inline-flex items-center gap-1 bg-[#3B6C4D] text-white px-3 py-1 rounded-full text-sm">
                          <span>{disciplina.nome}</span>
                          <button
                            type="button"
                            onClick={() => handleDisciplinaObrigatoriaRemove(disciplina.id)}
                            className="ml-1 hover:bg-[#2d5016] rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhuma disciplina obrigatória selecionada</p>
                  )}
                </div>

                <div className="relative" ref={obrigatoriaDropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar disciplinas obrigatórias..."
                      value={disciplinaObrigatoriaSearch}
                      onChange={(e) => {
                        setDisciplinaObrigatoriaSearch(e.target.value);
                        setShowDisciplinasObrigatorias(true);
                      }}
                      onFocus={() => setShowDisciplinasObrigatorias(true)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDisciplinasObrigatorias(!showDisciplinasObrigatorias)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {showDisciplinasObrigatorias && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredDisciplinasObrigatorias.length > 0 ? (
                        filteredDisciplinasObrigatorias.map((disciplina) => {
                          const isSelected = (watch("disciplinas_obrigatorias") || []).includes(disciplina.id);
                          return (
                            <button
                              key={disciplina.id}
                              type="button"
                              onClick={() => handleDisciplinaObrigatoriaAdd(disciplina.id)}
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

                {errors.disciplinas_obrigatorias && (
                  <p className="text-sm text-red-500 mt-1">{errors.disciplinas_obrigatorias.message}</p>
                )}
              </div>

              {/* Disciplinas Optativas */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Disciplinas Optativas</Label>
                
                <div className="mt-2 mb-3">
                  {getSelectedDisciplinasOptativas().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedDisciplinasOptativas().map((disciplina) => (
                        <div key={disciplina.id} className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          <span>{disciplina.nome}</span>
                          <button
                            type="button"
                            onClick={() => handleDisciplinaOptativaRemove(disciplina.id)}
                            className="ml-1 hover:bg-blue-600 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhuma disciplina optativa selecionada</p>
                  )}
                </div>

                <div className="relative" ref={optativaDropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar disciplinas optativas..."
                      value={disciplinaOptativaSearch}
                      onChange={(e) => {
                        setDisciplinaOptativaSearch(e.target.value);
                        setShowDisciplinasOptativas(true);
                      }}
                      onFocus={() => setShowDisciplinasOptativas(true)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDisciplinasOptativas(!showDisciplinasOptativas)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {showDisciplinasOptativas && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredDisciplinasOptativas.length > 0 ? (
                        filteredDisciplinasOptativas.map((disciplina) => {
                          const isSelected = (watch("disciplinas_optativas") || []).includes(disciplina.id);
                          const isObrigatoria = (watch("disciplinas_obrigatorias") || []).includes(disciplina.id);
                          return (
                            <button
                              key={disciplina.id}
                              type="button"
                              onClick={() => handleDisciplinaOptativaAdd(disciplina.id)}
                              disabled={isSelected || isObrigatoria}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                                isSelected || isObrigatoria ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <div>
                                <div className="font-medium text-sm">{disciplina.nome}</div>
                                <div className="text-xs text-gray-500">
                                  Código: {disciplina.codigo}
                                  {isObrigatoria && " (Já é obrigatória)"}
                                </div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-blue-500" />}
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

            {/* Conteúdo do Curso */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo do Curso</h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="objetivos_curso" className="text-sm font-medium text-gray-700">Objetivos do Curso *</Label>
                  <textarea
                    id="objetivos_curso"
                    {...register("objetivos_curso")}
                    placeholder="Descreva os objetivos gerais do curso..."
                    rows={4}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.objetivos_curso ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.objetivos_curso && (
                    <p className="text-sm text-red-500 mt-1">{errors.objetivos_curso.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="perfil_egresso" className="text-sm font-medium text-gray-700">Perfil do Egresso *</Label>
                  <textarea
                    id="perfil_egresso"
                    {...register("perfil_egresso")}
                    placeholder="Descreva o perfil esperado do estudante ao concluir o curso..."
                    rows={4}
                    className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.perfil_egresso ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.perfil_egresso && (
                    <p className="text-sm text-red-500 mt-1">{errors.perfil_egresso.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status e Observações */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status e Observações</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="em_revisao">Em Revisão</SelectItem>
                      <SelectItem value="em_desenvolvimento">Em Desenvolvimento</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</Label>
                <textarea
                  id="observacoes"
                  {...register("observacoes")}
                  placeholder="Digite observações adicionais sobre o curso..."
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
                    Salvar Curso
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
