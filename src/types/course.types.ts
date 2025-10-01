export interface Disciplina {
  codigo: number;
  designacao: string;
  codigo_Curso: number;
}

export interface Course {
  codigo?: number;
  designacao: string;
  codigo_Status?: number;
  observacoes?: string;
  nivel?: string;
  modalidade?: string;
  duracao?: string;
  tb_disciplinas?: Disciplina[];
}

export interface CreateCourseData {
  designacao: string;
  observacoes?: string;
  nivel: string;
  modalidade: string;
  duracao: string;
  codigo_Status?: number;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  codigo: number;
}
