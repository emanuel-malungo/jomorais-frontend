import { useState, useCallback, useEffect } from 'react';
import api from '@/utils/api.utils';

export interface IAnoLectivo {
  codigo: number;
  designacao: string;
  mesInicial: string;
  mesFinal: string;
  anoInicial: string;
  anoFinal: string;
}

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
  anoLetivo?: string; // Ano letivo extraído da string
  anoInicial?: number; // Ano inicial extraído
  anoFinal?: number; // Ano final extraído
}

export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IAluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  dadosAcademicos?: {
    classe: string;
    turma: string;
  };
}

// Função para extrair ano letivo da string do tipo de serviço
export const extractAnoLetivoFromString = (designacao: string): { anoLetivo?: string; anoInicial?: number; anoFinal?: number } => {
  // Padrões para diferentes formatos de ano letivo
  const patterns = [
    /(\d{4}\/\d{4})/g,           // 2024/2025
    /(\d{4}-\d{4})/g,           // 2024-2025
    /(\d{2}\/\d{2})/g,          // 22/23
    /(\d{4}\/\d{2})/g,          // 2024/25
  ];

  for (const pattern of patterns) {
    const match = designacao.match(pattern);
    if (match) {
      const anoLetivo = match[0];
      let anoInicial: number;
      let anoFinal: number;

      if (anoLetivo.includes('/')) {
        const [inicio, fim] = anoLetivo.split('/');
        if (inicio.length === 2) {
          // Formato 22/23 - assumir 20xx
          anoInicial = 2000 + parseInt(inicio);
          anoFinal = 2000 + parseInt(fim);
        } else if (fim.length === 2) {
          // Formato 2024/25
          anoInicial = parseInt(inicio);
          anoFinal = parseInt(inicio.substring(0, 2) + fim);
        } else {
          // Formato 2024/2025
          anoInicial = parseInt(inicio);
          anoFinal = parseInt(fim);
        }
      } else {
        // Formato com hífen 2024-2025
        const [inicio, fim] = anoLetivo.split('-');
        anoInicial = parseInt(inicio);
        anoFinal = parseInt(fim);
      }

      return {
        anoLetivo,
        anoInicial,
        anoFinal
      };
    }
  }

  return {};
};

// Função para verificar se um tipo de serviço corresponde a um ano letivo
export const matchesAnoLetivo = (tipoServico: ITipoServico, anoLectivoSelecionado: IAnoLectivo): boolean => {
  const { anoInicial: tipoAnoInicial, anoFinal: tipoAnoFinal } = tipoServico;
  
  if (!tipoAnoInicial || !tipoAnoFinal) {
    // Se não tem ano na string, é considerado compatível (serviço genérico)
    return true;
  }

  const anoLectivoInicial = parseInt(anoLectivoSelecionado.anoInicial);
  const anoLectivoFinal = parseInt(anoLectivoSelecionado.anoFinal);

  return tipoAnoInicial === anoLectivoInicial && tipoAnoFinal === anoLectivoFinal;
};

// Função para encontrar o ano letivo mais atual
export const findMostRecentAnoLetivo = (anosLectivos: IAnoLectivo[]): IAnoLectivo | null => {
  if (anosLectivos.length === 0) return null;
  
  return anosLectivos.reduce((latest, current) => {
    const latestYear = parseInt(latest.anoInicial);
    const currentYear = parseInt(current.anoInicial);
    return currentYear > latestYear ? current : latest;
  });
};

// Função auxiliar para verificar se uma designação contém uma abreviação específica
const contemAbreviacao = (designacao: string, abreviacao: string): boolean => {
  const regex = new RegExp(`\\b${abreviacao.replace('.', '\\.')}\\b`, 'i');
  return regex.test(designacao) || designacao.toUpperCase().includes(abreviacao.toUpperCase().replace('.', ''));
};

// Função auxiliar para detectar se uma propina é de Análises Clínicas
const ePropinaAnalisesClinicas = (designacao: string): boolean => {
  const designacaoUpper = designacao.toUpperCase();
  return designacaoUpper.includes('ANALISES') ||
         designacaoUpper.includes('ANÁLISES') ||
         designacaoUpper.includes('A.C') ||
         contemAbreviacao(designacaoUpper, 'AC') ||
         (designacaoUpper.includes('AC') && !designacaoUpper.includes('ENFERMAGEM') && !designacaoUpper.includes('FARMAC'));
};

