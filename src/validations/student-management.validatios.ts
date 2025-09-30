import * as yup from "yup";

export const addStudentSchema = yup.object({
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  
  pai: yup.string().optional(),
  
  mae: yup.string().optional(),
  
  codigo_Nacionalidade: yup
    .string()
    .required("Nacionalidade é obrigatória"),
  
  dataNascimento: yup
    .string()
    .required("Data de nascimento é obrigatória"),
  
  email: yup
    .string()
    .email("Email inválido")
    .required("Email é obrigatório"),
  
  telefone: yup
    .string()
    .required("Telefone é obrigatório"),
  
  codigo_Comuna: yup
    .string()
    .required("Comuna é obrigatória"),
  
  codigo_Encarregado: yup
    .string()
    .required("Encarregado é obrigatório"),
  
  codigo_Utilizador: yup
    .string()
    .optional(),
  
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
    .string()
    .required("Tipo de documento é obrigatório"),
  
  // Campos auxiliares para hierarquia geográfica
  provincia: yup.string().optional(),
  municipio: yup.string().optional(),
});