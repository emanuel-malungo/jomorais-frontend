"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Edit,
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  GraduationCap,
  Users,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

// Dados mockados
const documentTypes = [
  { codigo: 1, designacao: "Bilhete de Identidade" },
  { codigo: 2, designacao: "Passaporte" },
  { codigo: 3, designacao: "Certidão de Nascimento" },
];

const provinces = [
  "Luanda", "Benguela", "Huíla", "Namibe", "Cunene", "Quando Cubango",
  "Moxico", "Lunda Norte", "Lunda Sul", "Malanje", "Uíge", "Zaire",
  "Cabinda", "Kwanza Norte", "Kwanza Sul", "Bié", "Huambo"
];

const courses = [
  { codigo: 1, designacao: "Informática de Gestão" },
  { codigo: 2, designacao: "Contabilidade" },
  { codigo: 3, designacao: "Administração" },
  { codigo: 4, designacao: "Marketing" },
];

const professions = [
  { codigo: 1, designacao: "Engenheiro Civil" },
  { codigo: 2, designacao: "Professor" },
  { codigo: 3, designacao: "Médico" },
  { codigo: 4, designacao: "Advogado" },
  { codigo: 5, designacao: "Comerciante" },
  { codigo: 6, designacao: "Funcionário Público" },
];

// Dados mockados do aluno para edição
const mockStudentData = {
  codigo: 1,
  nome: "Ana Silva Santos",
  pai: "João Santos",
  mae: "Maria Silva",
  email: "ana.santos@email.com",
  telefone: "923456789",
  dataNascimento: "2005-03-15",
  sexo: "F",
  morada: "Rua das Flores, 123, Luanda",
  tipo_documento: "1",
  n_documento_identificacao: "123456789LA041",
  provinciaEmissao: "Luanda",
  nome_encarregado: "João Santos",
  telefone_encarregado: "912345678",
  email_encarregado: "joao.santos@email.com",
  profissao_encarregado: "1",
  local_trabalho_encarregado: "Empresa ABC Lda",
  curso: "1",
  tipo_desconto: "50",
  motivo_desconto: "Bolsa de estudos",
};

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(mockStudentData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const studentId = params.id;

  useEffect(() => {
    // Em produção, buscar dados do aluno pela API
    console.log("Carregando dados do aluno:", studentId);
  }, [studentId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.sexo) newErrors.sexo = "Sexo é obrigatório";
    if (!formData.tipo_documento) newErrors.tipo_documento = "Tipo de documento é obrigatório";
    if (!formData.n_documento_identificacao.trim()) newErrors.n_documento_identificacao = "Número do documento é obrigatório";
    if (!formData.nome_encarregado.trim()) newErrors.nome_encarregado = "Nome do encarregado é obrigatório";
    if (!formData.telefone_encarregado.trim()) newErrors.telefone_encarregado = "Telefone do encarregado é obrigatório";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (formData.email_encarregado && !emailRegex.test(formData.email_encarregado)) {
      newErrors.email_encarregado = "Email do encarregado inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Dados atualizados:", formData);
      router.push('/admin/student-management/list-student');
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    } finally {
      setIsLoading(false);
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
                  <Edit className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Editar Aluno
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">{formData.nome}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Atualize as informações do aluno. Todos os campos marcados com * são obrigatórios.
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
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Formulário em Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="guardian">Encarregado</TabsTrigger>
          <TabsTrigger value="enrollment">Matrícula</TabsTrigger>
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
                  <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
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
                  <label className="text-sm font-medium text-gray-700">Sexo *</label>
                  <Select value={formData.sexo} onValueChange={(value) => handleInputChange('sexo', value)}>
                    <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Data de Nascimento *</label>
                  <Input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    className={errors.dataNascimento ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Telefone *</label>
                  <Input
                    placeholder="9XX XXX XXX"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Pai</label>
                  <Input
                    placeholder="Nome do pai"
                    value={formData.pai}
                    onChange={(e) => handleInputChange('pai', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome da Mãe</label>
                  <Input
                    placeholder="Nome da mãe"
                    value={formData.mae}
                    onChange={(e) => handleInputChange('mae', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Endereço</label>
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
                  <label className="text-sm font-medium text-gray-700">Tipo de Documento *</label>
                  <Select value={formData.tipo_documento} onValueChange={(value) => handleInputChange('tipo_documento', value)}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Número do Documento *</label>
                  <Input
                    placeholder="Número do documento"
                    value={formData.n_documento_identificacao}
                    onChange={(e) => handleInputChange('n_documento_identificacao', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Província de Emissão</label>
                  <Select value={formData.provinciaEmissao} onValueChange={(value) => handleInputChange('provinciaEmissao', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a província" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardian" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Encarregado de Educação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome do Encarregado *</label>
                  <Input
                    placeholder="Nome completo do encarregado"
                    value={formData.nome_encarregado}
                    onChange={(e) => handleInputChange('nome_encarregado', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Telefone do Encarregado *</label>
                  <Input
                    placeholder="9XX XXX XXX"
                    value={formData.telefone_encarregado}
                    onChange={(e) => handleInputChange('telefone_encarregado', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email do Encarregado</label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={formData.email_encarregado}
                    onChange={(e) => handleInputChange('email_encarregado', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Profissão</label>
                  <Select value={formData.profissao_encarregado} onValueChange={(value) => handleInputChange('profissao_encarregado', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a profissão" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((prof) => (
                        <SelectItem key={prof.codigo} value={prof.codigo.toString()}>
                          {prof.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Local de Trabalho</label>
                  <Input
                    placeholder="Nome da empresa ou local de trabalho"
                    value={formData.local_trabalho_encarregado}
                    onChange={(e) => handleInputChange('local_trabalho_encarregado', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Informações de Matrícula</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Curso</label>
                  <Select value={formData.curso} onValueChange={(value) => handleInputChange('curso', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.codigo} value={course.codigo.toString()}>
                          {course.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Desconto</label>
                  <Select value={formData.tipo_desconto} onValueChange={(value) => handleInputChange('tipo_desconto', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o desconto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sem desconto</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="100">100% (Bolsa integral)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipo_desconto && formData.tipo_desconto !== "0" && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Motivo do Desconto</label>
                    <Input
                      placeholder="Descreva o motivo do desconto"
                      value={formData.motivo_desconto}
                      onChange={(e) => handleInputChange('motivo_desconto', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
