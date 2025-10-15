import api from '@/utils/api.utils';
import { 
  ISAFTFile, 
  ISAFTExportConfig, 
  ISAFTExportResponse,
  ISAFTHeader,
  ISAFTCustomer,
  ISAFTProduct,
  ISAFTInvoice,
  ISAFTPayment
} from '@/types/saft.types';

class SAFTService {
  private baseUrl = '/api/finance-management/saft';

  /**
   * Gera e exporta ficheiro SAFT-AO
   */
  async exportSAFT(config: ISAFTExportConfig): Promise<ISAFTExportResponse> {
    try {
      console.log('🔄 Iniciando exportação SAFT:', config);
      
      const response = await api.post(`${this.baseUrl}/export`, config, {
        responseType: 'blob', // Para download de ficheiro
        timeout: 300000, // 5 minutos timeout para ficheiros grandes
      });

      // Se a resposta for um blob (ficheiro), criar URL de download
      if (response.data instanceof Blob) {
        const fileName = this.generateFileName(config.startDate, config.endDate);
        const downloadUrl = window.URL.createObjectURL(response.data);
        
        return {
          success: true,
          message: 'Ficheiro SAFT gerado com sucesso',
          fileName,
          fileSize: response.data.size,
          downloadUrl
        };
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao exportar SAFT:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao gerar ficheiro SAFT',
        errors: error.response?.data?.errors || [error.message]
      };
    }
  }