// Função para calcular score de compatibilidade
const calcularScoreCompatibilidade = (tipo: ITipoServico, cursoAluno: string, classeAluno: string, anoLetivo: string): number => {
  const designacao = tipo.designacao.toUpperCase();
  let score = 0;

  // Score por ano letivo (mais importante)
  if (anoLetivo && designacao.includes(anoLetivo)) {
    score += 100;
  }

  // Score por classe exata (muito importante)
  if (classeAluno && designacao.includes(classeAluno)) {
    score += 80;
  }

  // Score por curso (muito importante)
  if (cursoAluno === 'ANALISES CLINICAS') {
    if (designacao.includes('ANALISES') || designacao.includes('ANÁLISES')) score += 70;
    if (contemAbreviacao(designacao, 'A.C')) score += 70;
    if (contemAbreviacao(designacao, 'AC') && !designacao.includes('FARMAC') && !designacao.includes('ENFERMAGEM')) score += 60;
  } else if (cursoAluno === 'ENFERMAGEM GERAL') {
    if (designacao.includes('ENFERMAGEM')) score += 70;
    if (contemAbreviacao(designacao, 'E.G') || contemAbreviacao(designacao, 'EG')) score += 60;
  } else if (cursoAluno === 'FARMACIA') {
    if (designacao.includes('FARMÁCIA') || designacao.includes('FARMACIA')) score += 70;
    if (contemAbreviacao(designacao, 'F.M') || contemAbreviacao(designacao, 'FM')) score += 60;
  }

  // Score por ser propina
  if (designacao.includes('PROPINA')) {
    score += 50;
  }

  // Penalizar cursos incompatíveis (muito importante)
  if (cursoAluno === 'ENFERMAGEM GERAL') {
    if (ePropinaAnalisesClinicas(designacao)) score -= 200;
    if (designacao.includes('FARMÁCIA') || designacao.includes('FARMACIA')) score -= 200;
  } else if (cursoAluno === 'ANALISES CLINICAS') {
    if (designacao.includes('ENFERMAGEM')) score -= 200;
    if (designacao.includes('FARMÁCIA') || designacao.includes('FARMACIA')) score -= 200;
  } else if (cursoAluno === 'FARMACIA') {
    if (designacao.includes('ENFERMAGEM')) score -= 200;
    if (ePropinaAnalisesClinicas(designacao)) score -= 200;
  }

  // Penalizar classes incompatíveis (muito importante)
  const classeNaDesignacao = designacao.match(/(\d+)ª/);
  if (classeNaDesignacao && classeAluno) {
    const classeDoTipo = classeNaDesignacao[1] + 'ª';
    if (classeDoTipo !== classeAluno) {
      score -= 150; // Penalização severa por classe errada
    }
  }

  return score;
};

// Função para mapear curso baseado na turma
export const mapearCursoPorTurma = (turma: string): string => {
  const turmaUpper = turma.toUpperCase();
  
  console.log('🔍 Mapeando curso para turma:', turma);
  
  // Mapeamento robusto que considera variações com e sem pontos
  
  // 1. Análises Clínicas (A.C, AC, A C)
  if (contemAbreviacao(turma, 'A.C') || 
      contemAbreviacao(turma, 'AC') ||
      (turmaUpper.includes('AC') && !turmaUpper.includes('FARMAC')) ||
      turmaUpper.includes('ANALISES') || 
      turmaUpper.includes('ANÁLISES')) {
    console.log('✅ Curso mapeado: ANALISES CLINICAS');
    return 'ANALISES CLINICAS';
  }
  
  // 2. Enfermagem Geral (E.G, EG, E G)
  if (contemAbreviacao(turma, 'E.G') || 
      contemAbreviacao(turma, 'EG') ||
      turmaUpper.includes('ENFERMAGEM')) {
    console.log('✅ Curso mapeado: ENFERMAGEM GERAL');
    return 'ENFERMAGEM GERAL';
  }
  
  // 3. Farmácia (F.M, FM, F M)
  if (contemAbreviacao(turma, 'F.M') || 
      contemAbreviacao(turma, 'FM') ||
      turmaUpper.includes('FARMAC') || 
      turmaUpper.includes('FARMÁCIA')) {
    console.log('✅ Curso mapeado: FARMACIA');
    return 'FARMACIA';
  }
  
  // 4. Ciências Econômicas Jurídicas (C.E.J, CEJ, C E J)
  if (contemAbreviacao(turma, 'C.E.J') || 
      contemAbreviacao(turma, 'CEJ') ||
      turmaUpper.includes('ECONOMICAS') ||
      turmaUpper.includes('JURIDICAS')) {
    console.log('✅ Curso mapeado: CIENCIAS ECONOMICAS JURIDICAS');
    return 'CIENCIAS ECONOMICAS JURIDICAS';
  }
  
  // 5. Ciências Físicas Biológicas (C.F.B, CFB, C F B)
  if (contemAbreviacao(turma, 'C.F.B') || 
      contemAbreviacao(turma, 'CFB') ||
      turmaUpper.includes('FISICAS') ||
      turmaUpper.includes('BIOLOGICAS')) {
    console.log('✅ Curso mapeado: CIENCIAS FISICAS BIOLOGICAS');
    return 'CIENCIAS FISICAS BIOLOGICAS';
  }
  
  console.log('❌ Curso não identificado, usando GERAL');
  return 'GERAL'; // Fallback
};

// Função para extrair classe da turma
export const extrairClasseDaTurma = (turma: string): string => {
  console.log('🔍 Extraindo classe da turma:', turma);
  const match = turma.match(/(\d+)ª/);
  const classe = match ? `${match[1]}ª` : '';
  console.log('✅ Classe extraída:', classe);
  return classe;
};

