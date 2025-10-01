"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Save,
  X,
  CreditCard,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function AddPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    estudante_id: '',
    tipo_pagamento: '',
    valor: '',
    metodo_pagamento: '',
    data_pagamento: '',
    data_vencimento: '',
    descricao: '',
    observacoes: '',
    status: 'pendente'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular criação do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/admin/finance-management/payments');
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container>
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Novo Pagamento</h1>
                <p className="text-sm text-muted-foreground">Registrar novo pagamento de estudante</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                form="payment-form"
                disabled={loading}
                className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Pagamento
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações do Estudante */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Informações do Estudante</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Estudante *
                  </label>
                  <select
                    value={formData.estudante_id}
                    onChange={(e) => setFormData({...formData, estudante_id: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar estudante</option>
                    <option value="1">João Manuel Silva - 10ª A</option>
                    <option value="2">Maria Santos Costa - 11ª B</option>
                    <option value="3">Pedro António Neto - 9ª C</option>
                    <option value="4">Ana Paula Francisco - 12ª A</option>
                    <option value="5">Carlos Alberto Mendes - 10ª B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tipo de Pagamento *
                  </label>
                  <select
                    value={formData.tipo_pagamento}
                    onChange={(e) => setFormData({...formData, tipo_pagamento: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar tipo</option>
                    <option value="propina">Propina Mensal</option>
                    <option value="matricula">Taxa de Matrícula</option>
                    <option value="confirmacao">Taxa de Confirmação</option>
                    <option value="exame">Taxa de Exame</option>
                    <option value="material">Material Escolar</option>
                    <option value="uniforme">Uniforme</option>
                    <option value="transporte">Transporte</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Pagamento */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Informações do Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Valor (AOA) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 25000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Método de Pagamento *
                  </label>
                  <select
                    value={formData.metodo_pagamento}
                    onChange={(e) => setFormData({...formData, metodo_pagamento: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar método</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="transferencia">Transferência Bancária</option>
                    <option value="multicaixa">Multicaixa Express</option>
                    <option value="cheque">Cheque</option>
                    <option value="cartao">Cartão de Débito/Crédito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Datas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Pagamento
                  </label>
                  <input
                    type="date"
                    value={formData.data_pagamento}
                    onChange={(e) => setFormData({...formData, data_pagamento: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição e Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <span>Detalhes Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Ex: Propina referente ao mês de Outubro 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Observações adicionais sobre o pagamento..."
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
