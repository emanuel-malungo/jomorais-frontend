export interface Aluno {
    id_aluno: number;
    nome: string;
    data_nascimento: Date;
    genero: "M" | "F" | "Outro";
    nome_encarregado: string;
    contato_encarregado: string;
    numero_matricula: string; // único
    estado_financeiro: "em_dia" | "em_atraso" | "suspenso";
  }