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
  useAlunoCompleto,
  useTipoServicoTurmaAluno,
  useMesesPendentesAluno,
  useAnosLectivos,
  useValidateBordero,
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
  mesesSelecionados: string[];
  ano: number | null;
  preco: string;
  observacao: string;
  codigo_FormaPagamento: number | null;
  tipoConta: string;
  numeroBordero: string;
}

const NovoPaymentModal: React.FC<NovoPaymentModalProps> = ({ open, onClose }) => {
  // Estados do formulário
  const [formData, setFormData] = useState<FormData>({
    codigo_Aluno: null,
    codigo_Tipo_Servico: null,
    mesesSelecionados: [],
    ano: new Date().getFullYear(),
    preco: '',
    observacao: '',
    codigo_FormaPagamento: null,
    tipoConta: '',
    numeroBordero: '',
  });

  // Estados para busca de alunos
  const [alunoSearch, setAlunoSearch] = useState('');
  const [selectedAluno, setSelectedAluno] = useState<any>(null);
  const [showAlunoResults, setShowAlunoResults] = useState(false);
  const [alunoCompleto, setAlunoCompleto] = useState<any>(null);

  // Estados para modal de fatura
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [createdPayment, setCreatedPayment] = useState<any>(null);
  
  // Estados para depósito bancário
  const [isDeposito, setIsDeposito] = useState(false);
  const [borderoError, setBorderoError] = useState<string>('');

  // Debounce para busca de alunos
  const debouncedAlunoSearch = useDebounce(alunoSearch, 500);

  // Hooks
  const { createPayment, loading: createLoading, error: createError } = useCreatePayment();
  const { formasPagamento, loading: formasLoading } = useFormasPagamento();
  const { alunos, loading: alunosLoading, searchAlunos, clearAlunos } = useAlunosSearch();
  const { fetchAlunoCompleto } = useAlunoCompleto();
  const { tipoServico: tipoServicoTurma, fetchTipoServicoTurma, loading: tipoServicoLoading } = useTipoServicoTurmaAluno();
  const { mesesPendentes, mensagem, fetchMesesPendentes, loading: mesesLoading } = useMesesPendentesAluno();
  const { anosLectivos, loading: anosLoading } = useAnosLectivos();
  const { validateBordero, loading: borderoValidating } = useValidateBordero();

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
        mesesSelecionados: [],
        ano: new Date().getFullYear(),
        preco: '',
        observacao: '',
        codigo_FormaPagamento: null,
        tipoConta: '',
        numeroBordero: '',
      });
      setAlunoSearch('');
      setSelectedAluno(null);
      setShowAlunoResults(false);
      setIsDeposito(false);
      setBorderoError('');
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
  const handleSelectAluno = async (aluno: any) => {
    setSelectedAluno(aluno);
    setFormData(prev => ({ ...prev, codigo_Aluno: aluno.codigo }));
    setAlunoSearch(aluno.nome);
    setShowAlunoResults(false);
    try {
      // Buscar dados completos do aluno
      const alunoCompletoData = await fetchAlunoCompleto(aluno.codigo);
      setAlunoCompleto(alunoCompletoData);
      
      // Buscar tipo de serviço específico da turma
      await fetchTipoServicoTurma(aluno.codigo);
      
      // Buscar meses pendentes - usar o ano do aluno se disponível
      let codigoAnoLectivo = formData.ano;
      
      // Se não há ano selecionado, tentar encontrar o ano letivo do aluno
      if (!codigoAnoLectivo && alunoCompletoData?.tb_matriculas?.tb_confirmacoes?.length > 0) {
        // Usar o ano letivo da confirmação ativa do aluno
        const confirmacaoAtiva = alunoCompletoData.tb_matriculas.tb_confirmacoes.find(
          (conf: any) => conf.codigo_Status === 1
        );
        if (confirmacaoAtiva) {
          codigoAnoLectivo = confirmacaoAtiva.codigo_Ano_lectivo;
          console.log('Usando ano letivo do aluno:', codigoAnoLectivo);
        }
      }
      
      // Fallback: tentar encontrar um ano onde o aluno tenha dados
      if (!codigoAnoLectivo && anosLectivos.length > 0) {
        // Tentar anos letivos em ordem até encontrar um com dados do aluno
        for (const ano of anosLectivos.reverse()) {
          try {
            const testData = await fetchMesesPendentes(aluno.codigo, ano.codigo);
            if (testData.mesesPendentes.length > 0 || testData.mesesPagos.length > 0) {
              codigoAnoLectivo = ano.codigo;
              console.log('Encontrado ano com dados:', ano.designacao);
              break;
            }
          } catch (error) {
            // Continuar tentando outros anos
          }
        }
        
        // Se ainda não encontrou, usar o último ano da lista
        if (!codigoAnoLectivo) {
          codigoAnoLectivo = anosLectivos[anosLectivos.length - 1].codigo;
        }
      }
      if (codigoAnoLectivo) {
        try {
          const mesesData = await fetchMesesPendentes(aluno.codigo, codigoAnoLectivo);
          if (mesesData.mesesPendentes.length > 0) {
            setFormData(prev => ({
              ...prev,
              ano: codigoAnoLectivo,
              mesesSelecionados: [mesesData.proximoMes || mesesData.mesesPendentes[0]]
            }));
          } else {
            // Se não há meses pendentes, apenas definir o ano
            setFormData(prev => ({
              ...prev,
              ano: codigoAnoLectivo,
              mesesSelecionados: []
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar meses pendentes:', error);
          // Não impedir a seleção do aluno por causa disso
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados completos do aluno:', error);
    }
  };

  const handleClearAluno = () => {
    setSelectedAluno(null);
    setAlunoCompleto(null);
    setFormData(prev => ({ 
      ...prev, 
      codigo_Aluno: null,
      codigo_Tipo_Servico: null,
      mesesSelecionados: [],
      preco: '',
      tipoConta: '',
      numeroBordero: ''
    }));
    setAlunoSearch('');
    setShowAlunoResults(false);
    setIsDeposito(false);
    setBorderoError('');
    clearAlunos();
  };

  // Atualizar preço quando tipo de serviço da turma é carregado
  useEffect(() => {
    if (tipoServicoTurma) {
      setFormData(prev => ({
        ...prev,
        codigo_Tipo_Servico: tipoServicoTurma.codigo,
        preco: tipoServicoTurma.preco ? tipoServicoTurma.preco.toString() : prev.preco
      }));
    }
  }, [tipoServicoTurma]);

  // Handler para mudança de forma de pagamento
  const handleFormaPagamentoChange = (formaPagamentoId: string) => {
    const formaPagamento = formasPagamento.find(forma => forma.codigo === parseInt(formaPagamentoId));
    const isDepositoForm = formaPagamento?.designacao?.toLowerCase().includes('depósito') || 
                          formaPagamento?.designacao?.toLowerCase().includes('deposito') ||
                          formaPagamento?.designacao?.toLowerCase().includes('transferência') ||
                          formaPagamento?.designacao?.toLowerCase().includes('transferencia');
    
    setIsDeposito(isDepositoForm || false);
    setFormData(prev => ({
      ...prev,
      codigo_FormaPagamento: parseInt(formaPagamentoId),
      // Limpar campos de depósito se não for depósito
      ...((!isDepositoForm) && {
        tipoConta: '',
        numeroBordero: ''
      })
    }));
    
    // Limpar erros de borderô
    if (!isDepositoForm) {
      setBorderoError('');
    }
  };

  // Handler para validação de borderô em tempo real
  const handleBorderoChange = async (value: string) => {
    setBorderoError('');
    
    // Permitir apenas dígitos e máximo 9 caracteres
    const numericValue = value.replace(/\D/g, '').slice(0, 9);
    
    setFormData(prev => ({
      ...prev,
      numeroBordero: numericValue
    }));
    
    // Validar quando tiver 9 dígitos
    if (numericValue.length === 9) {
      try {
        await validateBordero(numericValue);
        setBorderoError('');
      } catch (error) {
        setBorderoError((error as Error).message);
      }
    } else if (numericValue.length > 0) {
      setBorderoError('Número deve conter exatamente 9 dígitos');
    }
  };

  const validateForm = (): string | null => {
    if (!formData.codigo_Aluno) return 'Selecione um aluno';
    if (!formData.codigo_Tipo_Servico) return 'Tipo de serviço não encontrado para esta turma';
    if (!formData.mesesSelecionados.length) return 'Selecione pelo menos um mês';
    if (!formData.ano) return 'Informe o ano';
    if (!formData.preco || parseFloat(formData.preco) <= 0) return 'Informe um valor válido';
    if (!formData.codigo_FormaPagamento) return 'Selecione a forma de pagamento';
    
    // Validações específicas para depósito
    if (isDeposito) {
      if (!formData.tipoConta) return 'Selecione o tipo de conta para depósito';
      if (!formData.numeroBordero) return 'Informe o número do borderô';
      if (!/^\d{9}$/.test(formData.numeroBordero)) return 'Número do borderô deve conter exatamente 9 dígitos';
    }
    
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
      // Encontrar o ano letivo selecionado para obter o ano numérico correto por mês
      const anoLetivoSelecionado = anosLectivos.find(ano => ano.codigo === formData.ano);

      // Criar pagamentos para cada mês selecionado
      const pagamentosPromises = formData.mesesSelecionados.map(mes => {
        // Determinar o ano correto baseado no mês
        let anoCorreto = formData.ano!;
        if (anoLetivoSelecionado) {
          const mesesPrimeiroAno = ['SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
          const mesesSegundoAno = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'];
          
          if (mesesPrimeiroAno.includes(mes)) {
            anoCorreto = parseInt(anoLetivoSelecionado.anoInicial);
          } else if (mesesSegundoAno.includes(mes)) {
            anoCorreto = parseInt(anoLetivoSelecionado.anoFinal);
          }
        }

        const paymentData = {
          codigo_Aluno: formData.codigo_Aluno!,
          codigo_Tipo_Servico: formData.codigo_Tipo_Servico!,
          mes: mes,
          ano: anoCorreto,
          preco: parseFloat(formData.preco),
          observacao: formData.observacao,
          codigo_FormaPagamento: formData.codigo_FormaPagamento!,
          ...(isDeposito && {
            tipoConta: formData.tipoConta,
            numeroBordero: formData.numeroBordero
          })
        };
        console.log('Dados do pagamento para mês', mes, ':', paymentData);
        return createPayment(paymentData);
      });

      console.log('Criando pagamentos para meses:', formData.mesesSelecionados);
      const payments = await Promise.all(pagamentosPromises);
      console.log('Pagamentos criados com sucesso:', payments);
      
      // Atualizar dados de meses pendentes (sempre disparar evento para atualizar)
      console.log('Pagamento criado, disparando evento de atualização...');
      // Disparar evento para atualizar o modal de status
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('paymentCreated', { 
          detail: { 
            alunoId: formData.codigo_Aluno,
            meses: formData.mesesSelecionados 
          }
        }));
      }
      
      // Usar o primeiro pagamento para o modal de fatura
      setCreatedPayment({
        ...payments[0],
        mesesPagos: formData.mesesSelecionados,
        totalPago: parseFloat(formData.preco) * formData.mesesSelecionados.length
      });
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
        const mesesPagos = createdPayment.mesesPagos || [createdPayment.mes];
        const valorTotal = createdPayment.totalPago || createdPayment.preco || 0;
        
        // Obter nome do funcionário logado
        let nomeOperador = 'Sistema';
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            nomeOperador = user.nome || user.username || 'Sistema';
          }
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
        }
        
        const dadosFatura = {
          numeroFatura: createdPayment.fatura || `FAT_${Date.now()}`,
          dataEmissao: new Date(createdPayment.data || new Date()).toLocaleString('pt-BR'),
          aluno: {
            nome: createdPayment.aluno?.nome || 'Aluno não identificado',
            curso: alunoCompleto?.dadosAcademicos?.curso || 'Curso não especificado',
            classe: alunoCompleto?.dadosAcademicos?.classe || 'Classe não especificada',
            turma: alunoCompleto?.dadosAcademicos?.turma || 'Turma não especificada'
          },
          servicos: [
            {
              descricao: `${createdPayment.tipoServico?.designacao || 'Propina'}`,
              quantidade: mesesPagos.length,
              precoUnitario: createdPayment.preco || 0,
              total: valorTotal
            }
          ],
          mesesPagos: mesesPagos.join(', '),
          formaPagamento: createdPayment.formaPagamento?.designacao || 'DINHEIRO',
          // Só mostrar dados bancários se for realmente depósito
          contaBancaria: (createdPayment.formaPagamento?.designacao === 'DEPOSITO' || createdPayment.formaPagamento?.designacao === 'DEPÓSITO') ? createdPayment.contaMovimentada : null,
          numeroBordero: (createdPayment.formaPagamento?.designacao === 'DEPOSITO' || createdPayment.formaPagamento?.designacao === 'DEPÓSITO') ? createdPayment.numeroBordero : null,
          subtotal: valorTotal,
          iva: 0.00,
          desconto: 0.00,
          totalPagar: valorTotal,
          totalPago: valorTotal,
          pagoEmSaldo: 0.00,
          saldoAtual: 0.00,
          operador: nomeOperador
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
                ${dadosFatura.contaBancaria ? `<p>Conta Bancária: ${dadosFatura.contaBancaria}</p>` : ''}
                ${dadosFatura.numeroBordero ? `<p>Nº Borderô: ${dadosFatura.numeroBordero}</p>` : ''}
                <p>Mês(s) pago(s): ${dadosFatura.mesesPagos}</p>
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
            {/* Tipo de Serviço da Turma */}
            {selectedAluno && (
              <div className="space-y-2">
                <Label htmlFor="tipo-servico">Tipo de Serviço (Propina da Turma) *</Label>
                {tipoServicoLoading ? (
                  <div className="p-3 border rounded-md bg-gray-50">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-center text-sm text-gray-500 mt-2">Carregando tipo de serviço...</p>
                  </div>
                ) : tipoServicoTurma ? (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-blue-800">{tipoServicoTurma.designacao}</div>
                          <div className="text-sm text-blue-600">
                            Preço: {tipoServicoTurma.preco?.toLocaleString('pt-AO')} Kz
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <CreditCard className="w-3 h-3 mr-1" />
                          Propina
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-3 border rounded-md bg-red-50 border-red-200">
                    <p className="text-red-600 text-sm">
                      Tipo de serviço de propina não encontrado para esta turma.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Seleção de Meses Pendentes */}
            {selectedAluno && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano Letivo *</Label>
                    <Select
                      value={formData.ano?.toString() || ""}
                      onValueChange={(value) => {
                        const codigoAnoLectivo = parseInt(value);
                        handleInputChange('ano', codigoAnoLectivo);
                        // Recarregar meses pendentes para o novo ano letivo
                        if (selectedAluno) {
                          fetchMesesPendentes(selectedAluno.codigo, codigoAnoLectivo);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {anosLoading ? (
                          <SelectItem value="" disabled>Carregando...</SelectItem>
                        ) : anosLectivos.length > 0 ? (
                          anosLectivos.map((ano) => (
                            <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                              {ano.designacao}
                            </SelectItem>
                          ))
                        ) : (
                          ANOS_OPTIONS.map((ano) => (
                            <SelectItem key={ano.value} value={ano.value.toString()}>
                              {ano.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Meses Selecionados</Label>
                    <div className="p-2 border rounded-md bg-gray-50 min-h-[40px] flex items-center">
                      {formData.mesesSelecionados.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {formData.mesesSelecionados.map((mes) => (
                            <Badge key={mes} variant="secondary" className="bg-green-100 text-green-800">
                              {mes}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Nenhum mês selecionado</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Lista de Meses Pendentes */}
                {mesesLoading ? (
                  <div className="p-3 text-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                    <span className="text-sm text-gray-500 mt-2">Carregando meses...</span>
                  </div>
                ) : mesesPendentes.length > 0 ? (
                  <div className="space-y-2">
                    <Label>Meses Pendentes (Selecione os que deseja pagar)</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                      {mesesPendentes.map((mes) => {
                        const isSelected = formData.mesesSelecionados.includes(mes);
                        return (
                          <button
                            key={mes}
                            type="button"
                            onClick={() => {
                              const newMeses = isSelected 
                                ? formData.mesesSelecionados.filter(m => m !== mes)
                                : [...formData.mesesSelecionados, mes];
                              setFormData(prev => ({ ...prev, mesesSelecionados: newMeses }));
                            }}
                            className={`p-2 text-xs rounded border transition-colors ${
                              isSelected 
                                ? 'bg-green-100 border-green-300 text-green-800' 
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {mes}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Botões de Seleção Rápida */}
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Selecionar próximos 3 meses pendentes
                          const proximos3 = mesesPendentes.slice(0, 3);
                          setFormData(prev => ({ ...prev, mesesSelecionados: proximos3 }));
                        }}
                      >
                        Próximos 3
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Selecionar todos os meses pendentes
                          setFormData(prev => ({ ...prev, mesesSelecionados: [...mesesPendentes] }));
                        }}
                      >
                        Todos
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Limpar seleção
                          setFormData(prev => ({ ...prev, mesesSelecionados: [] }));
                        }}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center border rounded-md bg-blue-50 border-blue-200">
                    <p className="text-blue-600 text-sm">
                      {mensagem && mensagem.includes('não estava matriculado')
                        ? '📋 Aluno não estava matriculado neste ano letivo'
                        : '✓ Todos os meses já foram pagos para este ano letivo!'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="preco">Valor por Mês (Kz) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
                disabled={!tipoServicoTurma}
              />
              {formData.mesesSelecionados.length > 0 && formData.preco && (
                <div className="text-sm text-gray-600">
                  <strong>Total a pagar:</strong> {(parseFloat(formData.preco) * formData.mesesSelecionados.length).toLocaleString('pt-AO')} Kz
                  <br />
                  <span className="text-xs">({formData.mesesSelecionados.length} meses × {parseFloat(formData.preco).toLocaleString('pt-AO')} Kz)</span>
                </div>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label htmlFor="forma-pagamento">Forma de Pagamento *</Label>
              <Select
                value={formData.codigo_FormaPagamento?.toString() || ""}
                onValueChange={handleFormaPagamentoChange}
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

            {/* Informação sobre dívidas de anos anteriores */}
            {mesesPendentes.length === 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-blue-800 font-medium">
                    {mensagem && mensagem.includes('não estava matriculado') 
                      ? 'Aluno não estava matriculado neste ano letivo'
                      : 'Nenhuma dívida encontrada para este ano letivo'
                    }
                  </p>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {mensagem && mensagem.includes('não estava matriculado')
                    ? 'Este aluno não possui matrícula confirmada para o ano letivo selecionado.'
                    : 'O aluno não possui dívidas neste período ou não estava matriculado neste ano letivo.'
                  }
                </p>
              </div>
            )}

            {/* Seção de Depósito Bancário */}
            {isDeposito && (
              <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Informações do Depósito Bancário
                </h4>
                
                {/* Tipo de Conta */}
                <div className="space-y-2">
                  <Label htmlFor="tipo-conta">Banco/Conta *</Label>
                  <Select
                    value={formData.tipoConta}
                    onValueChange={(value) => handleInputChange('tipoConta', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAI">
                        BAI - Conta: 89248669/10/001
                      </SelectItem>
                      <SelectItem value="BFA">
                        BFA - Conta: 180912647/30/001
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Número do Borderô */}
                <div className="space-y-2">
                  <Label htmlFor="numero-bordero">Número do Borderô *</Label>
                  <Input
                    id="numero-bordero"
                    type="text"
                    placeholder="Digite exatamente 9 dígitos"
                    value={formData.numeroBordero}
                    onChange={(e) => handleBorderoChange(e.target.value)}
                    maxLength={9}
                    className={borderoError ? 'border-red-300 focus:border-red-500' : ''}
                  />
                  {borderoError && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {borderoError}
                    </p>
                  )}
                  {formData.numeroBordero && !borderoError && formData.numeroBordero.length === 9 && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      Número válido
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Este número deve ser único e conter exatamente 9 dígitos
                  </p>
                </div>
              </div>
            )}

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
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Aluno:</span>
                      <span className="font-medium">{createdPayment.aluno?.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor:</span>
                      <span className="font-medium">{(createdPayment.preco || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mês:</span>
                      <span className="font-medium">{createdPayment.mes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fatura:</span>
                      <span className="font-medium">{createdPayment.fatura}</span>
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
                    const mesesPagos = createdPayment.mesesPagos || [createdPayment.mes];
                    const valorTotal = createdPayment.totalPago || createdPayment.preco || 0;
                    
                    // Obter nome do funcionário logado
                    let nomeOperador = 'Sistema';
                    try {
                      const userData = localStorage.getItem('user');
                      if (userData) {
                        const user = JSON.parse(userData);
                        nomeOperador = user.nome || user.username || 'Sistema';
                      }
                    } catch (error) {
                      console.error('Erro ao obter dados do usuário:', error);
                    }
                    
                    const dadosFatura = {
                      numeroFatura: createdPayment.fatura || `FAT_${Date.now()}`,
                      dataEmissao: new Date(createdPayment.data || new Date()).toLocaleString('pt-BR'),
                      aluno: {
                        nome: createdPayment.aluno?.nome || 'Aluno não identificado',
                        curso: alunoCompleto?.dadosAcademicos?.curso || 'Curso não especificado',
                        classe: alunoCompleto?.dadosAcademicos?.classe || 'Classe não especificada',
                        turma: alunoCompleto?.dadosAcademicos?.turma || 'Turma não especificada'
                      },
                      servicos: [
                        {
                          descricao: createdPayment.tipoServico?.designacao || 'Serviço',
                          quantidade: mesesPagos.length,
                          precoUnitario: createdPayment.preco || 0,
                          total: valorTotal
                        }
                      ],
                      mesesPagos: mesesPagos.join(', '),
                      formaPagamento: createdPayment.formaPagamento?.designacao || 'DINHEIRO',
                      // Só mostrar dados bancários se for realmente depósito
                      contaBancaria: (createdPayment.formaPagamento?.designacao === 'DEPOSITO' || createdPayment.formaPagamento?.designacao === 'DEPÓSITO') ? createdPayment.contaMovimentada : null,
                      numeroBordero: (createdPayment.formaPagamento?.designacao === 'DEPOSITO' || createdPayment.formaPagamento?.designacao === 'DEPÓSITO') ? createdPayment.numeroBordero : null,
                      subtotal: valorTotal,
                      iva: 0.00,
                      desconto: 0.00,
                      totalPagar: valorTotal,
                      totalPago: valorTotal,
                      pagoEmSaldo: 0.00,
                      saldoAtual: 0.00,
                      operador: nomeOperador
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
