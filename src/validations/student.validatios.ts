import * as yup from "yup";

export const addStudentSchema = yup.object({
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),

  pai: yup.string().optional(),

  mae: yup.string().optional(),

  codigo_Nacionalidade: yup
    .number()
    .typeError("Nacionalidade deve ser um número")
    .required("Nacionalidade é obrigatória"),

  dataNascimento: yup
    .date()
    .typeError("Data de nascimento inválida")
    .required("Data de nascimento é obrigatória"),

  email: yup
    .string()
    .email("Email inválido")
    .required("Email é obrigatório"),

  telefone: yup
    .string()
    .required("Telefone é obrigatório"),

  codigo_Comuna: yup
    .number()
    .typeError("Comuna deve ser um número")
    .required("Comuna é obrigatória"),

  sexo: yup
    .string()
    .required("Sexo é obrigatório"),

  n_documento_identificacao: yup
    .string()
    .required("Número do documento é obrigatório"),

  saldo: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .min(0, "Saldo não pode ser negativo")
    .optional()
    .default(0),

  morada: yup.string().optional(),

  codigoTipoDocumento: yup
    .number()
    .typeError("Tipo de documento deve ser um número")
    .required("Tipo de documento é obrigatório"),

  codigo_Utilizador: yup
    .string()
    .optional(),

  provincia: yup.string().optional(),
  municipio: yup.string().optional(),

  // Encarregado como objeto aninhado (ajuste importante)
  encarregado: yup.object({
    nome: yup.string().required("Nome do encarregado é obrigatório"),
    telefone: yup.string().required("Telefone do encarregado é obrigatório"),
    email: yup.string().email("Email do encarregado inválido").required("Email do encarregado é obrigatório"),
    codigo_Profissao: yup
      .number()
      .typeError("Profissão do encarregado deve ser um número")
      .required("Profissão do encarregado é obrigatória"),
    local_Trabalho: yup.string().required("Local de trabalho é obrigatório"),
    status: yup
      .number()
      .typeError("Status deve ser um número")
      .required("Status do encarregado é obrigatório"),
  }).required("Encarregado é obrigatório"),
});
