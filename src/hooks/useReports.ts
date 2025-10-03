import { useState, useCallback } from 'react';
import { 
  reportsService, 
  IReportFilters, 
  IStudentReport, 
  IFinancialReport, 
  IAcademicReport 
} from '@/services/reports.service';

// ===============================
// HOOK PARA RELATÓRIOS DE ALUNOS
// ===============================

export const useStudentReports = () => {
  const [report, setReport] = useState<IStudentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (filters: IReportFilters = {}) => {
    console.log('🔄 Hook useStudentReports: Iniciando geração de relatório...', filters);
    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await reportsService.generateStudentReport(filters);
      console.log('✅ Hook useStudentReports: Relatório gerado com sucesso:', reportData);
      setReport(reportData);
    } catch (err: unknown) {
      console.error('❌ Hook useStudentReports: Erro ao gerar relatório:', err);
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório de alunos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    console.log('🔴 BOTÃO PDF CLICADO - Iniciando exportação PDF');
    if (!report) {
      console.warn('⚠️ Nenhum relatório disponível para PDF');
      return;
    }
    
    try {
      console.log('📄 Chamando exportReportToPDF...');
      await reportsService.exportReportToPDF('students', report);
      console.log('✅ PDF exportado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao exportar relatório em PDF:', err);
      alert(`Erro ao gerar PDF: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [report]);

  const exportToExcel = useCallback(async () => {
    console.log('🟢 BOTÃO EXCEL CLICADO - Iniciando exportação Excel');
    if (!report) {
      console.warn('⚠️ Nenhum relatório disponível para Excel');
      return;
    }
    
    try {
      console.log('📊 Chamando exportReportToExcel...');
      await reportsService.exportReportToExcel('students', report);
      console.log('✅ Excel exportado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao exportar relatório em Excel:', err);
      alert(`Erro ao gerar Excel: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [report]);

  return {
    report,
    isLoading,
    error,
    generateReport,
    exportToPDF,
    exportToExcel
  };
};

// ===============================
// HOOK PARA RELATÓRIOS FINANCEIROS
// ===============================

export const useFinancialReports = () => {
  const [report, setReport] = useState<IFinancialReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (filters: IReportFilters = {}) => {
    console.log('🔄 Hook useFinancialReports: Iniciando geração de relatório...', filters);
    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await reportsService.generateFinancialReport(filters);
      console.log('✅ Hook useFinancialReports: Relatório gerado com sucesso:', reportData);
      setReport(reportData);
    } catch (err: unknown) {
      console.error('❌ Hook useFinancialReports: Erro ao gerar relatório:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório financeiro';
      console.error('❌ Mensagem de erro:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    console.log('🔴 BOTÃO PDF FINANCEIRO CLICADO - Iniciando exportação PDF');
    if (!report) {
      console.warn('⚠️ Nenhum relatório financeiro disponível para PDF');
      return;
    }
    
    try {
      console.log('📄 Chamando exportReportToPDF para relatório financeiro...');
      console.log('📊 Dados do relatório financeiro:', report);
      await reportsService.exportReportToPDF('financial', report);
      console.log('✅ PDF financeiro exportado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao exportar relatório financeiro em PDF:', err);
      alert(`Erro ao gerar PDF financeiro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [report]);

  const exportToExcel = useCallback(async () => {
    console.log('🟢 BOTÃO EXCEL FINANCEIRO CLICADO - Iniciando exportação Excel');
    if (!report) {
      console.warn('⚠️ Nenhum relatório financeiro disponível para Excel');
      return;
    }
    
    try {
      console.log('📊 Chamando exportReportToExcel para relatório financeiro...');
      await reportsService.exportReportToExcel('financial', report);
      console.log('✅ Excel financeiro exportado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao exportar relatório financeiro em Excel:', err);
      alert(`Erro ao gerar Excel financeiro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [report]);

  return {
    report,
    isLoading,
    error,
    generateReport,
    exportToPDF,
    exportToExcel
  };
};

// ===============================
// HOOK PARA RELATÓRIOS ACADÊMICOS
// ===============================

export const useAcademicReports = () => {
  const [report, setReport] = useState<IAcademicReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (filters: IReportFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await reportsService.generateAcademicReport(filters);
      setReport(reportData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório acadêmico');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportToPDF = useCallback(async () => {
    if (!report) return;
    
    try {
      await reportsService.exportReportToPDF('academic', report);
    } catch (err) {
      console.error('Erro ao exportar relatório em PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  }, [report]);

  const exportToExcel = useCallback(async () => {
    if (!report) return;
    
    try {
      await reportsService.exportReportToExcel('academic', report);
    } catch (err) {
      console.error('Erro ao exportar relatório em Excel:', err);
      alert('Erro ao gerar Excel. Tente novamente.');
    }
  }, [report]);

  return {
    report,
    isLoading,
    error,
    generateReport,
    exportToPDF,
    exportToExcel
  };
};

// ===============================
// HOOK GENÉRICO PARA RELATÓRIOS
// ===============================

export const useReports = () => {
  const studentReports = useStudentReports();
  const financialReports = useFinancialReports();
  const academicReports = useAcademicReports();

  return {
    students: studentReports,
    financial: financialReports,
    academic: academicReports
  };
};
