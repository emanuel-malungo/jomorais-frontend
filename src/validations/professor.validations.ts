import * as yup from "yup";

export const professorSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  data_nascimento: yup
    .string()
    .required("Data de nascimento é obrigatória")
    .test("idade", "Professor deve ter entre 18 e 70 anos", function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18 && age - 1 <= 70;
      }
      return age >= 18 && age <= 70;
    }),
  
  genero: yup
    .string()
    .required("Gênero é obrigatório")
    .oneOf(["M", "F"], "Gênero deve ser Masculino ou Feminino"),
  
  numero_bi: yup
    .string()
    .required("Número do BI é obrigatório")
    .matches(/^[0-9]{9}[A-Z]{2}[0-9]{3}$/, "Formato do BI inválido (ex: 123456789LA012)"),
  
  endereco: yup
    .string()
    .required("Endereço é obrigatório")
    .min(5, "Endereço deve ter pelo menos 5 caracteres")
    .max(200, "Endereço deve ter no máximo 200 caracteres"),
  
  telefone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(/^(\+244\s?)?[9][0-9]{8}$/, "Formato de telefone inválido (ex: +244 923456789 ou 923456789)"),
  
  email: yup
    .string()
    .required("Email é obrigatório")
    .email("Email inválido"),
  
  formacao_academica: yup
    .string()
    .required("Formação acadêmica é obrigatória")
    .oneOf([
      "ensino_medio", 
      "licenciatura", 
      "bacharelado", 
      "especializacao", 
      "mestrado", 
      "doutorado"
    ], "Selecione uma formação válida"),
  
  area_especializacao: yup
    .string()
    .required("Área de especialização é obrigatória")
    .min(2, "Área de especialização deve ter pelo menos 2 caracteres")
    .max(100, "Área de especialização deve ter no máximo 100 caracteres"),
  
  disciplinas: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione pelo menos uma disciplina")
    .required("Disciplinas são obrigatórias"),
  
  experiencia_anos: yup
    .number()
    .required("Anos de experiência são obrigatórios")
    .min(0, "Anos de experiência não podem ser negativos")
    .max(50, "Anos de experiência não podem exceder 50 anos"),
  
  salario: yup
    .number()
    .required("Salário é obrigatório")
    .min(50000, "Salário mínimo é 50.000 Kz")
    .max(5000000, "Salário máximo é 5.000.000 Kz"),
  
  data_contratacao: yup
    .string()
    .required("Data de contratação é obrigatória"),
  
  observacoes: yup
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
});

export type ProfessorFormData = yup.InferType<typeof professorSchema>;
