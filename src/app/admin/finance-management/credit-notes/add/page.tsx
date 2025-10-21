"use client";

import React, { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useCreateCreditNote } from '@/hooks/useCreditNote';
import useStudent from '@/hooks/useStudent';
import { ICreditNoteInput } from '@/types/creditNote.types';

export default function AddCreditNote() {
  const router = useRouter();
  const { createCreditNote, loading } = useCreateCreditNote();
  const { students, loading: studentsLoading, getAllStudents } = useStudent();
  
  const [studentSearch, setStudentSearch] = useState('');
  const [formData, setFormData] = useState<ICreditNoteInput>({
    designacao: '',
    fatura: '',
    descricao: '',
    valor: '',
    codigo_aluno: 0,
    documento: '',
    next: '',
    dataOperacao: new Date().toISOString().split('T')[0],
    hash: '',
    codigoPagamentoi: undefined
  });

  // Carregar estudantes com debounce na busca
  useEffect(() => {
    const timer = setTimeout(() => {
      getAllStudents(1, 50, studentSearch); // Apenas 50 estudantes por vez
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [studentSearch, getAllStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação antes de enviar
    if (!formData.codigo_aluno || formData.codigo_aluno === 0) {
      alert('Por favor, selecione um estudante');
      return;
    }

    if (!formData.designacao.trim()) {
      alert('Por favor, preencha a designação');
      return;
    }

    if (!formData.fatura.trim()) {
      alert('Por favor, preencha o número da fatura');
      return;
    }

    if (!formData.documento.trim()) {
      alert('Por favor, preencha o documento');
      return;
    }

    if (!formData.descricao.trim()) {
      alert('Por favor, preencha a descrição');
      return;
    }

    if (!formData.valor.trim()) {
      alert('Por favor, preencha o valor');
      return;
    }

    try {
      console.log('📤 Enviando dados:', formData);
      await createCreditNote(formData);
      router.push('/admin/finance-management/credit-notes');
    } catch (error) {
      console.error('❌ Erro ao criar nota de crédito:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

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
                <h1 className="text-2xl font-bold text-foreground">Nova Nota de Crédito</h1>
                <p className="text-sm text-muted-foreground">
                  Adicione uma nova nota de crédito para estudante
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="credit-note-form"
                disabled={loading}
                className="bg-[#3B6C4D] hover:bg-[#2d5016]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Nota de Crédito
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-8">
        <form id="credit-note-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileText className="w-6 h-6 mr-3 text-blue-500" />
                Informações Básicas
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
                    Estudante *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Buscar estudante por nome..."
                      className="w-full h-10 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground text-sm"
                    />
                    <Select
                      value={formData.codigo_aluno.toString()}
                      onValueChange={(value) => setFormData({...formData, codigo_aluno: parseInt(value)})}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecionar estudante" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentsLoading ? (
                          <SelectItem value="0" disabled>
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                              <span>Carregando...</span>
                            </div>
                          </SelectItem>
                        ) : students && students.length > 0 ? (
                          <>
                            {students.map((student) => (
                              <SelectItem key={student.codigo} value={student.codigo.toString()}>
                                {student.nome}
                              </SelectItem>
                            ))}
                            {students.length === 50 && (
                              <SelectItem value="0" disabled className="text-xs text-muted-foreground">
                                Use a busca para encontrar mais estudantes
                              </SelectItem>
                            )}
                          </>
                        ) : studentSearch ? (
                          <SelectItem value="0" disabled>Nenhum estudante encontrado</SelectItem>
                        ) : (
                          <SelectItem value="0" disabled>Digite para buscar estudantes</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <DollarSign className="w-6 h-6 mr-3 text-green-500" />
                Informações do Crédito
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileText className="w-6 h-6 mr-3 text-orange-500" />
                Informações Adicionais
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
