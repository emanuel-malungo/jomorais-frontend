import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  pagamento: {
    codigo: number;
    fatura: string;
    data: string;
    mes: string;
    ano: number;
    preco: number;
    observacao: string;
    aluno: {
      codigo: number;
      nome: string;
      n_documento_identificacao: string;
      email: string;
      telefone: string;
    };
    tipoServico: {
      designacao: string;
    };
    formaPagamento: {
      designacao: string;
    };
  };
  instituicao: {
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
  };
}

export class InvoiceService {
  /**
   * Gera PDF da fatura de pagamento
   */
  static generateInvoicePDF(data: InvoiceData): void {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;

      // Cabeçalho da instituição
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(data.instituicao.nome, pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(data.instituicao.endereco, pageWidth / 2, 32, { align: 'center' });
      doc.text(`Tel: ${data.instituicao.telefone} | Email: ${data.instituicao.email}`, pageWidth / 2, 38, { align: 'center' });

      // Linha separadora
      doc.setLineWidth(0.5);
      doc.line(margin, 45, pageWidth - margin, 45);

      // Título da fatura
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('FATURA DE PAGAMENTO', pageWidth / 2, 55, { align: 'center' });

      // Informações da fatura
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      let yPosition = 70;
      
      // Dados da fatura
      const faturaInfo = [
        ['Número da Fatura:', data.pagamento.fatura],
        ['Data de Emissão:', new Date(data.pagamento.data).toLocaleDateString('pt-BR')],
        ['Mês de Referência:', `${data.pagamento.mes}/${data.pagamento.ano}`],
        ['Forma de Pagamento:', data.pagamento.formaPagamento.designacao]
      ];

      faturaInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 50, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Dados do aluno
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DO ALUNO', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const alunoInfo = [
        ['Nome:', data.pagamento.aluno.nome],
        ['Documento:', data.pagamento.aluno.n_documento_identificacao],
        ['Email:', data.pagamento.aluno.email || 'N/A'],
        ['Telefone:', data.pagamento.aluno.telefone || 'N/A']
      ];

      alunoInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 30, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Tabela de serviços
      const tableData = [
        [
          '1',
          data.pagamento.tipoServico.designacao,
          `${data.pagamento.mes}/${data.pagamento.ano}`,
          '1',
          this.formatCurrency(data.pagamento.preco),
          this.formatCurrency(data.pagamento.preco)
        ]
      ];

      autoTable(doc, {
        head: [['Item', 'Descrição', 'Período', 'Qtd', 'Valor Unit.', 'Total']],
        body: tableData,
        startY: yPosition,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { halign: 'center', cellWidth: 25 },
          3: { halign: 'center', cellWidth: 15 },
          4: { halign: 'right', cellWidth: 30 },
          5: { halign: 'right', cellWidth: 30 }
        }
      });

      // Total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL GERAL:', pageWidth - margin - 60, finalY);
      doc.text(this.formatCurrency(data.pagamento.preco), pageWidth - margin, finalY, { align: 'right' });

      // Observações
      if (data.pagamento.observacao) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Observações:', margin, finalY + 20);
        doc.text(data.pagamento.observacao, margin, finalY + 28);
      }

      // Rodapé
      const footerY = doc.internal.pageSize.height - 30;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Esta fatura foi gerada automaticamente pelo sistema.', pageWidth / 2, footerY, { align: 'center' });
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, footerY + 5, { align: 'center' });

      // Salvar o PDF
      doc.save(`Fatura_${data.pagamento.fatura}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF da fatura:', error);
      throw new Error('Erro ao gerar PDF da fatura');
    }
  }

  /**
   * Imprime a fatura
   */
  static printInvoice(data: InvoiceData): void {
    try {
      const doc = new jsPDF();
      // Usar a mesma lógica de geração do PDF
      this.generateInvoicePDF(data);
      
      // Abrir janela de impressão
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Erro ao imprimir fatura:', error);
      throw new Error('Erro ao imprimir fatura');
    }
  }

  /**
   * Formata valor monetário
   */
  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('AOA', 'Kz');
  }

  /**
   * Gera dados mockados para teste
   */
  static getMockInvoiceData(paymentId: number): InvoiceData {
    return {
      pagamento: {
        codigo: paymentId,
        fatura: `FAT_${Date.now()}`,
        data: new Date().toISOString(),
        mes: 'OUTUBRO',
        ano: 2024,
        preco: 15000,
        observacao: 'Pagamento de propina mensal',
        aluno: {
          codigo: 123,
          nome: 'João Silva Santos',
          n_documento_identificacao: '123456789LA041',
          email: 'joao@email.com',
          telefone: '923456789'
        },
        tipoServico: {
          designacao: 'Propina'
        },
        formaPagamento: {
          designacao: 'Dinheiro'
        }
      },
      instituicao: {
        nome: 'INSTITUTO MÉDIO POLITÉCNICO JO MORAIS',
        endereco: 'Luanda, Angola',
        telefone: '+244 XXX XXX XXX',
        email: 'info@JOMORAIS.ao'
      }
    };
  }
}
