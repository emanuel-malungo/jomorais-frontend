export interface Matricula {
    id_matricula: number;
    id_aluno: number; // FK -> Aluno
    id_turma: number; // FK -> Turma
    id_classe: number; // FK -> Classe
    id_curso?: number | null; // FK -> Curso (nullable)
    ano_letivo: string;
    data_matricula: Date;
    status: "ativo" | "concluido" | "suspenso";
  }