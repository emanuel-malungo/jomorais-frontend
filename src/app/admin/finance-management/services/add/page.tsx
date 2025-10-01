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
  Briefcase,
  DollarSign,
  Calendar,
  Settings
} from 'lucide-react';

export default function AddService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    valor: '',
    tipo_cobranca: 'unico',
    obrigatorio: false,
    aplicavel_classes: [] as string[],
    data_inicio: '',
    data_fim: '',
    observacoes: '',
    status: 'ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular criação do serviço
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/admin/finance-management/services');
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleClasseToggle = (classe: string) => {
    setFormData(prev => ({
      ...prev,
      aplicavel_classes: prev.aplicavel_classes.includes(classe)
        ? prev.aplicavel_classes.filter(c => c !== classe)
        : [...prev.aplicavel_classes, classe]
    }));
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
                <h1 className="text-xl font-semibold text-foreground">Novo Serviço</h1>
                <p className="text-sm text-muted-foreground">Criar novo serviço adicional</p>
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
                form="service-form"
                disabled={loading}
                className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Serviço
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <form id="service-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: Transporte Escolar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar categoria</option>
                    <option value="transporte">Transporte</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="material">Material Escolar</option>
                    <option value="uniforme">Uniforme</option>
                    <option value="atividades">Atividades Extracurriculares</option>
                    <option value="seguro">Seguro Escolar</option>
                    <option value="certificados">Certificados e Documentos</option>
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
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Descrição detalhada do serviço..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações Financeiras */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Configurações Financeiras</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Valor (AOA) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 15000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tipo de Cobrança *
                  </label>
                  <select
                    value={formData.tipo_cobranca}
                    onChange={(e) => setFormData({...formData, tipo_cobranca: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="unico">Pagamento Único</option>
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="obrigatorio"
                  checked={formData.obrigatorio}
                  onChange={(e) => setFormData({...formData, obrigatorio: e.target.checked})}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-border rounded"
                />
                <label htmlFor="obrigatorio" className="text-sm font-medium text-foreground">
                  Serviço obrigatório para todos os estudantes
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Classes Aplicáveis */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>Classes Aplicáveis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Selecionar classes onde o serviço será aplicado:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {Array.from({length: 12}, (_, i) => i + 1).map((classe) => (
                    <label key={classe} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.aplicavel_classes.includes(classe.toString())}
                        onChange={() => handleClasseToggle(classe.toString())}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-border rounded"
                      />
                      <span className="text-sm text-foreground">{classe}ª Classe</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Se nenhuma classe for selecionada, o serviço será aplicável a todas as classes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Período de Vigência */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>Período de Vigência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  required
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
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
                  placeholder="Observações adicionais sobre o serviço..."
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
