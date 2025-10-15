import { useState, useCallback } from 'react';
import saftService from '@/services/saft.service';
import { ISAFTExportConfig, ISAFTExportResponse } from '@/types/saft.types';

export const useSAFTExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ISAFTExportResponse | null>(null);

  const exportSAFT = useCallback(async (config: ISAFTExportConfig): Promise<ISAFTExportResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);

      console.log('🔄 Iniciando exportação SAFT via hook:', config);

      const response = await saftService.exportSAFT(config);
      setResult(response);

      if (response.success) {
        console.log('✅ Exportação SAFT concluída com sucesso');
      } else {
        console.error('❌ Erro na exportação SAFT:', response.message);
        setError(response.message);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao exportar SAFT';
      console.error('❌ Erro no hook useSAFTExport:', err);
      setError(errorMessage);
      
      const errorResponse: ISAFTExportResponse = {
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
      setResult(errorResponse);
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateConfig = useCallback(async (config: ISAFTExportConfig) => {
    try {
      setIsValidating(true);
      setError(null);

      console.log('🔍 Validando configuração SAFT:', config);

      const validation = await saftService.validateExportConfig(config);
      
      if (!validation.valid) {
        console.warn('⚠️ Configuração SAFT inválida:', validation.errors);
        setError(validation.errors.join(', '));
      } else {
        console.log('✅ Configuração SAFT válida');
      }

      return validation;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao validar configuração';
      console.error('❌ Erro na validação SAFT:', err);
      setError(errorMessage);
      
      return {
        valid: false,
        errors: [errorMessage]
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const generateMockSAFT = useCallback(async (config: ISAFTExportConfig): Promise<ISAFTExportResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);

      console.log('🔄 Gerando SAFT mock via hook:', config);

      const response = await saftService.generateMockSAFT(config);
      setResult(response);

      if (response.success) {
        console.log('✅ SAFT mock gerado com sucesso');
      } else {
        console.error('❌ Erro ao gerar SAFT mock:', response.message);
        setError(response.message);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao gerar SAFT mock';
      console.error('❌ Erro no hook generateMockSAFT:', err);
      setError(errorMessage);
      
      const errorResponse: ISAFTExportResponse = {
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      };
      setResult(errorResponse);
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadFile = useCallback((downloadUrl: string, fileName: string) => {
    try {
      saftService.downloadSAFTFile(downloadUrl, fileName);
      console.log('✅ Download iniciado:', fileName);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer download';
      console.error('❌ Erro no download:', err);
      setError(errorMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    // Estados
    isLoading,
    isValidating,
    error,
    result,
    
    // Funções
    exportSAFT,
    validateConfig,
    generateMockSAFT,
    downloadFile,
    clearError,
    clearResult
  };
};

export const useSAFTStatistics = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async (startDate: string, endDate: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 Carregando estatísticas SAFT:', { startDate, endDate });

      const stats = await saftService.getExportStatistics(startDate, endDate);
      setStatistics(stats);

      console.log('✅ Estatísticas SAFT carregadas:', stats);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar estatísticas';
      console.error('❌ Erro ao carregar estatísticas SAFT:', err);
      setError(errorMessage);
      
      // Definir estatísticas padrão em caso de erro
      setStatistics({
        totalInvoices: 0,
        totalPayments: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalAmount: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearStatistics = useCallback(() => {
    setStatistics(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    statistics,
    isLoading,
    error,
    
    // Funções
    loadStatistics,
    clearStatistics,
    clearError
  };
};

export const useSAFTCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompanyInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🏢 Carregando informações da empresa para SAFT...');

      const company = await saftService.getCompanyInfo();
      setCompanyInfo(company);

      console.log('✅ Informações da empresa carregadas:', company);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar informações da empresa';
      console.error('❌ Erro ao carregar informações da empresa:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCompanyInfo = useCallback(() => {
    setCompanyInfo(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    companyInfo,
    isLoading,
    error,
    
    // Funções
    loadCompanyInfo,
    clearCompanyInfo,
    clearError
  };
};

// Hook principal que combina todas as funcionalidades
export const useSAFT = () => {
  const exportHook = useSAFTExport();
  const statisticsHook = useSAFTStatistics();
  const companyHook = useSAFTCompanyInfo();

  return {
    // Export
    export: exportHook,
    
    // Statistics
    statistics: statisticsHook,
    
    // Company Info
    company: companyHook,
    
    // Estados combinados
    isLoading: exportHook.isLoading || statisticsHook.isLoading || companyHook.isLoading,
    hasError: !!(exportHook.error || statisticsHook.error || companyHook.error),
    
    // Função para limpar todos os erros
    clearAllErrors: () => {
      exportHook.clearError();
      statisticsHook.clearError();
      companyHook.clearError();
    }
  };
};

export default useSAFT;
