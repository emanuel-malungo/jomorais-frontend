import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  reportsService, 
  IReportFilters, 
  IStudentReport, 
  IFinancialReport, 
  IAcademicReport 
} from '@/services/reports.service';

// Cache helper
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface CacheData<T> {
  data: T;
  timestamp: number;
  filters: string;
}

function getCachedData<T>(key: string, filters: IReportFilters): T | null {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp, filters: cachedFilters }: CacheData<T> = JSON.parse(cached);
    const now = Date.now();
    const filtersMatch = JSON.stringify(filters) === cachedFilters;

    if (now - timestamp < CACHE_TTL && filtersMatch) {
      console.log(`✅ Cache hit para ${key}`);
      return data;
    }

    sessionStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T, filters: IReportFilters): void {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
      filters: JSON.stringify(filters),
    };
    sessionStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`Erro ao salvar cache para ${key}:`, error);
  }
}

// ===============================
// HOOK PARA RELATÓRIOS DE ALUNOS
// ===============================

export const useStudentReports = () => {
  const [report, setReport] = useState<IStudentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const generateReport = useCallback(async (filters: IReportFilters = {}) => {
    if (fetchingRef.current) return;

    console.log('🔄 Hook useStudentReports: Iniciando geração de relatório...', filters);
    
    // Verificar cache primeiro
    const cached = getCachedData<IStudentReport>('student-report', filters);
    if (cached) {
      setReport(cached);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await reportsService.generateStudentReport(filters);
      if (isMountedRef.current) {
        console.log('✅ Hook useStudentReports: Relatório gerado com sucesso:', reportData);
        setReport(reportData);
        setCachedData('student-report', reportData, filters);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        console.error('❌ Hook useStudentReports: Erro ao gerar relatório:', err);
        setError(err instanceof Error ? err.message : 'Erro ao gerar relatório de alunos');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      fetchingRef.current = false;
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
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const generateReport = useCallback(async (filters: IReportFilters = {}) => {
    if (fetchingRef.current) return;

    console.log('🔄 Hook useFinancialReports: Iniciando geração de relatório...', filters);
    
    // Verificar cache primeiro
    const cached = getCachedData<IFinancialReport>('financial-report', filters);
    if (cached) {
      setReport(cached);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await reportsService.generateFinancialReport(filters);
      if (isMountedRef.current) {
        console.log('✅ Hook useFinancialReports: Relatório gerado com sucesso:', reportData);
        setReport(reportData);
        setCachedData('financial-report', reportData, filters);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        console.error('❌ Hook useFinancialReports: Erro ao gerar relatório:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório financeiro';
        console.error('❌ Mensagem de erro:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      fetchingRef.current = false;
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
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const generateReport = useCallback(async (filters: IReportFilters = {}) => {
    if (fetchingRef.current) return;

    // Verificar cache primeiro
    const cached = getCachedData<IAcademicReport>('academic-report', filters);
    if (cached) {
      setReport(cached);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await reportsService.generateAcademicReport(filters);
      if (isMountedRef.current) {
        setReport(reportData);
        setCachedData('academic-report', reportData, filters);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao gerar relatório acadêmico');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      fetchingRef.current = false;
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
