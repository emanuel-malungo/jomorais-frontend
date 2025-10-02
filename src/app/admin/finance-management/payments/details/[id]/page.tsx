"use client";

import React, { useState } from 'react';
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
import { usePagamentoPrincipal } from '@/hooks/usePayment';

export default function PaymentDetails() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Hook da API para buscar dados reais
  const paymentId = parseInt(params.id as string);
  const { pagamento: payment, loading, error } = usePagamentoPrincipal(paymentId);

  const handleEdit = () => {
    router.push(`/admin/finance-management/payments/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push('/admin/finance-management/payments');
  };

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      1: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      0: { label: 'Inativo', className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (error) {
    return (
      <Container>
        <div className="text-center py-12">
          <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar pagamento</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pagamentos
          </Button>
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
            <p className="text-muted-foreground">
              {payment.aluno?.nome || payment.tb_alunos?.nome || 'Aluno não identificado'} - Código: {payment.codigo}
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
                <p className="text-sm font-medium text-muted-foreground">Valor Entregue</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(payment.valorEntregue)}
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
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-lg font-semibold text-foreground">
                  {payment.total ? formatCurrency(payment.total) : 'Não informado'}
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
                <p className="text-sm font-medium text-muted-foreground">Data do Banco</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(payment.dataBanco)}
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="student">Estudante</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
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
                  <label className="text-sm font-medium text-muted-foreground">Código do Pagamento</label>
                  <p className="text-foreground font-mono">#{payment.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor Entregue</label>
                  <p className="text-foreground text-lg font-semibold">
                    {formatCurrency(payment.valorEntregue)}
                  </p>
                </div>
                {payment.total && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Valor Total</label>
                    <p className="text-foreground">
                      {formatCurrency(payment.total)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
                {payment.totalDesconto && payment.totalDesconto > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Desconto</label>
                    <p className="text-foreground text-green-600">
                      -{formatCurrency(payment.totalDesconto)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Datas e Informações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Datas e Informações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data do Pagamento</label>
                  <p className="text-foreground">
                    {formatDate(payment.data)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data do Banco</label>
                  <p className="text-foreground">
                    {formatDate(payment.dataBanco)}
                  </p>
                </div>
                {payment.obs && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-foreground text-sm bg-muted p-3 rounded-lg">
                      {payment.obs}
                    </p>
                  </div>
                )}
                {payment.borderoux && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Borderô</label>
                    <p className="text-foreground font-mono">{payment.borderoux}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="text-foreground">
                    {payment.aluno?.nome || payment.tb_alunos?.nome || 'Não informado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Código do Aluno</label>
                  <p className="text-foreground font-mono">
                    #{payment.codigo_Aluno}
                  </p>
                </div>
                {payment.tb_alunos?.numeroMatricula && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número de Matrícula</label>
                    <p className="text-foreground font-mono">
                      {payment.tb_alunos.numeroMatricula}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Detalhes do Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {payment.detalhes && payment.detalhes.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Serviços Pagos:</h4>
                  {payment.detalhes.map((detalhe, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Serviço</label>
                          <p className="text-foreground">
                            {detalhe.tipoServico?.designacao || detalhe.tb_tipo_servicos?.designacao || 'Não informado'}
                          </p>
                        </div>
                        {detalhe.preco && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Preço</label>
                            <p className="text-foreground">
                              {formatCurrency(detalhe.preco)}
                            </p>
                          </div>
                        )}
                        {detalhe.quantidade && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Quantidade</label>
                            <p className="text-foreground">{detalhe.quantidade}</p>
                          </div>
                        )}
                        {detalhe.desconto && detalhe.desconto > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Desconto</label>
                            <p className="text-foreground text-green-600">
                              -{formatCurrency(detalhe.desconto)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum detalhe de serviço disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
