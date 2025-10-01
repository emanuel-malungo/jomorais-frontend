export interface IDisciplineInput {
  designacao: string
  codigo_Curso: number
}

export interface IDiscipline {
  codigo: number
  designacao: string
  codigo_Curso: number
  codigo_Status: number
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface IDisciplineListResponse {
  data: IDiscipline[]
  pagination: IPagination
}
