import * as yup from "yup";

export const cursoSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome do curso é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  codigo: yup
    .string()
    .required("Código do curso é obrigatório")
    .min(2, "Código deve ter pelo menos 2 caracteres")
    .max(10, "Código deve ter no máximo 10 caracteres")
    .matches(/^[A-Z0-9]+$/, "Código deve conter apenas letras maiúsculas e números"),
  
  area_conhecimento: yup
    .string()
    .required("Área de conhecimento é obrigatória")
    .oneOf([
      "educacao_geral",
      "ciencias_exatas",
      "ciencias_humanas",
      "ciencias_natureza",
      "artes",
      "preparacao_universitaria",
      "tecnologia"
    ], "Selecione uma área de conhecimento válida"),
  
  nivel_ensino: yup
    .string()
    .required("Nível de ensino é obrigatório")
    .oneOf([
      "ensino_primario",
      "ensino_secundario_1",
      "ensino_secundario_2",
      "ensino_pre_universitario"
    ], "Selecione um nível de ensino válido"),
  
  duracao_anos: yup
    .number()
    .required("Duração é obrigatória")
    .min(1, "Duração mínima é 1 ano")
    .max(6, "Duração máxima é 6 anos"),
  
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
  
  carga_horaria_total: yup
    .number()
    .required("Carga horária total é obrigatória")
    .min(500, "Carga horária mínima é 500 horas")
    .max(10000, "Carga horária máxima é 10.000 horas"),
  
  coordenador: yup
    .string()
    .nullable()
    .notRequired(),
  
  requisitos_ingresso: yup
    .string()
    .max(1000, "Requisitos devem ter no máximo 1000 caracteres")
    .nullable()
    .notRequired(),
  
  objetivos_curso: yup
    .string()
    .required("Objetivos do curso são obrigatórios")
    .min(50, "Objetivos devem ter pelo menos 50 caracteres")
    .max(2000, "Objetivos devem ter no máximo 2000 caracteres"),
  
  perfil_egresso: yup
    .string()
    .required("Perfil do egresso é obrigatório")
    .min(50, "Perfil do egresso deve ter pelo menos 50 caracteres")
    .max(2000, "Perfil do egresso deve ter no máximo 2000 caracteres"),
  
  metodologia_ensino: yup
    .string()
    .max(1500, "Metodologia deve ter no máximo 1500 caracteres")
    .nullable()
    .notRequired(),
  
  sistema_avaliacao: yup
    .string()
    .max(1500, "Sistema de avaliação deve ter no máximo 1500 caracteres")
    .nullable()
    .notRequired(),
  
  recursos_necessarios: yup
    .string()
    .max(1000, "Recursos necessários devem ter no máximo 1000 caracteres")
    .nullable()
    .notRequired(),
  
  certificacao: yup
    .string()
    .required("Tipo de certificação é obrigatório")
    .oneOf([
      "certificado_conclusao",
      "diploma_ensino_primario",
      "diploma_ensino_secundario",
      "certificado_pre_universitario"
    ], "Selecione um tipo de certificação válido"),
  
  status: yup
    .string()
    .required("Status é obrigatório")
    .oneOf(["ativo", "inativo", "em_revisao", "em_desenvolvimento"], "Selecione um status válido"),
  
  observacoes: yup
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
});

export type CursoFormData = yup.InferType<typeof cursoSchema>;
