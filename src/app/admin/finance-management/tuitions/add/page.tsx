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
  GraduationCap,
  DollarSign,
  Calendar,
  Settings
} from 'lucide-react';

export default function AddTuition() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    classe: '',
    curso: '',
    periodo: '',
    ano_letivo: '',
    valor_mensal: '',
    valor_matricula: '',
    valor_confirmacao: '',
    valor_exame: '',
    desconto_pontualidade: '',
    multa_atraso: '',
    data_vencimento: '',
    observacoes: '',
    status: 'ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular criação da propina
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/admin/finance-management/tuitions');
    } catch (error) {
      console.error('Erro ao criar propina:', error);
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
                <h1 className="text-xl font-semibold text-foreground">Nova Propina</h1>
                <p className="text-sm text-muted-foreground">Configurar valores de propina para classe/curso</p>
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
                form="tuition-form"
                disabled={loading}
                className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Propina
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <form id="tuition-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Acadêmicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span>Informações Acadêmicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Classe *
                  </label>
                  <select
                    value={formData.classe}
                    onChange={(e) => setFormData({...formData, classe: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar classe</option>
                    <option value="1">1ª Classe</option>
                    <option value="2">2ª Classe</option>
                    <option value="3">3ª Classe</option>
                    <option value="4">4ª Classe</option>
                    <option value="5">5ª Classe</option>
                    <option value="6">6ª Classe</option>
                    <option value="7">7ª Classe</option>
                    <option value="8">8ª Classe</option>
                    <option value="9">9ª Classe</option>
                    <option value="10">10ª Classe</option>
                    <option value="11">11ª Classe</option>
                    <option value="12">12ª Classe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Curso
                  </label>
                  <select
                    value={formData.curso}
                    onChange={(e) => setFormData({...formData, curso: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Curso Geral</option>
                    <option value="informatica">Informática de Gestão</option>
                    <option value="contabilidade">Contabilidade e Gestão</option>
                    <option value="administracao">Administração Pública</option>
                    <option value="economia">Economia</option>
                    <option value="ciencias">Ciências Físicas e Biológicas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Período *
                  </label>
                  <select
                    value={formData.periodo}
                    onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar período</option>
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Ano Letivo *
                  </label>
                  <select
                    value={formData.ano_letivo}
                    onChange={(e) => setFormData({...formData, ano_letivo: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar ano letivo</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valores Principais */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Valores Principais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Propina Mensal (AOA) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor_mensal}
                    onChange={(e) => setFormData({...formData, valor_mensal: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 25000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Taxa de Matrícula (AOA) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor_matricula}
                    onChange={(e) => setFormData({...formData, valor_matricula: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 15000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Taxa de Confirmação (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.valor_confirmacao}
                    onChange={(e) => setFormData({...formData, valor_confirmacao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 8000"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Taxa de Exame (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.valor_exame}
                    onChange={(e) => setFormData({...formData, valor_exame: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 5000"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Adicionais */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>Configurações Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Desconto Pontualidade (%)
                  </label>
                  <input
                    type="number"
                    value={formData.desconto_pontualidade}
                    onChange={(e) => setFormData({...formData, desconto_pontualidade: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 5"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Multa por Atraso (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.multa_atraso}
                    onChange={(e) => setFormData({...formData, multa_atraso: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 2500"
                    min="0"
                    step="0.01"
                  />
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
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data e Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>Data e Observações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Data de Vencimento Padrão *
                </label>
                <input
                  type="number"
                  value={formData.data_vencimento}
                  onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                  className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Ex: 30 (dia do mês)"
                  min="1"
                  max="31"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dia do mês em que a propina vence (ex: 30 = todo dia 30 do mês)
                </p>
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
                  placeholder="Observações sobre a configuração da propina..."
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
