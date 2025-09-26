export interface Nota {
    id_nota: number;
    id_matricula: number; // FK -> Matricula
    id_disciplina: number; // FK -> Disciplina
    id_funcionario: number; // FK -> Funcionario (Professor)
    periodo: string; // ex.: "1º trimestre"
    valor_nota: number;
  }