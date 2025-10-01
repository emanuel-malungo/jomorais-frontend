"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  FileText,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';

interface CreditNote {
  id: number;
  estudante_id: string;
  tipo_credito: string;
  valor: string;
  motivo: string;
  descricao: string;
  data_emissao: string;
  data_validade: string;
  aplicar_automaticamente: boolean;
  observacoes: string;
  status: string;
}

export default function EditCreditNote() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreditNote>({
    id: 0,
    estudante_id: '',
    tipo_credito: '',
    valor: '',
    motivo: '',
    descricao: '',
    data_emissao: '',
    data_validade: '',
    aplicar_automaticamente: false,
    observacoes: '',
    status: 'ativo'
  });

  // Dados mockados das notas de crédito
  const creditNotesData = [
    {
      id: 1,
      estudante_id: "1",
      tipo_credito: "desconto",
      valor: "10000",
      motivo: "desconto_promocional",
      descricao: "Desconto promocional para estudantes com bom desempenho acadêmico",
      data_emissao: "2024-09-15",
      data_validade: "2024-12-31",
      aplicar_automaticamente: true,
      status: "ativo",
      observacoes: "Desconto aplicável nas próximas 3 mensalidades"
    },
    {
      id: 2,
      estudante_id: "2",
      tipo_credito: "reembolso",
      valor: "25000",
      motivo: "pagamento_duplicado",
      descricao: "Reembolso devido a pagamento duplicado da propina de setembro",
      data_emissao: "2024-09-20",
      data_validade: "",
      aplicar_automaticamente: false,
      status: "utilizado",
      observacoes: "Valor já aplicado na propina de outubro"
    }
  ];

  useEffect(() => {
    const loadCreditNote = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const creditNoteId = parseInt(params.id as string);
      const foundCreditNote = creditNotesData.find(cn => cn.id === creditNoteId);
      
      if (foundCreditNote) {
        setFormData(foundCreditNote);
      }
      
      setLoading(false);
    };

    loadCreditNote();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simular atualização da nota de crédito
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push(`/admin/finance-management/credit-notes/details/${params.id}`);
    } catch (error) {
      console.error('Erro ao atualizar nota de crédito:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados da nota de crédito...</p>
          </div>
        </div>
      </Container>
    );
  }

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
                <h1 className="text-xl font-semibold text-foreground">Editar Nota de Crédito</h1>
                <p className="text-sm text-muted-foreground">Atualizar informações da nota de crédito</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                form="credit-note-form"
                disabled={saving}
                className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <form id="credit-note-form" onSubmit={handleSubmit} className="space-y-8">
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
                    Tipo de Crédito *
                  </label>
                  <select
                    value={formData.tipo_credito}
                    onChange={(e) => setFormData({...formData, tipo_credito: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar tipo</option>
                    <option value="reembolso">Reembolso</option>
                    <option value="desconto">Desconto</option>
                    <option value="bolsa">Bolsa de Estudo</option>
                    <option value="promocao">Promoção</option>
                    <option value="compensacao">Compensação</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Crédito */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Informações do Crédito</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Valor do Crédito (AOA) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 10000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Motivo *
                  </label>
                  <select
                    value={formData.motivo}
                    onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar motivo</option>
                    <option value="pagamento_duplicado">Pagamento Duplicado</option>
                    <option value="erro_cobranca">Erro na Cobrança</option>
                    <option value="cancelamento_servico">Cancelamento de Serviço</option>
                    <option value="desconto_promocional">Desconto Promocional</option>
                    <option value="bolsa_merito">Bolsa por Mérito</option>
                    <option value="bolsa_carencia">Bolsa por Carência</option>
                    <option value="compensacao_problema">Compensação por Problema</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Descrição detalhada do motivo do crédito..."
                  required
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="aplicar_automaticamente"
                  checked={formData.aplicar_automaticamente}
                  onChange={(e) => setFormData({...formData, aplicar_automaticamente: e.target.checked})}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-border rounded"
                />
                <label htmlFor="aplicar_automaticamente" className="text-sm font-medium text-foreground">
                  Aplicar automaticamente nos próximos pagamentos
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Datas e Validade */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Datas e Validade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Emissão *
                  </label>
                  <input
                    type="date"
                    value={formData.data_emissao}
                    onChange={(e) => setFormData({...formData, data_emissao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Validade
                  </label>
                  <input
                    type="date"
                    value={formData.data_validade}
                    onChange={(e) => setFormData({...formData, data_validade: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco se o crédito não tem data de validade
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                  required
                >
                  <option value="ativo">Ativo</option>
                  <option value="utilizado">Utilizado</option>
                  <option value="expirado">Expirado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <span>Observações Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Observações adicionais sobre a nota de crédito..."
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
