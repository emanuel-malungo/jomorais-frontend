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
  FileText,
  User,
  DollarSign,
  Calendar,
  History,
  CreditCard
} from 'lucide-react';

interface CreditNote {
  id: number;
  estudante: string;
  classe: string;
  turma: string;
  tipo_credito: string;
  valor: number;
  motivo: string;
  descricao: string;
  data_emissao: string;
  data_validade: string;
  aplicar_automaticamente: boolean;
  status: string;
  observacoes: string;
  valor_utilizado: number;
  numero_nota: string;
}

export default function CreditNoteDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [creditNote, setCreditNote] = useState<CreditNote | null>(null);

  // Dados mockados das notas de crédito
  const creditNotesData: CreditNote[] = [
    {
      id: 1,
      estudante: "João Manuel Silva",
      classe: "10ª",
      turma: "A",
      tipo_credito: "desconto",
      valor: 10000,
      motivo: "desconto_promocional",
      descricao: "Desconto promocional para estudantes com bom desempenho acadêmico",
      data_emissao: "2024-09-15",
      data_validade: "2024-12-31",
      aplicar_automaticamente: true,
      status: "ativo",
      observacoes: "Desconto aplicável nas próximas 3 mensalidades",
      valor_utilizado: 0,
      numero_nota: "NC-2024-001"
    },
    {
      id: 2,
      estudante: "Maria Santos Costa",
      classe: "11ª",
      turma: "B",
      tipo_credito: "reembolso",
      valor: 25000,
      motivo: "pagamento_duplicado",
      descricao: "Reembolso devido a pagamento duplicado da propina de setembro",
      data_emissao: "2024-09-20",
      data_validade: "",
      aplicar_automaticamente: false,
      status: "utilizado",
      observacoes: "Valor já aplicado na propina de outubro",
      valor_utilizado: 25000,
      numero_nota: "NC-2024-002"
    }
  ];

  useEffect(() => {
    const loadCreditNote = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const creditNoteId = parseInt(params.id as string);
      const foundCreditNote = creditNotesData.find(cn => cn.id === creditNoteId);
      
      if (foundCreditNote) {
        setCreditNote(foundCreditNote);
      }
      
      setLoading(false);
    };

    loadCreditNote();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin/finance-management/credit-notes/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push('/admin/finance-management/credit-notes');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ativo': { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      'utilizado': { label: 'Utilizado', className: 'bg-blue-100 text-blue-800' },
      'expirado': { label: 'Expirado', className: 'bg-red-100 text-red-800' },
      'cancelado': { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTipoCreditoLabel = (tipo: string) => {
    const tipos = {
      'reembolso': 'Reembolso',
      'desconto': 'Desconto',
      'bolsa': 'Bolsa de Estudo',
      'promocao': 'Promoção',
      'compensacao': 'Compensação',
      'outros': 'Outros'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getMotivoLabel = (motivo: string) => {
    const motivos = {
      'pagamento_duplicado': 'Pagamento Duplicado',
      'erro_cobranca': 'Erro na Cobrança',
      'cancelamento_servico': 'Cancelamento de Serviço',
      'desconto_promocional': 'Desconto Promocional',
      'bolsa_merito': 'Bolsa por Mérito',
      'bolsa_carencia': 'Bolsa por Carência',
      'compensacao_problema': 'Compensação por Problema',
      'outros': 'Outros'
    };
    return motivos[motivo as keyof typeof motivos] || motivo;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes da nota de crédito...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!creditNote) {
    return (
      <Container>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Nota de crédito não encontrada</h2>
          <p className="text-muted-foreground mb-6">A nota de crédito solicitada não foi encontrada.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Notas de Crédito
          </Button>
        </div>
      </Container>
    );
  }

  const valorDisponivel = creditNote.valor - creditNote.valor_utilizado;

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
            <h1 className="text-2xl font-bold text-foreground">Nota de Crédito {creditNote.numero_nota}</h1>
            <p className="text-muted-foreground">{creditNote.estudante} - {getTipoCreditoLabel(creditNote.tipo_credito)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {creditNote.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
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
                <p className="text-sm font-medium text-muted-foreground">Valor Utilizado</p>
                <p className="text-2xl font-bold text-foreground">
                  {creditNote.valor_utilizado.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Disponível</p>
                <p className="text-2xl font-bold text-foreground">
                  {valorDisponivel.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
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
                  {getStatusBadge(creditNote.status)}
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="student">Estudante</TabsTrigger>
          <TabsTrigger value="usage">Utilização</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Nota de Crédito */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Informações da Nota de Crédito</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número da Nota</label>
                  <p className="text-foreground">{creditNote.numero_nota}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Crédito</label>
                  <p className="text-foreground">{getTipoCreditoLabel(creditNote.tipo_credito)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Motivo</label>
                  <p className="text-foreground">{getMotivoLabel(creditNote.motivo)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-foreground">{creditNote.descricao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(creditNote.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datas e Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Datas e Configurações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Emissão</label>
                  <p className="text-foreground">
                    {new Date(creditNote.data_emissao).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {creditNote.data_validade && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Validade</label>
                    <p className="text-foreground">
                      {new Date(creditNote.data_validade).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Aplicação Automática</label>
                  <div className="mt-1">
                    <Badge className={creditNote.aplicar_automaticamente ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {creditNote.aplicar_automaticamente ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                </div>
                {creditNote.observacoes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-foreground">{creditNote.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações do Estudante</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="text-foreground">{creditNote.estudante}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Classe</label>
                  <p className="text-foreground">{creditNote.classe} Classe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Turma</label>
                  <p className="text-foreground">Turma {creditNote.turma}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Utilização do Crédito</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Progresso de Utilização</span>
                    <span className="text-sm font-bold text-foreground">
                      {((creditNote.valor_utilizado / creditNote.valor) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(creditNote.valor_utilizado / creditNote.valor) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {creditNote.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </div>
                    <div className="text-sm font-medium text-green-800">Valor Total</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {creditNote.valor_utilizado.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </div>
                    <div className="text-sm font-medium text-blue-800">Valor Utilizado</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {valorDisponivel.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </div>
                    <div className="text-sm font-medium text-purple-800">Valor Disponível</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Histórico de Alterações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Nota de crédito criada</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(creditNote.data_emissao).toLocaleDateString('pt-BR')} às 14:30
                    </p>
                  </div>
                </div>
                {creditNote.valor_utilizado > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Crédito utilizado</p>
                      <p className="text-xs text-muted-foreground">
                        Valor: {creditNote.valor_utilizado.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </p>
                    </div>
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
