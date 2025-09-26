export interface Turma {
    id_turma: number;
    nome_turma: string; // ex.: 10A
    turno: "manha" | "tarde" | "noite";
    id_sala: number; // FK -> Sala
  }