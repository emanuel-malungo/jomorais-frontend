export interface Funcionario {
    id_funcionario: number;
    nome: string;
    cargo: "professor" | "administrativo" | "gestor";
    username: string;
    senha: string; // hash
    nivel_acesso: "leitura" | "escrita" | "admin";
  }