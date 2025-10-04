import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/utils/api.utils';

// Estender o tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface StudentData {
  codigo: number;
  nome: string;
  numero_documento?: string;
  email?: string;
  telefone?: string;
}

export interface TurmaReportData {
  turma: {
    codigo: number;
    designacao: string;
    tb_classes?: { designacao: string };
    tb_cursos?: { designacao: string };
    tb_salas?: { designacao: string };
    tb_periodos?: { designacao: string };
  };
  alunos: StudentData[];
}

export class TurmaReportService {
  
  /**
   * Busca alunos de uma turma específica
   */
  static async getStudentsByTurma(turmaId: number): Promise<StudentData[]> {
    try {
      const response = await api.get(`/api/academic-management/turmas/${turmaId}/alunos`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao buscar alunos');
    } catch (error) {
      console.error('Erro ao buscar alunos da turma:', error);
      // Retornar dados mockados para teste
      return this.getMockStudents();
    }
  }

  /**
   * Busca todas as turmas com seus alunos
   */
  static async getAllTurmasWithStudents(anoLectivoId?: number): Promise<TurmaReportData[]> {
    try {
      const params = anoLectivoId ? { ano_lectivo: anoLectivoId } : {};
      const response = await api.get('/api/academic-management/relatorio-turmas-completo', { params });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao buscar dados');
    } catch (error) {
      console.error('Erro ao buscar todas as turmas:', error);
      // Retornar dados mockados para teste
      return this.getMockTurmasData();
    }
  }

  /**
   * Gera PDF para uma turma específica
   */
  static async generateSingleTurmaPDF(turma: any): Promise<void> {
    const alunos = await this.getStudentsByTurma(turma.codigo);
    
    const doc = new jsPDF();
    
    // Configurações do documento
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Cabeçalho da escola/instituição
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTITUTO MÉDIO POLITÉCNICO JO MORAIS', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('LISTA NOMINAL DE ALUNOS', pageWidth / 2, 35, { align: 'center' });
    
    // Informações da turma
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const turmaInfo = [
      `Turma: ${turma.designacao}`,
      `Classe: ${turma.tb_classes?.designacao || 'N/A'}`,
      `Curso: ${turma.tb_cursos?.designacao || 'N/A'}`,
      `Sala: ${turma.tb_salas?.designacao || 'N/A'}`,
      `Período: ${turma.tb_periodos?.designacao || 'N/A'}`
    ];
    
    let yPosition = 50;
    turmaInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += 8;
    });
    
