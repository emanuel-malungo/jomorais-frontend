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
  CreditCard,
  User,
  Calendar,
  DollarSign,
  FileText,
  Receipt,
  History
} from 'lucide-react';

interface Payment {
  id: number;
  estudante: string;
  classe: string;
  turma: string;
  tipo_pagamento: string;
  valor: number;
  metodo_pagamento: string;
  data_pagamento: string;
  data_vencimento: string;
  status: string;
  descricao: string;
  observacoes: string;
  numero_recibo: string;
}

export default function PaymentDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [payment, setPayment] = useState<Payment | null>(null);

  // Dados mockados dos pagamentos
  const paymentsData: Payment[] = [
    {
      id: 1,
      estudante: "João Manuel Silva",
      classe: "10ª",
      turma: "A",
      tipo_pagamento: "propina",
      valor: 25000,
      metodo_pagamento: "transferencia",
      data_pagamento: "2024-09-30",
      data_vencimento: "2024-09-30",
      status: "pago",
      descricao: "Propina referente ao mês de Setembro 2024",
      observacoes: "Pagamento efetuado via transferência bancária",
      numero_recibo: "REC-2024-001234"
    },
    {
      id: 2,
      estudante: "Maria Santos Costa",
      classe: "11ª",
      turma: "B",
      tipo_pagamento: "matricula",
      valor: 15000,
      metodo_pagamento: "dinheiro",
      data_pagamento: "",
      data_vencimento: "2024-10-15",
      status: "pendente",
      descricao: "Taxa de matrícula para o ano letivo 2024/2025",
      observacoes: "",
      numero_recibo: ""
    }
  ];

  useEffect(() => {
    const loadPayment = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentId = parseInt(params.id as string);
      const foundPayment = paymentsData.find(p => p.id === paymentId);
      
      if (foundPayment) {
        setPayment(foundPayment);
      }
      
      setLoading(false);
    };

    loadPayment();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/admin/finance-management/payments/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push('/admin/finance-management/payments');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pago': { label: 'Pago', className: 'bg-green-100 text-green-800' },
      'pendente': { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      'atrasado': { label: 'Atrasado', className: 'bg-red-100 text-red-800' },
      'cancelado': { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      'propina': 'Propina Mensal',
      'matricula': 'Taxa de Matrícula',
      'confirmacao': 'Taxa de Confirmação',
      'exame': 'Taxa de Exame',
      'material': 'Material Escolar',
      'uniforme': 'Uniforme',
      'transporte': 'Transporte',
      'alimentacao': 'Alimentação',
      'outros': 'Outros'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getMetodoLabel = (metodo: string) => {
    const metodos = {
      'dinheiro': 'Dinheiro',
      'transferencia': 'Transferência Bancária',
      'multicaixa': 'Multicaixa Express',
      'cheque': 'Cheque',
      'cartao': 'Cartão de Débito/Crédito'
    };
    return metodos[metodo as keyof typeof metodos] || metodo;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes do pagamento...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!payment) {
    return (
      <Container>
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Pagamento não encontrado</h2>
          <p className="text-muted-foreground mb-6">O pagamento solicitado não foi encontrado.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pagamentos
          </Button>
        </div>
      </Container>
    );
  }

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
            <h1 className="text-2xl font-bold text-foreground">Detalhes do Pagamento</h1>
            <p className="text-muted-foreground">{payment.estudante} - {getTipoLabel(payment.tipo_pagamento)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Valor</p>
                <p className="text-2xl font-bold text-foreground">
                  {payment.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
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
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-2">
                  {getStatusBadge(payment.status)}
                </div>
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
                <p className="text-sm font-medium text-muted-foreground">Método</p>
                <p className="text-lg font-semibold text-foreground">
                  {getMetodoLabel(payment.metodo_pagamento)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vencimento</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(payment.data_vencimento).toLocaleDateString('pt-BR')}
                </p>
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
          <TabsTrigger value="receipt">Recibo</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações do Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Informações do Pagamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Pagamento</label>
                  <p className="text-foreground">{getTipoLabel(payment.tipo_pagamento)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className="text-foreground">
                    {payment.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Método de Pagamento</label>
                  <p className="text-foreground">{getMetodoLabel(payment.metodo_pagamento)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Datas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Vencimento</label>
                  <p className="text-foreground">
                    {new Date(payment.data_vencimento).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {payment.data_pagamento && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Pagamento</label>
                    <p className="text-foreground">
                      {new Date(payment.data_pagamento).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-foreground">{payment.descricao}</p>
                </div>
                {payment.observacoes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-foreground">{payment.observacoes}</p>
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
                  <p className="text-foreground">{payment.estudante}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Classe</label>
                  <p className="text-foreground">{payment.classe} Classe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Turma</label>
                  <p className="text-foreground">Turma {payment.turma}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Recibo de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payment.numero_recibo ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número do Recibo</label>
                    <p className="text-lg font-semibold text-foreground">{payment.numero_recibo}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Recibo gerado automaticamente após confirmação do pagamento.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Recibo será gerado após confirmação do pagamento</p>
                </div>
              )}
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
                    <p className="text-sm font-medium text-foreground">Pagamento criado</p>
                    <p className="text-xs text-muted-foreground">30 de Setembro, 2024 às 14:30</p>
                  </div>
                </div>
                {payment.status === 'pago' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Pagamento confirmado</p>
                      <p className="text-xs text-muted-foreground">30 de Setembro, 2024 às 15:45</p>
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
