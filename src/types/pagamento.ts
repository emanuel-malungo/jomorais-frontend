export interface Pagamento {
    id_pagamento: number;
    id_matricula: number; // FK -> Matricula
    mes_referente: string; // ex.: "2025-03"
    valor: number;
    data_pagamento: Date;
    id_funcionario: number; // FK -> Funcionario
    comprovativo_fatura: string; // PDF/link
  }