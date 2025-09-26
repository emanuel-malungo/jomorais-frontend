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
import { ArrowLeft, Save, User, Phone, Calendar, Users, Camera, Upload, Mail, GraduationCap, BookOpen, DollarSign, Plus, X, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { professorSchema, ProfessorFormData } from "@/validations/professor.validations";

export default function NovoProfessorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, removeToast, success, error } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(professorSchema),
    defaultValues: {
      nome: "",
      data_nascimento: "",
      genero: "",
      numero_bi: "",
      endereco: "",
      telefone: "",
      email: "",
      formacao_academica: "",
      area_especializacao: "",
      disciplinas: [],
      experiencia_anos: 0,
      salario: 0,
      data_contratacao: "",
      observacoes: "",
    },
  });

  // Máscaras para inputs
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("244")) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "+$1 $2 $3 $4");
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  const formatBI = (value: string) => {
    const cleaned = value.replace(/[^0-9A-Z]/g, "");
    return cleaned.replace(/(\d{9})([A-Z]{2})(\d{3})/, "$1$2$3");
  };

  const formatSalary = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(Number(cleaned));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error("Erro", "A foto deve ter no máximo 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Aqui seria feita a chamada à API para criar o professor
      console.log("Dados do novo professor:", data);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      success("Sucesso!", "Professor criado com sucesso");
      
      // Aguardar um pouco para mostrar o toast antes de redirecionar
      setTimeout(() => {
        router.push("/professores");
      }, 1000);
    } catch (err) {
      console.error("Erro ao criar professor:", err);
      error("Erro", "Não foi possível criar o professor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Disciplinas mock - futuramente virão da API
  const disciplinasDisponiveis = [
    { id: "1", nome: "Matemática", codigo: "MAT", carga_horaria: 4 },
    { id: "2", nome: "Português", codigo: "POR", carga_horaria: 4 },
    { id: "3", nome: "Física", codigo: "FIS", carga_horaria: 3 },
    { id: "4", nome: "Química", codigo: "QUI", carga_horaria: 3 },
    { id: "5", nome: "Biologia", codigo: "BIO", carga_horaria: 3 },
    { id: "6", nome: "História", codigo: "HIS", carga_horaria: 2 },
    { id: "7", nome: "Geografia", codigo: "GEO", carga_horaria: 2 },
    { id: "8", nome: "Inglês", codigo: "ING", carga_horaria: 2 },
    { id: "9", nome: "Francês", codigo: "FRA", carga_horaria: 2 },
    { id: "10", nome: "Educação Física", codigo: "EDF", carga_horaria: 2 },
    { id: "11", nome: "Artes", codigo: "ART", carga_horaria: 1 },
    { id: "12", nome: "Filosofia", codigo: "FIL", carga_horaria: 1 },
    { id: "13", nome: "Sociologia", codigo: "SOC", carga_horaria: 1 },
    { id: "14", nome: "Informática", codigo: "INF", carga_horaria: 2 },
    { id: "15", nome: "Música", codigo: "MUS", carga_horaria: 1 },
    { id: "16", nome: "Desenho", codigo: "DES", carga_horaria: 1 },
    { id: "17", nome: "Educação Moral e Cívica", codigo: "EMC", carga_horaria: 1 },
    { id: "18", nome: "Psicologia", codigo: "PSI", carga_horaria: 1 },
    { id: "19", nome: "Economia", codigo: "ECO", carga_horaria: 2 },
    { id: "20", nome: "Contabilidade", codigo: "CON", carga_horaria: 3 }
  ];

  const [disciplinaSearch, setDisciplinaSearch] = useState("");
  const [showDisciplinas, setShowDisciplinas] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredDisciplinas = disciplinasDisponiveis.filter(disciplina =>
    disciplina.nome.toLowerCase().includes(disciplinaSearch.toLowerCase()) ||
    disciplina.codigo.toLowerCase().includes(disciplinaSearch.toLowerCase())
  );

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDisciplinas(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-9xl mx-auto p-1">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="space-y-8">
            
            {/* Foto do Professor */}
            <div className="flex items-start gap-8 pb-6 border-b border-border">
              <div className="w-32 h-32 border-2 border-dashed border-muted rounded-xl flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Camera className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Foto do Professor</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Foto
                </Button>
                <p className="text-sm text-muted-foreground">
                  Formatos: JPG, PNG, GIF • Máx: 5MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Informações Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Nome Completo - Ocupa 2 colunas */}
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="nome" className="text-sm font-medium text-foreground">Nome Completo *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Digite o nome completo do professor"
                  className={`mt-1 ${errors.nome ? "border-red-500" : ""}`}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                )}
              </div>
              
              {/* Data de Nascimento */}
              <div>
                <Label htmlFor="data_nascimento" className="text-sm font-medium text-foreground">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  {...register("data_nascimento")}
                  className={`mt-1 ${errors.data_nascimento ? "border-red-500" : ""}`}
                />
                {errors.data_nascimento && (
                  <p className="text-sm text-red-500 mt-1">{errors.data_nascimento.message}</p>
                )}
              </div>
              
              {/* Gênero */}
              <div>
                <Label htmlFor="genero" className="text-sm font-medium text-foreground">Gênero *</Label>
                <Select 
                  value={watch("genero")} 
                  onValueChange={(value) => setValue("genero", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.genero ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genero && (
                  <p className="text-sm text-red-500 mt-1">{errors.genero.message}</p>
                )}
              </div>

              {/* Número do BI */}
              <div>
                <Label htmlFor="numero_bi" className="text-sm font-medium text-foreground">Número do BI *</Label>
                <Input
                  id="numero_bi"
                  {...register("numero_bi")}
                  placeholder="123456789LA012"
                  onChange={(e) => {
                    const formatted = formatBI(e.target.value);
                    setValue("numero_bi", formatted);
                  }}
                  className={`mt-1 ${errors.numero_bi ? "border-red-500" : ""}`}
                />
                {errors.numero_bi && (
                  <p className="text-sm text-red-500 mt-1">{errors.numero_bi.message}</p>
                )}
              </div>
              
              {/* Telefone */}
              <div>
                <Label htmlFor="telefone" className="text-sm font-medium text-foreground">Telefone *</Label>
                <Input
                  id="telefone"
                  {...register("telefone")}
                  placeholder="+244 923 456 789"
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setValue("telefone", formatted);
                  }}
                  className={`mt-1 ${errors.telefone ? "border-red-500" : ""}`}
                />
                {errors.telefone && (
                  <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="professor@exemplo.com"
                  className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              
              {/* Endereço - Ocupa 2 colunas */}
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="endereco" className="text-sm font-medium text-foreground">Endereço *</Label>
                <Input
                  id="endereco"
                  {...register("endereco")}
                  placeholder="Digite o endereço completo"
                  className={`mt-1 ${errors.endereco ? "border-red-500" : ""}`}
                />
                {errors.endereco && (
                  <p className="text-sm text-red-500 mt-1">{errors.endereco.message}</p>
                )}
              </div>
            </div>

            {/* Separador - Informações Acadêmicas */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações Acadêmicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Formação Acadêmica */}
                <div>
                  <Label htmlFor="formacao_academica" className="text-sm font-medium text-foreground">Formação Acadêmica *</Label>
                  <Select 
                    value={watch("formacao_academica")} 
                    onValueChange={(value) => setValue("formacao_academica", value)}
                  >
                    <SelectTrigger className={`mt-1 ${errors.formacao_academica ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ensino_medio">Ensino Médio</SelectItem>
                      <SelectItem value="licenciatura">Licenciatura</SelectItem>
                      <SelectItem value="bacharelado">Bacharelado</SelectItem>
                      <SelectItem value="especializacao">Especialização</SelectItem>
                      <SelectItem value="mestrado">Mestrado</SelectItem>
                      <SelectItem value="doutorado">Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.formacao_academica && (
                    <p className="text-sm text-red-500 mt-1">{errors.formacao_academica.message}</p>
                  )}
                </div>
                
                {/* Área de Especialização */}
                <div>
                  <Label htmlFor="area_especializacao" className="text-sm font-medium text-foreground">Área de Especialização *</Label>
                  <Input
                    id="area_especializacao"
                    {...register("area_especializacao")}
                    placeholder="Ex: Matemática, Ciências, Letras"
                    className={`mt-1 ${errors.area_especializacao ? "border-red-500" : ""}`}
                  />
                  {errors.area_especializacao && (
                    <p className="text-sm text-red-500 mt-1">{errors.area_especializacao.message}</p>
                  )}
                </div>
                
                {/* Anos de Experiência */}
                <div>
                  <Label htmlFor="experiencia_anos" className="text-sm font-medium text-foreground">Anos de Experiência *</Label>
                  <Input
                    id="experiencia_anos"
                    type="number"
                    min="0"
                    max="50"
                    {...register("experiencia_anos")}
                    placeholder="0"
                    className={`mt-1 ${errors.experiencia_anos ? "border-red-500" : ""}`}
                  />
                  {errors.experiencia_anos && (
                    <p className="text-sm text-red-500 mt-1">{errors.experiencia_anos.message}</p>
                  )}
                </div>
              </div>
              
              {/* Disciplinas que pode lecionar */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-foreground">Disciplinas que pode lecionar *</Label>
                
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
                    <p className="text-sm text-muted-foreground italic">Nenhuma disciplina selecionada</p>
                  )}
                </div>

                {/* Combobox para adicionar disciplinas */}
                <div className="relative" ref={dropdownRef}>
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
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Dropdown de disciplinas */}
                  {showDisciplinas && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredDisciplinas.length > 0 ? (
                        filteredDisciplinas.map((disciplina) => {
                          const isSelected = (watch("disciplinas") || []).includes(disciplina.id);
                          return (
                            <button
                              key={disciplina.id}
                              type="button"
                              onClick={() => handleDisciplinaAdd(disciplina.id)}
                              disabled={isSelected}
                              className={`w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center justify-between ${
                                isSelected ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <div>
                                <div className="font-medium text-sm">{disciplina.nome}</div>
                                <div className="text-xs text-muted-foreground">
                                  Código: {disciplina.codigo} • {disciplina.carga_horaria}h/semana
                                </div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-[#3B6C4D]" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
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

            {/* Separador - Informações Contratuais */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informações Contratuais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data de Contratação */}
                <div>
                  <Label htmlFor="data_contratacao" className="text-sm font-medium text-foreground">Data de Contratação *</Label>
                  <Input
                    id="data_contratacao"
                    type="date"
                    {...register("data_contratacao")}
                    className={`mt-1 ${errors.data_contratacao ? "border-red-500" : ""}`}
                  />
                  {errors.data_contratacao && (
                    <p className="text-sm text-red-500 mt-1">{errors.data_contratacao.message}</p>
                  )}
                </div>
                
                {/* Salário */}
                <div>
                  <Label htmlFor="salario" className="text-sm font-medium text-foreground">Salário (Kz) *</Label>
                  <Input
                    id="salario"
                    type="number"
                    min="50000"
                    max="5000000"
                    step="1000"
                    {...register("salario")}
                    placeholder="150000"
                    className={`mt-1 ${errors.salario ? "border-red-500" : ""}`}
                  />
                  {errors.salario && (
                    <p className="text-sm text-red-500 mt-1">{errors.salario.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="border-t border-border pt-6">
              <Label htmlFor="observacoes" className="text-sm font-medium text-foreground">Observações</Label>
              <textarea
                id="observacoes"
                {...register("observacoes")}
                placeholder="Digite observações adicionais sobre o professor..."
                rows={4}
                className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                  errors.observacoes ? "border-red-500" : "border-input"
                }`}
              />
              {errors.observacoes && (
                <p className="text-sm text-red-500 mt-1">{errors.observacoes.message}</p>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t border-border">
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
                    Salvar Professor
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
