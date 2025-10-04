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
  Printer,
  Eye
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
import FaturaTermica from '@/components/FaturaTermica';

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
        // Preparar dados para a fatura térmica
        const dadosFatura = {
          numeroFatura: createdPayment.fatura || `FAT_${Date.now()}`,
          dataEmissao: new Date(createdPayment.data || new Date()).toLocaleString('pt-BR'),
          aluno: {
            nome: createdPayment.aluno?.nome || 'Aluno não identificado',
            curso: 'Curso não especificado', // Pode ser obtido de outra API
            classe: 'Classe não especificada', // Pode ser obtido de outra API
            turma: 'Turma não especificada' // Pode ser obtido de outra API
          },
          servicos: [
            {
              descricao: createdPayment.tipoServico?.designacao || 'Serviço',
              quantidade: 1,
              precoUnitario: createdPayment.preco || 0,
              total: createdPayment.preco || 0
            }
          ],
          formaPagamento: createdPayment.formaPagamento?.designacao || 'DINHEIRO',
          subtotal: createdPayment.preco || 0,
          iva: 0.00,
          desconto: 0.00,
          totalPagar: createdPayment.preco || 0,
          totalPago: createdPayment.preco || 0,
          pagoEmSaldo: 0.00,
          saldoAtual: 0.00,
          operador: 'Sistema'
        };
        
        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Fatura - ${dadosFatura.numeroFatura}</title>
              <style>
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.2;
                  margin: 0;
                  padding: 8px;
                  width: 80mm;
                  background: white;
                  color: black;
                }
                .header {
                  text-align: center;
                  border-bottom: 1px solid #000;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
                }
                .header h2 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0 0 4px 0;
                }
                .header p {
                  margin: 2px 0;
                  font-size: 11px;
                }
                .aluno {
                  margin-bottom: 8px;
                  font-size: 11px;
                }
                .aluno p {
                  margin: 2px 0;
                }
                .servicos-table {
                  width: 100%;
                  border-top: 1px solid #000;
                  border-bottom: 1px solid #000;
                  margin: 8px 0;
                  border-collapse: collapse;
                }
                .servicos-table th,
                .servicos-table td {
                  padding: 2px 4px;
                  font-size: 10px;
                  text-align: left;
                }
                .servicos-table th {
                  border-bottom: 1px solid #000;
                }
                .text-right {
                  text-align: right;
                }
                .totais {
                  font-size: 11px;
                  margin: 8px 0;
                }
                .totais p {
                  margin: 2px 0;
                }
                .rodape {
                  text-align: center;
                  border-top: 1px solid #000;
                  padding-top: 8px;
                  margin-top: 12px;
                  font-size: 10px;
                }
                .rodape p {
                  margin: 2px 0;
                }
                .selo-pago {
                  text-align: center;
                  margin-top: 16px;
                }
                .selo-pago span {
                  font-weight: bold;
                  font-size: 16px;
                  color: #2563eb;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>COMPLEXO ESCOLAR PRIVADO JOMORAIS</h2>
                <p>NIF: 5101165107</p>
                <p>Bairro 1º de Maio, Zongoio - Cabinda</p>
                <p>Tlf: 915312187</p>
                <p>Data: ${dadosFatura.dataEmissao}</p>
                <p>Fatura: ${dadosFatura.numeroFatura}</p>
              </div>

              <div class="aluno">
                <p><strong>Aluno(a):</strong> ${dadosFatura.aluno.nome}</p>
                <p>Consumidor Final</p>
                <p>${dadosFatura.aluno.curso}</p>
                <p>${dadosFatura.aluno.classe} - ${dadosFatura.aluno.turma}</p>
              </div>

              <table class="servicos-table">
                <thead>
                  <tr>
                    <th style="width: 50%">Serviços</th>
                    <th class="text-right" style="width: 15%">Qtd</th>
                    <th class="text-right" style="width: 17.5%">P.Unit</th>
                    <th class="text-right" style="width: 17.5%">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${dadosFatura.servicos.map(servico => `
                    <tr>
                      <td>${servico.descricao}</td>
                      <td class="text-right">${servico.quantidade}</td>
                      <td class="text-right">${servico.precoUnitario.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</td>
                      <td class="text-right">${servico.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totais">
                <p>Forma de Pagamento: ${dadosFatura.formaPagamento}</p>
                <p>Total: ${dadosFatura.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Total IVA: ${dadosFatura.iva.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>N.º de Itens: ${dadosFatura.servicos.length}</p>
                <p>Desconto: ${dadosFatura.desconto.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>A Pagar: ${dadosFatura.totalPagar.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Total Pago: ${dadosFatura.totalPago.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Pago em Saldo: ${dadosFatura.pagoEmSaldo.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Saldo Actual: ${dadosFatura.saldoAtual.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
              </div>

              <div class="rodape">
                <p>Operador: ${dadosFatura.operador}</p>
                <p>Emitido em: ${dadosFatura.dataEmissao.split(' ')[0]}</p>
                <p>REGIME SIMPLIFICADO</p>
                <p>Processado pelo computador</p>
              </div>

              <div class="selo-pago">
                <span>[ PAGO ]</span>
              </div>
            </body>
            </html>
          `);
          
          printWindow.document.close();
          printWindow.focus();
          
          // Aguardar o carregamento e imprimir
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF da fatura');
    }
  };

  const handlePrintInvoice = () => {
    // Usar a mesma função de download para imprimir
    handleDownloadInvoice();
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
                Imprimir Fatura
              </Button>
              <Button
                onClick={() => {
                  // Mostrar preview da fatura antes de imprimir
                  if (createdPayment) {
                    const dadosFatura = {
                      numeroFatura: createdPayment.fatura || `FAT_${Date.now()}`,
                      dataEmissao: new Date(createdPayment.data || new Date()).toLocaleString('pt-BR'),
                      aluno: {
                        nome: createdPayment.aluno?.nome || 'Aluno não identificado',
                        curso: 'Curso não especificado',
                        classe: 'Classe não especificada',
                        turma: 'Turma não especificada'
                      },
                      servicos: [
                        {
                          descricao: createdPayment.tipoServico?.designacao || 'Serviço',
                          quantidade: 1,
                          precoUnitario: createdPayment.preco || 0,
                          total: createdPayment.preco || 0
                        }
                      ],
                      formaPagamento: createdPayment.formaPagamento?.designacao || 'DINHEIRO',
                      subtotal: createdPayment.preco || 0,
                      iva: 0.00,
                      desconto: 0.00,
                      totalPagar: createdPayment.preco || 0,
                      totalPago: createdPayment.preco || 0,
                      pagoEmSaldo: 0.00,
                      saldoAtual: 0.00,
                      operador: 'Sistema'
                    };
                    
                    // Abrir nova janela com preview da fatura
                    const previewWindow = window.open('', '_blank', 'width=400,height=600');
                    if (previewWindow) {
                      previewWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Preview Fatura - ${dadosFatura.numeroFatura}</title>
                          <style>
                            body {
                              font-family: Arial, sans-serif;
                              padding: 20px;
                              background: #f5f5f5;
                            }
                            .container {
                              max-width: 400px;
                              margin: 0 auto;
                              background: white;
                              padding: 20px;
                              border-radius: 8px;
                              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            .preview-header {
                              text-align: center;
                              margin-bottom: 20px;
                              padding-bottom: 10px;
                              border-bottom: 2px solid #eee;
                            }
                            .preview-header h2 {
                              color: #333;
                              margin: 0;
                            }
                            .preview-header p {
                              color: #666;
                              margin: 5px 0;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <div class="preview-header">
                              <h2>Preview da Fatura</h2>
                              <p>Fatura: ${dadosFatura.numeroFatura}</p>
                              <p>Aluno: ${dadosFatura.aluno.nome}</p>
                              <p>Valor: ${(dadosFatura.totalPago || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</p>
                            </div>
                            <div id="fatura-container"></div>
                          </div>
                          <script>
                            // Aqui você pode adicionar o componente React da fatura
                            console.log('Preview da fatura carregado');
                          </script>
                        </body>
                        </html>
                      `);
                      previewWindow.document.close();
                    }
                  }
                }}
                className="flex-1"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
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
