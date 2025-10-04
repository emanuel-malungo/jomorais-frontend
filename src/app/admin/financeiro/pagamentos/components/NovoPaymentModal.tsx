'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  DollarSign, 
  Calendar,
  FileText,
  User,
  CreditCard,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreatePayment } from '@/hooks/usePayments';
import { 
  useTiposServico, 
  useFormasPagamento, 
  useAlunosSearch,
  MESES_OPTIONS,
  ANOS_OPTIONS
} from '@/hooks/usePaymentData';
import { useDebounce } from '@/hooks';
import { ThermalInvoiceService } from '@/services/thermalInvoiceService';
import { ThermalInvoiceData } from '@/components/ThermalInvoice';
import ThermalInvoiceModal from '@/components/ThermalInvoiceModal';

interface NovoPaymentModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  codigo_Aluno: number | null;
  codigo_Tipo_Servico: number | null;
  mes: string;
  ano: number | null;
  preco: string;
  observacao: string;
  codigo_FormaPagamento: number | null;
}

const NovoPaymentModal: React.FC<NovoPaymentModalProps> = ({ open, onClose }) => {
  // Estados do formulário
  const [formData, setFormData] = useState<FormData>({
    codigo_Aluno: null,
    codigo_Tipo_Servico: null,
    mes: '',
    ano: new Date().getFullYear(),
    preco: '',
    observacao: '',
    codigo_FormaPagamento: null,
  });

  // Estados para busca de alunos
  const [alunoSearch, setAlunoSearch] = useState('');
  const [selectedAluno, setSelectedAluno] = useState<any>(null);
  const [showAlunoResults, setShowAlunoResults] = useState(false);

  // Estados para modal de fatura
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [createdPayment, setCreatedPayment] = useState<any>(null);

  // Debounce para busca de alunos
  const debouncedAlunoSearch = useDebounce(alunoSearch, 500);

  // Hooks
  const { createPayment, loading: createLoading, error: createError } = useCreatePayment();
  const { tiposServico, loading: tiposLoading } = useTiposServico();
  const { formasPagamento, loading: formasLoading } = useFormasPagamento();
  const { alunos, loading: alunosLoading, searchAlunos, clearAlunos } = useAlunosSearch();

  // Buscar alunos quando o termo de busca muda
  useEffect(() => {
    if (debouncedAlunoSearch.trim().length >= 2) {
      searchAlunos(debouncedAlunoSearch);
      setShowAlunoResults(true);
    } else {
      clearAlunos();
      setShowAlunoResults(false);
    }
  }, [debouncedAlunoSearch]);

  // Resetar formulário quando modal abre/fecha
  useEffect(() => {
    if (open) {
      setFormData({
        codigo_Aluno: null,
        codigo_Tipo_Servico: null,
        mes: '',
        ano: new Date().getFullYear(),
        preco: '',
        observacao: '',
        codigo_FormaPagamento: null,
      });
      setAlunoSearch('');
      setSelectedAluno(null);
      setShowAlunoResults(false);
      clearAlunos();
    }
  }, [open]);

  // Handlers
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectAluno = (aluno: any) => {
    setSelectedAluno(aluno);
    setFormData(prev => ({ ...prev, codigo_Aluno: aluno.codigo }));
    setAlunoSearch(aluno.nome);
    setShowAlunoResults(false);
  };

  const handleClearAluno = () => {
    setSelectedAluno(null);
    setFormData(prev => ({ ...prev, codigo_Aluno: null }));
    setAlunoSearch('');
    setShowAlunoResults(false);
    clearAlunos();
  };

  const validateForm = (): string | null => {
    if (!formData.codigo_Aluno) return 'Selecione um aluno';
    if (!formData.codigo_Tipo_Servico) return 'Selecione o tipo de serviço';
    if (!formData.mes) return 'Selecione o mês';
    if (!formData.ano) return 'Informe o ano';
    if (!formData.preco || parseFloat(formData.preco) <= 0) return 'Informe um valor válido';
    if (!formData.codigo_FormaPagamento) return 'Selecione a forma de pagamento';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const paymentData = {
        codigo_Aluno: formData.codigo_Aluno!,
        codigo_Tipo_Servico: formData.codigo_Tipo_Servico!,
        mes: formData.mes,
        ano: formData.ano!,
        preco: parseFloat(formData.preco),
        observacao: formData.observacao,
        codigo_FormaPagamento: formData.codigo_FormaPagamento!,
      };

      console.log('Enviando dados do pagamento:', paymentData);
      const payment = await createPayment(paymentData);
      console.log('Pagamento criado com sucesso:', payment);
      
      setCreatedPayment(payment);
      setShowInvoiceModal(true);
      
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      
      // Verificar se o erro é NetworkError mas o pagamento foi criado
      if (error instanceof Error && error.message.includes('NetworkError')) {
        console.log('NetworkError detectado, mas pagamento pode ter sido criado');
        // Tentar mostrar modal de fatura mesmo assim
        setShowInvoiceModal(true);
      } else {
        alert('Erro ao criar pagamento: ' + (error as Error).message);
      }
    }
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setCreatedPayment(null);
    onClose();
  };

  const handleDownloadInvoice = () => {
    try {
      if (createdPayment) {
        const thermalData: ThermalInvoiceData = {
          pagamento: {
            codigo: createdPayment.codigo,
            fatura: createdPayment.fatura,
            data: createdPayment.data || new Date().toISOString(),
            mes: createdPayment.mes,
            ano: createdPayment.ano,
            preco: createdPayment.preco,
            observacao: createdPayment.observacao || '',
            aluno: {
              codigo: createdPayment.aluno?.codigo || 0,
              nome: createdPayment.aluno?.nome || '',
              n_documento_identificacao: createdPayment.aluno?.n_documento_identificacao || '',
              email: createdPayment.aluno?.email || '',
              telefone: createdPayment.aluno?.telefone || ''
            },
            tipoServico: {
              designacao: createdPayment.tipoServico?.designacao || 'Serviço'
            },
            formaPagamento: {
              designacao: createdPayment.formaPagamento?.designacao || 'Dinheiro'
            }
          },
          operador: 'Sistema'
        };
        ThermalInvoiceService.generateThermalPDF(thermalData);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF da fatura');
    }
  };

  const handlePrintInvoice = () => {
    try {
      if (createdPayment) {
        // Por enquanto usar dados mockados até a API de fatura estar pronta
        const invoiceData = InvoiceService.getMockInvoiceData(createdPayment.codigo);
        // Atualizar com dados reais do pagamento
        invoiceData.pagamento = {
          ...invoiceData.pagamento,
          codigo: createdPayment.codigo,
          fatura: createdPayment.fatura,
          data: createdPayment.data,
          mes: createdPayment.mes,
          ano: createdPayment.ano,
          preco: createdPayment.preco,
          observacao: createdPayment.observacao,
          aluno: createdPayment.aluno,
          tipoServico: createdPayment.tipoServico,
          formaPagamento: createdPayment.formaPagamento || { designacao: 'Dinheiro' }
        };
        InvoiceService.printInvoice(invoiceData);
      }
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      alert('Erro ao imprimir fatura');
    }
  };

  return (
    <>
      {/* Modal Principal - Novo Pagamento */}
      <Dialog open={open && !showInvoiceModal} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Novo Pagamento
            </DialogTitle>
            <DialogDescription>
              Registre um novo pagamento de propina ou outros serviços
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Busca de Aluno */}
            <div className="space-y-2">
              <Label htmlFor="aluno">Aluno *</Label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="aluno"
                    placeholder="Digite o nome do aluno para buscar..."
                    value={alunoSearch}
                    onChange={(e) => setAlunoSearch(e.target.value)}
                    className="pl-10"
                  />
                  {selectedAluno && (
                    <Button
                      type="button"
                      onClick={handleClearAluno}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Resultados da busca */}
                {showAlunoResults && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {alunosLoading ? (
                      <div className="p-3 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                        <span className="ml-2">Buscando...</span>
                      </div>
                    ) : alunos.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        Nenhum aluno encontrado
                      </div>
                    ) : (
                      alunos.map((aluno) => (
                        <div
                          key={aluno.codigo}
                          onClick={() => handleSelectAluno(aluno)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{aluno.nome}</div>
                          <div className="text-sm text-gray-500">
                            {aluno.n_documento_identificacao} • {aluno.email}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Aluno Selecionado */}
              {selectedAluno && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-800">{selectedAluno.nome}</div>
                        <div className="text-sm text-green-600">
                          {selectedAluno.n_documento_identificacao} • {selectedAluno.email}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <User className="w-3 h-3 mr-1" />
                        Selecionado
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tipo de Serviço */}
            <div className="space-y-2">
              <Label htmlFor="tipo-servico">Tipo de Serviço *</Label>
              <Select
                value={formData.codigo_Tipo_Servico?.toString() || ""}
                onValueChange={(value) => handleInputChange('codigo_Tipo_Servico', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  {tiposLoading ? (
                    <SelectItem value="" disabled>Carregando...</SelectItem>
                  ) : (
                    tiposServico.map((tipo) => (
                      <SelectItem key={tipo.codigo} value={tipo.codigo.toString()}>
                        {tipo.designacao}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Mês e Ano */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mes">Mês *</Label>
                <Select
                  value={formData.mes}
                  onValueChange={(value) => handleInputChange('mes', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {MESES_OPTIONS.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value}>
                        {mes.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano *</Label>
                <Select
                  value={formData.ano?.toString() || ""}
                  onValueChange={(value) => handleInputChange('ano', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS_OPTIONS.map((ano) => (
                      <SelectItem key={ano.value} value={ano.value.toString()}>
                        {ano.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="preco">Valor (Kz) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
              />
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label htmlFor="forma-pagamento">Forma de Pagamento *</Label>
              <Select
                value={formData.codigo_FormaPagamento?.toString() || ""}
                onValueChange={(value) => handleInputChange('codigo_FormaPagamento', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {formasLoading ? (
                    <SelectItem value="" disabled>Carregando...</SelectItem>
                  ) : (
                    formasPagamento.map((forma) => (
                      <SelectItem key={forma.codigo} value={forma.codigo.toString()}>
                        {forma.designacao}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                placeholder="Observações adicionais (opcional)"
                value={formData.observacao}
                onChange={(e) => handleInputChange('observacao', e.target.value)}
                rows={3}
              />
            </div>

            {/* Erro */}
            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{createError}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={createLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={createLoading}
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Salvar Pagamento
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Fatura Gerada */}
      <Dialog open={showInvoiceModal} onOpenChange={handleCloseInvoiceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              Pagamento Registrado
            </DialogTitle>
            <DialogDescription>
              O pagamento foi registrado com sucesso. Deseja gerar a fatura?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {createdPayment && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fatura:</span>
                      <span className="font-medium">{createdPayment.fatura}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Aluno:</span>
                      <span className="font-medium">{createdPayment.aluno?.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor:</span>
                      <span className="font-medium">{createdPayment.preco?.toLocaleString('pt-AO')} Kz</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleDownloadInvoice}
                className="flex-1"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                onClick={handlePrintInvoice}
                className="flex-1"
                variant="outline"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>

            <Button
              onClick={handleCloseInvoiceModal}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NovoPaymentModal;
