export interface Disciplina {
    id_disciplina: number;
    nome_disciplina: string;
    id_curso?: number | null; // FK -> Curso (nullable)
  }