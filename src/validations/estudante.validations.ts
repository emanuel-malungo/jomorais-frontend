import * as yup from "yup";

export const estudanteSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  data_nascimento: yup
    .string()
    .required("Data de nascimento é obrigatória")
    .test("idade", "Estudante deve ter entre 5 e 25 anos", function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 5 && age - 1 <= 25;
      }
      return age >= 5 && age <= 25;
    }),
  
  genero: yup
    .string()
    .required("Gênero é obrigatório")
    .oneOf(["M", "F"], "Gênero deve ser Masculino ou Feminino"),
  
  numero_bi: yup
    .string()
    .matches(/^[0-9]{9}[A-Z]{2}[0-9]{3}$/, "Formato do BI inválido (ex: 123456789LA012)")
    .nullable()
    .notRequired(),
  
  endereco: yup
    .string()
    .max(200, "Endereço deve ter no máximo 200 caracteres")
    .nullable()
    .notRequired(),
  
  nome_encarregado: yup
    .string()
    .required("Nome do encarregado é obrigatório")
    .min(2, "Nome do encarregado deve ter pelo menos 2 caracteres")
    .max(100, "Nome do encarregado deve ter no máximo 100 caracteres"),
  
  contato_encarregado: yup
    .string()
    .required("Contato do encarregado é obrigatório")
    .matches(/^(\+244\s?)?[9][0-9]{8}$/, "Formato de telefone inválido (ex: +244 923456789 ou 923456789)"),
  
  email_encarregado: yup
    .string()
    .email("Email inválido")
    .nullable()
    .notRequired(),
  
  classe: yup
    .string()
    .required("Classe é obrigatória"),
  
  turma: yup
    .string()
    .required("Turma é obrigatória"),
  
  observacoes: yup
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .nullable()
    .notRequired(),
});

export type EstudanteFormData = yup.InferType<typeof estudanteSchema>;
