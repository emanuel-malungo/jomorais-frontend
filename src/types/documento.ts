export interface Documento {
    id_documento: number;
    id_aluno: number; // FK -> Aluno
    tipo_documento: "BI" | "certidao" | "historico_escolar" | string;
    arquivo: string; // PDF ou imagem
    data_upload: Date;
  }