  /**
   * Valida configuração antes da exportação
   */
  async validateExportConfig(config: ISAFTExportConfig): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await api.post(`${this.baseUrl}/validate`, config);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao validar configuração SAFT:', error);
      return {
        valid: false,
        errors: [error.response?.data?.message || 'Erro ao validar configuração']
      };
    }
  }

  /**
   * Obtém informações da empresa para pré-preenchimento
   */
  async getCompanyInfo(): Promise<any> {
    try {
      const response = await api.get('/api/settings-management/instituicao');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar informações da empresa:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas para o período selecionado
   */
  async getExportStatistics(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/statistics`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return {
        totalInvoices: 0,
        totalPayments: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalAmount: 0
      };
    }
  }

  /**
   * Gera nome do ficheiro SAFT baseado no período
   */
  private generateFileName(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const year = start.getFullYear();
    const startMonth = String(start.getMonth() + 1).padStart(2, '0');
    const endMonth = String(end.getMonth() + 1).padStart(2, '0');
    
    if (startMonth === endMonth) {
      // Mesmo mês
      return `SAFT_${year}${startMonth}.xml`;
    } else if (start.getFullYear() === end.getFullYear()) {
      // Mesmo ano, meses diferentes
      return `SAFT_${year}${startMonth}_${endMonth}.xml`;
    } else {
      // Anos diferentes
      return `SAFT_${start.getFullYear()}${startMonth}_${end.getFullYear()}${String(end.getMonth() + 1).padStart(2, '0')}.xml`;
    }
  }

  /**
   * Download direto do ficheiro SAFT
   */
  downloadSAFTFile(downloadUrl: string, fileName: string): void {
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL do blob após download
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
      
      console.log('✅ Download do ficheiro SAFT iniciado:', fileName);
    } catch (error) {
      console.error('❌ Erro ao fazer download:', error);
      throw new Error('Erro ao fazer download do ficheiro');
    }
  }

  /**
   * Gera estrutura SAFT mock para demonstração (quando backend não estiver disponível)
   */
  async generateMockSAFT(config: ISAFTExportConfig): Promise<ISAFTExportResponse> {
    try {
      console.log('🔄 Gerando SAFT mock para demonstração...');
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const saftData = this.createMockSAFTStructure(config);
      const xmlContent = this.convertToXML(saftData);
      
      // Criar blob com conteúdo XML
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const fileName = this.generateFileName(config.startDate, config.endDate);
      const downloadUrl = window.URL.createObjectURL(blob);
      
      return {
        success: true,
        message: 'Ficheiro SAFT gerado com sucesso (demonstração)',
        fileName,
        fileSize: blob.size,
        downloadUrl
      };
    } catch (error: any) {
      console.error('❌ Erro ao gerar SAFT mock:', error);
      return {
        success: false,
        message: 'Erro ao gerar ficheiro SAFT de demonstração',
        errors: [error.message]
      };
    }
  }

  /**
   * Cria estrutura SAFT mock para demonstração
   */
  private createMockSAFTStructure(config: ISAFTExportConfig): ISAFTFile {
    const now = new Date().toISOString();
    
    return {
      header: {
        auditFileVersion: '1.04_01',
        companyID: config.companyInfo.nif,
        taxRegistrationNumber: config.companyInfo.nif,
        taxAccountingBasis: 'F',
        companyName: config.companyInfo.name,
        companyAddress: {
          addressDetail: config.companyInfo.address,
          city: config.companyInfo.city,
          postalCode: config.companyInfo.postalCode,
          country: 'AO'
        },
        fiscalYear: new Date(config.startDate).getFullYear().toString(),
        startDate: config.startDate,
        endDate: config.endDate,
        currencyCode: 'AOA',
        dateCreated: now.split('T')[0],
        taxEntity: 'Global',
        productCompanyTaxID: config.softwareInfo.companyNIF,
        softwareCertificateNumber: config.softwareInfo.certificateNumber,
        productID: config.softwareInfo.name,
        productVersion: config.softwareInfo.version,
        headerComment: 'Ficheiro SAFT gerado pelo Sistema Jomorais'
      },
      masterFiles: {
        customers: config.includeCustomers ? this.createMockCustomers() : [],
        products: config.includeProducts ? this.createMockProducts() : [],
        taxTable: this.createMockTaxTable()
      },
      sourceDocuments: {
        salesInvoices: config.includeInvoices ? {
          numberOfEntries: 10,
          totalDebit: 500000,
          totalCredit: 0,
          invoice: this.createMockInvoices()
        } : undefined,
        payments: config.includePayments ? {
          numberOfEntries: 8,
          totalDebit: 0,
          totalCredit: 400000,
          payment: this.createMockPayments()
        } : undefined
      }
    };
  }

  /**
   * Cria clientes mock
   */
  private createMockCustomers(): ISAFTCustomer[] {
    return [
      {
        customerID: 'CLI001',
        accountID: '2111001',
        customerTaxID: '123456789',
        companyName: 'João Manuel Silva',
        billingAddress: {
          addressDetail: 'Rua da Independência, 123',
          city: 'Luanda',
          country: 'AO'
        },
        telephone: '+244 923 456 789',
        email: 'joao.silva@email.com',
        selfBillingIndicator: 0
      }
    ];
  }

  /**
   * Cria produtos mock
   */
  private createMockProducts(): ISAFTProduct[] {
    return [
      {
        productType: 'S',
        productCode: 'PROP001',
        productDescription: 'Propina da 10ª Classe',
        productGroup: 'Educação'
      },
      {
        productType: 'S',
        productCode: 'MAT001',
        productDescription: 'Taxa de Matrícula',
        productGroup: 'Educação'
      }
    ];
  }

  /**
   * Cria tabela de impostos mock
   */
  private createMockTaxTable(): any[] {
    return [
      {
        taxType: 'IVA',
        taxCountryRegion: 'AO',
        taxCode: 'ISE',
        description: 'Isento de IVA',
        taxPercentage: 0
      }
    ];
  }

  /**
   * Cria faturas mock
   */
  private createMockInvoices(): ISAFTInvoice[] {
    return [
      {
        invoiceNo: 'FT 2024/001',
        documentStatus: {
          invoiceStatus: 'N',
          invoiceStatusDate: '2024-01-15T10:30:00',
          sourceID: 'Admin',
          sourceBilling: 'P'
        },
        hash: 'ABC123DEF456',
        hashControl: '1',
        invoiceDate: '2024-01-15',
        invoiceType: 'FT',
        sourceID: 'Admin',
        systemEntryDate: '2024-01-15T10:30:00',
        customerID: 'CLI001',
        line: [
          {
            lineNumber: 1,
            productCode: 'PROP001',
            productDescription: 'Propina da 10ª Classe - Janeiro 2024',
            quantity: 1,
            unitOfMeasure: 'UN',
            unitPrice: 50000,
            description: 'Propina mensal',
            tax: {
              taxType: 'IVA',
              taxCountryRegion: 'AO',
              taxCode: 'ISE',
              taxPercentage: 0,
              taxAmount: 0
            }
          }
        ],
        documentTotals: {
          taxPayable: 0,
          netTotal: 50000,
          grossTotal: 50000
        }
      }
    ];
  }

  /**
   * Cria pagamentos mock
   */
  private createMockPayments(): ISAFTPayment[] {
    return [
      {
        paymentRefNo: 'RC 2024/001',
        transactionDate: '2024-01-15',
        paymentType: 'RC',
        documentStatus: {
          invoiceStatus: 'N',
          invoiceStatusDate: '2024-01-15T11:00:00',
          sourceID: 'Admin',
          sourceBilling: 'P'
        },
        paymentMethod: [
          {
            paymentMechanism: 'NU',
            paymentAmount: 50000,
            paymentDate: '2024-01-15'
          }
        ],
        sourceID: 'Admin',
        systemEntryDate: '2024-01-15T11:00:00',
        customerID: 'CLI001',
        line: [
          {
            lineNumber: 1,
            sourceDocumentID: [
              {
                originatingON: 'FT 2024/001',
                invoiceDate: '2024-01-15',
                description: 'Pagamento de propina'
              }
            ],
            settlementAmount: 50000
          }
        ],
        documentTotals: {
          taxPayable: 0,
          netTotal: 50000,
          grossTotal: 50000
        }
      }
    ];
  }

  /**
   * Converte estrutura SAFT para XML
   */
  private convertToXML(saftData: ISAFTFile): string {
    // Implementação simplificada de conversão para XML
    // Em produção, usar biblioteca como xml2js ou similar
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<AuditFile xmlns="urn:OECD:StandardAuditFile-Tax:AO_1.04_01">
  <Header>
    <AuditFileVersion>${saftData.header.auditFileVersion}</AuditFileVersion>
    <CompanyID>${saftData.header.companyID}</CompanyID>
    <TaxRegistrationNumber>${saftData.header.taxRegistrationNumber}</TaxRegistrationNumber>
    <TaxAccountingBasis>${saftData.header.taxAccountingBasis}</TaxAccountingBasis>
    <CompanyName>${saftData.header.companyName}</CompanyName>
    <CompanyAddress>
      <AddressDetail>${saftData.header.companyAddress.addressDetail}</AddressDetail>
      <City>${saftData.header.companyAddress.city}</City>
      <Country>${saftData.header.companyAddress.country}</Country>
    </CompanyAddress>
    <FiscalYear>${saftData.header.fiscalYear}</FiscalYear>
    <StartDate>${saftData.header.startDate}</StartDate>
    <EndDate>${saftData.header.endDate}</EndDate>
    <CurrencyCode>${saftData.header.currencyCode}</CurrencyCode>
    <DateCreated>${saftData.header.dateCreated}</DateCreated>
    <TaxEntity>${saftData.header.taxEntity}</TaxEntity>
    <ProductCompanyTaxID>${saftData.header.productCompanyTaxID}</ProductCompanyTaxID>
    <SoftwareCertificateNumber>${saftData.header.softwareCertificateNumber}</SoftwareCertificateNumber>
    <ProductID>${saftData.header.productID}</ProductID>
    <ProductVersion>${saftData.header.productVersion}</ProductVersion>
    <HeaderComment>${saftData.header.headerComment}</HeaderComment>
  </Header>
  
  <MasterFiles>
    <!-- Clientes, Produtos, Tabela de Impostos seriam adicionados aqui -->
  </MasterFiles>
  
  <SourceDocuments>
    <!-- Faturas e Pagamentos seriam adicionados aqui -->
  </SourceDocuments>
</AuditFile>`;
  }
}

export default new SAFTService();
