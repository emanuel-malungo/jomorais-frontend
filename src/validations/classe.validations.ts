import * as yup from "yup";

export const classeSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome da classe é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  
  nivel_ensino: yup
    .string()
    .required("Nível de ensino é obrigatório")
    .oneOf([
      "ensino_primario",
      "ensino_secundario_1",
      "ensino_secundario_2",
      "ensino_pre_universitario"
    ], "Selecione um nível de ensino válido"),
  
  idade_minima: yup
    .number()
    .required("Idade mínima é obrigatória")
    .min(5, "Idade mínima deve ser pelo menos 5 anos")
    .max(25, "Idade mínima não pode exceder 25 anos"),
  
  idade_maxima: yup
    .number()
    .required("Idade máxima é obrigatória")
    .min(5, "Idade máxima deve ser pelo menos 5 anos")
    .max(30, "Idade máxima não pode exceder 30 anos")
    .test("idade-maxima", "Idade máxima deve ser maior que a idade mínima", function(value) {
      const { idade_minima } = this.parent;
      if (!idade_minima || !value) return true;
      return value > idade_minima;
    }),
  
  disciplinas_obrigatorias: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos uma disciplina obrigatória")
    .required("Disciplinas obrigatórias são necessárias"),
  
  disciplinas_optativas: yup
    .array()
    .of(yup.string())
    .nullable()
    .notRequired(),
  
  carga_horaria_semanal: yup
    .number()
    .required("Carga horária semanal é obrigatória")
    .min(10, "Carga horária mínima é 10 horas semanais")
    .max(40, "Carga horária máxima é 40 horas semanais"),
  
  requisitos_ingresso: yup
    .string()
    .max(500, "Requisitos devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
  
  objetivos_aprendizagem: yup
    .string()
    .required("Objetivos de aprendizagem são obrigatórios")
    .min(20, "Objetivos devem ter pelo menos 20 caracteres")
    .max(1000, "Objetivos devem ter no máximo 1000 caracteres"),
  
  metodologia_ensino: yup
    .string()
    .max(1000, "Metodologia deve ter no máximo 1000 caracteres")
    .nullable()
    .notRequired(),
  
  criterios_avaliacao: yup
    .string()
    .max(1000, "Critérios de avaliação devem ter no máximo 1000 caracteres")
    .nullable()
    .notRequired(),
  
  status: yup
    .string()
    .required("Status é obrigatório")
    .oneOf(["ativa", "inativa", "em_planejamento"], "Selecione um status válido"),
  
  observacoes: yup
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
});

export type ClasseFormData = yup.InferType<typeof classeSchema>;
