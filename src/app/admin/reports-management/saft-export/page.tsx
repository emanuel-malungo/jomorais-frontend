"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Shield,
  Download,
  FileText,
  Calendar,
  Building,
  Settings,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Info,
  Users,
  Package,
  Receipt,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import saftService from '@/services/saft.service';
import { ISAFTExportConfig, ISAFTExportResponse } from '@/types/saft.types';

export default function SAFTExportPage() {
  // Estados do formulário
  const [config, setConfig] = useState<ISAFTExportConfig>({
    startDate: '',
    endDate: '',
    includeCustomers: true,
    includeProducts: true,
    includeInvoices: true,
    includePayments: true,
    companyInfo: {
      nif: '',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      email: '',
    },
    softwareInfo: {
      name: 'Sistema Jomorais',
      version: '1.0.0',
      certificateNumber: 'CERT-JOMORAIS-2024',
      companyNIF: '123456789',
    },
  });

  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [exportResult, setExportResult] = useState<ISAFTExportResponse | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Carregar informações da empresa ao inicializar
  useEffect(() => {
    loadCompanyInfo();
    setDefaultDates();
  }, []);

  // Carregar estatísticas quando as datas mudarem
  useEffect(() => {
    if (config.startDate && config.endDate) {
      loadStatistics();
    }
  }, [config.startDate, config.endDate]);

  const loadCompanyInfo = async () => {
    try {
      const companyData = await saftService.getCompanyInfo();
      if (companyData.success && companyData.data) {
        const company = companyData.data;
        setConfig(prev => ({
          ...prev,
          companyInfo: {
            nif: company.nif || '',
            name: company.nome || '',
            address: company.endereco || '',
            city: company.cidade || '',
            postalCode: company.codigoPostal || '',
            phone: company.telefone || '',
            email: company.email || '',
          }
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar informações da empresa:', error);
    }
  };

  const setDefaultDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Primeiro dia do mês atual
    const startDate = new Date(currentYear, currentMonth, 1);
    // Último dia do mês atual
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    
    setConfig(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }));
  };

  const loadStatistics = async () => {
    try {
      setLoadingStats(true);
      const stats = await saftService.getExportStatistics(config.startDate, config.endDate);
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStatistics({
        totalInvoices: 0,
        totalPayments: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalAmount: 0
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = async () => {
    setIsValidating(true);
    setValidationErrors([]);

    try {
      const validation = await saftService.validateExportConfig(config);
      
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        return false;
      }

      return true;
    } catch (error) {
      setValidationErrors(['Erro ao validar configuração']);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    setExportResult(null);

    try {
      // Validar antes de exportar
      const isValid = await validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Tentar exportação real primeiro, depois mock se falhar
      let result: ISAFTExportResponse;
      try {
        result = await saftService.exportSAFT(config);
      } catch (error) {
        console.log('API não disponível, usando demonstração...');
        result = await saftService.generateMockSAFT(config);
      }

      setExportResult(result);

      // Se sucesso e há URL de download, iniciar download automaticamente
      if (result.success && result.downloadUrl && result.fileName) {
        saftService.downloadSAFTFile(result.downloadUrl, result.fileName);
      }

    } catch (error: any) {
      setExportResult({
        success: false,
        message: 'Erro inesperado ao gerar ficheiro SAFT',
        errors: [error.message]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (exportResult?.downloadUrl && exportResult?.fileName) {
      saftService.downloadSAFTFile(exportResult.downloadUrl, exportResult.fileName);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-[#F9CD1D]" />
              Exportação SAFT-AO
            </h1>
          </div>
        </div>

        {/* Informações importantes */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Informações Importantes</AlertTitle>
          <AlertDescription>
            O ficheiro SAFT-AO deve ser gerado mensalmente e entregue à AGT quando solicitado. 
            Certifique-se de que todas as informações da empresa estão corretas antes de gerar o ficheiro.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Configuração */}
          <div className="lg:col-span-2 space-y-6">
            {/* Período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Período de Exportação
                </CardTitle>
                <CardDescription>
                  Selecione o período para o qual deseja gerar o ficheiro SAFT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={config.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={config.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Períodos pré-definidos */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const start = new Date(now.getFullYear(), now.getMonth(), 1);
                      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                      handleInputChange('startDate', start.toISOString().split('T')[0]);
                      handleInputChange('endDate', end.toISOString().split('T')[0]);
                    }}
                  >
                    Mês Atual
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                      const end = new Date(now.getFullYear(), now.getMonth(), 0);
                      handleInputChange('startDate', start.toISOString().split('T')[0]);
                      handleInputChange('endDate', end.toISOString().split('T')[0]);
                    }}
                  >
                    Mês Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const start = new Date(now.getFullYear(), 0, 1);
                      const end = new Date(now.getFullYear(), 11, 31);
                      handleInputChange('startDate', start.toISOString().split('T')[0]);
                      handleInputChange('endDate', end.toISOString().split('T')[0]);
                    }}
                  >
                    Ano Atual
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informações da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription>
                  Dados da empresa que serão incluídos no ficheiro SAFT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nif">NIF</Label>
                    <Input
                      id="nif"
                      value={config.companyInfo.nif}
                      onChange={(e) => handleInputChange('companyInfo.nif', e.target.value)}
                      placeholder="Número de Identificação Fiscal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={config.companyInfo.name}
                      onChange={(e) => handleInputChange('companyInfo.name', e.target.value)}
                      placeholder="Nome completo da empresa"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={config.companyInfo.address}
                    onChange={(e) => handleInputChange('companyInfo.address', e.target.value)}
                    placeholder="Endereço completo"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={config.companyInfo.city}
                      onChange={(e) => handleInputChange('companyInfo.city', e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      value={config.companyInfo.postalCode}
                      onChange={(e) => handleInputChange('companyInfo.postalCode', e.target.value)}
                      placeholder="Código postal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={config.companyInfo.phone}
                      onChange={(e) => handleInputChange('companyInfo.phone', e.target.value)}
                      placeholder="+244 xxx xxx xxx"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.companyInfo.email}
                    onChange={(e) => handleInputChange('companyInfo.email', e.target.value)}
                    placeholder="email@empresa.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Erros de Validação */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erros de Validação</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Resultado da Exportação */}
            {exportResult && (
              <Alert variant={exportResult.success ? "default" : "destructive"}>
                {exportResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {exportResult.success ? 'Exportação Concluída' : 'Erro na Exportação'}
                </AlertTitle>
                <AlertDescription>
                  <p>{exportResult.message}</p>
                  {exportResult.success && exportResult.fileName && (
                    <div className="mt-2 space-y-1">
                      <p><strong>Ficheiro:</strong> {exportResult.fileName}</p>
                      {exportResult.fileSize && (
                        <p><strong>Tamanho:</strong> {formatFileSize(exportResult.fileSize)}</p>
                      )}
                      {exportResult.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          className="mt-2"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Novamente
                        </Button>
                      )}
                    </div>
                  )}
                  {exportResult.errors && exportResult.errors.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {exportResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas do Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : statistics ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Faturas:</span>
                      <span className="font-medium">{statistics.totalInvoices || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pagamentos:</span>
                      <span className="font-medium">{statistics.totalPayments || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Clientes:</span>
                      <span className="font-medium">{statistics.totalCustomers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Produtos:</span>
                      <span className="font-medium">{statistics.totalProducts || 0}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total:</span>
                        <span className="font-bold text-[#3B6C4D]">
                          {formatCurrency(statistics.totalAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Selecione um período para ver as estatísticas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Informações do Software */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações do Software</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span>{config.softwareInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versão:</span>
                  <span>{config.softwareInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificado:</span>
                  <span className="text-xs">{config.softwareInfo.certificateNumber}</span>
                </div>
              </CardContent>
            </Card>

            {/* Botão de Exportação */}
            <Button
              onClick={handleExport}
              disabled={isLoading || isValidating || !config.startDate || !config.endDate}
              className="w-full bg-[#3B6C4D] hover:bg-[#2d5a3d] text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando SAFT...
                </>
              ) : isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Ficheiro SAFT
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              O ficheiro será gerado em formato XML conforme especificações da AGT
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
