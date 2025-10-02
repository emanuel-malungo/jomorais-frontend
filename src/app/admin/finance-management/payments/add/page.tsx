'use client';

import { useState, useEffect, useRef } from 'react';
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
  DollarSign,
  Receipt,
  Hash,
  FileText
} from 'lucide-react';
import { useCreatePagamentoPrincipal, useAlunosBasicos } from '@/hooks/usePaymentPrincipal';
import { 
  IPagamentoPrincipalInput, 
  StatusPagamentoEnum, 
  TipoDocumentoEnum 
} from '@/types/financialService.types';
export default function AddPayment() {
  const router = useRouter();
  const { createPagamentoPrincipal, isCreating, error } = useCreatePagamentoPrincipal();
  const { alunos, isLoading: alunosLoading } = useAlunosBasicos();
  
  // Estados para a combobox de alunos
  const [alunoSearch, setAlunoSearch] = useState('');
  const [isAlunoDropdownOpen, setIsAlunoDropdownOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<any>(null);
  const alunoDropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<IPagamentoPrincipalInput>({
    data: new Date().toISOString().split('T')[0], // Data atual
    codigo_Aluno: 0,
    status: StatusPagamentoEnum.ATIVO,
    total: 0,
    valorEntregue: 0,
    dataBanco: new Date().toISOString().split('T')[0],
    totalDesconto: 0,
    obs: '',
    borderoux: '',
    saldoAnterior: 0,
    descontoSaldo: 0,
    saldo: 0,
    codigoPagamento: 0,
    saldoOperacao: 0,
    codigoUtilizador: 1, // Usuário atual
    hash: '',
    tipoDocumento: TipoDocumentoEnum.RECIBO,
    totalIva: 0,
    nifCliente: '',
    troco: 0
  });

  // Função para gerar hash simples
  const generateHash = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Calcular total automaticamente
  useEffect(() => {
    const total = formData.valorEntregue - (formData.totalDesconto || 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.valorEntregue, formData.totalDesconto]);

  // Filtrar alunos baseado na pesquisa
  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(alunoSearch.toLowerCase()) ||
    aluno.codigo.toString().includes(alunoSearch)
  ).slice(0, 10); // Mostrar apenas 10 resultados

  // Função para selecionar aluno
  const handleAlunoSelect = (aluno: any) => {
    setSelectedAluno(aluno);
    setAlunoSearch(aluno.nome);
    setFormData(prev => ({ ...prev, codigo_Aluno: aluno.codigo }));
    setIsAlunoDropdownOpen(false);
  };

  // Validar se o texto digitado corresponde a um aluno válido
  const validateAlunoInput = (inputValue: string) => {
    if (!inputValue.trim()) {
      setSelectedAluno(null);
      setFormData(prev => ({ ...prev, codigo_Aluno: 0 }));
      return;
    }

    // Procurar aluno que corresponda exatamente ao texto digitado
    const alunoEncontrado = alunos.find(aluno => 
      aluno.nome.toLowerCase() === inputValue.toLowerCase()
    );

    if (alunoEncontrado) {
      setSelectedAluno(alunoEncontrado);
      setFormData(prev => ({ ...prev, codigo_Aluno: alunoEncontrado.codigo }));
    } else {
      // Se não encontrou, limpar seleção mas manter o texto para mostrar erro
      setSelectedAluno(null);
      setFormData(prev => ({ ...prev, codigo_Aluno: 0 }));
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alunoDropdownRef.current && !alunoDropdownRef.current.contains(event.target as Node)) {
        setIsAlunoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAluno || formData.codigo_Aluno === 0) {
      alert('Por favor, selecione um estudante da lista');
      return;
    }

    if (formData.valorEntregue <= 0) {
      alert('Por favor, informe um valor válido');
      return;
    }
    
    try {
      // Gerar hash se não existir
      const dataToSubmit = {
        ...formData,
        hash: formData.hash || generateHash()
      };

      const result = await createPagamentoPrincipal(dataToSubmit);
      
      if (result) {
        alert('Pagamento criado com sucesso!');
        router.push('/admin/finance-management/payments');
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      alert('Erro ao criar pagamento. Tente novamente.');
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
                disabled={isCreating}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                form="payment-form"
                disabled={isCreating}
                className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white"
              >
                {isCreating ? (
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
                  <div className="relative" ref={alunoDropdownRef}>
                    <input
                      type="text"
                      value={alunoSearch}
                      onChange={(e) => {
                        setAlunoSearch(e.target.value);
                        setIsAlunoDropdownOpen(true);
                      }}
                      onBlur={(e) => {
                        // Validar quando o usuário sair do campo
                        setTimeout(() => validateAlunoInput(e.target.value), 150);
                      }}
                      onFocus={() => setIsAlunoDropdownOpen(true)}
                      placeholder={alunosLoading ? 'Carregando alunos...' : `Pesquisar estudante... (${alunos.length} disponíveis)`}
                      className={`w-full h-12 px-4 pr-10 border rounded-lg focus:ring-2 focus:border-transparent bg-background text-foreground ${
                        alunoSearch && !selectedAluno 
                          ? 'border-red-500 focus:ring-red-500' 
                          : selectedAluno 
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-border focus:ring-blue-500'
                      }`}
                      disabled={alunosLoading}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {isAlunoDropdownOpen && !alunosLoading && (
                      <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredAlunos.length > 0 ? (
                          filteredAlunos.map((aluno) => (
                            <div
                              key={aluno.codigo}
                              onClick={() => handleAlunoSelect(aluno)}
                              className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-medium text-foreground">{aluno.nome}</div>
                                <div className="text-sm text-muted-foreground">Código: {aluno.codigo}</div>
                              </div>
                              {selectedAluno?.codigo === aluno.codigo && (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-muted-foreground text-center">
                            {alunoSearch ? 'Nenhum estudante encontrado' : 'Digite para pesquisar...'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {alunoSearch && !selectedAluno && (
                    <p className="mt-1 text-sm text-red-600">
                      Estudante não encontrado. Selecione um estudante da lista.
                    </p>
                  )}
                  {selectedAluno && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ {selectedAluno.nome} selecionado
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Status do Pagamento *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: parseInt(e.target.value)})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value={StatusPagamentoEnum.ATIVO}>Ativo</option>
                    <option value={StatusPagamentoEnum.PENDENTE}>Pendente</option>
                    <option value={StatusPagamentoEnum.PROCESSANDO}>Processando</option>
                    <option value={StatusPagamentoEnum.CANCELADO}>Cancelado</option>
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
                    Valor Entregue (AOA) *
                  </label>
                  <input
                    type="number"
                    value={formData.valorEntregue}
                    onChange={(e) => setFormData({...formData, valorEntregue: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 25000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Total Desconto (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.totalDesconto}
                    onChange={(e) => setFormData({...formData, totalDesconto: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Total Final (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.total}
                    readOnly
                    className="w-full h-12 px-4 border border-border rounded-lg bg-muted text-foreground"
                    placeholder="Calculado automaticamente"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Total IVA (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.totalIva}
                    onChange={(e) => setFormData({...formData, totalIva: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 2100"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Troco (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.troco}
                    onChange={(e) => setFormData({...formData, troco: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    NIF do Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.nifCliente}
                    onChange={(e) => setFormData({...formData, nifCliente: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 123456789"
                    maxLength={50}
                  />
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
                    Data do Pagamento *
                  </label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data do Banco *
                  </label>
                  <input
                    type="date"
                    value={formData.dataBanco}
                    onChange={(e) => setFormData({...formData, dataBanco: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-orange-600" />
                <span>Informações Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tipo de Documento
                  </label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value={TipoDocumentoEnum.RECIBO}>Recibo</option>
                    <option value={TipoDocumentoEnum.FATURA}>Fatura</option>
                    <option value={TipoDocumentoEnum.NOTA_CREDITO}>Nota de Crédito</option>
                    <option value={TipoDocumentoEnum.COMPROVATIVO}>Comprovativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Borderoux
                  </label>
                  <input
                    type="text"
                    value={formData.borderoux}
                    onChange={(e) => setFormData({...formData, borderoux: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: BRD-2024-001"
                    maxLength={200}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.obs}
                  onChange={(e) => setFormData({...formData, obs: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Observações adicionais sobre o pagamento..."
                  maxLength={200}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações de Sistema */}
          <Card className="border-l-4 border-l-gray-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-gray-600" />
                <span>Informações de Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Saldo Anterior (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.saldoAnterior}
                    onChange={(e) => setFormData({...formData, saldoAnterior: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-background text-foreground"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Desconto no Saldo (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.descontoSaldo}
                    onChange={(e) => setFormData({...formData, descontoSaldo: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-background text-foreground"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Saldo Final (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.saldo}
                    onChange={(e) => setFormData({...formData, saldo: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-background text-foreground"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Código de Pagamento
                  </label>
                  <input
                    type="number"
                    value={formData.codigoPagamento}
                    onChange={(e) => setFormData({...formData, codigoPagamento: parseInt(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-background text-foreground"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Saldo da Operação (AOA)
                  </label>
                  <input
                    type="number"
                    value={formData.saldoOperacao}
                    onChange={(e) => setFormData({...formData, saldoOperacao: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-background text-foreground"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Hash de Segurança
                </label>
                <input
                  type="text"
                  value={formData.hash}
                  onChange={(e) => setFormData({...formData, hash: e.target.value})}
                  className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Será gerado automaticamente se não informado"
                  maxLength={1000}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
