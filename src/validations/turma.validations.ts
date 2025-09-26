import * as yup from "yup";

export const turmaSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome da turma é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  
  codigo: yup
    .string()
    .required("Código da turma é obrigatório")
    .min(2, "Código deve ter pelo menos 2 caracteres")
    .max(10, "Código deve ter no máximo 10 caracteres")
    .matches(/^[A-Z0-9]+$/, "Código deve conter apenas letras maiúsculas e números"),
  
  classe: yup
    .string()
    .required("Classe é obrigatória"),
  
  ano_letivo: yup
    .string()
    .required("Ano letivo é obrigatório")
    .matches(/^\d{4}$/, "Ano letivo deve ter 4 dígitos"),
  
  periodo: yup
    .string()
    .required("Período é obrigatório")
    .oneOf(["manha", "tarde", "noite"], "Selecione um período válido"),
  
  sala: yup
    .string()
    .required("Sala é obrigatória"),
  
  capacidade_maxima: yup
    .number()
    .required("Capacidade máxima é obrigatória")
    .min(10, "Capacidade mínima é 10 alunos")
    .max(50, "Capacidade máxima é 50 alunos"),
  
  professor_titular: yup
    .string()
    .required("Professor titular é obrigatório"),
  
  disciplinas: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos uma disciplina")
    .required("Disciplinas são obrigatórias"),
  
  horario_inicio: yup
    .string()
    .required("Horário de início é obrigatório")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido (HH:MM)"),
  
  horario_fim: yup
    .string()
    .required("Horário de fim é obrigatório")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido (HH:MM)")
    .test("horario-fim", "Horário de fim deve ser posterior ao horário de início", function(value) {
      const { horario_inicio } = this.parent;
      if (!horario_inicio || !value) return true;
      
      const inicio = new Date(`2000-01-01T${horario_inicio}:00`);
      const fim = new Date(`2000-01-01T${value}:00`);
      
      return fim > inicio;
    }),
  
  dias_semana: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos um dia da semana")
    .required("Dias da semana são obrigatórios"),
  
  data_inicio: yup
    .string()
    .required("Data de início é obrigatória"),
  
  data_fim: yup
    .string()
    .required("Data de fim é obrigatória")
    .test("data-fim", "Data de fim deve ser posterior à data de início", function(value) {
      const { data_inicio } = this.parent;
      if (!data_inicio || !value) return true;
      
      return new Date(value) > new Date(data_inicio);
    }),
  
  status: yup
    .string()
    .required("Status é obrigatório")
    .oneOf(["ativa", "inativa", "planejada", "concluida"], "Selecione um status válido"),
  
  observacoes: yup
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
});

export type TurmaFormData = yup.InferType<typeof turmaSchema>;
