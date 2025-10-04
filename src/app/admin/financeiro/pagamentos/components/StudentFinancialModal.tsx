'use client';

import React from 'react';
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
import { Separator } from '@/components/ui/separator';
import { IStudentFinancialData } from '@/hooks/usePayments';

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
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Carregando dados financeiros...</span>
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
                      <p className="text-2xl font-bold">{financialData.resumo.totalMeses}</p>
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
                      <p className="text-2xl font-bold text-green-600">{financialData.resumo.mesesPagos}</p>
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

            {/* Status dos Meses de Propina */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Status das Propinas (Setembro - Julho)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {financialData.mesesPropina.map((mes, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{mes.mes}</span>
                          {getStatusIcon(mes.status)}
                        </div>
                        <Badge className={`w-full justify-center ${getStatusColor(mes.status)}`}>
                          {mes.status === 'PAGO' ? 'PAGO' : 'PENDENTE'}
                        </Badge>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>Valor: {formatCurrency(mes.valor)}</div>
                          {mes.dataPagamento && (
                            <div>Pago em: {formatDate(mes.dataPagamento)}</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