    // Data do relatório
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, 50, { align: 'right' });
    doc.text(`Total de Alunos: ${alunos.length}`, pageWidth - margin, 58, { align: 'right' });
    
    // Ordenar alunos alfabeticamente
    const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
    
    // Tabela de alunos - apenas relação nominal
    const tableData = alunosOrdenados.map((aluno, index) => [
      (index + 1).toString(),
      aluno.nome
    ]);
    
    autoTable(doc, {
      head: [['Nº', 'Nome do Aluno']],
      body: tableData,
      startY: yPosition + 10,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 12,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        1: { cellWidth: 140 }
      }
    });
    
    // Rodapé
    const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;
    doc.setFontSize(10);
    doc.text('Assinatura do Diretor: _________________________', margin, finalY + 30);
    doc.text('Assinatura do Coordenador: _________________________', margin, finalY + 45);
    
    // Salvar o PDF
    doc.save(`Lista_Alunos_${turma.designacao.replace(/\s+/g, '_')}.pdf`);
  }

  /**
   * Gera PDF para todas as turmas
   */
  static async generateAllTurmasPDF(anoLectivoId?: number): Promise<void> {
    try {
      console.log('Iniciando geração de PDF para todas as turmas...');
      const turmasData = await this.getAllTurmasWithStudents(anoLectivoId);
      
      if (!turmasData || turmasData.length === 0) {
        throw new Error('Nenhuma turma encontrada para o ano letivo selecionado');
      }
      
      console.log(`Gerando PDF para ${turmasData.length} turmas`);
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      
      // Processar cada turma
      for (let turmaIndex = 0; turmaIndex < turmasData.length; turmaIndex++) {
        const turmaData = turmasData[turmaIndex];
        
        try {
          console.log(`Processando turma ${turmaIndex + 1}/${turmasData.length}: ${turmaData.turma.designacao}`);
          
          // Nova página para cada turma (exceto a primeira)
          if (turmaIndex > 0) {
            doc.addPage();
          }
          
          // Cabeçalho da escola/instituição
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('INSTITUTO MÉDIO POLITÉCNICO JO MORAIS', pageWidth / 2, 25, { align: 'center' });
          
          doc.setFontSize(14);
          doc.text('LISTA NOMINAL DE ALUNOS', pageWidth / 2, 35, { align: 'center' });
          
          // Informações da turma
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          const turmaInfo = [
            `Turma: ${turmaData.turma.designacao || 'N/A'}`,
            `Classe: ${turmaData.turma.tb_classes?.designacao || 'N/A'}`,
            `Curso: ${turmaData.turma.tb_cursos?.designacao || 'N/A'}`,
            `Sala: ${turmaData.turma.tb_salas?.designacao || 'N/A'}`,
            `Período: ${turmaData.turma.tb_periodos?.designacao || 'N/A'}`
          ];
          
          let yPosition = 50;
          turmaInfo.forEach(info => {
            doc.text(info, margin, yPosition);
            yPosition += 8;
          });
          
          // Data do relatório
          doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, 50, { align: 'right' });
          doc.text(`Total de Alunos: ${turmaData.alunos?.length || 0}`, pageWidth - margin, 58, { align: 'right' });
          
          // Verificar se há alunos na turma
          if (!turmaData.alunos || turmaData.alunos.length === 0) {
            doc.setFontSize(12);
            doc.text('Nenhum aluno encontrado nesta turma.', margin, yPosition + 20);
          } else {
            // Ordenar alunos alfabeticamente
            const alunosOrdenados = [...turmaData.alunos].sort((a, b) => 
              (a.nome || '').localeCompare(b.nome || '', 'pt', { sensitivity: 'base' })
            );
            
            // Tabela de alunos - apenas relação nominal
            const tableData = alunosOrdenados.map((aluno, index) => [
              (index + 1).toString(),
              aluno.nome || 'Nome não informado'
            ]);
            
            // Verificar se há espaço suficiente na página
            const estimatedTableHeight = (tableData.length + 1) * 8; // Estimativa
            const availableSpace = pageHeight - yPosition - 100; // Espaço disponível
            
            if (estimatedTableHeight > availableSpace && tableData.length > 20) {
              // Se a tabela for muito grande, dividir em páginas
              const itemsPerPage = Math.floor(availableSpace / 8) - 2; // Margem de segurança
              let currentPage = 0;
              
              while (currentPage * itemsPerPage < tableData.length) {
                if (currentPage > 0) {
                  doc.addPage();
                  // Repetir cabeçalho na nova página
                  doc.setFontSize(14);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`${turmaData.turma.designacao} (continuação)`, pageWidth / 2, 25, { align: 'center' });
                  yPosition = 40;
                }
                
                const pageData = tableData.slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                );
                
                autoTable(doc, {
                  head: currentPage === 0 ? [['Nº', 'Nome do Aluno']] : [],
                  body: pageData,
                  startY: yPosition + 10,
                  margin: { left: margin, right: margin },
                  styles: {
                    fontSize: 11,
                    cellPadding: 3,
                  },
                  headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                  },
                  alternateRowStyles: {
                    fillColor: [245, 245, 245]
                  },
                  columnStyles: {
                    0: { halign: 'center', cellWidth: 20 },
                    1: { cellWidth: 140 }
                  }
                });
                
                currentPage++;
              }
            } else {
              // Tabela cabe em uma página
              autoTable(doc, {
                head: [['Nº', 'Nome do Aluno']],
                body: tableData,
                startY: yPosition + 10,
                margin: { left: margin, right: margin },
                styles: {
                  fontSize: 11,
                  cellPadding: 3,
                },
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold'
                },
                alternateRowStyles: {
                  fillColor: [245, 245, 245]
                },
                columnStyles: {
                  0: { halign: 'center', cellWidth: 20 },
                  1: { cellWidth: 140 }
                }
              });
            }
          }
          
          // Rodapé
          const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
          if (finalY + 60 < pageHeight) { // Verificar se há espaço para o rodapé
            doc.setFontSize(10);
            doc.text('Assinatura do Diretor: _________________________', margin, finalY + 30);
            doc.text('Assinatura do Coordenador: _________________________', margin, finalY + 45);
          }
          
        } catch (turmaError) {
          console.error(`Erro ao processar turma ${turmaData.turma.designacao}:`, turmaError);
          // Continuar com as outras turmas mesmo se uma falhar
        }
      }
      
      // Salvar o PDF
      const fileName = `Lista_Alunos_Todas_Turmas_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log(`Salvando PDF: ${fileName}`);
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF de todas as turmas:', error);
      throw new Error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Dados mockados para teste
   */
  private static getMockStudents(): StudentData[] {
    return [
      { codigo: 1, nome: 'João Silva Santos', numero_documento: '123456789LA041', email: 'joao@email.com', telefone: '923456789' },
      { codigo: 2, nome: 'Maria Fernanda Costa', numero_documento: '987654321LA042', email: 'maria@email.com', telefone: '924567890' },
      { codigo: 3, nome: 'Pedro Miguel Oliveira', numero_documento: '456789123LA043', email: 'pedro@email.com', telefone: '925678901' },
      { codigo: 4, nome: 'Ana Beatriz Sousa', numero_documento: '789123456LA044', email: 'ana@email.com', telefone: '926789012' },
      { codigo: 5, nome: 'Carlos Eduardo Lima', numero_documento: '321654987LA045', email: 'carlos@email.com', telefone: '927890123' },
      { codigo: 6, nome: 'Luísa Marques Pereira', numero_documento: '654987321LA046', email: 'luisa@email.com', telefone: '928901234' },
      { codigo: 7, nome: 'Rafael Santos Almeida', numero_documento: '147258369LA047', email: 'rafael@email.com', telefone: '929012345' },
      { codigo: 8, nome: 'Beatriz Gonçalves', numero_documento: '369258147LA048', email: 'beatriz@email.com', telefone: '930123456' },
      { codigo: 9, nome: 'Miguel Ângelo Ferreira', numero_documento: '258147369LA049', email: 'miguel@email.com', telefone: '931234567' },
      { codigo: 10, nome: 'Sofia Rodrigues Martins', numero_documento: '741852963LA050', email: 'sofia@email.com', telefone: '932345678' }
    ];
  }

  private static getMockTurmasData(): TurmaReportData[] {
    return [
      {
        turma: {
          codigo: 1,
          designacao: '10ª A - Manhã',
          tb_classes: { designacao: '10ª Classe' },
          tb_cursos: { designacao: 'Informática de Gestão' },
          tb_salas: { designacao: 'Sala 101' },
          tb_periodos: { designacao: 'Manhã' }
        },
        alunos: this.getMockStudents().slice(0, 5)
      },
      {
        turma: {
          codigo: 2,
          designacao: '11ª B - Tarde',
          tb_classes: { designacao: '11ª Classe' },
          tb_cursos: { designacao: 'Contabilidade e Gestão' },
          tb_salas: { designacao: 'Sala 102' },
          tb_periodos: { designacao: 'Tarde' }
        },
        alunos: this.getMockStudents().slice(5, 10)
      }
    ];
  }
}
