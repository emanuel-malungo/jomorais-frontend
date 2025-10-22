'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Search, 
  Filter,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useStudentsConfirmed, useStudentFinancialData, usePaymentsList, useGenerateInvoicePDF } from '@/hooks/usePayments';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllTurmas } from '@/hooks/useTurma';
import { useAllCourses } from '@/hooks/useCourse';
import Container from '@/components/layout/Container';
import NovoPaymentModal from './components/NovoPaymentModal';
import StudentFinancialModal from './components/StudentFinancialModal';

const PagamentosPage = () => {
  // Estados principais
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTurma, setSelectedTurma] = useState<string>('all');
  const [selectedCurso, setSelectedCurso] = useState<string>('all');
  
  // Estados para lista de pagamentos
  const [paymentsSearchTerm, setPaymentsSearchTerm] = useState('');
  const [paymentsCurrentPage, setPaymentsCurrentPage] = useState(1);
  const [selectedTipoServico, setSelectedTipoServico] = useState<string>('all');
  const [downloadingPaymentId, setDownloadingPaymentId] = useState<number | null>(null);
  
  // Debounce para busca (otimizado)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedPaymentsSearch = useDebounce(paymentsSearchTerm, 500);

  // Hooks
  const { 
    students, 
    loading: studentsLoading, 
    error: studentsError, 
    pagination, 
    fetchStudents 
  } = useStudentsConfirmed();

  const {
    data: financialData,
    loading: financialLoading,
    fetchFinancialData,
    clearData: clearFinancialData
  } = useStudentFinancialData();

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    pagination: paymentsPagination,
    fetchPayments
  } = usePaymentsList();

  const { generatePDF, loading: pdfLoading } = useGenerateInvoicePDF();

  // Hooks para filtros
  const { turmas } = useAllTurmas();
  const { courses } = useAllCourses();

  // Carregar alunos quando a página carrega ou filtros mudam
  useEffect(() => {
    if (showStudentsModal) {
      // Reset página quando filtros mudam (mas não quando é mudança de página)
      if (currentPage !== 1 && (debouncedSearchTerm || selectedTurma !== 'all' || selectedCurso !== 'all')) {
        setCurrentPage(1);
        return;
      }
      
      const turmaId = selectedTurma !== 'all' ? parseInt(selectedTurma) : undefined;
      const cursoId = selectedCurso !== 'all' ? parseInt(selectedCurso) : undefined;
      fetchStudents(currentPage, 100, debouncedSearchTerm, turmaId, cursoId);
    }
  }, [showStudentsModal, currentPage, debouncedSearchTerm, selectedTurma, selectedCurso]);

  // Carregar pagamentos quando a página carrega ou filtros mudam
  useEffect(() => {
    const tipoServico = selectedTipoServico !== 'all' ? selectedTipoServico : undefined;
    fetchPayments(paymentsCurrentPage, 10, debouncedPaymentsSearch, tipoServico);
  }, [paymentsCurrentPage, debouncedPaymentsSearch, selectedTipoServico]);

  // Handlers
  const handleViewStudent = async (student: any) => {
    console.log('👁️ Abrindo dados financeiros para:', student.nome);
    setSelectedStudent(student);
    setShowFinancialModal(true);
    
    // Carregar dados financeiros de forma assíncrona (não bloqueante)
    fetchFinancialData(student.codigo);
  };

  const handleCloseFinancialModal = () => {
    setShowFinancialModal(false);
    setSelectedStudent(null);
    clearFinancialData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDownloadInvoice = async (paymentId: number) => {
    try {
      setDownloadingPaymentId(paymentId);
      await generatePDF(paymentId);
    } catch (error) {
      console.error('Erro ao baixar fatura:', error);
    } finally {
      setDownloadingPaymentId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Pagamentos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie pagamentos de propinas e outros serviços
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setShowStudentsModal(true)}
              variant="outline"
              className="px-4 sm:px-6 py-3 rounded-xl font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-50 text-sm sm:text-base"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Ver Estado dos </span>Alunos
            </Button>

            <Button
              onClick={() => setShowNewPaymentModal(true)}
              className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Novo Pagamento
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pagamentos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.231.000 Kz</div>
              <p className="text-xs text-muted-foreground">+15.3% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+5 em relação a ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">Alunos confirmados</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Pagamentos Processados</CardTitle>
              
              <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por aluno..."
                    value={paymentsSearchTerm}
                    onChange={(e) => setPaymentsSearchTerm(e.target.value)}
                    className="pl-10 w-full lg:w-64"
                  />
                </div>
                
                {/* Filter by Service Type */}
                <Select value={selectedTipoServico} onValueChange={setSelectedTipoServico}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Tipo de Serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Serviços</SelectItem>
                    <SelectItem value="propina">Propinas</SelectItem>
                    <SelectItem value="outros">Outros Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando pagamentos...</p>
              </div>
            ) : paymentsError ? (
              <div className="text-center py-8 text-red-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Erro ao carregar pagamentos: {paymentsError}</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pagamento encontrado</p>
                {(debouncedPaymentsSearch || selectedTipoServico !== 'all') && (
                  <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
                )}
              </div>
            ) : (
              <>
                {/* Payments Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">Aluno</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Serviço</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Mês/Ano</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">Valor</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Data</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm hidden xl:table-cell">Fatura</th>
                        <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment: any) => (
                        <tr key={payment.codigo} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 sm:px-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{payment.aluno?.nome}</p>
                              <p className="text-xs sm:text-sm text-gray-500 sm:hidden">{payment.tipoServico?.designacao}</p>
                              <p className="text-xs text-gray-500">{payment.aluno?.n_documento_identificacao}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                            <p className="text-gray-900 text-sm">{payment.tipoServico?.designacao}</p>
                          </td>
                          <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                            <p className="text-gray-900 text-sm">{payment.mes}/{payment.ano}</p>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <p className="font-medium text-green-600 text-sm sm:text-base">{formatCurrency(payment.preco)}</p>
                            <p className="text-xs text-gray-500 md:hidden">{payment.mes}/{payment.ano}</p>
                          </td>
                          <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">
                            <p className="text-gray-900 text-sm">{formatDate(payment.data)}</p>
                          </td>
                          <td className="py-3 px-2 sm:px-4 hidden xl:table-cell">
                            <p className="text-sm text-gray-600">{payment.fatura}</p>
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-center">
                            <Button
                              onClick={() => handleDownloadInvoice(payment.codigo)}
                              variant="outline"
                              size="sm"
                              disabled={downloadingPaymentId === payment.codigo}
                              className="text-blue-600 hover:text-blue-700 px-2 sm:px-3"
                            >
                              {downloadingPaymentId === payment.codigo ? (
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600 sm:mr-1"></div>
                              ) : (
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                              )}
                              <span className="hidden sm:inline">
                                {downloadingPaymentId === payment.codigo ? 'Gerando...' : 'Fatura'}
                              </span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {paymentsPagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                      Mostrando {((paymentsPagination.currentPage - 1) * paymentsPagination.itemsPerPage) + 1} a{' '}
                      {Math.min(paymentsPagination.currentPage * paymentsPagination.itemsPerPage, paymentsPagination.totalItems)} de{' '}
                      {paymentsPagination.totalItems} pagamentos
                    </p>
                    
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={() => setPaymentsCurrentPage(paymentsPagination.currentPage - 1)}
                        disabled={paymentsPagination.currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <span className="hidden sm:inline">Anterior</span>
                        <span className="sm:hidden">Ant</span>
                      </Button>
                      
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded">
                        {paymentsPagination.currentPage} de {paymentsPagination.totalPages}
                      </span>
                      
                      <Button
                        onClick={() => setPaymentsCurrentPage(paymentsPagination.currentPage + 1)}
                        disabled={paymentsPagination.currentPage === paymentsPagination.totalPages}
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <span className="hidden sm:inline">Próximo</span>
                        <span className="sm:hidden">Prox</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Novo Pagamento */}
      <NovoPaymentModal
        open={showNewPaymentModal}
        onClose={() => setShowNewPaymentModal(false)}
      />

      {/* Modal Lista de Alunos */}
      <Dialog open={showStudentsModal} onOpenChange={setShowStudentsModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Estado dos Alunos
            </DialogTitle>
            <DialogDescription className="text-sm">
              Lista de alunos confirmados em turmas com opções de filtro
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome do aluno..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger className="w-full sm:w-40 lg:w-48">
                    <SelectValue placeholder="Filtrar por turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                        {turma.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                  <SelectTrigger className="w-full sm:w-40 lg:w-48">
                    <SelectValue placeholder="Filtrar por curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os cursos</SelectItem>
                    {courses.map((curso) => (
                      <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                        {curso.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Alunos */}
            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              {studentsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando alunos...</p>
                </div>
              ) : studentsError ? (
                <div className="p-8 text-center text-red-600">
                  <p>Erro: {studentsError}</p>
                </div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum aluno encontrado</p>
                </div>
              ) : (
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900">Aluno</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900 hidden sm:table-cell">Documento</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900 hidden md:table-cell">Curso</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900">Turma</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.codigo} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900 text-sm truncate max-w-[120px] sm:max-w-none">{student.nome}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{student.n_documento_identificacao}</div>
                            <div className="text-xs text-gray-500 md:hidden">{student.tb_matriculas?.tb_cursos?.designacao || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {student.n_documento_identificacao}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          {student.tb_matriculas?.tb_cursos?.designacao || 'N/A'}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900">
                          {student.tb_matriculas?.tb_confirmacoes?.[0]?.tb_turmas?.designacao || 'N/A'}
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <Button
                            onClick={() => handleViewStudent(student)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-800 px-2 sm:px-3 text-xs sm:text-sm"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Visualizar</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                  {pagination.totalItems} alunos
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">Ant</span>
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Próximo</span>
                    <span className="sm:hidden">Prox</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Dados Financeiros do Aluno */}
      <StudentFinancialModal
        open={showFinancialModal}
        onClose={handleCloseFinancialModal}
        student={selectedStudent}
        financialData={financialData}
        loading={financialLoading}
      />
    </Container>
  );
};

export default PagamentosPage;
