import * as yup from "yup";

export const disciplinaSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome da disciplina é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  codigo: yup
    .string()
    .required("Código da disciplina é obrigatório")
    .min(2, "Código deve ter pelo menos 2 caracteres")
    .max(10, "Código deve ter no máximo 10 caracteres")
    .matches(/^[A-Z0-9]+$/, "Código deve conter apenas letras maiúsculas e números"),
  
  carga_horaria_semanal: yup
    .number()
    .required("Carga horária semanal é obrigatória")
    .min(1, "Carga horária deve ser pelo menos 1 hora")
    .max(10, "Carga horária não pode exceder 10 horas semanais"),
  
  carga_horaria_total: yup
    .number()
    .required("Carga horária total é obrigatória")
    .min(10, "Carga horária total deve ser pelo menos 10 horas")
    .max(500, "Carga horária total não pode exceder 500 horas"),
  
  area_conhecimento: yup
    .string()
    .required("Área de conhecimento é obrigatória")
    .oneOf([
      "linguagens",
      "matematica", 
      "ciencias_natureza",
      "ciencias_humanas",
      "ensino_religioso",
      "educacao_fisica",
      "artes",
      "tecnologia"
    ], "Selecione uma área de conhecimento válida"),
  
  nivel_ensino: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos um nível de ensino")
    .required("Nível de ensino é obrigatório"),
  
  classes_aplicaveis: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos uma classe")
    .required("Classes aplicáveis são obrigatórias"),
  
  pre_requisitos: yup
    .array()
    .of(yup.string())
    .nullable()
    .notRequired(),
  
  objetivos: yup
    .string()
    .required("Objetivos da disciplina são obrigatórios")
    .min(10, "Objetivos devem ter pelo menos 10 caracteres")
    .max(1000, "Objetivos devem ter no máximo 1000 caracteres"),
  
  ementa: yup
    .string()
    .required("Ementa da disciplina é obrigatória")
    .min(20, "Ementa deve ter pelo menos 20 caracteres")
    .max(2000, "Ementa deve ter no máximo 2000 caracteres"),
  
  metodologia: yup
    .string()
    .max(1000, "Metodologia deve ter no máximo 1000 caracteres")
    .nullable()
    .notRequired(),
  
  criterios_avaliacao: yup
    .string()
    .max(1000, "Critérios de avaliação devem ter no máximo 1000 caracteres")
    .nullable()
    .notRequired(),
  
  bibliografia: yup
    .string()
    .max(2000, "Bibliografia deve ter no máximo 2000 caracteres")
    .nullable()
    .notRequired(),
  
  status: yup
    .string()
    .required("Status é obrigatório")
    .oneOf(["ativa", "inativa", "em_revisao"], "Selecione um status válido"),
  
  observacoes: yup
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
});

export type DisciplinaFormData = yup.InferType<typeof disciplinaSchema>;
