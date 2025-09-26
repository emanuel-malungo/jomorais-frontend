"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { Save, Users, Clock, Calendar, MapPin, BookOpen, User, X, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { turmaSchema, TurmaFormData } from "@/validations/turma.validations";

export default function TurmasNovaPage() {
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
    resolver: yupResolver(turmaSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      classe: "",
      ano_letivo: new Date().getFullYear().toString(),
      periodo: "",
      sala: "",
      capacidade_maxima: 30,
      professor_titular: "",
      disciplinas: [],
      horario_inicio: "",
      horario_fim: "",
      dias_semana: [],
      data_inicio: "",
      data_fim: "",
      status: "planejada",
      observacoes: "",
    },
  });

  // Dados mock
  const professoresDisponiveis = [
    { id: "1", nome: "Prof. João Silva", especialidade: "Matemática" },
    { id: "2", nome: "Prof. Maria Santos", especialidade: "Português" },
    { id: "3", nome: "Prof. Carlos Oliveira", especialidade: "História" },
    { id: "4", nome: "Prof. Ana Costa", especialidade: "Ciências" },
    { id: "5", nome: "Prof. Pedro Almeida", especialidade: "Geografia" },
  ];

  const disciplinasDisponiveis = [
    { id: "1", nome: "Matemática", codigo: "MAT" },
    { id: "2", nome: "Português", codigo: "POR" },
    { id: "3", nome: "História", codigo: "HIS" },
    { id: "4", nome: "Geografia", codigo: "GEO" },
    { id: "5", nome: "Ciências", codigo: "CIE" },
    { id: "6", nome: "Inglês", codigo: "ING" },
    { id: "7", nome: "Educação Física", codigo: "EDF" },
    { id: "8", nome: "Artes", codigo: "ART" },
  ];

  const salasDisponiveis = [
    { id: "1", nome: "Sala 101", capacidade: 30, andar: "1º Andar" },
    { id: "2", nome: "Sala 102", capacidade: 35, andar: "1º Andar" },
    { id: "3", nome: "Sala 201", capacidade: 40, andar: "2º Andar" },
    { id: "4", nome: "Sala 202", capacidade: 25, andar: "2º Andar" },
    { id: "5", nome: "Laboratório", capacidade: 20, andar: "Térreo" },
  ];

  const [disciplinaSearch, setDisciplinaSearch] = useState("");
  const [showDisciplinas, setShowDisciplinas] = useState(false);
  const disciplinaDropdownRef = useRef<HTMLDivElement>(null);

  const filteredDisciplinas = disciplinasDisponiveis.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(disciplinaSearch.toLowerCase()) ||
    disciplina.codigo.toLowerCase().includes(disciplinaSearch.toLowerCase())
  );

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (disciplinaDropdownRef.current && !disciplinaDropdownRef.current.contains(event.target as Node)) {
        setShowDisciplinas(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDisciplinaAdd = (disciplinaId: string) => {
    const currentDisciplinas = watch("disciplinas") || [];
    if (!currentDisciplinas.includes(disciplinaId)) {
      setValue("disciplinas", [...currentDisciplinas, disciplinaId]);
    }
    setDisciplinaSearch("");
    setShowDisciplinas(false);
  };

  const handleDisciplinaRemove = (disciplinaId: string) => {
    const currentDisciplinas = watch("disciplinas") || [];
    setValue("disciplinas", currentDisciplinas.filter(id => id !== disciplinaId));
  };

  const getSelectedDisciplinas = () => {
    const selectedIds = watch("disciplinas") || [];
    return disciplinasDisponiveis.filter(d => selectedIds.includes(d.id));
  };

  const handleDiaChange = (dia: string, checked: boolean) => {
    const currentDias = watch("dias_semana") || [];
    if (checked) {
      setValue("dias_semana", [...currentDias, dia]);
    } else {
      setValue("dias_semana", currentDias.filter(d => d !== dia));
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      console.log("Dados da nova turma:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      success("Sucesso!", "Turma criada com sucesso");
      setTimeout(() => {
        router.push("/turmas");
      }, 1000);
    } catch (err) {
      console.error("Erro ao criar turma:", err);
      error("Erro", "Não foi possível criar a turma. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const classes = [
    { value: "1", label: "1ª Classe" },
    { value: "2", label: "2ª Classe" },
    { value: "3", label: "3ª Classe" },
    { value: "4", label: "4ª Classe" },
    { value: "5", label: "5ª Classe" },
    { value: "6", label: "6ª Classe" },
    { value: "7", label: "7ª Classe" },
    { value: "8", label: "8ª Classe" },
    { value: "9", label: "9ª Classe" },
    { value: "10", label: "10ª Classe" },
    { value: "11", label: "11ª Classe" },
    { value: "12", label: "12ª Classe" },
    { value: "13", label: "13ª Classe" },
  ];

  const diasSemana = [
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-9xl mx-auto p-1">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-8">
            
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Nome da Turma */}
              <div>
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome da Turma *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Ex: 9º Ano A"
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
                  placeholder="Ex: 9A, 10B"
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
              
              {/* Classe */}
              <div>
                <Label htmlFor="classe" className="text-sm font-medium text-gray-700">Classe *</Label>
                <Select 
                  value={watch("classe")} 
                  onValueChange={(value) => setValue("classe", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.classe ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classe) => (
                      <SelectItem key={classe.value} value={classe.value}>{classe.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classe && (
                  <p className="text-sm text-red-500 mt-1">{errors.classe.message}</p>
                )}
              </div>
              
              {/* Ano Letivo */}
              <div>
                <Label htmlFor="ano_letivo" className="text-sm font-medium text-gray-700">Ano Letivo *</Label>
                <Input
                  id="ano_letivo"
                  type="number"
                  min="2020"
                  max="2030"
                  {...register("ano_letivo")}
                  className={`mt-1 ${errors.ano_letivo ? "border-red-500" : ""}`}
                />
                {errors.ano_letivo && (
                  <p className="text-sm text-red-500 mt-1">{errors.ano_letivo.message}</p>
                )}
              </div>
              
              {/* Período */}
              <div>
                <Label htmlFor="periodo" className="text-sm font-medium text-gray-700">Período *</Label>
                <Select 
                  value={watch("periodo")} 
                  onValueChange={(value) => setValue("periodo", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.periodo ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
                {errors.periodo && (
                  <p className="text-sm text-red-500 mt-1">{errors.periodo.message}</p>
                )}
              </div>
              
              {/* Capacidade Máxima */}
              <div>
                <Label htmlFor="capacidade_maxima" className="text-sm font-medium text-gray-700">Capacidade Máxima *</Label>
                <Input
                  id="capacidade_maxima"
                  type="number"
                  min="10"
                  max="50"
                  {...register("capacidade_maxima")}
                  className={`mt-1 ${errors.capacidade_maxima ? "border-red-500" : ""}`}
                />
                {errors.capacidade_maxima && (
                  <p className="text-sm text-red-500 mt-1">{errors.capacidade_maxima.message}</p>
                )}
              </div>
            </div>

            {/* Separador - Recursos */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sala */}
                <div>
                  <Label htmlFor="sala" className="text-sm font-medium text-gray-700">Sala *</Label>
                  <Select 
                    value={watch("sala")} 
                    onValueChange={(value) => setValue("sala", value)}
                  >
                    <SelectTrigger className={`mt-1 ${errors.sala ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {salasDisponiveis.map((sala) => (
                        <SelectItem key={sala.id} value={sala.id}>
                          {sala.nome} - Cap. {sala.capacidade} ({sala.andar})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sala && (
                    <p className="text-sm text-red-500 mt-1">{errors.sala.message}</p>
                  )}
                </div>
                
                {/* Professor Titular */}
                <div>
                  <Label htmlFor="professor_titular" className="text-sm font-medium text-gray-700">Professor Titular *</Label>
                  <Select 
                    value={watch("professor_titular")} 
                    onValueChange={(value) => setValue("professor_titular", value)}
                  >
                    <SelectTrigger className={`mt-1 ${errors.professor_titular ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione um professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {professoresDisponiveis.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          {professor.nome} - {professor.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.professor_titular && (
                    <p className="text-sm text-red-500 mt-1">{errors.professor_titular.message}</p>
                  )}
                </div>
              </div>
              
              {/* Disciplinas */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700">Disciplinas *</Label>
                
                {/* Disciplinas selecionadas */}
                <div className="mt-2 mb-3">
                  {getSelectedDisciplinas().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedDisciplinas().map((disciplina) => (
                        <div key={disciplina.id} className="inline-flex items-center gap-1 bg-[#3B6C4D] text-white px-3 py-1 rounded-full text-sm">
                          <span>{disciplina.nome}</span>
                          <button
                            type="button"
                            onClick={() => handleDisciplinaRemove(disciplina.id)}
                            className="ml-1 hover:bg-[#2d5016] rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nenhuma disciplina selecionada</p>
                  )}
                </div>

                {/* Combobox para adicionar disciplinas */}
                <div className="relative" ref={disciplinaDropdownRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Pesquisar disciplinas..."
                      value={disciplinaSearch}
                      onChange={(e) => {
                        setDisciplinaSearch(e.target.value);
                        setShowDisciplinas(true);
                      }}
                      onFocus={() => setShowDisciplinas(true)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDisciplinas(!showDisciplinas)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Dropdown de disciplinas */}
                  {showDisciplinas && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredDisciplinas.length > 0 ? (
                        filteredDisciplinas.map((disciplina) => {
                          const isSelected = (watch("disciplinas") || []).includes(disciplina.id);
                          return (
                            <button
                              key={disciplina.id}
                              type="button"
                              onClick={() => handleDisciplinaAdd(disciplina.id)}
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

                {errors.disciplinas && (
                  <p className="text-sm text-red-500 mt-1">{errors.disciplinas.message}</p>
                )}
              </div>
            </div>

            {/* Separador - Horários */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horários</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Horário de Início */}
                <div>
                  <Label htmlFor="horario_inicio" className="text-sm font-medium text-gray-700">Horário de Início *</Label>
                  <Input
                    id="horario_inicio"
                    type="time"
                    {...register("horario_inicio")}
                    className={`mt-1 ${errors.horario_inicio ? "border-red-500" : ""}`}
                  />
                  {errors.horario_inicio && (
                    <p className="text-sm text-red-500 mt-1">{errors.horario_inicio.message}</p>
                  )}
                </div>
                
                {/* Horário de Fim */}
                <div>
                  <Label htmlFor="horario_fim" className="text-sm font-medium text-gray-700">Horário de Fim *</Label>
                  <Input
                    id="horario_fim"
                    type="time"
                    {...register("horario_fim")}
                    className={`mt-1 ${errors.horario_fim ? "border-red-500" : ""}`}
                  />
                  {errors.horario_fim && (
                    <p className="text-sm text-red-500 mt-1">{errors.horario_fim.message}</p>
                  )}
                </div>
              </div>
              
              {/* Dias da Semana */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-700">Dias da Semana *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {diasSemana.map((dia) => {
                    const isSelected = (watch("dias_semana") || []).includes(dia.value);
                    return (
                      <label key={dia.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleDiaChange(dia.value, e.target.checked)}
                          className="rounded border-gray-300 text-[#3B6C4D] focus:ring-[#3B6C4D]"
                        />
                        <span className="text-sm text-gray-700">{dia.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.dias_semana && (
                  <p className="text-sm text-red-500 mt-1">{errors.dias_semana.message}</p>
                )}
              </div>
            </div>

            {/* Separador - Período Letivo */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Período Letivo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data de Início */}
                <div>
                  <Label htmlFor="data_inicio" className="text-sm font-medium text-gray-700">Data de Início *</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    {...register("data_inicio")}
                    className={`mt-1 ${errors.data_inicio ? "border-red-500" : ""}`}
                  />
                  {errors.data_inicio && (
                    <p className="text-sm text-red-500 mt-1">{errors.data_inicio.message}</p>
                  )}
                </div>
                
                {/* Data de Fim */}
                <div>
                  <Label htmlFor="data_fim" className="text-sm font-medium text-gray-700">Data de Fim *</Label>
                  <Input
                    id="data_fim"
                    type="date"
                    {...register("data_fim")}
                    className={`mt-1 ${errors.data_fim ? "border-red-500" : ""}`}
                  />
                  {errors.data_fim && (
                    <p className="text-sm text-red-500 mt-1">{errors.data_fim.message}</p>
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
                      <SelectItem value="planejada">Planejada</SelectItem>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="inativa">Inativa</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
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
                  placeholder="Digite observações adicionais sobre a turma..."
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
                    Salvar Turma
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