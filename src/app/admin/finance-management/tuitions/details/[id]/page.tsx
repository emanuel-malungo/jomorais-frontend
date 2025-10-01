"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
  ArrowLeft,
  Edit,
  GraduationCap,
  DollarSign,
  Calendar,
  Settings,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';

interface Tuition {
  id: number;
  classe: string;
  curso: string;
  periodo: string;
  ano_letivo: string;
  valor_mensal: number;
  valor_matricula: number;
  valor_confirmacao: number;
  valor_exame: number;
  desconto_pontualidade: number;
  multa_atraso: number;
  data_vencimento: number;
  status: string;
  observacoes: string;
  total_estudantes: number;
  estudantes_pagos: number;
  estudantes_pendentes: number;
}

export default function TuitionDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [tuition, setTuition] = useState<Tuition | null>(null);

  // Dados mockados das propinas
  const tuitionsData: Tuition[] = [
    {
      id: 1,
      classe: "10",
      curso: "informatica",
      periodo: "manha",
      ano_letivo: "2024/2025",
      valor_mensal: 25000,
      valor_matricula: 15000,
      valor_confirmacao: 8000,
      valor_exame: 5000,
      desconto_pontualidade: 5,
      multa_atraso: 2500,
      data_vencimento: 30,
      status: "ativo",
      observacoes: "Propina para 10ª classe do curso de Informática de Gestão",
      total_estudantes: 35,
      estudantes_pagos: 28,
      estudantes_pendentes: 7
    },
    {
      id: 2,
      classe: "11",
      curso: "contabilidade",
      periodo: "tarde",
      ano_letivo: "2024/2025",
      valor_mensal: 27000,
      valor_matricula: 16000,
      valor_confirmacao: 9000,
      valor_exame: 5500,
      desconto_pontualidade: 3,
      multa_atraso: 3000,
      data_vencimento: 25,
      status: "ativo",
      observacoes: "Propina para 11ª classe do curso de Contabilidade e Gestão",
      total_estudantes: 42,
      estudantes_pagos: 38,
      estudantes_pendentes: 4
    }
  ];

  useEffect(() => {
    const loadTuition = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const tuitionId = parseInt(params.id as string);
      const foundTuition = tuitionsData.find(t => t.id === tuitionId);
      
      if (foundTuition) {
        setTuition(foundTuition);
      }
      
      setLoading(false);
    };

    loadTuition();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin/finance-management/tuitions/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push('/admin/finance-management/tuitions');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ativo': { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      'inativo': { label: 'Inativo', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCursoLabel = (curso: string) => {
    const cursos = {
      'informatica': 'Informática de Gestão',
      'contabilidade': 'Contabilidade e Gestão',
      'administracao': 'Administração Pública',
      'economia': 'Economia',
      'ciencias': 'Ciências Físicas e Biológicas'
    };
    return cursos[curso as keyof typeof cursos] || 'Curso Geral';
  };

  const getPeriodoLabel = (periodo: string) => {
    const periodos = {
      'manha': 'Manhã',
      'tarde': 'Tarde',
      'noite': 'Noite'
    };
    return periodos[periodo as keyof typeof periodos] || periodo;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes da propina...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!tuition) {
    return (
      <Container>
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Propina não encontrada</h2>
          <p className="text-muted-foreground mb-6">A configuração de propina solicitada não foi encontrada.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Propinas
          </Button>
        </div>
      </Container>
    );
  }

  const taxaPagamento = (tuition.estudantes_pagos / tuition.total_estudantes) * 100;

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {tuition.classe}ª Classe - {getCursoLabel(tuition.curso)}
            </h1>
            <p className="text-muted-foreground">
              {getPeriodoLabel(tuition.periodo)} • {tuition.ano_letivo}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Propina Mensal</p>
                <p className="text-2xl font-bold text-foreground">
                  {tuition.valor_mensal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Estudantes</p>
                <p className="text-2xl font-bold text-foreground">{tuition.total_estudantes}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Pagamento</p>
                <p className="text-2xl font-bold text-foreground">{taxaPagamento.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-2">
                  {getStatusBadge(tuition.status)}
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="values">Valores</TabsTrigger>
          <TabsTrigger value="students">Estudantes</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Acadêmicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Informações Acadêmicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Classe</label>
                  <p className="text-foreground">{tuition.classe}ª Classe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Curso</label>
                  <p className="text-foreground">{getCursoLabel(tuition.curso)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Período</label>
                  <p className="text-foreground">{getPeriodoLabel(tuition.periodo)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ano Letivo</label>
                  <p className="text-foreground">{tuition.ano_letivo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(tuition.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Vencimento</label>
                  <p className="text-foreground">Todo dia {tuition.data_vencimento} do mês</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Desconto Pontualidade</label>
                  <p className="text-foreground">{tuition.desconto_pontualidade}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Multa por Atraso</label>
                  <p className="text-foreground">
                    {tuition.multa_atraso.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </p>
                </div>
                {tuition.observacoes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-foreground">{tuition.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Tabela de Valores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Propina Mensal</span>
                    <span className="text-lg font-bold text-foreground">
                      {tuition.valor_mensal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Taxa de Matrícula</span>
                    <span className="text-lg font-bold text-foreground">
                      {tuition.valor_matricula.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Taxa de Confirmação</span>
                    <span className="text-lg font-bold text-foreground">
                      {tuition.valor_confirmacao.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">Taxa de Exame</span>
                    <span className="text-lg font-bold text-foreground">
                      {tuition.valor_exame.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Situação dos Estudantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{tuition.estudantes_pagos}</div>
                  <div className="text-sm font-medium text-green-800">Estudantes em Dia</div>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{tuition.estudantes_pendentes}</div>
                  <div className="text-sm font-medium text-yellow-800">Pagamentos Pendentes</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{tuition.total_estudantes}</div>
                  <div className="text-sm font-medium text-blue-800">Total de Estudantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Estatísticas Financeiras</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Taxa de Pagamento</span>
                    <span className="text-sm font-bold text-foreground">{taxaPagamento.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${taxaPagamento}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receita Mensal Esperada</label>
                    <p className="text-xl font-bold text-foreground">
                      {(tuition.valor_mensal * tuition.total_estudantes).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receita Atual</label>
                    <p className="text-xl font-bold text-foreground">
                      {(tuition.valor_mensal * tuition.estudantes_pagos).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
