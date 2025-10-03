// Interfaces para gestão de estudantes

export interface Student {
  codigo: number;
  nome: string;
  pai?: string;
  mae?: string;
  codigo_Nacionalidade: number;
  codigo_Estado_Civil: number;
  dataNascimento: string | Record<string, unknown>; // Pode ser objeto ou string
  email?: string;
  telefone?: string;
  codigo_Status: number;
  codigo_Comuna: number;
  codigo_Encarregado: number;
  codigo_Utilizador: number;
  sexo: string; // "Masculino" ou "Feminino" na API
  n_documento_identificacao?: string;
  dataCadastro: string | Record<string, unknown>; // Pode ser objeto ou string
  saldo: number;
  desconto: number;
  url_Foto?: string;
  tipo_desconto: string;
  escolaProveniencia?: number | null;
  saldo_Anterior?: number | null;
  codigoTipoDocumento: number;
  morada?: string;
  dataEmissao: string | Record<string, unknown>; // Pode ser objeto ou string
  motivo_Desconto?: string;
  user_id: string;
  tb_encarregados?: {
    codigo: number;
    nome: string;
    telefone: string;
    user: string;
  };
  tb_utilizadores?: {
    codigo: number;
    nome: string;
    user: string;
  };
  tb_tipo_documento?: {
    codigo: number;
    designacao: string;
  };
  tb_matriculas?: {
    codigo: number;
    data_Matricula: string | Record<string, unknown>;
    codigoStatus: number;
    tb_cursos: {
      codigo: number;
      designacao: string;
    };
  } | null;
}

export interface StudentResponse {
  success: boolean;
  message: string;
  data: Student[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}