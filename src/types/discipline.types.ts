// types/discipline.types.ts
export interface Discipline {
  codigo?: number;
  designacao: string;
  codigo_disciplina: string;
  carga_horaria: number;
  descricao?: string;
  codigo_Status: number;
  observacoes?: string;
  
  // Relacionamentos
  tb_disciplinas_classes?: Array<{
    codigo: number;
    tb_classes: {
      codigo: number;
      designacao: string;
      nivel_ensino: string;
    };
  }>;
  tb_disciplinas_professores?: Array<{
    codigo: number;
    tb_professores: {
      codigo: number;
      nome: string;
      especialidade: string;
    };
  }>;
  tb_pre_requisitos?: Array<{
    codigo: number;
    tb_disciplinas_pre_requisito: {
      codigo: number;
      designacao: string;
      codigo_disciplina: string;
    };
  }>;
}

export interface DisciplineFormData {
  designacao: string;
  codigo_disciplina: string;
  carga_horaria: number;
  descricao?: string;
  observacoes?: string;
  classes?: number[];
  pre_requisitos?: number[];
}

export interface DisciplinePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface DisciplineResponse {
  disciplines: Discipline[];
  pagination: DisciplinePagination;
}
