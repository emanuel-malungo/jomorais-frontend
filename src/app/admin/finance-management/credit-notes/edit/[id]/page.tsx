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
import { useCreditNote, useUpdateCreditNote } from '@/hooks/useCreditNote';
import { ICreditNoteInput } from '@/types/creditNote.types';

export default function EditCreditNote() {
  const params = useParams();
  const router = useRouter();
  const creditNoteId = parseInt(params.id as string);
  
  const { creditNote, loading, fetchCreditNote } = useCreditNote(creditNoteId);
  const { updateCreditNote, loading: updating } = useUpdateCreditNote();
  const [formData, setFormData] = useState<ICreditNoteInput>({
    designacao: '',
    fatura: '',
    descricao: '',
    valor: '',
    codigo_aluno: 0,
    documento: '',
    next: '',
    dataOperacao: '',
    hash: '',
    codigoPagamentoi: undefined
  });

  // Carregar nota de crédito
  useEffect(() => {
    if (creditNoteId) {
      fetchCreditNote();
    }
  }, [creditNoteId, fetchCreditNote]);

  // Preencher formulário quando nota carregar
  useEffect(() => {
    if (creditNote) {
      setFormData({
        designacao: creditNote.designacao || '',
        fatura: creditNote.fatura || '',
        descricao: creditNote.descricao || '',
        valor: creditNote.valor || '',
        codigo_aluno: creditNote.codigo_aluno || 0,
        documento: creditNote.documento || '',
        next: creditNote.next || '',
        dataOperacao: creditNote.dataOperacao || '',
        hash: creditNote.hash || '',
        codigoPagamentoi: creditNote.codigoPagamentoi
      });
    }
  }, [creditNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Remover codigo_aluno do payload de atualização (não pode ser alterado)
      const { codigo_aluno, ...updateData } = formData;
      
      console.log('📤 Enviando dados para atualização:', updateData);
      await updateCreditNote(creditNoteId, updateData);
      router.push('/admin/finance-management/credit-notes');
    } catch (error) {
      console.error('Erro ao atualizar nota de crédito:', error);
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
      {/* Header */}
      <div className="bg-background border-b shadow-sm mb-8 rounded-2xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Nota de Crédito</h1>
                <p className="text-sm text-muted-foreground">
                  Atualizar informações da nota de crédito
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={updating}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="credit-note-form"
                disabled={updating}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-8">
        <form id="credit-note-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Designação *
                  </label>
                  <input
                    type="text"
                    value={formData.designacao}
                    onChange={(e) => setFormData({...formData, designacao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: NC-2024-001"
                    required
                    maxLength={45}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Número da Fatura *
                  </label>
                  <input
                    type="text"
                    value={formData.fatura}
                    onChange={(e) => setFormData({...formData, fatura: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: FT-2024-12345"
                    required
                    maxLength={45}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Estudante * <span className="text-xs text-muted-foreground">(não pode ser alterado)</span>
                  </label>
                  <input
                    type="text"
                    value={creditNote?.tb_alunos?.nome || 'Carregando...'}
                    disabled
                    className="w-full h-12 px-4 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Código do aluno: {formData.codigo_aluno}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Documento *
                  </label>
                  <input
                    type="text"
                    value={formData.documento}
                    onChange={(e) => setFormData({...formData, documento: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: DOC-2024-001"
                    required
                    maxLength={45}
                  />
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
                    type="text"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 10000.00"
                    required
                    maxLength={45}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data da Operação
                  </label>
                  <input
                    type="date"
                    value={formData.dataOperacao}
                    onChange={(e) => setFormData({...formData, dataOperacao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                  />
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
                  placeholder="Descrição detalhada da nota de crédito..."
                  required
                  maxLength={45}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <span>Informações Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Next
                  </label>
                  <input
                    type="text"
                    value={formData.next}
                    onChange={(e) => setFormData({...formData, next: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Próximo documento"
                    maxLength={45}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Hash
                  </label>
                  <input
                    type="text"
                    value={formData.hash}
                    onChange={(e) => setFormData({...formData, hash: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Hash do documento"
                    maxLength={555}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