// Função para encontrar automaticamente o melhor tipo de serviço para um aluno e ano letivo
export const findBestTipoServicoForAluno = (
  tiposServico: ITipoServico[], 
  anoLectivoSelecionado: IAnoLectivo | null,
  dadosAluno?: any,
  tipoServicoTurma?: ITipoServico | null
): ITipoServico | null => {
  if (tiposServico.length === 0) return null;

  // Extrair informações do aluno se disponíveis
  let cursoAluno = '';
  let classeAluno = '';
  let anoLetivoString = '';
  
  if (dadosAluno?.dadosAcademicos?.turma) {
    cursoAluno = mapearCursoPorTurma(dadosAluno.dadosAcademicos.turma);
    classeAluno = extrairClasseDaTurma(dadosAluno.dadosAcademicos.turma);
  } else if (dadosAluno?.dadosAcademicos?.classe) {
    classeAluno = dadosAluno.dadosAcademicos.classe;
  }

  if (anoLectivoSelecionado) {
    anoLetivoString = `${anoLectivoSelecionado.anoInicial}/${anoLectivoSelecionado.anoFinal}`;
  }

  console.log('🎯 SELEÇÃO INTELIGENTE DE TIPO DE SERVIÇO');
  console.log(`👤 Aluno: Curso=${cursoAluno}, Classe=${classeAluno}, Ano=${anoLetivoString}`);

  // Calcular score para todos os tipos
  const tiposComScore = tiposServico.map(tipo => ({
    tipo,
    score: calcularScoreCompatibilidade(tipo, cursoAluno, classeAluno, anoLetivoString)
  }));

  // Ordenar por score (maior primeiro)
  tiposComScore.sort((a, b) => b.score - a.score);

  // Log dos top 5 candidatos
  console.log('🏆 TOP 5 CANDIDATOS:');
  tiposComScore.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. "${item.tipo.designacao}" - Score: ${item.score} - Preço: ${item.tipo.preco} Kz`);
  });

  // Filtrar apenas tipos com score positivo (compatíveis)
  const tiposCompativeis = tiposComScore.filter(item => item.score > 0);

  if (tiposCompativeis.length > 0) {
    const melhorTipo = tiposCompativeis[0].tipo;
    console.log(`✅ SELECIONADO: "${melhorTipo.designacao}" - Score: ${tiposCompativeis[0].score}`);
    return melhorTipo;
  }

  // Se nenhum tipo compatível, usar o tipo de serviço da turma como fallback
  if (tipoServicoTurma) {
    console.log('⚠️ FALLBACK: Usando tipo de serviço da turma');
    return tipoServicoTurma;
  }

  // Último recurso: tipo com melhor score mesmo que negativo
  if (tiposComScore.length > 0) {
    const ultimoRecurso = tiposComScore[0].tipo;
    console.log(`🚨 ÚLTIMO RECURSO: "${ultimoRecurso.designacao}" - Score: ${tiposComScore[0].score}`);
    return ultimoRecurso;
  }

  return null;
};

export const useConfirmacaoMaisRecente = () => {
            contemCurso = contemAbreviacao(designacao, 'A.C') ||
                         contemAbreviacao(designacao, 'AC') ||
                         (designacao.includes('AC') && !designacao.includes('FARMAC')) ||
                         designacao.includes('ANALISES') ||
                         designacao.includes('ANÁLISES');
            
          } else if (cursoAluno === 'ENFERMAGEM GERAL') {
            contemCurso = designacao.includes('ENFERMAGEM GERAL') ||
                         designacao.includes('ENFERMAGEM') ||
                         contemAbreviacao(designacao, 'E.G') || 
                         contemAbreviacao(designacao, 'EG');
          } else if (cursoAluno === 'FARMACIA') {
            contemCurso = contemAbreviacao(designacao, 'F.M') || 
                         contemAbreviacao(designacao, 'FM') ||
                         designacao.includes('FARMAC') || // FARMACIA ou FARMACEUTICA
                         designacao.includes('FARMÁCIA');
          } else if (cursoAluno === 'CIENCIAS ECONOMICAS JURIDICAS') {
            contemCurso = contemAbreviacao(designacao, 'C.E.J') || 
                         contemAbreviacao(designacao, 'CEJ') ||
                         designacao.includes('ECONOMICAS') ||
                         designacao.includes('JURIDICAS');
          } else if (cursoAluno === 'CIENCIAS FISICAS BIOLOGICAS') {
            contemCurso = contemAbreviacao(designacao, 'C.F.B') || 
                         contemAbreviacao(designacao, 'CFB') ||
                         designacao.includes('FISICAS') ||
                         designacao.includes('BIOLOGICAS');
          } else {
            // Fallback: buscar pelo nome completo do curso
            contemCurso = designacao.includes(cursoAluno.toUpperCase());
          }
          
          const contemClasse = designacao.includes(classeAluno);
          const ePropina = designacao.includes('PROPINA');
          
          return contemCurso && contemClasse && ePropina;
        });
        
        
        if (tiposFiltrados.length > 0) {
          // Validação extra: se há múltiplas opções, priorizar a mais específica para o curso
          let melhorTipo;
          
          if (tiposFiltrados.length > 1) {
            console.log('🔍 Múltiplas opções encontradas, priorizando mais específica...');
            
            // Para Análises Clínicas, priorizar tipos que contenham A.C
            if (cursoAluno === 'ANALISES CLINICAS') {
              const tiposAC = tiposFiltrados.filter(tipo => 
                tipo.designacao.toUpperCase().includes('A.C')
              );
              if (tiposAC.length > 0) {
                melhorTipo = tiposAC.reduce((best, current) => 
                  current.preco > best.preco ? current : best
                );
              }
            }
            
            // Se não encontrou tipo específico, usar o de maior preço
            if (!melhorTipo) {
              melhorTipo = tiposFiltrados.reduce((best, current) => 
                current.preco > best.preco ? current : best
              );
            }
          } else {
            melhorTipo = tiposFiltrados[0];
          }
          
          return melhorTipo;
        }
      }
      
      // Se não encontrou por curso/classe específico, buscar propinas genéricas do curso (TODOS os tipos, não só do ano letivo)
      if (cursoAluno && classeAluno) {
        const propinasGenericasCurso = tiposServico.filter(tipo => {
          const designacao = tipo.designacao.toUpperCase();
          let contemCurso = false;
          
          if (cursoAluno === 'ANALISES CLINICAS') {
            contemCurso = designacao.includes('ANALÍSES CLÍNICAS') || 
                         designacao.includes('ANALISES CLINICAS') ||
                         contemAbreviacao(designacao, 'A.C') ||
                         contemAbreviacao(designacao, 'AC');
          } else if (cursoAluno === 'ENFERMAGEM GERAL') {
            contemCurso = designacao.includes('ENFERMAGEM GERAL') ||
                         designacao.includes('ENFERMAGEM') ||
                         contemAbreviacao(designacao, 'E.G') ||
                         contemAbreviacao(designacao, 'EG');
          } else if (cursoAluno === 'FARMACIA') {
            contemCurso = designacao.includes('FARMÁCIA') || 
                         designacao.includes('FARMACIA') ||
                         contemAbreviacao(designacao, 'F.M') ||
                         contemAbreviacao(designacao, 'FM');
          } else if (cursoAluno === 'CIENCIAS ECONOMICAS JURIDICAS') {
            contemCurso = designacao.includes('ECONOMICAS') ||
                         designacao.includes('JURIDICAS') ||
                         contemAbreviacao(designacao, 'C.E.J') ||
                         contemAbreviacao(designacao, 'CEJ');
          } else if (cursoAluno === 'CIENCIAS FISICAS BIOLOGICAS') {
            contemCurso = designacao.includes('FISICAS') ||
                         designacao.includes('BIOLOGICAS') ||
                         contemAbreviacao(designacao, 'C.F.B') ||
                         contemAbreviacao(designacao, 'CFB');
          }
          
          const contemClasse = designacao.includes(classeAluno);
          const ePropina = designacao.includes('PROPINA');
          
          return contemCurso && contemClasse && ePropina;
        });
        
        if (propinasGenericasCurso.length > 0) {
          const melhorTipo = propinasGenericasCurso.reduce((best, current) => 
            current.preco > best.preco ? current : best
          );
          return melhorTipo;
        }
      }
      
      // Se não encontrou por curso/classe, buscar por classe apenas (mas ainda tentando evitar cursos diferentes)
      if (classeAluno) {
        const tiposPorClasse = tiposEspecificos.filter(tipo => {
          const designacao = tipo.designacao.toUpperCase();
          const contemClasse = designacao.includes(classeAluno);
          const ePropina = designacao.includes('PROPINA');
          
          // Evitar cursos claramente diferentes baseado no curso do aluno
          let cursoCompativel = true;
          
          if (cursoAluno === 'ENFERMAGEM GERAL') {
            cursoCompativel = !designacao.includes('FARMÁCIA') && 
                             !designacao.includes('FARMACIA') && 
                             !ePropinaAnalisesClinicas(designacao);
          } else if (cursoAluno === 'ANALISES CLINICAS') {
            cursoCompativel = !designacao.includes('FARMÁCIA') && 
                             !designacao.includes('FARMACIA') && 
                             !designacao.includes('ENFERMAGEM');
          } else if (cursoAluno === 'FARMACIA') {
            cursoCompativel = !designacao.includes('ENFERMAGEM') && 
                             !designacao.includes('ANALISES') && 
                             !designacao.includes('ANÁLISES') && 
                             !designacao.includes('A.C') && 
                             !designacao.includes('AC');
          } else {
            // Para outros cursos, evitar os principais conhecidos
            cursoCompativel = !designacao.includes('FARMÁCIA') && 
                             !designacao.includes('FARMACIA') && 
                             !designacao.includes('ENFERMAGEM') && 
                             !designacao.includes('ANALISES') && 
                             !designacao.includes('ANÁLISES');
          }
          
          return contemClasse && ePropina && cursoCompativel;
        });
        
        if (tiposPorClasse.length > 0) {
          const melhorTipo = tiposPorClasse.reduce((best, current) => 
            current.preco > best.preco ? current : best
          );
          return melhorTipo;
        }
        
        // Se ainda não encontrou, buscar qualquer propina da classe (último recurso)
        const qualquerTipoPorClasse = tiposEspecificos.filter(tipo => {
          const designacao = tipo.designacao.toUpperCase();
          return designacao.includes(classeAluno) && designacao.includes('PROPINA');
        });
        
        if (qualquerTipoPorClasse.length > 0) {
          const melhorTipo = qualquerTipoPorClasse.reduce((best, current) => 
            current.preco > best.preco ? current : best
          );
          return melhorTipo;
        }
      }
      
      // Fallback: propinas gerais do ano letivo (evitando cursos incompatíveis)
      let propinas = tiposEspecificos.filter(tipo => {
        const designacao = tipo.designacao.toUpperCase();
        const ePropina = designacao.includes('PROPINA');
        
        // Se temos informação do curso, evitar cursos incompatíveis
        if (cursoAluno === 'ANALISES CLINICAS') {
          const naoEFarmacia = !designacao.includes('FARMÁCIA') && !designacao.includes('FARMACIA');
          const naoEEnfermagem = !designacao.includes('ENFERMAGEM');
          return ePropina && naoEFarmacia && naoEEnfermagem;
        } else if (cursoAluno === 'ENFERMAGEM GERAL') {
          const naoEFarmacia = !designacao.includes('FARMÁCIA') && !designacao.includes('FARMACIA');
          const naoEAnalises = !ePropinaAnalisesClinicas(designacao);
          return ePropina && naoEFarmacia && naoEAnalises;
        } else if (cursoAluno === 'FARMACIA') {
          const naoEEnfermagem = !designacao.includes('ENFERMAGEM');
          const naoEAnalises = !designacao.includes('ANALISES') && !designacao.includes('ANÁLISES') && !designacao.includes('A.C') && !designacao.includes('AC');
          return ePropina && naoEEnfermagem && naoEAnalises;
        }
        
        return ePropina;
      });
      
      // Se não encontrou nada com filtros, buscar qualquer propina
      if (propinas.length === 0) {
        propinas = tiposEspecificos.filter(tipo => 
          tipo.designacao.toUpperCase().includes('PROPINA')
        );
      }
      
      if (propinas.length > 0) {
        const melhorTipo = propinas.reduce((best, current) => 
          current.preco > best.preco ? current : best
        );
        return melhorTipo;
      }
      
      // Se não há propinas, retornar o primeiro tipo específico
      return tiposEspecificos[0];
    }
  }

  // 2. Se não encontrou tipos específicos, usar o tipo de serviço da turma
  if (tipoServicoTurma) {
    return tipoServicoTurma;
  }

  // 3. CONDIÇÃO EXTREMA: Se o ano letivo não foi detectado na turma, buscar propina genérica da classe
  if (classeAluno) {
    const propinasGenericasClasse = tiposServico.filter(tipo => {
      const designacao = tipo.designacao.toUpperCase();
      const contemClasse = designacao.includes(classeAluno);
      const ePropina = designacao.includes('PROPINA');
      
      // Se temos informação do curso, priorizar o curso correto
      if (cursoAluno === 'ANALISES CLINICAS') {
        const contemCurso = designacao.includes('ANALÍSES CLÍNICAS') || 
                           designacao.includes('ANALISES CLINICAS') ||
                           contemAbreviacao(designacao, 'A.C') ||
                           contemAbreviacao(designacao, 'AC');
        return contemClasse && ePropina && contemCurso;
      } else if (cursoAluno === 'ENFERMAGEM GERAL') {
        const contemCurso = designacao.includes('ENFERMAGEM');
        return contemClasse && ePropina && contemCurso;
      } else if (cursoAluno === 'FARMACIA') {
        const contemCurso = designacao.includes('FARMÁCIA') || designacao.includes('FARMACIA');
        return contemClasse && ePropina && contemCurso;
      }
      
      // Se não temos curso específico, buscar qualquer propina da classe (evitando cursos incompatíveis)
      let cursoCompativel = true;
      
      if (cursoAluno === 'ENFERMAGEM GERAL') {
        cursoCompativel = !designacao.includes('FARMÁCIA') && 
                         !designacao.includes('FARMACIA') && 
                         !ePropinaAnalisesClinicas(designacao);
      } else if (cursoAluno === 'ANALISES CLINICAS') {
        cursoCompativel = !designacao.includes('FARMÁCIA') && 
                         !designacao.includes('FARMACIA') && 
                         !designacao.includes('ENFERMAGEM');
      } else if (cursoAluno === 'FARMACIA') {
        cursoCompativel = !designacao.includes('ENFERMAGEM') && 
                         !designacao.includes('ANALISES') && 
                         !designacao.includes('ANÁLISES') && 
                         !designacao.includes('A.C') && 
                         !designacao.includes('AC');
      } else {
        // Para outros cursos, evitar os principais conhecidos
        cursoCompativel = !designacao.includes('FARMÁCIA') && 
                         !designacao.includes('FARMACIA') && 
                         !designacao.includes('ENFERMAGEM') && 
                         !designacao.includes('ANALISES') && 
                         !designacao.includes('ANÁLISES');
      }
      
      return contemClasse && ePropina && cursoCompativel;
    });
    
    if (propinasGenericasClasse.length > 0) {
      const melhorTipo = propinasGenericasClasse.reduce((best, current) => 
        current.preco > best.preco ? current : best
      );
      return melhorTipo;
    }
    
    // Se não encontrou com curso específico, buscar qualquer propina da classe
    const qualquerPropinaClasse = tiposServico.filter(tipo => {
      const designacao = tipo.designacao.toUpperCase();
      return designacao.includes(classeAluno) && designacao.includes('PROPINA');
    });
    
    if (qualquerPropinaClasse.length > 0) {
      const melhorTipo = qualquerPropinaClasse.reduce((best, current) => 
        current.preco > best.preco ? current : best
      );
      return melhorTipo;
    }
  }

  // 4. Como último recurso, buscar o tipo mais atual disponível
  const tiposComAno = tiposServico.filter(tipo => tipo.anoInicial && tipo.anoFinal);
  if (tiposComAno.length > 0) {
    // Encontrar o tipo com ano mais recente
    const tipoMaisAtual = tiposComAno.reduce((latest, current) => {
      const latestYear = latest.anoInicial || 0;
      const currentYear = current.anoInicial || 0;
      return currentYear > latestYear ? current : latest;
    });
    return tipoMaisAtual;
  }

  // 4. Se nada mais funcionar, retornar tipos genéricos (sem ano)
  const tiposGenericos = tiposServico.filter(tipo => !tipo.anoInicial && !tipo.anoFinal);
  if (tiposGenericos.length > 0) {
    // Priorizar propinas genéricas
    const propinasGenericas = tiposGenericos.filter(tipo => 
      tipo.designacao.toUpperCase().includes('PROPINA')
    );
    return propinasGenericas.length > 0 ? propinasGenericas[0] : tiposGenericos[0];
  }

  return null;
};

// Hook para buscar confirmação mais recente do aluno
export const useConfirmacaoMaisRecente = () => {
  const [confirmacao, setConfirmacao] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfirmacaoMaisRecente = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando confirmação mais recente para aluno:', alunoId);
      
      // Tentar múltiplos endpoints para encontrar confirmações do aluno
      let confirmacoes: any[] = [];
      
      // Opção 1: Endpoint específico de confirmações por aluno
      try {
        const response1 = await api.get(`/api/student-management/confirmations?alunoId=${alunoId}`);
        if (response1.data.success && response1.data.data?.length > 0) {
          confirmacoes = response1.data.data;
          console.log('✅ Confirmações encontradas via endpoint específico:', confirmacoes.length);
        }
      } catch (err) {
        console.log('⚠️ Endpoint específico não disponível, tentando alternativa...');
      }
      
      // Opção 2: Buscar via dados completos do aluno (fallback)
      if (confirmacoes.length === 0) {
        try {
          const response2 = await api.get(`/api/payment-management/aluno/${alunoId}/completo`);
          if (response2.data.success && response2.data.data) {
            const alunoCompleto = response2.data.data;
            
            // Extrair confirmações da estrutura do aluno completo
            const matriculas = alunoCompleto.tb_matriculas;
            if (matriculas?.tb_confirmacoes?.length > 0) {
              confirmacoes = matriculas.tb_confirmacoes;
              console.log('✅ Confirmações encontradas via aluno completo:', confirmacoes.length);
            } else if (Array.isArray(matriculas)) {
              // Se matriculas é um array, buscar confirmações em cada matrícula
              confirmacoes = matriculas.flatMap(matricula => 
                matricula.tb_confirmacoes || []
              ).filter(Boolean);
              console.log('✅ Confirmações encontradas via múltiplas matrículas:', confirmacoes.length);
            }
          }
        } catch (err) {
          console.log('⚠️ Erro ao buscar via aluno completo:', err);
        }
      }
      
      if (confirmacoes.length > 0) {
        // Ordenar por ano letivo mais recente
        const confirmacoesSorted = confirmacoes.sort((a: any, b: any) => {
          // Tentar diferentes estruturas de ano letivo
          const anoA = parseInt(
            a.anoLetivo?.anoInicial || 
            a.tb_anos_lectivos?.anoInicial || 
            a.codigo_Ano_lectivo || 
            '0'
          );
          const anoB = parseInt(
            b.anoLetivo?.anoInicial || 
            b.tb_anos_lectivos?.anoInicial || 
            b.codigo_Ano_lectivo || 
            '0'
          );
          return anoB - anoA; // Mais recente primeiro
        });
        
        const confirmacaoMaisRecente = confirmacoesSorted[0];
        console.log('✅ Confirmação mais recente selecionada:', {
          id: confirmacaoMaisRecente.codigo,
          ano: confirmacaoMaisRecente.anoLetivo?.designacao || 
               confirmacaoMaisRecente.tb_anos_lectivos?.designacao ||
               confirmacaoMaisRecente.codigo_Ano_lectivo,
          turma: confirmacaoMaisRecente.turma?.designacao || 
                 confirmacaoMaisRecente.tb_turmas?.designacao
        });
        
        setConfirmacao(confirmacaoMaisRecente);
        return confirmacaoMaisRecente;
      } else {
        console.log('❌ Nenhuma confirmação encontrada para o aluno');
        setConfirmacao(null);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar confirmação do aluno';
      console.error('❌ Erro ao buscar confirmação:', errorMessage);
      setError(errorMessage);
      setConfirmacao(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmacao,
    loading,
    error,
    fetchConfirmacaoMaisRecente
  };
};

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
  anoLetivo?: string; // Ano letivo extraído da string
  anoInicial?: number; // Ano inicial extraído
  anoFinal?: number; // Ano final extraído
}

export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IAluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  dadosAcademicos?: {
    classe: string;
    turma: string;
  };
}

// Hook para buscar tipos de serviço
export const useTiposServico = () => {
  const [tiposServico, setTiposServico] = useState<ITipoServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposServico = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/tipos-servico');
      if (response.data.success) {
        // Processar tipos de serviço para extrair informações de ano letivo
        const processedTiposServico = response.data.data.map((tipo: ITipoServico) => {
          const anoInfo = extractAnoLetivoFromString(tipo.designacao);
          return {
            ...tipo,
            ...anoInfo
          };
        });
        setTiposServico(processedTiposServico);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipos de serviço');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipos de serviço';
      setError(errorMessage);
      // Dados mockados como fallback
      setTiposServico([
        { codigo: 1, designacao: 'Propina', preco: 15000 },
        { codigo: 2, designacao: 'Confirmação de Matrícula', preco: 5000 },
        { codigo: 3, designacao: 'Cartão de Estudante', preco: 2000 },
        { codigo: 4, designacao: 'Certificado', preco: 3000 },
        { codigo: 5, designacao: 'Outros Serviços', preco: 1000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposServico();
  }, []);

  return {
    tiposServico,
    loading,
    error,
    fetchTiposServico
  };
};

// Hook para filtrar tipos de serviço por ano letivo
export const useTiposServicoFiltrados = (anoLectivoSelecionado: IAnoLectivo | null) => {
  const { tiposServico, loading, error, fetchTiposServico } = useTiposServico();
  const [tiposServicoFiltrados, setTiposServicoFiltrados] = useState<ITipoServico[]>([]);

  useEffect(() => {
    if (!anoLectivoSelecionado) {
      // Se não há ano letivo selecionado, mostrar todos
      setTiposServicoFiltrados(tiposServico);
      return;
    }

    // Filtrar tipos de serviço que correspondem ao ano letivo selecionado
    const tiposFiltrados = tiposServico.filter((tipo: ITipoServico) => {
      return matchesAnoLetivo(tipo, anoLectivoSelecionado);
    });

    // Se não encontrou tipos específicos para o ano, incluir tipos genéricos (sem ano na string)
    const tiposGenericos = tiposServico.filter((tipo: ITipoServico) => !tipo.anoInicial && !tipo.anoFinal);
    
    // Combinar tipos específicos com genéricos, priorizando específicos
    const tiposFinais = tiposFiltrados.length > 0 ? tiposFiltrados : [...tiposFiltrados, ...tiposGenericos];
    
    setTiposServicoFiltrados(tiposFinais);
  }, [tiposServico, anoLectivoSelecionado]);

  return {
    tiposServico: tiposServicoFiltrados,
    loading,
    error,
    fetchTiposServico
  };
};

// Hook para formas de pagamento
export const useFormasPagamento = () => {
  const [formasPagamento, setFormasPagamento] = useState<IFormaPagamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormasPagamento = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/formas-pagamento');
      if (response.data.success) {
        setFormasPagamento(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar formas de pagamento');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar formas de pagamento';
      setError(errorMessage);
      // Dados mockados como fallback
      setFormasPagamento([
        { codigo: 1, designacao: 'Dinheiro' },
        { codigo: 2, designacao: 'Transferência Bancária' },
        { codigo: 3, designacao: 'Multicaixa' },
        { codigo: 4, designacao: 'Cheque' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormasPagamento();
  }, []);

  return { formasPagamento, loading, error, refetch: fetchFormasPagamento };
};

// Hook para buscar alunos (para o select de alunos)
export const useAlunosSearch = () => {
  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAlunos = async (search: string = '', limit: number = 50) => {
    if (!search.trim()) {
      setAlunos([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        limit: limit.toString(),
        page: '1'
      });

      const response = await api.get(`/api/payment-management/alunos-confirmados?${params}`);
      if (response.data.success) {
        setAlunos(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar alunos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar alunos';
      setError(errorMessage);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAlunos = () => {
    setAlunos([]);
    setError(null);
  };

  return { 
    alunos, 
    loading, 
    error, 
    searchAlunos,
    clearAlunos
  };
};

// Constantes úteis
export const MESES_ANO_LECTIVO = [
  'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'
];

export const MESES_OPTIONS = MESES_ANO_LECTIVO.map(mes => ({
  value: mes,
  label: mes.charAt(0) + mes.slice(1).toLowerCase()
}));

export const ANOS_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i - 5;
  return { value: year, label: year.toString() };
});

// Hook para buscar dados completos do aluno
export const useAlunoCompleto = () => {
  const [aluno, setAluno] = useState<IAluno | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunoCompleto = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/completo`);
      if (response.data.success) {
        setAluno(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados do aluno');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados do aluno';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearAluno = () => {
    setAluno(null);
    setError(null);
  };

  return {
    aluno,
    loading,
    error,
    fetchAlunoCompleto,
    clearAluno
  };
};

// Hook para buscar tipo de serviço específico da turma do aluno
export const useTipoServicoTurmaAluno = () => {
  const [tipoServico, setTipoServico] = useState<ITipoServico | null>(null);
  const [dadosAluno, setDadosAluno] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoServicoTurma = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/tipo-servico-turma`);
      if (response.data.success) {
        setTipoServico(response.data.data);
        setDadosAluno(null); // Não há dados do aluno nesta resposta
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipo de serviço da turma');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipo de serviço da turma';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearTipoServico = () => {
    setTipoServico(null);
    setDadosAluno(null);
    setError(null);
  };

  return {
    tipoServico,
    dadosAluno,
    loading,
    error,
    fetchTipoServicoTurma,
    clearTipoServico
  };
};

// Hook para buscar meses pendentes do aluno
export const useMesesPendentesAluno = () => {
  const [mesesPendentes, setMesesPendentes] = useState<string[]>([]);
  const [mesesPagos, setMesesPagos] = useState<string[]>([]);
  const [proximoMes, setProximoMes] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMesesPendentes = async (alunoId: number, codigoAnoLectivo?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = codigoAnoLectivo ? `?codigoAnoLectivo=${codigoAnoLectivo}` : '';
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/meses-pendentes${params}`);
      if (response.data.success) {
        const data = response.data.data;
        setMesesPendentes(data.mesesPendentes || []);
        setMesesPagos(data.mesesPagos || []);
        setProximoMes(data.proximoMes || null);
        setMensagem(data.mensagem || null);
        
        return data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar meses pendentes');
      }
    } catch (err: any) {
      // Se for erro 400, pode ser que o aluno não esteja matriculado no ano
      if (err.response?.status === 400) {
        console.log('Aluno não encontrado no ano letivo especificado');
        setMesesPendentes([]);
        setMesesPagos([]);
        setProximoMes(null);
        return {
          mesesPendentes: [],
          mesesPagos: [],
          totalMeses: 0,
          mesesPagosCount: 0,
          mesesPendentesCount: 0,
          proximoMes: null,
          dividasAnteriores: [],
          temDividas: false,
          mensagem: 'Aluno não encontrado no ano letivo especificado'
        };
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar meses pendentes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearMesesPendentes = useCallback(() => {
    setMesesPendentes([]);
    setMesesPagos([]);
    setProximoMes(null);
    setMensagem(null);
    setLoading(false);
    setError(null);
  }, []);

  const refreshMesesPendentes = useCallback(async (alunoId: number, codigoAnoLectivo?: number) => {
    // Força uma nova busca limpando o cache primeiro
    clearMesesPendentes();
    await fetchMesesPendentes(alunoId, codigoAnoLectivo);
  }, [fetchMesesPendentes, clearMesesPendentes]);

  return {
    mesesPendentes,
    mesesPagos,
    proximoMes,
    mensagem,
    loading,
    error,
    fetchMesesPendentes,
    clearMesesPendentes,
    refreshMesesPendentes
  };
};

// Hook para buscar anos letivos
export const useAnosLectivos = () => {
  const [anosLectivos, setAnosLectivos] = useState<IAnoLectivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnosLectivos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/anos-lectivos');
      if (response.data.success) {
        setAnosLectivos(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar anos letivos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar anos letivos';
      setError(errorMessage);
      // Dados mockados como fallback
      setAnosLectivos([
        { codigo: 1, designacao: '2024/2025', anoInicial: '2024', anoFinal: '2025', mesInicial: 'SETEMBRO', mesFinal: 'JULHO' },
        { codigo: 2, designacao: '2025/2026', anoInicial: '2025', anoFinal: '2026', mesInicial: 'SETEMBRO', mesFinal: 'JULHO' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnosLectivos();
  }, []);

  return {
    anosLectivos,
    loading,
    error,
    fetchAnosLectivos
  };
};

// Hook para buscar propina específica da classe do aluno no ano letivo
export const usePropinaClasse = () => {
  const [propinaClasse, setPropinaClasse] = useState<ITipoServico | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPropinaClasse = async (alunoId: number, anoLectivoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/propina-classe/${anoLectivoId}`);
      if (response.data.success) {
        setPropinaClasse(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar propina da classe');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar propina da classe';
      setError(errorMessage);
      setPropinaClasse(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearPropinaClasse = () => {
    setPropinaClasse(null);
    setError(null);
  };

  return {
    propinaClasse,
    loading,
    error,
    fetchPropinaClasse,
    clearPropinaClasse
  };
};

// Hook para validar número de borderô
export const useValidateBordero = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateBordero = async (bordero: string, excludeId?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = excludeId ? `?excludeId=${excludeId}` : '';
      const response = await api.post(`/api/payment-management/validate-bordero${params}`, {
        bordero
      });
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Número de borderô inválido');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao validar borderô';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    validateBordero,
    loading,
    error
  };
};
