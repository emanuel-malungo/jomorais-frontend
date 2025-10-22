'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { IStudentFinancialData } from '@/hooks/usePayments';
import { useAnosLectivos, useMesesPendentesAluno } from '@/hooks/usePaymentData';

interface StudentFinancialModalProps {
  open: boolean;
  onClose: () => void;
  student: any;
  financialData: IStudentFinancialData | null;
  loading: boolean;
}

const StudentFinancialModal: React.FC<StudentFinancialModalProps> = ({
  open,
  onClose,
  student,
  financialData,
  loading
}) => {
  const [selectedAnoLectivo, setSelectedAnoLectivo] = useState<number | null>(null);
  const { anosLectivos } = useAnosLectivos();
  const { mesesPendentes, mesesPagos, fetchMesesPendentes, clearMesesPendentes, refreshMesesPendentes, loading: mesesLoading, mensagem } = useMesesPendentesAluno();

  // Buscar meses pendentes quando o ano letivo mudar (otimizado com debounce)
  useEffect(() => {
    if (student && selectedAnoLectivo) {
      console.log('💰 Carregando dados financeiros:', { aluno: student.nome, anoLectivo: selectedAnoLectivo });
      
      // Debounce para evitar múltiplas chamadas
      const timeoutId = setTimeout(() => {
        const startTime = performance.now();
        
        fetchMesesPendentes(student.codigo, selectedAnoLectivo).then(() => {
          const endTime = performance.now();
          console.log(`✅ Dados financeiros carregados em ${(endTime - startTime).toFixed(2)}ms`);
        }).catch((error) => {
          console.error('❌ Erro ao carregar dados financeiros:', error);
        });
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [student?.codigo, selectedAnoLectivo]); // Removido fetchMesesPendentes das dependências

  // Definir ano letivo padrão
  useEffect(() => {
    if (anosLectivos.length > 0 && !selectedAnoLectivo) {
      setSelectedAnoLectivo(anosLectivos[0].codigo);
    }
  }, [anosLectivos, selectedAnoLectivo]);

  // Limpar dados quando modal abrir/fechar
  useEffect(() => {
    if (open && student) {
      clearMesesPendentes();
      setSelectedAnoLectivo(null);
    } else if (!open) {
      clearMesesPendentes();
      setSelectedAnoLectivo(null);
    }
  }, [open, student?.codigo]); // Removido clearMesesPendentes das dependências

  // Escutar eventos de pagamento criado para atualizar automaticamente
  useEffect(() => {
    const handlePaymentCreated = (event: CustomEvent) => {
      const { alunoId } = event.detail;
      if (student && student.codigo === alunoId && selectedAnoLectivo) {
        console.log('Pagamento criado para este aluno, forçando atualização dos dados...');
        // Aguardar um pouco para o backend processar e usar refresh para forçar atualização
        setTimeout(() => {
          refreshMesesPendentes(student.codigo, selectedAnoLectivo);
        }, 1500);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('paymentCreated', handlePaymentCreated as EventListener);
      return () => {
        window.removeEventListener('paymentCreated', handlePaymentCreated as EventListener);
      };
    }
  }, [student, selectedAnoLectivo, refreshMesesPendentes]);

  if (!student) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('AOA', 'Kz');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    return status === 'PAGO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'PAGO' ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Dados Financeiros do Aluno
          </DialogTitle>
          <DialogDescription>
            Visualização completa do estado financeiro e histórico de pagamentos
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6">
            {/* Skeleton para informações do aluno */}
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            
            {/* Skeleton para cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            
            {/* Skeleton para seleção de ano */}
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ) : !financialData ? (
          <div className="text-center py-12">
            <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-gray-600">Erro ao carregar dados financeiros</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações do Aluno */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nome</label>
                      <p className="font-medium">{financialData.aluno.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Documento</label>
                      <p className="font-medium">{financialData.aluno.documento}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {financialData.aluno.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Curso</label>
                      <p className="font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        {financialData.aluno.curso}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Turma</label>
                      <p className="font-medium">{financialData.aluno.turma}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefone</label>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {financialData.aluno.telefone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Meses</p>
                      <p className="text-2xl font-bold">{mesesPagos.length + mesesPendentes.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Meses Pagos</p>
                      <p className="text-2xl font-bold text-green-600">{mesesPagos.length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Pago</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(financialData.resumo.totalPago)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Pendente</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(financialData.resumo.totalPendente)}
                      </p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seleção de Ano Letivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Status das Propinas por Ano Letivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="ano-letivo">Selecionar Ano Letivo</Label>
                  <Select
                    value={selectedAnoLectivo?.toString() || ''}
                    onValueChange={(value) => setSelectedAnoLectivo(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano letivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {anosLectivos.map((ano) => (
                        <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                          {ano.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {mesesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Carregando meses...</span>
                  </div>
                ) : (
                  <>
                    {/* Meses Pagos */}
                    {mesesPagos.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Meses Pagos ({mesesPagos.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {mesesPagos.map((mes, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800 justify-center py-2">
                              {mes}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meses Pendentes */}
                    {mesesPendentes.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Meses Pendentes ({mesesPendentes.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {mesesPendentes.map((mes, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800 justify-center py-2">
                              {mes}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mensagem quando não há dados */}
                    {mesesPendentes.length === 0 && mesesPagos.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50 text-blue-500" />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-blue-800 font-medium">
                            {mensagem || "Nenhum dado encontrado para este ano letivo"}
                          </p>
                          {!mensagem && (
                            <p className="text-blue-600 text-sm mt-2">
                              O aluno pode não estar matriculado neste período
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Histórico Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Histórico Financeiro (Outros Serviços)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {financialData.historicoFinanceiro.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum pagamento de outros serviços encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {financialData.historicoFinanceiro.map((item, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{item.servico}</span>
                                <Badge variant="outline">{item.fatura}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{item.observacao}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(item.data)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                {formatCurrency(item.valor)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botão Fechar */}
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFinancialModal;
