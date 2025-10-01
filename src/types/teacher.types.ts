// types/teacher.types.ts
export interface Teacher {
  codigo?: number;
  nome: string;
  email?: string;
  telefone?: string;
  sexo: 'M' | 'F';
  dataNascimento?: string;
  n_documento_identificacao?: string;
  codigo_Status: number;
  codigo_Nacionalidade?: number;
  codigo_Comuna?: number;
  codigo_Utilizador?: number;
  morada?: string;
  especialidade?: string;
  grau_academico?: string;
  experiencia_anos?: number;
  salario?: number;
  data_contratacao?: string;
  observacoes?: string;
  
  // Relacionamentos
  tb_nacionalidades?: {
    codigo: number;
    designacao: string;
  };
  tb_comunas?: {
    codigo: number;
    designacao: string;
    tb_municipios: {
      codigo: number;
      designacao: string;
      tb_provincias: {
        codigo: number;
        designacao: string;
      };
    };
  };
  tb_utilizadores?: {
    codigo: number;
    nome: string;
    email: string;
  };
  tb_disciplinas_professores?: Array<{
    codigo: number;
    tb_disciplinas: {
      codigo: number;
      designacao: string;
      codigo_disciplina: string;
      carga_horaria: number;
    };
  }>;
}

export interface TeacherFormData {
  nome: string;
  email?: string;
  telefone?: string;
  sexo: 'M' | 'F';
  dataNascimento?: string;
  n_documento_identificacao?: string;
  codigo_Nacionalidade?: number;
  codigo_Comuna?: number;
  morada?: string;
  especialidade?: string;
  grau_academico?: string;
  experiencia_anos?: number;
  salario?: number;
  observacoes?: string;
  disciplinas?: number[];
}

export interface TeacherPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface TeacherResponse {
  teachers: Teacher[];
  pagination: TeacherPagination;
}
