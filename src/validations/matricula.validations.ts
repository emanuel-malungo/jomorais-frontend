import { z } from "zod"

// Schema para criar matrícula
export const matriculaCreateSchema = z.object({
  codigo_Aluno: z
    .number({
      required_error: "Código do aluno é obrigatório",
      invalid_type_error: "Código do aluno deve ser um número"
    })
    .int("Código do aluno deve ser um número inteiro")
    .positive("Código do aluno deve ser positivo"),

  data_Matricula: z
    .string({
      required_error: "Data da matrícula é obrigatória"
    })
    .datetime("Data da matrícula deve estar no formato ISO")
    .or(z.date())
    .transform((val) => typeof val === 'string' ? val : val.toISOString()),

  codigo_Curso: z
    .number({
      required_error: "Código do curso é obrigatório",
      invalid_type_error: "Código do curso deve ser um número"
    })
    .int("Código do curso deve ser um número inteiro")
    .positive("Código do curso deve ser positivo"),

  codigo_Utilizador: z
    .number({
      required_error: "Código do utilizador é obrigatório",
      invalid_type_error: "Código do utilizador deve ser um número"
    })
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo"),

  codigoStatus: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1)
})

// Schema para atualizar matrícula (todos os campos opcionais)
export const matriculaUpdateSchema = matriculaCreateSchema.partial()

// Schema flexível para batch operations
export const matriculaFlexibleCreateSchema = z.object({
  codigo_Aluno: z.number().int().positive(),
  data_Matricula: z.union([z.string().datetime(), z.date()]).transform(val => 
    typeof val === 'string' ? val : val.toISOString()
  ),
  codigo_Curso: z.number().int().positive(),
  codigo_Utilizador: z.number().int().positive(),
  codigoStatus: z.number().int().min(0).max(1).default(1)
})

// Schema para buscar por ano letivo
export const matriculasByAnoLectivoSchema = z.object({
  codigo_AnoLectivo: z
    .number({
      required_error: "Código do ano letivo é obrigatório",
      invalid_type_error: "Código do ano letivo deve ser um número"
    })
    .int("Código do ano letivo deve ser um número inteiro")
    .positive("Código do ano letivo deve ser positivo")
})

// Schema para batch operations
export const batchMatriculaCreateSchema = z.object({
  matriculas: z
    .array(matriculaFlexibleCreateSchema)
    .min(1, "Deve haver pelo menos uma matrícula")
    .max(100, "Máximo de 100 matrículas por lote")
})

// Tipos derivados dos schemas
export type MatriculaCreateInput = z.infer<typeof matriculaCreateSchema>
export type MatriculaUpdateInput = z.infer<typeof matriculaUpdateSchema>
export type MatriculaFlexibleCreateInput = z.infer<typeof matriculaFlexibleCreateSchema>
export type MatriculasByAnoLectivoInput = z.infer<typeof matriculasByAnoLectivoSchema>
export type BatchMatriculaCreateInput = z.infer<typeof batchMatriculaCreateSchema>

// Helper para validar data de matrícula
export const validateMatriculaDate = (date: string | Date): boolean => {
  const matriculaDate = new Date(date)
  const now = new Date()
  
  // Data não pode ser no futuro
  if (matriculaDate > now) {
    return false
  }
  
  // Data não pode ser muito antiga (mais de 10 anos)
  const tenYearsAgo = new Date()
  tenYearsAgo.setFullYear(now.getFullYear() - 10)
  
  if (matriculaDate < tenYearsAgo) {
    return false
  }
  
  return true
}

// Helper para formatar data para input datetime-local
export const formatDateForInput = (date: string | Date): string => {
  const d = new Date(date)
  return d.toISOString().slice(0, 16)
}

// Helper para formatar data para exibição
export const formatDateForDisplay = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Helper para validar status
export const isValidStatus = (status: number): boolean => {
  return status === 0 || status === 1
}

// Helper para obter o label do status
export const getStatusLabel = (status: number): string => {
  switch (status) {
    case 0:
      return "Inativo"
    case 1:
      return "Ativo"
    default:
      return "Desconhecido"
  }
}

// Helper para validar ano letivo
export const validateAnoLectivo = (ano: number): boolean => {
  const currentYear = new Date().getFullYear()
  // Ano letivo deve estar entre 2000 e ano atual + 5
  return ano >= 2000 && ano <= currentYear + 5
}

// Helper para gerar número de matrícula (se necessário)
export const generateMatriculaNumber = (alunoId: number, cursoId: number, year: number): string => {
  const yearStr = year.toString().slice(-2)
  const alunoStr = alunoId.toString().padStart(4, '0')
  const cursoStr = cursoId.toString().padStart(2, '0')
  return `${yearStr}${cursoStr}${alunoStr}`
}