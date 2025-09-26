"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { ArrowLeft, Save, User, Phone, Calendar, Users, Camera, Upload, Mail, GraduationCap, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { estudanteSchema, EstudanteFormData } from "@/validations/estudante.validations";

export default function NovoEstudantePage() {
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
    resolver: yupResolver(estudanteSchema),
    defaultValues: {
      nome: "",
      data_nascimento: "",
      genero: "",
      numero_bi: "",
      endereco: "",
      nome_encarregado: "",
      contato_encarregado: "",
      email_encarregado: "",
      classe: "",
      turma: "",
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

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Aqui seria feita a chamada à API para criar o estudante
      console.log("Dados do novo estudante:", data);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      success("Sucesso!", "Estudante criado com sucesso");
      
      // Aguardar um pouco para mostrar o toast antes de redirecionar
      setTimeout(() => {
        router.push("/estudantes");
      }, 1000);
    } catch (err) {
      console.error("Erro ao criar estudante:", err);
      error("Erro", "Não foi possível criar o estudante. Tente novamente.");
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
            
            {/* Foto do Estudante */}
            <div className="flex items-start gap-8 pb-6 border-b border-gray-200">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Camera className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Foto do Estudante</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Foto
                </Button>
                <p className="text-sm text-gray-500">
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

            {/* Informações do Estudante */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Nome Completo - Ocupa 2 colunas */}
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome Completo *</Label>
                <Input
                  id="nome"
                  {...register("nome")}
                  placeholder="Digite o nome completo do estudante"
                  className={`mt-1 ${errors.nome ? "border-red-500" : ""}`}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
                )}
              </div>
              
              {/* Data de Nascimento */}
              <div>
                <Label htmlFor="data_nascimento" className="text-sm font-medium text-gray-700">Data de Nascimento *</Label>
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
                <Label htmlFor="genero" className="text-sm font-medium text-gray-700">Gênero *</Label>
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
                <Label htmlFor="numero_bi" className="text-sm font-medium text-gray-700">Número do BI</Label>
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
                    <SelectItem value="1">1ª Classe</SelectItem>
                    <SelectItem value="2">2ª Classe</SelectItem>
                    <SelectItem value="3">3ª Classe</SelectItem>
                    <SelectItem value="4">4ª Classe</SelectItem>
                    <SelectItem value="5">5ª Classe</SelectItem>
                    <SelectItem value="6">6ª Classe</SelectItem>
                    <SelectItem value="7">7ª Classe</SelectItem>
                    <SelectItem value="8">8ª Classe</SelectItem>
                    <SelectItem value="9">9ª Classe</SelectItem>
                    <SelectItem value="10">10ª Classe</SelectItem>
                    <SelectItem value="11">11ª Classe</SelectItem>
                    <SelectItem value="12">12ª Classe</SelectItem>
                  </SelectContent>
                </Select>
                {errors.classe && (
                  <p className="text-sm text-red-500 mt-1">{errors.classe.message}</p>
                )}
              </div>
              
              {/* Turma */}
              <div>
                <Label htmlFor="turma" className="text-sm font-medium text-gray-700">Turma *</Label>
                <Select 
                  value={watch("turma")} 
                  onValueChange={(value) => setValue("turma", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.turma ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Turma A</SelectItem>
                    <SelectItem value="B">Turma B</SelectItem>
                    <SelectItem value="C">Turma C</SelectItem>
                    <SelectItem value="D">Turma D</SelectItem>
                  </SelectContent>
                </Select>
                {errors.turma && (
                  <p className="text-sm text-red-500 mt-1">{errors.turma.message}</p>
                )}
              </div>
              
              {/* Endereço - Ocupa 2 colunas */}
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">Endereço</Label>
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

            {/* Separador */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Encarregado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nome do Encarregado - Ocupa 2 colunas */}
                <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="nome_encarregado" className="text-sm font-medium text-gray-700">Nome do Encarregado *</Label>
                  <Input
                    id="nome_encarregado"
                    {...register("nome_encarregado")}
                    placeholder="Digite o nome completo do encarregado"
                    className={`mt-1 ${errors.nome_encarregado ? "border-red-500" : ""}`}
                  />
                  {errors.nome_encarregado && (
                    <p className="text-sm text-red-500 mt-1">{errors.nome_encarregado.message}</p>
                  )}
                </div>
                
                {/* Contato */}
                <div>
                  <Label htmlFor="contato_encarregado" className="text-sm font-medium text-gray-700">Contato *</Label>
                  <Input
                    id="contato_encarregado"
                    {...register("contato_encarregado")}
                    placeholder="+244 923 456 789"
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setValue("contato_encarregado", formatted);
                    }}
                    className={`mt-1 ${errors.contato_encarregado ? "border-red-500" : ""}`}
                  />
                  {errors.contato_encarregado && (
                    <p className="text-sm text-red-500 mt-1">{errors.contato_encarregado.message}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <Label htmlFor="email_encarregado" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email_encarregado"
                    type="email"
                    {...register("email_encarregado")}
                    placeholder="email@exemplo.com"
                    className={`mt-1 ${errors.email_encarregado ? "border-red-500" : ""}`}
                  />
                  {errors.email_encarregado && (
                    <p className="text-sm text-red-500 mt-1">{errors.email_encarregado.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="border-t border-gray-200 pt-6">
              <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</Label>
              <textarea
                id="observacoes"
                {...register("observacoes")}
                placeholder="Digite observações adicionais sobre o estudante..."
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
                    Salvar Estudante
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
