"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  User,
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  GraduationCap,
  Users,
  DollarSign,
  Clock,
  Award,
  BookOpen,
  Download,
  Printer,
  Share2,
} from 'lucide-react';

// Dados mockados do aluno (baseado na estrutura do backend)
const mockStudentDetails = {
  codigo: 1,
  nome: "Ana Silva Santos",
  pai: "João Santos",
  mae: "Maria Silva",
  email: "ana.santos@email.com",
  telefone: "923456789",
  dataNascimento: "2005-03-15",
  sexo: "F",
  n_documento_identificacao: "123456789LA041",
  morada: "Rua das Flores, 123, Luanda",
  url_Foto: "/avatars/ana.jpg",
  codigo_Status: 1,
  dataCadastro: "2024-01-15",
  saldo: 15000,
  motivo_Desconto: "Bolsa de estudos",
  tipo_desconto: "50%",
  provinciaEmissao: "Luanda",
  tb_encarregados: {
    codigo: 1,
    nome: "João Santos",
    telefone: "912345678",
    email: "joao.santos@email.com",
    local_Trabalho: "Empresa ABC Lda",
    tb_profissao: { 
      codigo: 1,
      designacao: "Engenheiro Civil" 
    }
  },
  tb_tipo_documento: { 
    codigo: 1,
    designacao: "Bilhete de Identidade" 
  },
  tb_matriculas: {
    codigo: 1,
    data_Matricula: "2024-02-01",
    codigoStatus: 1,
    tb_cursos: { 
      codigo: 1,
      designacao: "Informática de Gestão",
      duracao: "3 anos"
    },
    tb_confirmacoes: [{
      codigo: 1,
      data_Confirmacao: "2024-02-15",
      classificacao: "Aprovado",
      codigo_Ano_lectivo: 2024,
      tb_turmas: {
        codigo: 1,
        designacao: "IG-2024-M",
        tb_classes: { 
          codigo: 10,
          designacao: "10ª Classe" 
        },
        tb_salas: {
          codigo: 1,
          designacao: "Sala 101"
        },
        tb_periodos: {
          codigo: 1,
          designacao: "Manhã"
        }
      }
    }]
  },
  tb_pagamentos: [
    {
      codigo: 1,
      valor: 25000,
      data_Pagamento: "2024-02-01",
      tipo: "Propina",
      status: "Pago"
    },
    {
      codigo: 2,
      valor: 15000,
      data_Pagamento: "2024-03-01",
      tipo: "Propina",
      status: "Pago"
    }
  ],
  tb_transferencias: []
};

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const studentId = params.id;
  const student = mockStudentDetails; // Em produção, buscar por ID

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
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
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {student.nome}
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Detalhes do Aluno</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Visualize todas as informações detalhadas do aluno, incluindo dados pessoais,
                acadêmicos e financeiros.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir
              </Button>

              <Button
                onClick={() => router.push(`/admin/student-management/edit-student/${studentId}`)}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar Aluno
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {calculateAge(student.dataNascimento)} anos
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Idade</p>
            <p className="text-2xl font-bold text-gray-900">{calculateAge(student.dataNascimento)} anos</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <Badge variant="default" className="text-xs bg-emerald-100 text-emerald-800">
              Ativo
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Status</p>
            <p className="text-2xl font-bold text-gray-900">
              {student.codigo_Status === 1 ? "Ativo" : "Inativo"}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {student.tb_matriculas?.tb_confirmacoes?.[0]?.tb_turmas?.tb_classes?.designacao}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Classe</p>
            <p className="text-2xl font-bold text-gray-900">
              {student.tb_matriculas?.tb_confirmacoes?.[0]?.tb_turmas?.tb_classes?.designacao || "N/A"}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <Badge variant={student.saldo > 0 ? "destructive" : "default"} className="text-xs">
              {student.saldo > 0 ? "Pendente" : "Em dia"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Saldo</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(student.saldo)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="academic">Acadêmico</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-sm font-semibold text-gray-900">{student.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexo</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {student.sexo === 'M' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(student.dataNascimento)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Idade</label>
                    <p className="text-sm font-semibold text-gray-900">{calculateAge(student.dataNascimento)} anos</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome do Pai</label>
                    <p className="text-sm font-semibold text-gray-900">{student.pai}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome da Mãe</label>
                    <p className="text-sm font-semibold text-gray-900">{student.mae}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{student.telefone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{student.morada}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Encarregado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Encarregado de Educação</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-sm font-semibold text-gray-900">{student.tb_encarregados.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Profissão</label>
                    <p className="text-sm font-semibold text-gray-900">{student.tb_encarregados.tb_profissao.designacao}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Local de Trabalho</label>
                    <p className="text-sm font-semibold text-gray-900">{student.tb_encarregados.local_Trabalho}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{student.tb_encarregados.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{student.tb_encarregados.telefone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Matrícula */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Curso</label>
                    <p className="text-sm font-semibold text-gray-900">{student.tb_matriculas?.tb_cursos.designacao}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Matrícula</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(student.tb_matriculas?.data_Matricula || '')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status da Matrícula</label>
                    <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                      {student.tb_matriculas?.codigoStatus === 1 ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações da Turma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Turma Atual</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.tb_matriculas?.tb_confirmacoes?.[0] && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Turma</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {student.tb_matriculas.tb_confirmacoes[0].tb_turmas.designacao}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Classe</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {student.tb_matriculas.tb_confirmacoes[0].tb_turmas.tb_classes.designacao}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sala</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {student.tb_matriculas.tb_confirmacoes[0].tb_turmas.tb_salas.designacao}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Período</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {student.tb_matriculas.tb_confirmacoes[0].tb_turmas.tb_periodos.designacao}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Data de Confirmação</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(student.tb_matriculas.tb_confirmacoes[0].data_Confirmacao)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Resumo Financeiro</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Saldo Atual</label>
                    <p className={`text-2xl font-bold ${student.saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(student.saldo)}
                    </p>
                  </div>
                  {student.motivo_Desconto && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tipo de Desconto</label>
                        <p className="text-sm font-semibold text-gray-900">{student.tipo_desconto}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Motivo do Desconto</label>
                        <p className="text-sm font-semibold text-gray-900">{student.motivo_Desconto}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Pagamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Últimos Pagamentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.tb_pagamentos.map((pagamento) => (
                    <div key={pagamento.codigo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{pagamento.tipo}</p>
                        <p className="text-xs text-gray-500">{formatDate(pagamento.data_Pagamento)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{formatCurrency(pagamento.valor)}</p>
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          {pagamento.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Documentos de Identificação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Documento</label>
                  <p className="text-sm font-semibold text-gray-900">{student.tb_tipo_documento.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Número do Documento</label>
                  <p className="text-sm font-semibold text-gray-900">{student.n_documento_identificacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Província de Emissão</label>
                  <p className="text-sm font-semibold text-gray-900">{student.provinciaEmissao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(student.dataCadastro)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
