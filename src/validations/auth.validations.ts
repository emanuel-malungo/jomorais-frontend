import * as yup from "yup";

export const authSchema = yup.object().shape({
  email: yup.string()
    .email("Email inválido")
    .required("Email é obrigatório"),
  password: yup
    .string()
    .required("Senha é obrigatória"),
});
