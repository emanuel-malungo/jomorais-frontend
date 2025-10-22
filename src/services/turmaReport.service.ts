import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/utils/api.utils';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/getErrorMessage.utils';

// Estender o tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: unknown[][];
      body?: unknown[][];
      startY?: number;
      margin?: { left?: number; right?: number; top?: number; bottom?: number };
      styles?: Record<string, unknown>;
      headStyles?: Record<string, unknown>;
      alternateRowStyles?: Record<string, unknown>;
      columnStyles?: Record<string, unknown>;
    }) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export interface StudentData {
  codigo: number;
  nome: string;
  numero_documento?: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  idade?: number;
  genero?: string;
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
   * Adiciona o logo ao cabeçalho do PDF
   */
  private static async addLogo(doc: jsPDF, pageWidth: number, yPosition: number): Promise<number> {
    try {
      const logoUrl = '/icon.png';
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Adicionar logo centralizado (40px = ~14mm)
          const logoWidth = 14;
          const logoHeight = 14; // Manter proporção
          doc.addImage(base64data, 'PNG', (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight);
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
      
      return yPosition + 22; // Retornar nova posição Y (logo + margem maior)
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Erro ao carregar logo");
      toast.error(`Erro ao carregar logo: ${errorMessage}`);
      return yPosition; // Retornar posição original se falhar
    }
  }
  
  /**
   * Calcula a idade baseada na data de nascimento
   */
  private static calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Formata a data de nascimento
   */
  private static formatBirthDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  }
  
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
    } catch {
      // Retornar array vazio se não houver alunos
      return [];
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
    } catch {
      throw new Error('Não foi possível carregar os dados das turmas');
    }
  }

  /**
   * Gera PDF para uma turma específica
   */
  static async generateSingleTurmaPDF(turma: {
    codigo: number;
    designacao: string;
    tb_classes?: { designacao: string };
    tb_cursos?: { designacao: string };
    tb_salas?: { designacao: string };
    tb_periodos?: { designacao: string };
  }): Promise<void> {
    const alunos = await this.getStudentsByTurma(turma.codigo);
    
    const doc = new jsPDF();
    
    // Configurações do documento
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Adicionar logo
    let yPosition = await this.addLogo(doc, pageWidth, 15);
    
    // Cabeçalho da escola/instituição
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTITUTO MÉDIO POLITÉCNICO JO MORAIS', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('LISTA NOMINAL DE ALUNOS', pageWidth / 2, yPosition, { align: 'center' });
    
    // Informações da turma
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const turmaInfo = [
      `Turma: ${turma.designacao}`,
      `Classe: ${turma.tb_classes?.designacao || 'N/A'}`,
      `Curso: ${turma.tb_cursos?.designacao || 'N/A'}`,
      `Sala: ${turma.tb_salas?.designacao || 'N/A'}`,
      `Período: ${turma.tb_periodos?.designacao || 'N/A'}`
    ];
    turmaInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += 8;
    });
    
    // Data do relatório
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, 50, { align: 'right' });
    doc.text(`Total de Alunos: ${alunos.length}`, pageWidth - margin, 58, { align: 'right' });
    
    // Ordenar alunos alfabeticamente
    const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
    
    // Tabela de alunos com informações completas
    const tableData = alunosOrdenados.map((aluno, index) => {
      const dataNascimento = aluno.data_nascimento ? this.formatBirthDate(aluno.data_nascimento) : 'N/A';
      const idade = aluno.data_nascimento ? this.calculateAge(aluno.data_nascimento) : (aluno.idade || 'N/A');
      
      return [
        (index + 1).toString(),
        aluno.nome,
        dataNascimento,
        idade.toString(),
        turma.tb_cursos?.designacao || 'N/A'
      ];
    });
    
    autoTable(doc, {
      head: [['Nº', 'Nome Completo', 'Data Nascimento', 'Idade', 'Curso']],
      body: tableData,
      startY: yPosition + 10,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
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
        0: { halign: 'center', cellWidth: 15 },
        1: { cellWidth: 80 },
        2: { halign: 'center', cellWidth: 30 },
        3: { halign: 'center', cellWidth: 20 },
        4: { cellWidth: 45 }
      }
    });
    
    // Rodapé
    const finalY = doc.lastAutoTable?.finalY || yPosition + 50;
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
      const turmasData = await this.getAllTurmasWithStudents(anoLectivoId);
      
      if (!turmasData || turmasData.length === 0) {
        throw new Error('Nenhuma turma encontrada para o ano letivo selecionado');
      }
      
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      
      // Processar cada turma
      for (let turmaIndex = 0; turmaIndex < turmasData.length; turmaIndex++) {
        const turmaData = turmasData[turmaIndex];
        
        try {
          
          // Nova página para cada turma (exceto a primeira)
          if (turmaIndex > 0) {
            doc.addPage();
          }
          
          // Adicionar logo
          let yPos = await this.addLogo(doc, pageWidth, 15);
          
          // Cabeçalho da escola/instituição
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('INSTITUTO MÉDIO POLITÉCNICO JO MORAIS', pageWidth / 2, yPos, { align: 'center' });
          
          yPos += 10;
          doc.setFontSize(14);
          doc.text('LISTA NOMINAL DE ALUNOS', pageWidth / 2, yPos, { align: 'center' });
          
          // Informações da turma
          yPos += 10;
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          const turmaInfo = [
            `Turma: ${turmaData.turma.designacao || 'N/A'}`,
            `Classe: ${turmaData.turma.tb_classes?.designacao || 'N/A'}`,
            `Curso: ${turmaData.turma.tb_cursos?.designacao || 'N/A'}`,
            `Sala: ${turmaData.turma.tb_salas?.designacao || 'N/A'}`,
            `Período: ${turmaData.turma.tb_periodos?.designacao || 'N/A'}`
          ];
          
          let yPosition = yPos;
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
            
            // Tabela de alunos com informações completas
            const tableData = alunosOrdenados.map((aluno, index) => {
              const dataNascimento = aluno.data_nascimento ? this.formatBirthDate(aluno.data_nascimento) : 'N/A';
              const idade = aluno.data_nascimento ? this.calculateAge(aluno.data_nascimento) : (aluno.idade || 'N/A');
              
              return [
                (index + 1).toString(),
                aluno.nome || 'Nome não informado',
                dataNascimento,
                idade.toString(),
                turmaData.turma.tb_cursos?.designacao || 'N/A'
              ];
            });
            
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
                  head: currentPage === 0 ? [['Nº', 'Nome Completo', 'Data Nascimento', 'Idade', 'Curso']] : [],
                  body: pageData,
                  startY: yPosition + 10,
                  margin: { left: margin, right: margin },
                  styles: {
                    fontSize: 9,
                    cellPadding: 2,
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
                    0: { halign: 'center', cellWidth: 15 },
                    1: { cellWidth: 70 },
                    2: { halign: 'center', cellWidth: 25 },
                    3: { halign: 'center', cellWidth: 15 },
                    4: { cellWidth: 40 }
                  }
                });
                
                currentPage++;
              }
            } else {
              // Tabela cabe em uma página
              autoTable(doc, {
                head: [['Nº', 'Nome Completo', 'Data Nascimento', 'Idade', 'Curso']],
                body: tableData,
                startY: yPosition + 10,
                margin: { left: margin, right: margin },
                styles: {
                  fontSize: 10,
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
                  0: { halign: 'center', cellWidth: 15 },
                  1: { cellWidth: 80 },
                  2: { halign: 'center', cellWidth: 30 },
                  3: { halign: 'center', cellWidth: 20 },
                  4: { cellWidth: 45 }
                }
              });
            }
          }
          
          // Rodapé
          const finalY = doc.lastAutoTable?.finalY || yPosition + 50;
          if (finalY + 60 < pageHeight) { // Verificar se há espaço para o rodapé
            doc.setFontSize(10);
            doc.text('Assinatura do Diretor: _________________________', margin, finalY + 30);
            doc.text('Assinatura do Coordenador: _________________________', margin, finalY + 45);
          }
          
        } catch {
          // Continuar com as outras turmas mesmo se uma falhar
        }
      }
      
      // Salvar o PDF
      const fileName = `Lista_Alunos_Todas_Turmas_${new Date().toISOString().split('T')[0]}.pdf`;

      doc.save(fileName);
      
    } catch (error) {
      throw new Error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}
